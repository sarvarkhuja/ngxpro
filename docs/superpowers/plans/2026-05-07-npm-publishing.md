# ngxpro NPM Publishing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `@ngxpro/cdk`, `@ngxpro/core`, `@ngxpro/components`, `@ngxpro/blocks`, and `@ngxpro/fintech` installable from public npm so consumers can run `npm i @ngxpro/core @ngxpro/cdk @ngxpro/components` and use them in their Angular apps.

**Architecture:** The Nx 22.5 workspace already has each library wired up with `ng-packagr`, secondary entry points, and an `nx release` configuration in `nx.json` (fixed-version, conventional-commits, GitHub release + npm publish via `.github/workflows/release.yml`). What's missing: (1) builds are currently broken on `cdk` (TypeScript "Only synthetic references are imports" error on the `checkbox` secondary entry point); (2) per-package READMEs / LICENSE so the published tarballs render correctly on npmjs.com; (3) consumer-facing root README; (4) a verified `nx release --first-release --dry-run` proving the publish payload is correct.

**Tech Stack:** Nx 22.5, Angular 21.1 + ng-packagr, TypeScript 5.9, npm (with `--legacy-peer-deps`), Verdaccio for local registry test, GitHub Actions for the release workflow, Conventional Commits.

---

## Current State Snapshot

**What's already done (don't redo):**

- Each `libs/<pkg>/package.json` has `name`, `version: 0.0.1`, `description`, `license: MIT`, `homepage`, `repository`, `bugs`, `keywords`, `publishConfig: { access: public, registry: ... }`, `peerDependencies`, `sideEffects: false`.
- `libs/<pkg>/ng-package.json` outputs to `dist/libs/<pkg>`.
- Secondary entry points exist for `@ngxpro/cdk/components/*`, `@ngxpro/components/*`, `@ngxpro/blocks/*`. Each has its own `ng-package.json`.
- `nx.json` `release` block: fixed projectsRelationship, conventional-commits specifier source, git-tag version resolver, GitHub release + workspace CHANGELOG.md, `manifestRootsToUpdate: [{projectRoot}, dist/{projectRoot}]` (which is what rewrites `@ngxpro/cdk: "*"` peerDeps to a real version on each release).
- `.github/workflows/release.yml` uses `workflow_dispatch` with a `dryRun` and `firstRelease` toggle, runs lint + test, then `npx nx release` with `NPM_TOKEN` and `NPM_CONFIG_PROVENANCE=true`.

**What's broken or missing:**

- `npx nx build cdk` fails with `Debug Failure. False expression: Only synthetic references are imports`. **Root cause (resolved):** every secondary entry point under `libs/cdk/src/lib/components/` reached back into the primary entry via deep relative paths (e.g. `from '../../../utils'`). ng-packagr forbids cross-entry-point relative imports — those refs must use the package alias (`@ngxpro/cdk`). Plus one secondary→secondary deep import (`input` → `textfield/src/textfield-accessor`) had to become `@ngxpro/cdk/components/textfield`. Plus `@nx/enforce-module-boundaries` had to be told this is OK via `allowCircularSelfDependency: true` in `libs/cdk/eslint.config.mjs`. Primary-entry files in `expand/` and `slider/` continue to use relative imports (no change).
- `dist/libs/components` and `dist/libs/core` don't exist (because cdk fails first and they depend on `^build`).
- Root `README.md` is the default Nx scaffold ("Your new, shiny Nx workspace…"). Not consumer-facing.
- No per-package `README.md` in any of the five libs. ng-packagr does **not** auto-generate one; the published tarball will have no readme on npmjs.com.
- No `LICENSE` file alongside `libs/<pkg>/package.json`. ng-packagr copies `LICENSE` from each project root if present.
- Peer-dep `@ngxpro/cdk: "*"` and `@ngxpro/core: "*"` rely on `manifestRootsToUpdate` rewriting them at release. This needs to be verified end-to-end.
- No `RELEASING.md` documenting the human steps (set NPM_TOKEN secret, dispatch the workflow, etc.).
- No verified Verdaccio install of the built packages — the only proof the packages work is "the build doesn't error."

---

## File Structure

Files this plan touches:

