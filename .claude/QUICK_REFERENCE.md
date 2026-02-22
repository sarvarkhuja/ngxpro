# nxp Quick Reference Card

**For AI Agents working on nxp**

---

## 🚨 CRITICAL RULES

### ❌ DO NOT

- Import or use Taiga UI components (`TuiButton`, `TuiCard`, etc.)
- Do not use Taiga's styling system
- DO not include Taiga UI in production bundles
- Use `@Input()` or `@Output()` decorators (use signals)

### ✅ DO

- Build components from scratch
- Study Taiga for **architecture patterns** (signals, contentChildren, OnPush)
- Study Tremor for **styling patterns** (Tailwind classes)
- Use 100% Tailwind CSS for styling
- Use `input()` and `output()` for signals
- Keep Taiga UI as dev dependency only

---

## 📚 Two Reference Sources

### Taiga UI = Architecture

**Location**: `taiga-family/`
**Study for**:

- Component structure patterns
- Signal usage (`input()`, `signal()`, `computed()`)
- `contentChildren()` and `viewChildren()`
- `hostDirectives` for composition
- OnPush change detection patterns
- State management approaches

**DO NOT**:

- Copy code directly
- Import Taiga components
- Use Taiga styling

### Tremor = Styling

**Location**: `tremor-main/`
**Study for**:

- Tailwind utility classes
- Dark mode patterns (`dark:` variants)
- Responsive breakpoints (`sm:`, `md:`, `lg:`)
- Color schemes
- Spacing patterns
- Animation approaches
- `cx()` utility for class merging

**DO**:

- Copy Tailwind class patterns
- Adapt to Angular templates

---

## 📦 Package Structure

```
@nxp/cdk         # Utils (focus, DOM, math, observables, Polymorpheus)
@nxp/core        # Services (theme, format, breakpoint)
@nxp/components  # Base UI (Accordion, Button, Card, ...)
@nxp/blocks      # Composed (charts, tables, forms, ...)
@nxp/fintech     # Domain-specific
@nxp/cli         # Code generator
```

---

## 🔧 Polymorpheus for Flexible Content

**Use**: Make components accept strings, functions, templates, OR components
**Package**: `@taiga-ui/polymorpheus` (1KB, included in @nxp/cdk)
**Pattern**: From Taiga UI architecture

### When to Use

- Dropdowns, selects, tabs (custom item rendering)
- Tooltips, modals, alerts (flexible content)
- Validation errors, empty states
- Any component that accepts arbitrary content

## 🏗️ Component Template

```typescript
import {
	ChangeDetectionStrategy,
	Component,
	input,
	output,
	signal,
	contentChildren,
	ViewEncapsulation,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
	selector: "nxp-example",
	standalone: true,
	imports: [CommonModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	template: `
		<!-- Tremor Tailwind classes -->
		<div
			class="flex items-center justify-between p-4 
                text-gray-900 dark:text-gray-50 
                border border-gray-200 dark:border-gray-800"
		>
			<ng-content />
		</div>
	`,
})
export class NgxproExampleComponent {
	// Taiga pattern: signal inputs
	public readonly size = input<"sm" | "md" | "lg">("md");
	public readonly disabled = input(false);

	// Taiga pattern: signal outputs
	public readonly valueChange = output<string>();

	// Taiga pattern: contentChildren
	protected readonly items = contentChildren(SomeChildComponent);
}
```

---

## 🎨 Tailwind Patterns (Tremor)

### Base Structure

```html
class="flex items-center justify-between"
```

### Colors (with dark mode)

```html
text-gray-900 dark:text-gray-50 bg-white dark:bg-gray-950 border-gray-200
dark:border-gray-800
```

### Responsive

```html
class="text-sm md:text-base lg:text-lg" class="grid grid-cols-1 md:grid-cols-2
lg:grid-cols-3"
```

### States

```html
hover:bg-gray-100 dark:hover:bg-gray-900 focus-visible:ring-2
focus-visible:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed
```

---

## 🧪 Quality Checklist (Per Component)

- [ ] Standalone component
- [ ] OnPush change detection
- [ ] Signal inputs (`input()` not `@Input()`)
- [ ] Tailwind classes (NO SCSS)
- [ ] Dark mode (`dark:` variants on all colors)
- [ ] Responsive (`sm:`, `md:`, `lg:` where appropriate)
- [ ] ≥80% test coverage
- [ ] 0 accessibility violations
- [ ] Storybook story
- [ ] README with usage
- [ ] NO Taiga UI dependencies

---

## 📍 Starting Point: Accordion Component

**Architecture reference**: `taiga-family/kit/components/accordion/`
**Styling reference**: `tremor-main/src/components/Accordion/`
**Implementation guide**: `.claude/ACCORDION_IMPLEMENTATION.md`

---

## 🔗 Key Files to Read

### Always Applied Rules

- `.cursor/rules/nxp-project-context.mdc` — Mission and package layout
- `AGENTS.md` — Agent role selection

### Agent-Specific Rules

- `.claude/rules/architecture-agent.md` — Nx, Tailwind, CI/CD
- `.claude/rules/block-generator-agent.md` — Component/block creation
- `.claude/rules/core-agent.md` — CDK and Core services
- `.claude/rules/testing-agent.md` — Testing standards

### Implementation Guides

- `.claude/PROJECT_DIRECTION.md` — Complete project overview
- `.claude/ACCORDION_IMPLEMENTATION.md` — First component guide
- `.claude/CLAUDE.md` — Main project documentation

---

## 💡 Quick Decision Tree

**Q: Should I use a Taiga UI component?**
A: ❌ NO. Build from scratch.

**Q: Should I study Taiga UI code?**
A: ✅ YES, for architecture patterns only.

**Q: Should I copy Tremor's Tailwind classes?**
A: ✅ YES, adapt to Angular templates.

**Q: Should I use SCSS for styling?**
A: ❌ NO. Only Tailwind classes (except global tokens).

**Q: Should I use @Input() decorator?**
A: ❌ NO. Use `input()` signal function.

**Q: Where do I start?**
A: Read `.claude/rules/architecture-agent.md` for setup, then `.claude/ACCORDION_IMPLEMENTATION.md` for first component.

---

## 🎯 Success Mantra

**"Taiga architecture + Tremor styling = nxp components"**

Study both. Implement our own. Build from scratch.
