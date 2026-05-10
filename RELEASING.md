# Releasing ngxpro

ngxpro publishes five npm packages on a fixed version line: `@ngxpro/cdk`, `@ngxpro/core`, `@ngxpro/components`, `@ngxpro/blocks`, `@ngxpro/fintech`.

Versioning is driven by **Conventional Commits** via `nx release`. CHANGELOG and GitHub Release are generated automatically.

## Prerequisites (one-time)

1. **NPM_TOKEN GitHub secret** — create an [npm automation token](https://docs.npmjs.com/creating-and-viewing-access-tokens) with publish permission on the `@ngxpro` scope, then add it to the repository secrets as `NPM_TOKEN`. Skip this step if you are using trusted publishing (recommended, see below).
2. **Trusted publisher (recommended)** — set up [npm trusted publishing](https://docs.npmjs.com/trusted-publishers) for each `@ngxpro/*` package, pointing at this repo + the `Release` workflow. Once trusted publishing is live, `NPM_TOKEN` is no longer required (the workflow already enables `id-token: write` and sets `NPM_CONFIG_PROVENANCE=true`).
3. **Workspace claim** — connect the workspace to Nx Cloud (`https://cloud.nx.app`) using the URL Nx prints during builds, so the release CI run can read/write the cache. Builds still work without it.

## First release

The packages start at `0.0.1` with no git tags. The first release must use the `--first-release` flag.

GitHub Actions:

1. Open **Actions → Release → Run workflow** in GitHub.
2. Tick **firstRelease**. Optionally tick **dryRun** for the first attempt.
3. Run.

Locally (for verification):

```bash
npx nx release --first-release --dry-run --verbose   # preview
npx nx release --first-release --verbose             # publish
```

**First-release version:** if there are no conventional-commit `feat:`/`fix:` commits in the repo's history yet, `nx release` will skip versioning ("No changes were detected"). For the very first publish, supply an explicit specifier:

```bash
npx nx release version 0.1.0 --first-release
npx nx release publish
```

Or, in the **Release** workflow, commit at least one conventional commit (e.g. `feat: initial public release`) before dispatching with `firstRelease=true`.

## Subsequent releases

```bash
git switch main && git pull
npx nx release --dry-run --verbose                   # preview
```

Then dispatch the **Release** workflow with neither flag set. `nx release` will:

1. Determine the next version from conventional-commits since the last `vX.Y.Z` tag.
2. Bump every published package's `package.json`.
3. Rewrite cross-package `peerDependencies` from `*` to the new version (via `manifestRootsToUpdate` in `nx.json`).
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

Breaking changes: add `BREAKING CHANGE:` in the body or `!` after the type (`feat!: …`). This bumps the major.

## Local registry smoke test

To validate a release end-to-end without publishing publicly:

```bash
npm run local-registry:start &                       # Verdaccio on :4873
npx nx release publish --registry=http://localhost:4873 --tag=verdaccio-test
# in a scratch project:
npm install @ngxpro/core @ngxpro/cdk @ngxpro/components \
  --registry=http://localhost:4873 --legacy-peer-deps
```

## Troubleshooting

- **`peerDependencies: "@ngxpro/cdk": "*"` shipped to npm** — `manifestRootsToUpdate` in `nx.json` is misconfigured. It must include both `{projectRoot}` and `dist/{projectRoot}`.
- **Build fails on a secondary entry point with "Only synthetic references are imports"** — usually a deep relative import crossing entry-point boundaries. Use the package alias (`@ngxpro/cdk` for primary, `@ngxpro/cdk/components/<name>` for sibling secondary entries) instead, and ensure `@nx/enforce-module-boundaries` has `allowCircularSelfDependency: true` for that lib.
- **Provenance fails** — check the workflow has `id-token: write` permission and that the package is configured for [trusted publishing](https://docs.npmjs.com/trusted-publishers).
- **First release errors with "no git tags found"** — re-run with the `firstRelease` flag.