| Path                                                                        | Action                                           | Purpose                               |
| --------------------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------- |
| `libs/cdk/src/lib/components/checkbox/src/index.ts` (and possibly siblings) | Investigate / modify if a TS file is the trigger | Fix the partial-compilation crash     |
| `tmp/`, `dist/`, `.angular/`, Nx cache                                      | Delete                                           | Rule out stale artifacts              |
| `libs/cdk/README.md`                                                        | Create                                           | Per-package npm README                |
| `libs/core/README.md`                                                       | Create                                           | Per-package npm README                |
| `libs/components/README.md`                                                 | Create                                           | Per-package npm README                |
| `libs/blocks/README.md`                                                     | Create                                           | Per-package npm README                |
| `libs/fintech/README.md`                                                    | Create                                           | Per-package npm README                |
| `libs/cdk/LICENSE`                                                          | Create (copy of root)                            | Bundled in tarball                    |
| `libs/core/LICENSE`                                                         | Create (copy of root)                            | Bundled in tarball                    |
| `libs/components/LICENSE`                                                   | Create (copy of root)                            | Bundled in tarball                    |
| `libs/blocks/LICENSE`                                                       | Create (copy of root)                            | Bundled in tarball                    |
| `libs/fintech/LICENSE`                                                      | Create (copy of root)                            | Bundled in tarball                    |
| `README.md` (root)                                                          | Rewrite                                          | Consumer-facing docs                  |
| `RELEASING.md` (root)                                                       | Create                                           | Human release runbook                 |
| `dist/libs/*/package.json`                                                  | Inspect                                          | Verify exports map + peerDeps rewrite |

---

## Task 1: Diagnose and fix the cdk build crash

**Files:**

- Inspect: `libs/cdk/src/lib/components/checkbox/src/*.ts`
- Possibly modify: any source file ng-packagr can't ingest in `partial` compilation mode
- Clean: `dist/`, `tmp/`, `.angular/`, `node_modules/.cache/nx`

- [ ] **Step 1: Capture the failing build with full stacktrace and full file context**

```bash
npx nx reset
rm -rf dist tmp .angular node_modules/.cache/nx
npx nx build cdk --verbose --skip-nx-cache 2>&1 | tee /tmp/cdk-build.log
```

Expected: Log shows which secondary entry point is being compiled when the error fires. Last successful entry point in the log is the previous one; the next-after is the offender.

- [ ] **Step 2: Re-read the offending entry point's `index.ts` and every `.ts` file it re-exports**

For checkbox specifically: `libs/cdk/src/lib/components/checkbox/src/{index,checkbox,checkbox.component,checkbox.directive,checkbox.options}.ts`. Look for: re-exports of types only without `export type`, namespace imports, circular imports between siblings, `import { ... } from '../../...'` reaching back into the primary entry point (forbidden across secondary entry boundaries).

Common triggers for "Only synthetic references are imports":

1. A secondary entry point importing from another secondary entry point via a deep relative path instead of through the package alias (e.g. `import { Foo } from '../../label/src'` instead of `from '@ngxpro/cdk/components/label'`).
2. A `.ts` file outside `src/**/*.ts` being pulled in by transitive `import`.
3. A type-only re-export that elides at runtime but trips TS's program builder.

- [ ] **Step 3: Apply the minimal fix**

Most likely fix: change cross-entry-point imports to use the package alias. Example:

```ts
// BEFORE — libs/cdk/src/lib/components/checkbox/src/checkbox.component.ts
import { NxpLabelDirective } from '../../label/src';

// AFTER
import { NxpLabelDirective } from '@ngxpro/cdk/components/label';
```

If the trigger is a stray non-source file, exclude it via `tsconfig.lib.json` `exclude`.

- [ ] **Step 4: Rebuild cdk only**

```bash
npx nx build cdk --skip-nx-cache 2>&1 | tail -20
```

Expected: `Built @ngxpro/cdk` printed, exit code 0, `dist/libs/cdk/fesm2022/` populated.

- [ ] **Step 5: Commit**

```bash
git add libs/cdk
git commit -m "fix(cdk): unblock ng-packagr partial compilation for secondary entry points"
```

---

## Task 2: Build all five libraries cleanly

**Files:** None changed; this is a verification gate.

- [ ] **Step 1: Run the full build**

