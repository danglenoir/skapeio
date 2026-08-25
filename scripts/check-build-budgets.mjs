import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import {
  brotliCompressSync,
  constants as zlibConstants,
  gzipSync,
} from 'node:zlib';

const rootDirectory = process.cwd();
const htmlPath = path.join(rootDirectory, '.next/server/app/index.html');
const rscPath = path.join(rootDirectory, '.next/server/app/index.rsc');
const staticDirectory = path.join(rootDirectory, '.next/static');

const budgets = {
  html: { raw: 180_000, gzip: 50_000, brotli: 40_000 },
  rsc: { raw: 100_000, gzip: 30_000, brotli: 25_000 },
  initialJavaScript: { raw: 900_000, gzip: 300_000, brotli: 250_000 },
  totalJavaScript: { raw: 3_000_000, gzip: 950_000, brotli: 800_000 },
};

const collectFiles = async (directory, extension) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) return collectFiles(entryPath, extension);
    return entry.isFile() && entry.name.endsWith(extension) ? [entryPath] : [];
  }));

  return files.flat();
};

const measure = (buffers) => buffers.reduce((total, buffer) => ({
  raw: total.raw + buffer.byteLength,
  gzip: total.gzip + gzipSync(buffer, { level: 9 }).byteLength,
  brotli: total.brotli + brotliCompressSync(buffer, {
    params: {
      [zlibConstants.BROTLI_PARAM_QUALITY]: 11,
    },
  }).byteLength,
}), { raw: 0, gzip: 0, brotli: 0 });

const formatBytes = (bytes) => `${(bytes / 1024).toFixed(1)} KiB`;

const reportMeasurement = (label, measurement, budget) => {
  console.log(`\n${label}`);

  for (const encoding of ['raw', 'gzip', 'brotli']) {
    console.log(
      `  ${encoding.padEnd(6)} ${formatBytes(measurement[encoding])}`
      + ` / ${formatBytes(budget[encoding])}`,
    );
  }
};

const failures = [];

const enforceBudget = (label, measurement, budget) => {
  for (const encoding of ['raw', 'gzip', 'brotli']) {
    if (measurement[encoding] > budget[encoding]) {
      failures.push(
        `${label} ${encoding} is ${formatBytes(measurement[encoding])}; `
        + `budget is ${formatBytes(budget[encoding])}`,
      );
    }
  }
};

try {
  const htmlBuffer = await readFile(htmlPath);
  const html = htmlBuffer.toString('utf8');
  const rscBuffer = await readFile(rscPath);
  const javascriptFiles = await collectFiles(staticDirectory, '.js');
  const javascriptByPath = new Map(await Promise.all(javascriptFiles.map(async (file) => (
    [file, await readFile(file)]
  ))));
  const scriptSources = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+\.js(?:\?[^"]*)?)"/gi)]
    .map(([, source]) => source);
  const initialJavaScriptFiles = [...new Set(scriptSources.map((source) => {
    const pathname = decodeURIComponent(new URL(source, 'https://local.test').pathname);
    const relativePath = pathname.replace(/^\/_next\/static\//, '');
    return path.join(staticDirectory, relativePath);
  }))];
  const missingInitialFiles = initialJavaScriptFiles.filter((file) => !javascriptByPath.has(file));

  if (initialJavaScriptFiles.length === 0) {
    failures.push('No route-critical JavaScript files were found in index.html');
  }
  if (missingInitialFiles.length > 0) {
    failures.push(`Missing emitted scripts: ${missingInitialFiles.join(', ')}`);
  }

  const initialJavaScriptBuffers = initialJavaScriptFiles
    .map((file) => javascriptByPath.get(file))
    .filter(Boolean);
  const allJavaScriptBuffers = [...javascriptByPath.values()];
  const measurements = {
    html: measure([htmlBuffer]),
    rsc: measure([rscBuffer]),
    initialJavaScript: measure(initialJavaScriptBuffers),
    totalJavaScript: measure(allJavaScriptBuffers),
  };

  reportMeasurement('Prerendered HTML', measurements.html, budgets.html);
  reportMeasurement('React Server Component payload', measurements.rsc, budgets.rsc);
  reportMeasurement(
    `Initial JavaScript (${initialJavaScriptBuffers.length} files)`,
    measurements.initialJavaScript,
    budgets.initialJavaScript,
  );
  reportMeasurement(
    `All emitted JavaScript (${allJavaScriptBuffers.length} files)`,
    measurements.totalJavaScript,
    budgets.totalJavaScript,
  );

  enforceBudget('Prerendered HTML', measurements.html, budgets.html);
  enforceBudget('React Server Component payload', measurements.rsc, budgets.rsc);
  enforceBudget('Initial JavaScript', measurements.initialJavaScript, budgets.initialJavaScript);
  enforceBudget('All emitted JavaScript', measurements.totalJavaScript, budgets.totalJavaScript);

  const emittedText = `${html}\n${rscBuffer.toString('utf8')}\n${
    allJavaScriptBuffers.map((buffer) => buffer.toString('utf8')).join('\n')
  }`;
  const inlineSvgCount = (html.match(/<svg(?:\s|>)/gi) ?? []).length;
  const forbiddenArtifacts = [
    {
      label: 'old unversioned sculpture asset',
      pattern: /\/models\/discobolus-mesh\.glb/i,
    },
    {
      label: 'old unversioned Earth texture',
      pattern: /\/textures\/earth\/roughness-2048\.jpg/i,
    },
  ];
  const requiredArtifacts = [
    {
      label: 'JORD CTA',
      pattern: /Explore JORD/i,
    },
  ];

  if (inlineSvgCount > 4) {
    failures.push(
      `Found ${inlineSvgCount} inline SVG documents; expected at most four decorative brand/fallback SVGs`,
    );
  }
  if (/<svg\b[^>]*>[\s\S]*?<title>/i.test(html)) {
    failures.push('Found an inline titled SVG document; partner logos must remain external assets');
  }

  for (const { label, pattern } of forbiddenArtifacts) {
    if (pattern.test(emittedText)) failures.push(`Found ${label} in emitted artifacts`);
  }

  for (const { label, pattern } of requiredArtifacts) {
    if (!pattern.test(emittedText)) failures.push(`Missing ${label} from emitted artifacts`);
  }

  if (failures.length > 0) {
    console.error('\nBuild budget check failed:');
    failures.forEach((failure) => console.error(`  - ${failure}`));
    process.exitCode = 1;
  } else {
    console.log('\nBuild budgets and artifact guards passed.');
  }
} catch (error) {
  console.error(
    'Unable to inspect the production build. Run `npm run build` before `npm run check:budget`.',
  );
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
