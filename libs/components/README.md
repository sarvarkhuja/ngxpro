# @ngxpro/components

30+ standalone Angular UI components styled with Tailwind CSS v4. Part of the [ngxpro](https://github.com/SarvarkhujaMurodov/ngxpro) Angular UI library.

Components include: accordion, alert, avatar, badge, block, breadcrumb, button, calendar, card, checkbox, chip, copy, data-list, dialog, drawer, dropdown, hint, input, input-date, input-pin, label, link, modal, notification, pagination, popup, radio, range, segment, select, slider, sonner, stepper, switch, tabs, textarea, textfield, tooltip, tree.

## Install

```bash
npm install @ngxpro/components --legacy-peer-deps
```

## Peer dependencies

- `@angular/common` ^21.1
- `@angular/core` ^21.1
- `@ngxpro/cdk` (any matching workspace version)
- `@ngxpro/core` (any matching workspace version)

Tree-shakable secondary entry points: import each component from its own subpath.

## Usage

```ts
import { NxpAccordionComponent } from '@ngxpro/components/accordion';
import { NxpButtonDirective } from '@ngxpro/components/button';
import { NxpCardComponent } from '@ngxpro/components/card';
```

## License

[MIT](./LICENSE)
