# nxp Project Direction

**Updated**: 2026-02-14

---

## 🎯 Mission Statement

Build a **from-scratch Angular UI component library** inspired by:

- **Taiga UI's architecture** (@taiga-family/cdk, @taiga-family/core, @taiga-family/kit)
- **Tremor's Tailwind styling** (utility-first CSS, dark mode, responsive)

**We are NOT building on top of Taiga UI.** We are building our own library from scratch, using Taiga as a reference for code architecture patterns and Tremor as a reference for styling patterns.

---

## 🔑 Key Principles

### 1. Architecture from Taiga UI

Study and adopt these patterns from Taiga:

- **CDK utilities**: Focus management, DOM helpers, observables, math utils
- **Signal-based inputs**: `input()`, `signal()`, `computed()`
- **Content queries**: `contentChildren()`, `viewChildren()`
- **Host directives**: For component composition
- **OnPush**: Always use OnPush change detection
- **Standalone**: All components standalone
- **Component structure**: How to organize complex components

**DO NOT**:

- Import or use Taiga UI components
- Do not use Taiga's styling system
- Copy Taiga code directly (study patterns, implement our own)

### 2. Styling from Tremor

Study and adopt these patterns from Tremor:

- **Tailwind CSS**: 100% utility classes, NO SCSS (except global tokens)
- **Dark mode**: `dark:` variant on all colors
- **Responsive**: `sm:`, `md:`, `lg:`, `xl:` breakpoints
- **Class merging**: `cx()` utility for dynamic classes
- **Animations**: Tailwind animation utilities
- **Color palette**: Tremor's color system approach
- **Spacing**: Consistent spacing patterns

**DO NOT**:

- Use React patterns (convert to Angular)
- Use Radix UI primitives (build our own)

### 3. Build Everything From Scratch

- **NO Taiga UI components** in production bundles
- **NO external component dependencies** (except Angular core, CDK for utilities)
- **Every component** is built by us
- **Taiga UI** as dev dependency only (for reference)

---

## 📦 Package Architecture

```
@nxp/
├── cdk/                    # Low-level utilities (inspired by @taiga-family/cdk)
│   ├── utils/
│   │   ├── focus/         # Focus management utilities
│   │   ├── dom/           # DOM manipulation helpers
│   │   ├── math/          # Math utilities (clamp, round, etc.)
│   │   ├── observables/   # RxJS utilities
│   │   └── polymorpheus/  # Re-export @taiga-ui/polymorpheus for flexible content
│   └── directives/        # Low-level directives
│
├── core/                   # Foundation (inspired by @taiga-family/core)
│   ├── services/
│   │   ├── theme.service.ts      # Dark/light mode (Tailwind class-based)
│   │   ├── format.service.ts     # Currency, number, date formatting
│   │   └── breakpoint.service.ts # Responsive breakpoint detection
│   ├── pipes/             # Reusable pipes
│   └── tokens/            # Design tokens (Tailwind config)
│
├── components/             # Base UI components (Taiga arch + Tremor style)
│   ├── accordion/         # FIRST COMPONENT
│   ├── button/
│   ├── card/
│   ├── input/
│   ├── select/
│   ├── checkbox/
│   ├── dialog/
│   ├── dropdown/
│   └── ...                # 30+ components total
│
├── blocks/                 # Composed blocks
│   ├── charts/            # Built ON TOP of @nxp/components
│   ├── kpi-cards/
│   ├── tables/
│   ├── forms/
│   └── ...
│
├── fintech/                # Domain-specific blocks
│   ├── portfolio/
│   ├── transactions/
│   └── ...
│
└── cli/                    # Code generator
    ├── generate component
    ├── generate block
    └── ...
```

---

## 🏗️ Implementation Workflow

### Phase 1: Foundation Setup

**Agent**: Architecture Agent

1. Initialize Nx workspace
2. Install and configure Tailwind CSS
3. Create package structure:
   - `@nxp/cdk`
   - `@nxp/core`
   - `@nxp/components`
   - `@nxp/blocks`
   - `@nxp/fintech`
   - `@nxp/cli`
4. Set up CI/CD, linting, testing
5. Install Taiga UI as **dev dependency only**

**Deliverable**: Empty packages, ready for components

---

### Phase 2: CDK Utilities

**Agent**: CDK Agent

Study `@taiga-family/cdk` and implement:

1. **Focus utilities**: `isFocusable()`, `getFocused()`, `moveFocus()`
2. **DOM utilities**: `getElementOffset()`, `isElementVisible()`
3. **Math utilities**: `clamp()`, `round()`, `inRange()`
4. **Observable utilities**: Custom operators for common patterns
5. **Directives**: Low-level directives for common behaviors

**Reference**: `taiga-family/cdk/utils/`

**Deliverable**: `@nxp/cdk` ready for use

---

### Phase 3: Core Services

**Agent**: Core Agent

Study `@taiga-family/core` and implement:

1. **ThemeService**: Tailwind dark mode management
2. **FormatService**: Currency, number, date formatting
3. **BreakpointService**: Responsive breakpoint detection
4. **Tailwind tokens**: Design token configuration
5. **Base pipes**: Common transformation pipes

**Reference**: `taiga-family/core/services/`

**Deliverable**: `@nxp/core` ready for use

---

### Phase 4: First Component - Accordion

**Agent**: Component Generator Agent

**Architecture reference**: `taiga-family/kit/components/accordion/`
**Styling reference**: `tremor-main/src/components/Accordion/`

