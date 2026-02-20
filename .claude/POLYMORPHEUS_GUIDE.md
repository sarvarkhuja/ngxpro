# Polymorpheus Integration Guide

**For ngxpro Agents**

---

## 🎯 Purpose

Polymorpheus is a 1KB utility library that enables **polymorphic templates** in Angular components. It allows components to accept content in multiple forms (strings, functions, templates, components) without interface bloat.

**Package**: `@taiga-ui/polymorpheus` v5.0.0+  
**Source**: https://github.com/taiga-family/ng-polymorpheus  
**NPM**: https://www.npmjs.com/package/@taiga-ui/polymorpheus  
**Article**: https://medium.com/angular-in-depth/agnostic-components-in-angular-2427923b742d

---

## 🔑 Core Concept

### The Problem

When building reusable components, you often need to support various content types:

```typescript
// ❌ BAD: Interface bloat
interface MenuItem {
  label: string;
  icon?: string;
  disabled?: boolean;
  badge?: number;
  customClass?: string;
  onClick?: () => void;
  // ... keeps growing forever
}
```

Every new use case requires a new property, making the interface unmaintainable.

### The Solution

Polymorpheus allows components to be **data-agnostic** and **design-agnostic**:

```typescript
// ✅ GOOD: Polymorphic content
interface MenuItem<T = any> {
  data: T;  // Accept ANY data structure
}

// Let consumer decide how to render
<ngxpro-menu 
  [items]="menuItems" 
  [itemContent]="customRenderFunction" />
```

---

## 📦 Installation

```bash
npm install @taiga-ui/polymorpheus@^5.0.0
```

**Re-export from @ngxpro/cdk**:

```typescript
// libs/cdk/src/index.ts
export {
  PolymorpheusContent,
  PolymorpheusComponent,
  PolymorpheusTemplate,
  PolymorpheusOutlet,
  POLYMORPHEUS_CONTEXT,
  injectContext,
} from '@taiga-ui/polymorpheus';
```

---

## 🏗️ Basic Usage

### 1. Component Definition

```typescript
import { PolymorpheusContent, PolymorpheusOutlet } from '@taiga-ui/polymorpheus';

interface ItemContext<T> {
  $implicit: T;     // Current item
  index: number;    // Item index
  focused: boolean; // Is item focused
}

@Component({
  selector: 'ngxpro-list',
  standalone: true,
  imports: [CommonModule, PolymorpheusOutlet],
  template: `
    @for (item of items(); track item; let idx = $index) {
      <div 
        class="p-4"
        [class.bg-gray-100]="idx === focusedIndex()"
        *polymorpheusOutlet="
          itemContent() as content; 
          context: { $implicit: item, index: idx, focused: idx === focusedIndex() }
        ">
        {{ content }}
      </div>
    }
  `,
})
export class NgxproListComponent<T> {
  public readonly items = input.required<T[]>();
  
  // Accept any content type, default to stringify
  public readonly itemContent = input<PolymorpheusContent<ItemContext<T>>>(
    (ctx) => String(ctx.$implicit)
  );
  
  protected readonly focusedIndex = signal(0);
}
```

### 2. Consumer Usage

#### A. Simple String

```html
<ngxpro-list [items]="['Apple', 'Banana', 'Cherry']" />
```

#### B. Function (stringify)

```html
<ngxpro-list 
  [items]="users" 
  [itemContent]="getUserName" />
```

```typescript
getUserName = (ctx: ItemContext<User>) => ctx.$implicit.name;
```

#### C. Template

```html
<ngxpro-list 
  [items]="accounts" 
  [itemContent]="accountTemplate" />

<ng-template #accountTemplate let-account let-idx="index" let-focused="focused">
  <div class="flex items-center gap-2">
    <img [src]="account.avatar" class="w-6 h-6 rounded-full" />
    <span [class.font-bold]="focused">
      {{ idx + 1 }}. {{ account.name }}
    </span>
  </div>
</ng-template>
```

#### D. Dynamic Component