```bash
npx nx run-many -t build --parallel=3 -p cdk,core,components,blocks,fintech --skip-nx-cache 2>&1 | tail -40
```

Expected: All five projects show "Built @ngxpro/<name>". `dist/libs/{cdk,core,components,blocks,fintech}` all exist.

- [ ] **Step 2: Spot-check the dist outputs**

```bash
for pkg in cdk core components blocks fintech; do
  echo "=== $pkg ==="
  ls dist/libs/$pkg
  echo "--- package.json fields ---"
  node -e "const p=require('./dist/libs/$pkg/package.json'); console.log(JSON.stringify({name:p.name,version:p.version,module:p.module,typings:p.typings,exports:Object.keys(p.exports||{}),peer:p.peerDependencies},null,2))"
done
```

Expected: each prints `name: @ngxpro/<pkg>`, version `0.0.1`, a `module` pointing into `fesm2022/`, a `typings` pointing into `types/`, an `exports` map listing primary `.` plus every secondary entry point, and `peerDependencies` matching the source.

- [ ] **Step 3: Commit if any source change crept in (likely none)**

```bash
git status
# only untracked dist/ — do not commit dist/. If sources changed, commit them.
```

---

## Task 3: Add per-package READMEs

**Files:**

- Create: `libs/cdk/README.md`
- Create: `libs/core/README.md`
- Create: `libs/components/README.md`
- Create: `libs/blocks/README.md`
- Create: `libs/fintech/README.md`

ng-packagr automatically copies `README.md` from the package root into the dist output, so a file at `libs/cdk/README.md` will end up in `dist/libs/cdk/README.md` and render on npmjs.com.

- [ ] **Step 1: Create `libs/cdk/README.md`**

```markdown
# @ngxpro/cdk

Low-level utilities, directives, tokens, observables, and portals for the **ngxpro** Angular UI library.

## Install

\`\`\`bash
npm install @ngxpro/cdk --legacy-peer-deps
\`\`\`

## Peer dependencies

This package needs Angular 21.1+, RxJS 7.8+, and the Tailwind helpers used throughout ngxpro:

\`\`\`bash
npm install @angular/common @angular/core @angular/forms @angular/platform-browser \\
@taiga-ui/polymorpheus clsx rxjs tailwind-merge tailwind-variants
\`\`\`

## Secondary entry points

\`\`\`ts
import { NxpIconComponent } from '@ngxpro/cdk/components/icon';
import { NxpCheckbox } from '@ngxpro/cdk/components/checkbox';
import { NxpRadio } from '@ngxpro/cdk/components/radio';
import { NxpRootComponent } from '@ngxpro/cdk/components/root';
import { NxpTextfieldComponent } from '@ngxpro/cdk/components/textfield';
// ...and: copy, link, label, input, calendar, notification
\`\`\`

## License

MIT — see [LICENSE](./LICENSE).
```

- [ ] **Step 2: Create `libs/core/README.md`**

```markdown
# @ngxpro/core

Foundation services (`ThemeService`, `BreakpointService`, `FormatService`), pipes, and tokens for the **ngxpro** Angular UI library.

## Install

\`\`\`bash
npm install @ngxpro/core @ngxpro/cdk --legacy-peer-deps
\`\`\`

## Peer dependencies

\`\`\`bash
npm install @angular/core
\`\`\`

`@ngxpro/core` also has `@ngxpro/cdk` as a peer dependency — install it alongside.

## Usage

\`\`\`ts
import { ThemeService, BreakpointService, FormatService } from '@ngxpro/core';
\`\`\`

## License

MIT — see [LICENSE](./LICENSE).
```

- [ ] **Step 3: Create `libs/components/README.md`**