Study both, implement our own:

1. `NgxproAccordionComponent` (container)
2. `NgxproAccordionItemComponent` (item)
3. Unit tests (≥80% coverage)
4. Storybook stories
5. README with usage examples
6. Accessibility validation

**Implementation guide**: `.claude/ACCORDION_IMPLEMENTATION.md`

**Deliverable**: `@nxp/components/accordion` complete

---

### Phase 5: More Components

**Agent**: Component Generator Agent

Following the same pattern as Accordion, implement:

**Priority 1** (Core components):

- Button
- Card
- Input
- Select
- Checkbox
- Label

**Priority 2** (Interactive):

- Dialog
- Dropdown
- Tabs
- Tooltip
- Popover

**Priority 3** (Advanced):

- DatePicker
- Slider
- Calendar
- Drawer
- Toast

Each follows: Taiga architecture + Tremor styling

**Deliverable**: 30+ components in `@nxp/components`

---

### Phase 6: Composed Blocks

**Agent**: Block Generator Agent

Build blocks ON TOP of `@nxp/components`:

1. **Charts**: Line, Bar, Area, Donut, etc.
2. **KPI Cards**: Metric cards, stat cards
3. **Tables**: Data tables, transaction tables
4. **Forms**: Form layouts, multi-step forms
5. **Navigation**: Sidebar, breadcrumbs
6. **Feedback**: Alerts, toasts, progress
7. **Layouts**: Page shells, grids

**Deliverable**: 300+ blocks in `@nxp/blocks`

---

### Phase 7: Fintech Domain

**Agent**: Fintech Agent

Build domain-specific blocks:

1. Portfolio components
2. Transaction tables
3. Financial charts
4. Banking dashboards
5. Trading interfaces

**Deliverable**: `@nxp/fintech` complete

---

### Phase 8: Polish & Release

**Agent**: Master Agent + Documentation Agent

1. Showcase website (Tremor-style gallery)
2. CLI generator
3. Complete documentation
4. Release v1.0.0 to NPM

**Deliverable**: Production-ready library

---

## 🎓 How to Use References

### Studying Taiga UI Components

When implementing a component, study the Taiga version:

1. **Locate the component**: `taiga-family/kit/components/[component-name]/`
2. **Study the architecture**:
   - How are signals used?
   - How are children accessed?
   - What are the key methods?
   - How is state managed?
3. **Note the patterns** (DON'T copy code directly)
4. **Implement our own version** using those patterns

### Studying Tremor Components

When styling a component, study the Tremor version:

1. **Locate the component**: `tremor-main/src/components/[ComponentName]/`
2. **Study the styling**:
   - What Tailwind classes are used?
   - How is dark mode handled?
   - What are the responsive breakpoints?
   - How are animations implemented?
3. **Copy the Tailwind patterns** (this is expected)
4. **Adapt to Angular templates**

---

## ✅ Quality Gates

Every component must pass:

### Architecture

- [ ] Standalone component
- [ ] OnPush change detection
- [ ] Signal-based inputs (`input()` not `@Input()`)
- [ ] Proper use of `contentChildren()` / `viewChildren()` where needed
- [ ] Host directives for composition (if applicable)

### Styling

- [ ] 100% Tailwind CSS (NO SCSS except global tokens)
- [ ] Dark mode support (all colors have `dark:` variant)
- [ ] Responsive (proper use of `sm:`, `md:`, `lg:` breakpoints)
- [ ] Consistent spacing (Tailwind spacing scale)

### Testing

- [ ] ≥80% code coverage
- [ ] 0 critical accessibility violations (axe-core)
- [ ] Unit tests for all public methods
- [ ] Tests for edge cases

### Documentation

- [ ] Storybook story with all variants
- [ ] README with usage examples
- [ ] Props/Events documented
- [ ] Examples for common use cases

### Dependencies

- [ ] NO Taiga UI components in imports
- [ ] NO external component libraries
- [ ] Only Angular core and @nxp packages

---

## 🚀 Getting Started

### For Architecture Agent

Read: `.claude/rules/architecture-agent.md`

### For Component Generator Agent

Read:

1. `.claude/rules/block-generator-agent.md`
2. `.claude/ACCORDION_IMPLEMENTATION.md`

### For All Agents

- Main reference: `.claude/CLAUDE.md`
- Agent roles: `AGENTS.md`
- Project context: `.cursor/rules/nxp-project-context.mdc`

---

## 📌 Key Differences from Original Plan

### ❌ OLD Approach

- Build blocks ON TOP of Taiga UI components
- Use Taiga's styling system
- Import and use `TuiButton`, `TuiCard`, etc.

### ✅ NEW Approach

- Build EVERYTHING from scratch
- Use Taiga for **architecture patterns only**
- Use Tremor for **styling patterns only**
- NO Taiga UI components in production code
- 100% Tailwind CSS for styling

---

## 🎯 Success Criteria

1. ✅ Zero Taiga UI components in production bundles
2. ✅ 100% Tailwind CSS (except global design tokens)
3. ✅ 30+ base components (Taiga architecture + Tremor styling)
4. ✅ 300+ composed blocks
5. ✅ ≥80% test coverage across all packages
6. ✅ 0 critical accessibility violations
7. ✅ Published to NPM as independent library
8. ✅ Complete documentation and showcase site

**We are building a NEW UI library, not extending an existing one.**
