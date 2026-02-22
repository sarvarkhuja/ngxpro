# CDK Directives

Low-level directives for building UI components. These directives provide the foundation for creating cells, titles, and other common UI patterns.

## CellDirective (`[nxpCell]`)

Creates structured list items with consistent spacing and sizing. Supports three size variants and three height modes.

### Basic Usage

```typescript
import { CellDirective, TitleDirective, SubtitleDirective } from '@nxp/cdk';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CellDirective, TitleDirective, SubtitleDirective],
  template: `
    <div nxpCell="m">
      <img src="avatar.png" alt="User" class="w-10 h-10 rounded-full" />
      <div nxpTitle>
        <div>John Doe</div>
        <div nxpSubtitle>Software Engineer</div>
      </div>
    </div>
  `,
})
export class UserListComponent {}
```

### Size Variants

```html
<!-- Small (40px min height) -->
<div nxpCell="s">Small cell</div>

<!-- Medium (52px min height) -->
<div nxpCell="m">Medium cell</div>

<!-- Large (72px min height) - default -->
<div nxpCell="l">Large cell</div>
```

### Height Modes

```html
<!-- Compact: No vertical padding -->
<div nxpCell="m" [height]="'compact'">Minimal padding</div>

<!-- Normal: Standard padding (default) -->
<div nxpCell="m" [height]="'normal'">Normal padding</div>

<!-- Spacious: Extra vertical padding -->
<div nxpCell="m" [height]="'spacious'">Extra padding</div>
```

### Interactive Cells

When applied to `button`, `label`, or `a` elements, the cell automatically adds hover and active states:

```html
<button nxpCell="l" (click)="handleClick()">
  <div nxpTitle>
    <div>Clickable Item</div>
    <div nxpSubtitle>Click to expand</div>
  </div>
</button>
```

## TitleDirective (`[nxpTitle]`)

Creates structured title/subtitle layouts with optional size variants.

### Basic Usage

```html
<div nxpTitle>
  <h2>Main Title</h2>
  <p nxpSubtitle>Supporting description</p>
</div>
```

### Size Variants

```html
<!-- Small -->
<div nxpTitle="s">
  <span>Small Title</span>
  <span nxpSubtitle>Caption text</span>
</div>

<!-- Medium -->
<div nxpTitle="m">
  <h3>Medium Title</h3>
  <p nxpSubtitle>Description</p>
</div>

<!-- Large -->
<div nxpTitle="l">
  <h1>Large Page Title</h1>
  <p nxpSubtitle>Subtitle with more spacing</p>
</div>
```

### In a Cell

```html
<div nxpCell="m">
  <img src="avatar.png" class="w-10 h-10 rounded-full" />
  <div nxpTitle>
    <div>Jane Smith</div>
    <div nxpSubtitle>Product Manager</div>
  </div>
</div>
```

## SubtitleDirective (`[nxpSubtitle]`)

Renders secondary text in a lighter color with smaller font size.

### Basic Usage

```html
<div nxpTitle>
  <div>Primary Text</div>
  <div nxpSubtitle>Secondary description text</div>
</div>
```

### With Icons

```html
<div nxpSubtitle>
  <svg class="w-4 h-4" fill="currentColor">
    <use href="#icon-check"></use>
  </svg>
  <span>Status: Active</span>
</div>
```

## CellActionsDirective (`[nxpCellActions]`)

Positions action buttons within a cell. Actions are revealed on hover with smooth transitions.

### Basic Usage

```html
<div nxpCell="l">
  <div nxpTitle>
    <div>Item Title</div>
    <div nxpSubtitle>Description</div>
  </div>
  <div nxpCellActions>
    <button class="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
      <svg class="w-4 h-4"><use href="#icon-edit"></use></svg>
    </button>
    <button class="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
      <svg class="w-4 h-4"><use href="#icon-delete"></use></svg>
    </button>
  </div>
</div>
```

### Note on Hover Behavior

The actions are hidden by default and revealed when the parent cell is hovered. Individual buttons/links remain visible when focused for keyboard accessibility.

## Complete Example

```typescript
import { CellDirective, TitleDirective, SubtitleDirective, CellActionsDirective } from '@nxp/cdk';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CellDirective, TitleDirective, SubtitleDirective, CellActionsDirective],
  template: `
    <div class="space-y-2">
      @for (user of users; track user.id) {
        <div nxpCell="m">
          <img [src]="user.avatar" [alt]="user.name" class="w-10 h-10 rounded-full" />
          <div nxpTitle>
            <div class="font-medium">{{ user.name }}</div>
            <div nxpSubtitle>
              <svg class="w-4 h-4"><use href="#icon-briefcase"></use></svg>
              <span>{{ user.role }}</span>
            </div>
          </div>
          <div nxpCellActions>
            <button (click)="editUser(user)" class="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Edit user">
              <svg class="w-4 h-4"><use href="#icon-edit"></use></svg>
            </button>
            <button (click)="deleteUser(user)" class="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Delete user">
              <svg class="w-4 h-4"><use href="#icon-delete"></use></svg>
            </button>
          </div>
        </div>
      }
    </div>
  `,
})
export class UserListComponent {
  users = [
    { id: 1, name: 'John Doe', role: 'Software Engineer', avatar: 'avatar1.png' },
    { id: 2, name: 'Jane Smith', role: 'Product Manager', avatar: 'avatar2.png' },
    { id: 3, name: 'Bob Johnson', role: 'Designer', avatar: 'avatar3.png' },
  ];

  editUser(user: any) {
    console.log('Edit user:', user);
  }

  deleteUser(user: any) {
    console.log('Delete user:', user);
  }
}
```

## Dark Mode Support

All directives include dark mode variants using Tailwind's `dark:` prefix:

```html
<!-- SubtitleDirective automatically adapts -->
<div nxpSubtitle>
  <!-- text-gray-600 in light mode -->
  <!-- text-gray-400 in dark mode -->
  Secondary text
</div>

<!-- CellDirective hover states adapt -->
<button nxpCell="m">
  <!-- bg-gray-50 hover in light mode -->
  <!-- bg-gray-900/50 hover in dark mode -->
  Clickable cell
</button>
```

## Accessibility

- All interactive cells include proper focus styles (`focus-visible:outline`)
- Cell actions remain visible when focused for keyboard navigation
- Use semantic HTML elements (`button`, `a`) for interactive cells
- Always provide `aria-label` for icon-only buttons
- Use proper heading hierarchy with `nxpTitle`

## Pattern Source

These directives are based on Taiga UI's architecture patterns:

- `CellDirective` → `TuiCell`
- `TitleDirective` → `TuiTitle`
- `SubtitleDirective` → `tuiSubtitle`
- `CellActionsDirective` → `tuiCellActions`

Styling is 100% Tailwind CSS with dark mode support, following Tremor's design patterns.
