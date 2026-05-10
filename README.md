# ngxpro

Angular 21 UI component library — a fast, opinionated set of standalone components, directives, and services styled with Tailwind CSS v4.

## Packages

| Package                                   | Description                                             |
| ----------------------------------------- | ------------------------------------------------------- |
| [`@ngxpro/cdk`](./libs/cdk)               | Utilities, directives, tokens, observables, portals     |
| [`@ngxpro/core`](./libs/core)             | Theme / breakpoint / format services, pipes, tokens     |
| [`@ngxpro/components`](./libs/components) | 30+ standalone UI components via secondary entry points |
| [`@ngxpro/blocks`](./libs/blocks)         | Composed blocks (charts, KPI cards, tables)             |
| [`@ngxpro/fintech`](./libs/fintech)       | Fintech-domain blocks                                   |

## Install

```bash
npm install @ngxpro/core @ngxpro/cdk @ngxpro/components --legacy-peer-deps
```

## Requirements

- Angular **21.1+**
- Tailwind CSS **v4**
- TypeScript **5.9+**

Peer dependencies are listed on each package's npm page.

## Quickstart

```ts
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { nxpIconsProvider } from '@ngxpro/cdk/components/icon';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([]),
    nxpIconsProvider({
      /* register icons here */
    }),
  ],
};
```

```ts
// my.component.ts
import { Component } from '@angular/core';
import { NxpButtonDirective } from '@ngxpro/components/button';

@Component({
  standalone: true,
  imports: [NxpButtonDirective],
  template: `<button nxpButton>Click me</button>`,
})
export class MyComponent {}
```

## Tailwind setup

In your app's main stylesheet:

```css
@use 'tailwindcss';

@source '../node_modules/@ngxpro/cdk';
@source '../node_modules/@ngxpro/components';
@source '../node_modules/@ngxpro/blocks';
```

## Development

This is an Nx 22.5 monorepo.

```bash
npm install --legacy-peer-deps
npx nx serve showcase             # demo app
npx nx run-many -t build,lint,test --parallel=3
```

## Releasing

See [RELEASING.md](./RELEASING.md).

## License

MIT — see [LICENSE](./LICENSE).
