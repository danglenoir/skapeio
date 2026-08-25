# Project improvement TODO

This checklist is ordered by impact. Complete each phase roughly in order, and keep the production route statically generated.

Effort guide: **S** = under half a day, **M** = roughly one day, **L** = multiple days.

## 0. Fix correctness and dependency risk

- [x] **Keep the Explore JORD CTA visible while its destination is pending** — **S**
  - Preserve the intended call-to-action in the design without inventing or publishing an unverified URL.
  - Enable external navigation only after JORD has a verified destination.

- [x] **Remove the incomplete Earth land-wireframe pass** — **S**
  - Remove the unused land-wireframe shader/mesh so the continents retain their original appearance.
  - Check the browser console for shader compilation/runtime errors.
  - Done when all retained shader passes produce defined output.

- [x] **Upgrade vulnerable production dependencies** — **M**
  - Upgrade `next` and `eslint-config-next` together to a patched/current release.
  - Upgrade direct `postcss`; refresh the lockfile so patched Nanoid and Sharp versions resolve.
  - Consider the current React/React DOM patch releases at the same time.
  - Run `npm audit --omit=dev`, lint, typecheck, and a production build.
  - Done when there are no applicable high-severity production advisories.

## 1. Reduce initial HTML and JavaScript

- [x] **Externalize partner logos** — **L**
  - Move the six raw SVG strings out of `app/i18n.ts` into content-hashed static SVG files or one reusable sprite.
  - Replace `dangerouslySetInnerHTML` in `components/PartnerLogo.tsx` with normal image/SVG references.
  - Ensure repeated marquee copies reuse the same downloaded assets.
  - Expose one logo set to assistive technology; mark visual duplicates `aria-hidden`.
  - Done when `app/i18n.ts` contains no raw SVG documents and partner names are absent from the page client chunk.

- [x] **Split the monolithic content module** — **M**
  - Separate navigation, hero, JORD, services, footer, and partner data into narrow typed exports.
  - Client Components must import only the data they actually need.
  - Replace array-index keys with stable identifiers where practical.
  - Done when the client graph cannot pull partner SVG data through Hero, Nav, or JORD imports.

- [x] **Make the generic Section component server-rendered** — **L**
  - Remove `'use client'`, `Canvas`, and `Sculpture` from `components/Section.tsx`.
  - Create narrow client leaves such as `SculptureCanvas`, `PlanetCanvas`, and `RotatingWords`.
  - Keep About, References, Services, Contact, Footer, dialogs, and the Hero/JORD copy server-rendered.
  - Done when the production build still marks `/` as static and `Section` is absent from the client manifest.

- [x] **Defer the heavy 3D client islands** — **L**
  - Dynamically load the Canvas islands instead of including the complete 3D graph in critical JavaScript.
  - Mount the below-fold planet only when it is near the viewport.
  - Consider a lightweight poster/fallback for the hero while its scene loads.
  - Add an error boundary/static fallback for failed WebGL, GLB, or texture initialization.
  - Done when the Earth texture is not requested on initial load and meaningful text renders before the 3D bundle.

## 2. Reduce continuous browser/GPU work

- [x] **Pause animation when it is not useful** — **M**
  - Stop or unmount each Canvas while offscreen or while the document is hidden.
  - Disable continuous animation for `prefers-reduced-motion: reduce`.
  - Consider reduced quality or a static fallback when `saveData` is enabled.
  - Done when an offscreen planet produces no continuous frame work.

- [x] **Add adaptive 3D quality** — **M**
  - Preserve the approved globe's original geometry, texture, antialiasing, DPR, and contrast on every device.
  - Apply reduced geometry/DPR only to the sculpture, where it does not alter the globe art direction.
  - Profile whether every Earth sphere pass is visually necessary.
  - Dispose cloned textures/materials during cleanup.
  - Combine lazy mounting, offscreen pausing, and static fallbacks to reduce mobile GPU load without changing the globe styling.

- [x] **Compress and cache 3D assets** — **M**
  - Meshopt/Draco-compress `discobolus-mesh.glb` and verify the final visual.
  - Evaluate a smaller/single-channel or KTX2/Basis land mask.
  - Give both assets content-hashed filenames.
  - Apply one-year immutable caching only to the new versioned paths.
  - Done when repeat visits do not revalidate unchanged 3D assets.

- [x] **Remove the navigation mousemove render/layout loop** — **M**
  - Throttle pointer handling to one `requestAnimationFrame`.
  - Cache item centers until resize rather than calling `getBoundingClientRect()` for every item on every event.
  - Prefer CSS variables or MotionValues over React state for per-frame presentation.
  - Done when pointer movement does not trigger six effects plus multiple React state updates per event.

## 3. Correct responsive and accessible behavior

- [x] **Fix Hero overflow on narrow screens** — **S**
  - Allow rotating phrases to wrap or use responsive sizing instead of globally clipping them.
  - Test at 320, 375, 768, and desktop widths.
  - Done when the full heading remains visible without horizontal clipping at every target width.

- [x] **Provide a stable accessible Hero heading** — **S**
  - Mark the invisible sizing phrase `aria-hidden`.
  - Avoid announcing two phrases simultaneously or announcing an automatic change every three seconds.
  - Replace the literal `don&apos;t` content string with a real apostrophe.

- [x] **Fix global navigation accessibility** — **S**
  - Add an accessible name such as “Back to top” to the fixed logo link.
  - Reveal desktop nav labels for `:focus-visible`, not only `:hover`; intentionally omit the navigation menu on mobile/touch layouts.
  - Give `NavItem.item` a concrete type derived from the navigation data.