```markdown
# @ngxpro/components

30+ standalone Angular UI components (accordion, button, calendar, input, textfield, tabs, tooltip, …) styled with Tailwind CSS v4.

## Install

\`\`\`bash
npm install @ngxpro/components @ngxpro/cdk @ngxpro/core --legacy-peer-deps
\`\`\`

## Peer dependencies

\`\`\`bash
npm install @angular/common @angular/core @angular/forms @angular/router \\
@taiga-ui/polymorpheus rxjs tailwind-variants
\`\`\`

## Secondary entry points

Each component is published as its own entry point — import only what you use:

\`\`\`ts
import { AccordionComponent } from '@ngxpro/components/accordion';
import { NxpButtonDirective } from '@ngxpro/components/button';
import { CardComponent } from '@ngxpro/components/card';
import { CalendarComponent } from '@ngxpro/components/calendar';
import { NxpTabs } from '@ngxpro/components/tabs';
// ...30+ entry points total
\`\`\`

## Tailwind setup

`@ngxpro/components` uses Tailwind CSS v4 utility classes. In your app's stylesheet:

\`\`\`css
@use 'tailwindcss';

@source '../node_modules/@ngxpro/components';
@source '../node_modules/@ngxpro/cdk';
\`\`\`

## License

MIT — see [LICENSE](./LICENSE).
```

- [ ] **Step 4: Create `libs/blocks/README.md`**

```markdown
# @ngxpro/blocks

Higher-level composed blocks (charts, KPI cards, tables) built on top of `@ngxpro/components`.

## Install

\`\`\`bash
npm install @ngxpro/blocks @ngxpro/components @ngxpro/core @ngxpro/cdk --legacy-peer-deps
\`\`\`

## Secondary entry points

\`\`\`ts
import { ChartsModule } from '@ngxpro/blocks/charts';
import { KpiCardsModule } from '@ngxpro/blocks/kpi-cards';
import { TablesModule } from '@ngxpro/blocks/tables';
\`\`\`

## License

MIT — see [LICENSE](./LICENSE).
```

- [ ] **Step 5: Create `libs/fintech/README.md`**

```markdown
# @ngxpro/fintech

Fintech-domain blocks built on top of `@ngxpro/blocks`.

> **Status:** placeholder — content is being added incrementally.

## Install

\`\`\`bash
npm install @ngxpro/fintech @ngxpro/blocks @ngxpro/components @ngxpro/core @ngxpro/cdk --legacy-peer-deps
\`\`\`

## License

MIT — see [LICENSE](./LICENSE).
```

- [ ] **Step 6: Verify the READMEs land in dist**

```bash
npx nx run-many -t build --parallel=3 -p cdk,core,components,blocks,fintech --skip-nx-cache > /dev/null 2>&1
for pkg in cdk core components blocks fintech; do
  test -f dist/libs/$pkg/README.md && echo "$pkg: README OK" || echo "$pkg: README MISSING"
done
```

Expected: Five `README OK` lines.

- [ ] **Step 7: Commit**

```bash
git add libs/cdk/README.md libs/core/README.md libs/components/README.md libs/blocks/README.md libs/fintech/README.md
git commit -m "docs: add per-package READMEs for npm publish"
```

---

## Task 4: Add per-package LICENSE files

**Files:**

- Create: `libs/cdk/LICENSE` (copy of root LICENSE)
- Create: `libs/core/LICENSE`
- Create: `libs/components/LICENSE`
- Create: `libs/blocks/LICENSE`
- Create: `libs/fintech/LICENSE`

- [ ] **Step 1: Copy root LICENSE into each lib**

```bash
for pkg in cdk core components blocks fintech; do
  cp LICENSE libs/$pkg/LICENSE
done
ls libs/*/LICENSE
```

Expected: Five `libs/<pkg>/LICENSE` files listed.

- [ ] **Step 2: Verify they end up in dist after build**

```bash
npx nx run-many -t build --parallel=3 -p cdk,core,components,blocks,fintech --skip-nx-cache > /dev/null 2>&1
for pkg in cdk core components blocks fintech; do
  test -f dist/libs/$pkg/LICENSE && echo "$pkg: LICENSE OK" || echo "$pkg: LICENSE MISSING"
done
```

Expected: Five `LICENSE OK` lines.

- [ ] **Step 3: Commit**

```bash
git add libs/*/LICENSE
git commit -m "chore: include LICENSE in each publishable package"
```

---

## Task 5: Verify built package.json contents and `npm pack` payload

**Files:** None changed — verification only.

- [ ] **Step 1: Inspect the published-shape package.json**

```bash
node -e "const p=require('./dist/libs/cdk/package.json'); console.log(JSON.stringify(p,null,2))" | head -60
node -e "const p=require('./dist/libs/core/package.json'); console.log(JSON.stringify(p,null,2))"
node -e "const p=require('./dist/libs/components/package.json'); console.log(JSON.stringify(p,null,2))" | head -60
```

