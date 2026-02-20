# ngxpro - Claude Agent Project

**Production-ready Angular UI library built FROM SCRATCH with Taiga architecture + Tremor Tailwind styling**

**CRITICAL**: NOT building on Taiga UI. Taiga = architecture patterns only. Tremor = styling patterns. 100% Tailwind CSS.

---

## 🎯 Project Mission

Build a **from-scratch Angular UI component library** inspired by:
- **Taiga UI architecture** (@taiga-family/cdk, @taiga-family/core, @taiga-family/kit patterns)
- **Tremor styling** (Tailwind CSS, dark mode, responsive)
- **Tremor blocks model** (copy-paste ready, categorized by use case)

Features:
- **300+ components and blocks**
- **Domain-specific** collections (Fintech, E-commerce, SaaS)
- **Light/Dark mode** with Tailwind dark mode
- **Fully responsive** and accessible
- **Agent-built** with zero manual coding

---

## 📦 Architecture

```
@ngxpro/
├── cdk                     # Low-level utilities (focus, DOM, observables)
│                           # Pattern: @taiga-family/cdk
├── core                    # Foundation services (theme, format, breakpoint)
│                           # Pattern: @taiga-family/core
├── components              # Base UI components (Tailwind styled)
│   ├── accordion/         # Pattern: Taiga arch + Tremor style
│   ├── button/
│   ├── card/
│   ├── input/
│   └── ...                # 30+ base components
├── blocks                  # Composed blocks
│   ├── charts/            # Area, Line, Bar, Donut, Candlestick, Spark
│   ├── kpi-cards/         # Metric cards, stat cards, comparison cards
│   ├── tables/            # Data tables, transaction tables, portfolio tables
│   ├── forms/             # Form layouts, inputs, selectors
│   ├── navigation/        # Sidebar, breadcrumbs, tabs
│   ├── feedback/          # Toasts, alerts, progress
│   └── layouts/           # Page shells, grids, cards, empty states
├── fintech                # Fintech domain blocks & templates
├── ecommerce              # E-commerce blocks (future)
└── cli                    # Component & block generator
```

**Patterns**: Taiga UI architecture (NOT styling) + Tremor Tailwind styling

---

## 🤖 Agent System

When working on ngxpro, **adopt the appropriate agent role**:

| Role | Responsibility | Rule File |
|------|---------------|-----------|
| **Architecture Agent** | Nx workspace, Tailwind, CI/CD, build | `rules/architecture-agent.md` |
| **CDK Agent** | Low-level utilities (Taiga CDK patterns) | `rules/core-agent.md` |
| **Core Agent** | Foundation services, theme, tokens | `rules/core-agent.md` |
| **Component Generator** | UI components (Taiga arch + Tremor style) | `rules/block-generator-agent.md` |
| **Block Generator** | Composed blocks (charts, tables, forms) | `rules/block-generator-agent.md` |
| **Fintech Agent** | Fintech-specific blocks & templates | `rules/fintech-agent.md` |
| **Documentation Agent** | README, Storybook, showcase site | `rules/documentation-agent.md` |
| **Testing Agent** | Unit tests, E2E, a11y validation | `rules/testing-agent.md` |
| **Master Agent** | Orchestration, quality gates, releases | `rules/master-agent.md` |

**Rule files**: See `.claude/rules/*.md` for detailed agent instructions.

---

## 📚 Reference Documentation

| File | Purpose |
|------|---------|
| `NGXPRO_AGENTS.md` | Complete agent structure, workflows, quality metrics |
| `AGENT_IMPLEMENTATION.md` | Per-agent prompts, automation, quality gates |
| `BLOCK_CATALOG.md` | All 300+ blocks organized by category (Tremor-style) |
| `DEVELOPER_GUIDE.md` | Installation, usage, Taiga UI integration |
| `POLYMORPHEUS_GUIDE.md` | Polymorphic templates for flexible component APIs |
| `CURSOR_AND_AGENTS.md` | Cursor IDE integration guide |

---

## 🏗️ Block Standards (Tremor-Inspired)

### Every block must have:
1. **Component** (`.ts`, `.html`, `.scss`) - Standalone, OnPush
2. **Variants** - Multiple use cases per block type
3. **Props interface** - Clear, documented inputs/outputs
4. **Storybook story** - Interactive demos with controls
5. **README** - Usage examples, props table, customization
6. **Tests** - ≥80% coverage, a11y validated
7. **Config** - Block metadata (category, tags, preview)

### Block categories (Tremor model):
- **Charts** (12+ types): Area, Line, Bar, Donut, Candlestick, Spark, Composed
- **KPI Cards** (29+ variants): Metric cards, stat cards, trend indicators
- **Tables** (15+ types): Data tables, transaction tables, portfolio tables
- **Forms** (10+ layouts): Standard forms, multi-step, search, filters
- **Navigation**: Sidebar, breadcrumbs, tabs, pagination
- **Feedback**: Banners, toasts, alerts, progress indicators
- **Layouts**: Page shells, grids, cards, empty states, dialogs

