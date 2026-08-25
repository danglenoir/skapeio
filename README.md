# skape.io

The public website for skape.io Kft. It is a statically rendered Next.js site with focused client-side islands for motion and 3D presentation.

## Requirements

- Node.js 20.9–24 (Node.js 22 is recommended and used in CI)
- npm 10 or newer

No environment variables are required. Copying `.env.example` is optional.

## Local development

```sh
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The normal development and production commands use Next.js defaults, including Turbopack where supported.

For the Google AI Studio environment, where file watching must be disabled to avoid editor flicker, use:

```sh
npm run dev:ai-studio
```

## Verification and build commands

```sh
npm run lint
npm run typecheck
npm run build
npm run check:budget
npm run test:e2e:production
npm run audit:prod
```

Run the complete local verification sequence with `npm run verify`. Install the Playwright Chromium binary once with `npx playwright install chromium` before the first browser test run.

Use `npm run lint:fix` to apply named-import spacing, deterministic import ordering, unused-import cleanup, and CSS declaration ordering automatically.

`npm run test:e2e` starts the development server for a fast browser-test loop. After `npm run build`, use `npm run test:e2e:production` to exercise the same Chromium/Axe matrix against the actual production artifact; CI and `npm run verify` use this path.

Generate Next.js's interactive bundle analysis with:

```sh
npm run analyze
```

`npm run build:webpack` remains available for diagnosing webpack-specific behavior; the normal Vercel build uses `npm run build`.

## Deployment

The production target is Vercel:

- Framework preset: Next.js
- Build command: `npm run build`
- Node.js version: 22.x
- Output directory: managed by Next.js/Vercel
- Canonical origin: `https://skape.io`

The route remains statically generated. The repository intentionally does not set `output: 'standalone'`; that mode is intended for a separately managed self-hosted Node deployment.

Vercel Web Analytics and Speed Insights are mounted in the root layout. Both products must also be enabled in the Vercel project dashboard. Review the production Observability dashboard and preview Toolbar there; they need no additional package in this project.

## Metadata and security

Next.js metadata routes provide the icon, web app manifest, social preview images, `robots.txt`, and `sitemap.xml`. The canonical URL and structured organization data use the public company details shown in the imprint.

Baseline response headers are configured in `next.config.ts`. The Content Security Policy is deliberately report-only for manual preview and browser-console evaluation; no violation-collection endpoint is configured. Enforce it only after all required production and Vercel preview sources have been confirmed.

Content-hashed partner, model, and texture assets receive immutable cache headers. Do not apply the same policy to assets whose filenames can change without a new URL.

## Continuous integration

The GitHub Actions workflow installs from the lockfile and runs JavaScript/CSS linting, TypeScript, a production build, build-size budgets, the Chromium/Axe matrix against that production server, and a production-dependency audit. Configure the Vercel production deployment to require this check before deployment.

## Assets and licensing

The skape.io identity, partner marks, model, and texture files under `public/` are project assets and are not licensed for reuse by this README. Confirm their source-specific rights before redistributing them. Third-party code remains subject to the licenses declared by its packages.