Verify on cdk: `module: fesm2022/ngxpro-cdk.mjs`, `typings: types/ngxpro-cdk.d.ts`, `exports['.']` and `exports['./components/...']` present, `peerDependencies` lists Angular + clsx + rxjs + tailwind-merge + tailwind-variants + @taiga-ui/polymorpheus.

Verify on core: `peerDependencies['@ngxpro/cdk']` exists. Note: it will still read `*` until `nx release` rewrites it.

- [ ] **Step 2: `npm pack --dry-run` to see the tarball contents**

```bash
for pkg in cdk core components blocks fintech; do
  echo "=== $pkg ==="
  (cd dist/libs/$pkg && npm pack --dry-run 2>&1 | tail -40)
done
```

Expected per package: tarball name `ngxpro-<pkg>-0.0.1.tgz`, includes `package.json`, `README.md`, `LICENSE`, `fesm2022/*.mjs`, `fesm2022/*.mjs.map`, `types/*.d.ts`. No source `.ts`, no `node_modules`, no `tmp`.

- [ ] **Step 3: Confirm peer-dep rewrite hook is configured**

```bash
node -e "const cfg=require('./nx.json'); console.log(JSON.stringify(cfg.release.version.manifestRootsToUpdate))"
```

Expected: `["{projectRoot}","dist/{projectRoot}"]`. This is what makes `nx release version` rewrite `@ngxpro/cdk: *` to a real semver in **both** the source manifest and the dist manifest. No code change.

---

## Task 6: Local registry smoke test with Verdaccio

**Files:** None changed; uses the existing `local-registry:start` script.

- [ ] **Step 1: Start Verdaccio in the background**

```bash
npx nx run-many -t build --parallel=3 -p cdk,core,components,blocks,fintech --skip-nx-cache > /dev/null
npm run local-registry:start &
echo $! > /tmp/verdaccio.pid
sleep 3
curl -s http://localhost:4873/-/ping && echo " — verdaccio up"
```

Expected: `{} — verdaccio up`.

- [ ] **Step 2: Authenticate to the local registry (Verdaccio default allows on-the-fly users)**

```bash
npm-cli-login -u test -p test -e test@test.com -r http://localhost:4873/ 2>/dev/null || \
  ( echo "//localhost:4873/:_authToken=fake" >> ~/.npmrc )
npm whoami --registry http://localhost:4873/ || true
```

Expected: prints a username or `fake` token works for publish.

- [ ] **Step 3: Publish to Verdaccio via nx release**

```bash
npx nx release publish --registry=http://localhost:4873 --tag=verdaccio-test
```

Expected: Five packages publish; output ends with `Successfully ran target nx-release-publish for 5 projects`.

- [ ] **Step 4: Install in a scratch project**

```bash
mkdir -p /tmp/ngxpro-smoke && cd /tmp/ngxpro-smoke && npm init -y > /dev/null
npm install @ngxpro/core @ngxpro/cdk @ngxpro/components \
  --registry=http://localhost:4873 \
  --legacy-peer-deps
ls node_modules/@ngxpro
node -e "console.log(Object.keys(require('@ngxpro/core/package.json').peerDependencies))"
```

Expected: `cdk core components` directory listing; `peerDependencies` of core lists `@angular/core` and `@ngxpro/cdk` (the latter pinned to a real version, not `*`).

- [ ] **Step 5: Stop Verdaccio**

```bash
kill $(cat /tmp/verdaccio.pid) 2>/dev/null || true
rm -f /tmp/verdaccio.pid
```

- [ ] **Step 6: No commit**

This task is a verification gate; nothing in the working tree changes.

---

## Task 7: Rewrite root README for consumers

**Files:**

- Modify: `README.md` (rewrite from default Nx scaffold)

- [ ] **Step 1: Replace `README.md` content**

