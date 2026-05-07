# @ngxpro/cdk

Low-level utilities, directives, tokens, observables, and portals for the [ngxpro](https://github.com/SarvarkhujaMurodov/ngxpro) Angular UI library.

Includes: `cx()` class merging, focus/coercion/dom/math utilities, control/driver/vehicle base classes, icon/copy/link/checkbox/radio/textfield/label/input/calendar/notification components, and dropdown/dialog/modal/popup portals.

## Install

```bash
npm install @ngxpro/cdk --legacy-peer-deps
```

## Peer dependencies

- `@angular/common` ^21.1
- `@angular/core` ^21.1
- `@taiga-ui/polymorpheus` ^5.0

## Usage

```ts
// Primary entry point
import { cx } from '@ngxpro/cdk';

// Secondary entry points
import { NxpIconComponent, nxpIconsProvider } from '@ngxpro/cdk/components/icon';
import { NxpDropdownComponent } from '@ngxpro/cdk/portals/dropdown';
```

## License

[MIT](./LICENSE)