```html
<ngxpro-list 
  [items]="contacts" 
  [itemContent]="ContactCardComponent" />
```

```typescript
// ContactCardComponent has access to context via injection
@Component({
  selector: 'contact-card',
  template: `
    <div class="flex items-center gap-2">
      <img [src]="context().$implicit.avatar" />
      <span>{{ context().$implicit.name }}</span>
    </div>
  `,
})
export class ContactCardComponent {
  protected readonly context = injectContext<ItemContext<Contact>>();
}
```

---

## 🎨 Real-World Examples

### Example 1: Dropdown with Polymorphic Items

```typescript
// libs/components/dropdown/dropdown.component.ts
import { PolymorpheusContent, PolymorpheusOutlet } from '@ngxpro/cdk';

interface DropdownContext<T> {
  $implicit: T;
  selected: boolean;
  disabled: boolean;
  index: number;
}

@Component({
  selector: 'ngxpro-dropdown',
  standalone: true,
  imports: [CommonModule, PolymorpheusOutlet],
  template: `
    <button 
      type="button"
      class="px-4 py-2 border rounded-lg"
      (click)="toggle()">
      @if (selectedItem()) {
        <div *polymorpheusOutlet="
          itemContent() as content; 
          context: { 
            $implicit: selectedItem(), 
            selected: true, 
            disabled: false,
            index: selectedIndex() 
          }">
          {{ content }}
        </div>
      } @else {
        <span class="text-gray-400">{{ placeholder() }}</span>
      }
    </button>

    @if (isOpen()) {
      <div class="absolute mt-1 border rounded-lg shadow-lg bg-white">
        @for (item of items(); track item; let idx = $index) {
          <div 
            class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            [class.bg-blue-50]="idx === selectedIndex()"
            (click)="select(item, idx)"
            *polymorpheusOutlet="
              itemContent() as content; 
              context: { 
                $implicit: item, 
                selected: idx === selectedIndex(),
                disabled: disabledFn()(item),
                index: idx
              }">
            {{ content }}
          </div>
        }
      </div>
    }
  `,
})
export class NgxproDropdownComponent<T> {
  public readonly items = input.required<T[]>();
  public readonly placeholder = input('Select...');
  
  // Polymorphic item renderer
  public readonly itemContent = input<PolymorpheusContent<DropdownContext<T>>>(
    (ctx) => String(ctx.$implicit)
  );
  
  // Handler for disabled state
  public readonly disabledFn = input<(item: T) => boolean>(() => false);
  
  protected readonly isOpen = signal(false);
  protected readonly selectedIndex = signal(-1);
  protected readonly selectedItem = computed(() => {
    const idx = this.selectedIndex();
    return idx >= 0 ? this.items()[idx] : null;
  });
  
  protected toggle() {
    this.isOpen.update(v => !v);
  }
  
  protected select(item: T, index: number) {
    this.selectedIndex.set(index);
    this.isOpen.set(false);
  }
}
```

**Usage**:

```html
<!-- Simple strings -->
<ngxpro-dropdown [items]="['Small', 'Medium', 'Large']" />

<!-- Objects with function -->
<ngxpro-dropdown 
  [items]="users" 
  [itemContent]="(ctx) => ctx.$implicit.name + ' (' + ctx.$implicit.email + ')'" />

<!-- Template with custom design -->
<ngxpro-dropdown 
  [items]="accounts" 
  [itemContent]="accountTpl"
  [disabledFn]="(account) => !account.active" />

<ng-template #accountTpl let-account let-selected="selected">
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <img [src]="account.avatar" class="w-8 h-8 rounded-full" />
      <div>
        <div class="font-medium">{{ account.name }}</div>
        <div class="text-sm text-gray-500">{{ account.balance | currency }}</div>
      </div>
    </div>
    @if (selected) {
      <svg class="w-5 h-5 text-blue-500"><!-- checkmark --></svg>
    }
  </div>
</ng-template>
```

### Example 2: Tooltip with Polymorphic Content