```markdown
# ngxpro

Angular 21 UI component library — a fast, opinionated set of standalone components, directives, and services styled with Tailwind CSS v4.

## Packages

| Package              | Description                                             |
| -------------------- | ------------------------------------------------------- |
| `@ngxpro/cdk`        | Utilities, directives, tokens, observables, portals     |
| `@ngxpro/core`       | Theme / breakpoint / format services, pipes, tokens     |
| `@ngxpro/components` | 30+ standalone UI components via secondary entry points |
| `@ngxpro/blocks`     | Composed blocks (charts, KPI cards, tables)             |
| `@ngxpro/fintech`    | Fintech-domain blocks                                   |

## Install

\`\`\`bash
npm install @ngxpro/core @ngxpro/cdk @ngxpro/components --legacy-peer-deps
\`\`\`

## Requirements

- Angular **21.1+**
- Tailwind CSS **v4**
- TypeScript **5.9+**

Peer dependencies are listed on each package's npm page.

## Quickstart

\`\`\`ts
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { nxpIconsProvider } from '@ngxpro/cdk/components/icon';

export const appConfig: ApplicationConfig = {
providers: [
provideRouter([]),
nxpIconsProvider({ /_ register icons here _/ }),
],
};
\`\`\`

\`\`\`ts
// my.component.ts
import { Component } from '@angular/core';
import { NxpButtonDirective } from '@ngxpro/components/button';

@Component({
standalone: true,
imports: [NxpButtonDirective],
template: `<button nxpButton>Click me</button>`,
})
export class MyComponent {}
\`\`\`

## Tailwind

In your app's main stylesheet:

\`\`\`css
@use 'tailwindcss';

@source '../node_modules/@ngxpro/cdk';
@source '../node_modules/@ngxpro/components';
@source '../node_modules/@ngxpro/blocks';
\`\`\`

## Development

This is an Nx monorepo.

\`\`\`bash
npm install --legacy-peer-deps
npx nx serve showcase # demo app
npx nx run-many -t build,lint,test --parallel=3
\`\`\`

## Releasing

See [RELEASING.md](./RELEASING.md).

## License

MIT — see [LICENSE](./LICENSE).
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: replace default Nx readme with consumer-facing docs"
```

---

## Task 8: Add RELEASING.md runbook

**Files:**

- Create: `RELEASING.md`

- [ ] **Step 1: Write the runbook**