- [x] **Respect reduced-motion preferences everywhere** — **M**
  - Disable smooth scrolling, rotating Hero text, partner marquee motion, and 3D motion when reduced motion is requested.
  - Ensure the static state remains understandable and visually complete.

- [x] **Finish dialog accessibility** — **S**
  - Give each dialog an accessible name using `aria-labelledby` connected to its heading.
  - Verify focus enters the dialog, remains contained, closes with Escape, and returns to the trigger.
  - Test both dialogs with keyboard-only navigation.

- [x] **Fix remaining contrast and semantic issues** — **S**
  - Raise footer copyright/legal text contrast to at least 4.5:1.
  - Add focus styles that match hover states.
  - Move the global footer outside `<main>` and make “Contact us” a real heading.

## 4. Complete Vercel and public-site setup

- [x] **Complete SEO and site identity metadata** — **M**
  - Replace the placeholder description with specific company/service copy.
  - Add `metadataBase`, canonical URL, Open Graph, and Twitter metadata.
  - Add `app/icon.*`, `app/opengraph-image.*`, `app/robots.ts`, and `app/sitemap.ts`.
  - Add Organization structured data with verified company/contact information.
  - Done when link previews are branded and `/favicon.ico`, `/robots.txt`, and `/sitemap.xml` all resolve.

- [x] **Add baseline security headers** — **M**
  - Set `poweredByHeader: false`.
  - Add `X-Content-Type-Options`, `Referrer-Policy`, and an appropriate `Permissions-Policy`.
  - Design and test a CSP in report-only mode before enforcing it.
  - Allow WebAssembly compilation narrowly for the compressed 3D decoder without enabling general JavaScript evaluation.
  - Remove the unused broad `picsum.photos` image allowlist.

- [ ] **Verify Vercel features in the dashboard** — **S**
  - Confirm Web Analytics and Speed Insights are enabled for production.
  - Review the built-in Observability dashboard; no extra SDK is needed for the current static route.
  - Use the preview Toolbar during responsive/accessibility review.
  - Configure the CI workflow as a required production-deployment check.
  - After preview evaluation, decide whether to enforce the report-only CSP.
  - Optional: evaluate sampled client-error monitoring for WebGL failures, with CSP and privacy review.

- [x] **Bring the privacy notice in sync with telemetry** — **S**
  - Add an explicit Speed Insights disclosure and link to its privacy documentation.
  - If custom Analytics conversion events are added later, update the statement that currently says no custom events.
  - [ ] Obtain final legal review of the updated privacy wording.

## 5. Strengthen build and regression protection

- [x] **Fix scripts and clarify the deployment target** — **S**
  - Remove or replace the invalid `next clean` script.
  - If deployment is Vercel-only, remove `output: 'standalone'`.
  - If self-hosting remains supported, make the standalone start/copy workflow explicit.
  - Stop forcing Webpack for normal Vercel builds when the AI Studio watcher workaround is no longer required; retain a separate environment-specific script if necessary.
  - Pin a supported Node major in `engines` and in the Vercel project settings.

- [x] **Add a bundle-analysis and performance-budget workflow** — **M**
  - Add a script for `next experimental-analyze --output`.
  - Record before/after HTML, RSC, JavaScript, and critical-asset sizes.
  - Set CI budgets so the page cannot silently return to megabyte-scale HTML or eager 3D loading.

- [x] **Add automated regression tests** — **L**
  - Add Playwright smoke tests for the CTA, hash navigation, email link, and both dialogs.
  - Add Axe checks for accessible names, contrast, landmarks, and duplicate logo content.
  - Add viewport coverage for 320, 375, 768, and desktop widths.
  - Add a reduced-motion test and a check that the below-fold texture is not initially requested.

- [x] **Add CI verification before deployment** — **M**
  - Run JavaScript/CSS lint, TypeScript, tests, production build, and `npm audit --omit=dev`.
  - Configure Vercel deployments to wait for the required checks.

- [x] **Remove remaining template and dead code** — **S**
  - Confirm and remove unused packages such as `@hookform/resolvers`, `class-variance-authority`, `lucide-react`, and `firebase-tools`.
  - Move build-only packages such as PostCSS/Autoprefixer and `@types/three` to development dependencies where appropriate.
  - Remove unused `_Planet.tsx`, `_Sculpture.tsx`, `hooks/use-mobile.ts`, empty CSS modules, and stale ESLint configuration.
  - Remove unused Gemini/Cloud Run variables from `.env.example`, or document the deployment that still needs them.
  - Remove the broad `suppressHydrationWarning` once any real mismatch has been identified and fixed.

- [x] **Document the project** — **S**
  - Fill in `README.md` with local setup, supported Node version, required environment variables, build/test commands, deployment target, analytics configuration, and asset licensing.

## Suggested delivery batches

1. **Safety patch:** CTA, shader, dependency upgrades.
2. **Payload patch:** external logos, split content, record new build sizes.
3. **Rendering patch:** server `Section`, client islands, lazy/visibility-gated Canvas.
4. **UX patch:** mobile Hero, reduced motion, navigation/dialog/accessibility fixes.
5. **Platform patch:** metadata, headers, privacy, Vercel verification.
6. **Quality patch:** tests, CI, budgets, scripts, dependency/dead-code cleanup.

## Verification command set

```sh
npm run lint
npm run typecheck
npm run build
npm run check:budget
npm run test:e2e:production
npm run audit:prod
npx next experimental-analyze --output
```