```typescript
// libs/components/tooltip/tooltip.component.ts
import { PolymorpheusContent, PolymorpheusOutlet } from '@ngxpro/cdk';

interface TooltipContext {
  $implicit: any;  // Host element or data
}

@Component({
  selector: 'ngxpro-tooltip',
  standalone: true,
  imports: [CommonModule, PolymorpheusOutlet],
  template: `
    <div 
      class="inline-block"
      (mouseenter)="show()"
      (mouseleave)="hide()">
      <ng-content />
    </div>

    @if (isVisible()) {
      <div class="absolute z-50 px-3 py-2 text-sm bg-gray-900 text-white rounded-lg shadow-lg">
        <div *polymorpheusOutlet="content() as text; context: { $implicit: data() }">
          {{ text }}
        </div>
      </div>
    }
  `,
})
export class NgxproTooltipComponent {
  // Accept string, function, template, or component
  public readonly content = input.required<PolymorpheusContent<TooltipContext>>();
  public readonly data = input<any>(null);
  
  protected readonly isVisible = signal(false);
  
  protected show() { this.isVisible.set(true); }
  protected hide() { this.isVisible.set(false); }
}
```

**Usage**:

```html
<!-- Simple string -->
<ngxpro-tooltip content="Delete this item">
  <button>Delete</button>
</ngxpro-tooltip>

<!-- Function -->
<ngxpro-tooltip 
  [content]="(ctx) => 'Created: ' + formatDate(ctx.$implicit.createdAt)"
  [data]="item">
  <span>{{ item.name }}</span>
</ngxpro-tooltip>

<!-- Rich template -->
<ngxpro-tooltip [content]="richTooltip" [data]="user">
  <img [src]="user.avatar" />
</ngxpro-tooltip>

<ng-template #richTooltip let-user>
  <div class="text-center">
    <div class="font-bold">{{ user.name }}</div>
    <div class="text-gray-400">{{ user.role }}</div>
  </div>
</ng-template>
```

### Example 3: Modal with Polymorphic Content

```typescript
// libs/components/modal/modal.service.ts
import { Injectable, inject } from '@angular/core';
import { PolymorpheusComponent, PolymorpheusContent } from '@ngxpro/cdk';

interface ModalContext {
  $implicit: any;  // Modal data
  close: (result?: any) => void;
}

@Injectable({ providedIn: 'root' })
export class NgxproModalService {
  open<T>(content: PolymorpheusContent<ModalContext>, data?: any) {
    // Implementation: create overlay, render content with context
    const context: ModalContext = {
      $implicit: data,
      close: (result) => this.closeModal(result),
    };
    // ... render with *polymorpheusOutlet
  }
  
  private closeModal(result?: any) {
    // Close and return result
  }
}
```

**Usage**:

```typescript
// Open with string
modal.open('Are you sure?');

// Open with template
modal.open(myTemplate, userData);

// Open with component
modal.open(new PolymorpheusComponent(UserFormComponent), user);
```

---

## 🔧 Taiga UI Pattern Reference

Study these Taiga UI components for Polymorpheus usage patterns:

### 1. Select / Dropdown
**Path**: `taiga-family/kit/components/select/`
**Pattern**: Polymorphic item templates with focus state

### 2. Tabs
**Path**: `taiga-family/kit/components/tabs/`
**Pattern**: Tab content rendering with active state

### 3. Notification / Alert
**Path**: `taiga-family/core/components/notification/`
**Pattern**: Alert content (string, template, component)

### 4. Dialog
**Path**: `taiga-family/core/components/dialog/`
**Pattern**: Modal content injection with context

### 5. DataList
**Path**: `taiga-family/kit/components/data-list/`
**Pattern**: List items with custom templates

---

## ✅ Best Practices

### 1. Always Provide a Default

```typescript
// Good: Works without configuration
public readonly content = input<PolymorpheusContent<Context>>(
  (ctx) => String(ctx.$implicit)  // Default stringify
);
```

### 2. Rich Context

Include all data that might affect rendering:

```typescript
interface RichContext<T> {
  $implicit: T;      // Primary data (required)
  index: number;     // Position
  focused: boolean;  // State
  selected: boolean; // State
  disabled: boolean; // State
  // ... any other state
}
```

### 3. Type Safety with Generics

```typescript
export class FlexibleComponent<T> {
  public readonly items = input.required<T[]>();
  public readonly itemContent = input<PolymorpheusContent<{ $implicit: T }>>();
  //                                                         ^^^^^^^^^^^^^^^^
  //                                                         Type-safe context
}
```

### 4. Performance: Live Context

Context object is **live** — changes propagate automatically:

```typescript
// Context is reactive
protected getContext(item: T, index: number) {
  return {
    $implicit: item,
    focused: this.focusedIndex() === index,  // Updates automatically
  };
}
```

### 5. Accessibility

Ensure all content types meet a11y requirements:

```typescript
// For components, ensure proper ARIA attributes
@Component({
  template: `
    <div 
      role="option"
      [attr.aria-selected]="context().selected"
      *polymorpheusOutlet="content() as text; context: ctx()">
      {{ text }}
    </div>
  `,
})
```

---

## 🚫 Anti-Patterns

### ❌ Don't: Manual Type Checking

```typescript
// Bad: Don't check types manually
if (typeof content === 'string') {
  // ...
} else if (content instanceof TemplateRef) {
  // ...
}
```

Use `*polymorpheusOutlet` — it handles type detection.

### ❌ Don't: Duplicating Context

```typescript
// Bad: Context spread across multiple properties
public readonly item = input<T>();
public readonly focused = input(false);
public readonly index = input(0);

// Good: Single context object
public readonly context = input<Context<T>>();
```

### ❌ Don't: Static Context

```typescript
// Bad: Context doesn't update
protected readonly context = {
  $implicit: this.item(),
  focused: this.focused(),  // Won't update!
};

// Good: Computed or method
protected readonly context = computed(() => ({
  $implicit: this.item(),
  focused: this.focused(),  // Updates automatically
}));
```

---

## 📚 Additional Resources

- **Polymorpheus GitHub**: https://github.com/taiga-family/ng-polymorpheus
- **Original Article**: https://medium.com/angular-in-depth/agnostic-components-in-angular-2427923b742d
- **Taiga UI Examples**: Browse `taiga-family/` folder for real implementations
- **ngxpro Core Agent Rules**: `.claude/rules/core-agent.md` (Polymorpheus Integration)

---

## 🎯 When to Use Polymorpheus

| Component Type | Use Polymorpheus? | Example |
|---------------|-------------------|---------|
| Dropdown / Select | ✅ YES | Custom item rendering |
| Tabs | ✅ YES | Tab label/content |
| ComboBox | ✅ YES | Search result items |
| Tooltip | ✅ YES | Rich tooltip content |
| Modal | ✅ YES | Dialog content |
| Alert / Toast | ✅ YES | Notification content |
| Menu | ✅ YES | Menu item templates |
| Table Cell | ✅ YES | Custom cell content |
| Empty State | ✅ YES | Placeholder content |
| Badge | ✅ YES | Badge content |
| Button | ❌ NO | Just text/icon slots |
| Input | ❌ NO | Fixed structure |
| Checkbox | ❌ NO | Label is simple |

**Rule of thumb**: If users might want to customize content appearance in multiple ways → use Polymorpheus.

---

## 🏁 Quick Start Checklist

- [ ] Install `@taiga-ui/polymorpheus@^5.0.0`
- [ ] Re-export from `@ngxpro/cdk/src/index.ts`
- [ ] Import `PolymorpheusOutlet` in component
- [ ] Define context interface with `$implicit`
- [ ] Add `itemContent` input with default function
- [ ] Use `*polymorpheusOutlet` in template
- [ ] Test with: string, function, template, component
- [ ] Document usage examples in component README
- [ ] Add Storybook stories for all content types

---

**Next Steps**: See `.claude/rules/core-agent.md` for integration into @ngxpro/core, or start using in components like Dropdown, Select, ComboBox, Tabs.