---

## 🎨 Design System (Tailwind + Taiga Patterns)

### Theme System (Tailwind Dark Mode)
```typescript
// ThemeService using Tailwind's class-based dark mode

```

### Tailwind Configuration
```javascript
// tailwind.config.js (Tremor-inspired)
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        tremor: {
          brand: { /* ... */ },
        },
      },
    },
  },
};
```

### Component Patterns (Taiga Architecture)
- **Standalone components** (Angular 17+)
- **Signals** (`input()`, `signal()`, `computed()`) — Taiga pattern
- **contentChildren** for projection — Taiga pattern
- **hostDirectives** for composition — Taiga pattern
- **OnPush change detection** — Always
- **Tailwind classes** — Tremor styling approach
- **Secondary entry points** (`@ngxpro/components/accordion`)
- **RxJS observables** for async data

---

## 🚀 Getting Started (for Agents)

### Phase 1: Foundation (Week 1)
**Agent**: Architecture + CDK + Core
- [ ] Initialize Nx workspace with Tailwind
- [ ] Create @ngxpro/cdk (Taiga CDK patterns)
- [ ] Create @ngxpro/core (services, tokens)
- [ ] CI/CD pipeline

### Phase 2: First Component - Accordion (Week 1)
**Agent**: Component Generator
- [ ] Study Taiga accordion architecture
- [ ] Study Tremor accordion styling
- [ ] Implement ngxpro-accordion (combining both)
- [ ] Test coverage ≥80%, docs, Storybook

### Phase 3: Core Components (Week 2-3)
**Agent**: Component Generator + Testing + Documentation
- [ ] Button, Card, Input, Select, Checkbox
- [ ] Dialog, Dropdown, Tabs, Tooltip
- [ ] 30+ base components (Taiga arch + Tremor style)
- [ ] Test coverage ≥80%, docs for all

### Phase 4: Composed Blocks (Week 3-4)
**Agent**: Block Generator + Testing + Documentation
- [ ] 50 chart blocks, 29 KPI cards
- [ ] 15 table blocks, 10 form layouts
- [ ] Navigation, feedback, layout blocks

### Phase 5: Fintech Domain (Week 5)
**Agent**: Fintech + Testing + Documentation
- [ ] 20 fintech-specific blocks
- [ ] 8 fintech templates
- [ ] Transaction/Portfolio data models

### Phase 6: Polish & Release (Week 6)
**Agent**: Master + Documentation
- [ ] Showcase website
- [ ] CLI generator
- [ ] Release v1.0.0 to NPM

---

## 📋 Quality Gates

### Per Component/Block
- [ ] Standalone component with OnPush
- [ ] Signals for inputs (`input()` not `@Input()`)
- [ ] Tailwind classes (NO SCSS except global tokens)
- [ ] Dark mode support (`dark:` variants)
- [ ] ≥80% test coverage
- [ ] 0 accessibility violations (axe-core)
- [ ] Storybook story with all variants
- [ ] README with usage examples
- [ ] Props/Events documented
- [ ] Responsive (sm/md/lg breakpoints)
- [ ] Bundle size <50KB (gzipped)
- [ ] NO Taiga UI components as dependencies

### Per Release
- [ ] All blocks tested
- [ ] Showcase site deployed
- [ ] NPM packages published
- [ ] CHANGELOG updated
- [ ] Migration guide (if breaking changes)

---

## 🔗 References

### Architecture Patterns (Taiga UI)
- **Taiga GitHub**: https://github.com/taiga-family/taiga-ui
- **Taiga CDK**: Study `@taiga-family/cdk` for utilities
- **Taiga Core**: Study `@taiga-family/core` for services
- **Taiga Kit**: Study `@taiga-family/kit/components` for component patterns
- **DO NOT** use Taiga styling, only study architecture

### Styling Patterns (Tremor)
- **Tremor Blocks**: https://blocks.tremor.so/
- **Tremor GitHub**: Study `tremor-main/src/components` for Tailwind patterns
- **Tremor Docs**: https://tremor.so/docs
- **DO** replicate Tailwind class patterns, dark mode, responsive

---

## 📖 How to Use This System

1. **Pick your role** from the Agent System table above
2. **Read the rule file** in `.claude/rules/[your-role].md`
3. **Reference** the appropriate docs (BLOCK_CATALOG, AGENT_IMPLEMENTATION, etc.)
4. **Follow** the block standards and quality gates
5. **Update** TODOs as you complete tasks
6. **Report** completion to Master Agent (quality review)

---

**Start here**: 
1. Read `.claude/rules/architecture-agent.md` to initialize Nx + Tailwind + packages
2. Then `.claude/rules/block-generator-agent.md` to create first component (Accordion)