```markdown
# Releasing ngxpro

ngxpro publishes five npm packages on a fixed version line: `@ngxpro/cdk`, `@ngxpro/core`, `@ngxpro/components`, `@ngxpro/blocks`, `@ngxpro/fintech`.

Versioning is driven by **Conventional Commits** via `nx release`. CHANGELOG and GitHub Release are generated automatically.

## Prerequisites (one-time)

1. **NPM_TOKEN GitHub secret** — create an [npm automation token](https://docs.npmjs.com/creating-and-viewing-access-tokens) with `Publish` permission on the `@ngxpro` scope, then add it to the repository secrets as `NPM_TOKEN`.
2. **Trusted publisher (recommended)** — set up [npm trusted publishing](https://docs.npmjs.com/trusted-publishers) for each `@ngxpro/*` package, pointing at this repo + the `Release` workflow. Once trusted publishing is live, `NPM_TOKEN` is no longer required (the workflow already enables `id-token: write` and sets `NPM_CONFIG_PROVENANCE=true`).
3. **Workspace claim** — connect the workspace to Nx Cloud (`https://cloud.nx.app`) using the URL Nx prints during builds, so the release CI run can read/write the cache.

## First release

The packages are at `0.0.1` with no git tags yet. The first release must use the `--first-release` flag.

1. Open **Actions → Release → Run workflow** in GitHub.
2. Tick **firstRelease**. Optionally tick **dryRun** for the first attempt.
3. Run.

Locally, the same flow:

\`\`\`bash
npx nx release --first-release --dry-run --verbose

# inspect output — what will be published, version, changelog text

npx nx release --first-release --verbose # for real
\`\`\`

## Subsequent releases

\`\`\`bash
git switch main && git pull
npx nx release --dry-run --verbose # preview
\`\`\`

Then dispatch the **Release** workflow with neither flag set. `nx release` will:

1. Determine the next version from conventional-commits since the last `vX.Y.Z` tag.
2. Bump every published package's `package.json` to that version.
3. Rewrite cross-package `peerDependencies` from `*` to the new version (via `manifestRootsToUpdate`).
4. Generate `CHANGELOG.md` entries.
5. Build all five libs.
6. Publish each `dist/libs/*` to npm with provenance.
7. Tag the commit `vX.Y.Z` and push.
8. Create a GitHub Release.

## Commit message conventions

| Type                                             | Bumps | Example                                              |
| ------------------------------------------------ | ----- | ---------------------------------------------------- |
| `feat:`                                          | minor | `feat(components/button): add ghost variant`         |
| `fix:`                                           | patch | `fix(cdk): unblock partial compilation for checkbox` |
| `perf:`                                          | patch | `perf(components/calendar): memoize day grid`        |
| `refactor:`                                      | patch | `refactor(core): split FormatService`                |
| `docs:` `chore:` `test:` `style:` `build:` `ci:` | none  | `docs: add quickstart`                               |

Breaking changes: add `BREAKING CHANGE:` to the body or `!` after the type (`feat!: …`). This bumps the major.

## Troubleshooting

- **`peerDependencies: "@ngxpro/cdk": "*"` shipped to npm** — `manifestRootsToUpdate` is misconfigured in `nx.json`. It must include both `{projectRoot}` and `dist/{projectRoot}`.
- **Build fails on a secondary entry point with "Only synthetic references are imports"** — usually a deep relative import crossing entry-point boundaries. Use the package alias (`@ngxpro/cdk/components/label`) instead.
- **Provenance fails** — check the workflow has `id-token: write` permission and that the package is configured for [trusted publishing](https://docs.npmjs.com/trusted-publishers) on npmjs.com.
- **First release errors with "no git tags found"** — re-run with the `firstRelease` flag.
```

- [ ] **Step 2: Commit**

```bash
git add RELEASING.md
git commit -m "docs: add release runbook"
```

---

## Task 9: First-release dry run

**Files:** None changed — verification only.

- [ ] **Step 1: Run the dry run**

```bash
npx nx release --first-release --dry-run --verbose 2>&1 | tee /tmp/nx-release-dryrun.log
```

Expected: log shows

1. Version determined (e.g., `0.1.0` if there are `feat:` commits, `0.0.2` for `fix:`-only).
2. Each `libs/*/package.json` planned-rewrite from `0.0.1` → new version.
3. Each `peerDependencies['@ngxpro/cdk']` planned-rewrite from `*` → new version.
4. CHANGELOG.md planned-rewrite.
5. Build runs.
6. `Would publish @ngxpro/cdk@<v>` (one per package, **dry-run**).
7. Git tag `v<v>` planned.
8. GitHub Release planned.

If any of these are missing, fix before going live. No source change should be required.

- [ ] **Step 2: No commit**

---

## Task 10: Trigger the actual first release

This step is **operator-driven** — performed by the user via the GitHub Actions UI, not by an automated agent. The plan documents it for completeness; do not execute it from inside an autonomous run.

- [ ] **Step 1: Confirm `NPM_TOKEN` secret is set in the repo**
- [ ] **Step 2: Open Actions → Release → Run workflow**
- [ ] **Step 3: Tick `firstRelease`. Leave `dryRun` unticked.**
- [ ] **Step 4: Run. Watch the logs.**
- [ ] **Step 5: Verify on https://www.npmjs.com/~ngxpro that all five packages appear with the correct version, README, and LICENSE.**
- [ ] **Step 6: Smoke-test against npm (not Verdaccio):**

```bash
mkdir -p /tmp/ngxpro-public-smoke && cd /tmp/ngxpro-public-smoke && npm init -y
npm install @ngxpro/core @ngxpro/cdk @ngxpro/components --legacy-peer-deps
ls node_modules/@ngxpro
```

Expected: three directories.

---

## Self-Review Notes

- Spec coverage: every published package has a build-fix gate (Task 1–2), README (Task 3), LICENSE (Task 4), payload verification (Task 5), local install proof (Task 6), consumer docs (Task 7), and a release runbook (Task 8). The release itself is gated by a dry-run (Task 9) and an operator-triggered actual run (Task 10).
- No placeholders — all README content, LICENSE source, and runbook text is inline.
- Type consistency — peer-dep rewrite, `manifestRootsToUpdate`, and `nx release --first-release` are referenced consistently.
- Risk: Task 1 fix is hypothesis-driven. If the actual root cause differs, expand Task 1's Step 2 reading list rather than guessing.
