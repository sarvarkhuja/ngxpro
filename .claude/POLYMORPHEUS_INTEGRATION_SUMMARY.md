# Polymorpheus Integration Summary

**Date**: 2026-02-15  
**Status**: ✅ Documentation Complete

---

## 📦 What is Polymorpheus?

**Polymorpheus** (`@taiga-ui/polymorpheus`) is a 1KB utility library from Taiga UI that enables **polymorphic templates** in Angular components. It allows components to accept content in multiple forms:

- **Primitives**: `string`, `number`
- **Functions**: `(context: T) => string | number`
- **Templates**: `TemplateRef<T>`
- **Components**: `Type<T>` with context injection

**Key benefit**: Eliminates interface bloat and makes components infinitely flexible without knowing the data model.

**Article**: https://medium.com/angular-in-depth/agnostic-components-in-angular-2427923b742d  
**Package**: https://www.npmjs.com/package/@taiga-ui/polymorpheus

---

## 📝 Documentation Updates

### 1. Core Agent Rules (`.claude/rules/core-agent.md`)

**Added**: Complete "Polymorpheus Integration" section including:

- Purpose and use cases
- Installation instructions
- Basic usage patterns
- Example: Dropdown with polymorphic content
- Best practices
- Reference to Taiga UI patterns

**Location**: After "Common tokens" section, before "Public API"

### 2. Quick Reference (`.claude/QUICK_REFERENCE.md`)

**Added**: "Polymorpheus for Flexible Content" section with:

- When to use Polymorpheus
- Quick example with all content types
- Package structure update (CDK includes Polymorpheus)

**Location**: Before "Component Template" section

### 3. Architecture Agent (`.claude/rules/architecture-agent.md`)

**Added**: Installation step after CDK library creation:

- `npm install @taiga-ui/polymorpheus@^5.0.0`
- Purpose and reference links
- Usage examples (Dropdown, Select, Tooltips, Modals)

**Location**: After "Create CDK Library" section

### 4. Project Direction (`.claude/PROJECT_DIRECTION.md`)

**Updated**: Package architecture to include Polymorpheus:

- Added `polymorpheus/` to `@nxp/cdk/utils/` structure
- Listed as re-export utility

### 5. Main Documentation (`.claude/CLAUDE.md`)

**Updated**:

- Added `POLYMORPHEUS_GUIDE.md` to Reference Documentation table
- Added reference note to Polymorpheus in Component Patterns

### 6. Agent Roles (`AGENTS.md`)

**Updated**: Architecture references to include Polymorpheus as a pattern to study

### 7. New Comprehensive Guide (`.claude/POLYMORPHEUS_GUIDE.md`)

**Created**: 600+ line comprehensive guide including:

- Core concepts (The Problem vs The Solution)
- Installation and setup
- Basic usage with all 4 content types
- Real-world examples:
  - Dropdown with polymorphic items
  - Tooltip with polymorphic content
  - Modal with polymorphic content
- Taiga UI pattern references
- Best practices and anti-patterns
- When to use Polymorpheus (decision table)
- Quick start checklist

---

## 🎯 Where Polymorpheus Will Be Used

### Components (High Priority)

- **Dropdown / Select**: Custom item rendering
- **ComboBox**: Search result display
- **Tabs**: Tab labels and content
- **Tooltip**: Rich tooltip content
- **Menu**: Menu item templates
- **Modal/Dialog**: Dialog content injection
- **Alert/Toast**: Notification content

### Components (Medium Priority)

- **Table cells**: Custom cell templates
- **Empty states**: Placeholder content
- **Badge**: Badge content variations
- **List items**: Custom list rendering

### Blocks (Where Applicable)

- **Data tables**: Column cell renderers
- **Form fields**: Validation error messages
- **KPI cards**: Custom metric displays
- **Charts**: Custom legend items, tooltips

---

## 🚀 Implementation Steps for Agents

### Phase 1: Foundation (Architecture Agent)

1. ✅ Install `@taiga-ui/polymorpheus@^5.0.0`
2. ✅ Re-export from `@nxp/cdk/src/index.ts`

### Phase 2: Core Integration (Core Agent)

1. Create `libs/cdk/src/lib/utils/polymorpheus/index.ts`
2. Re-export all Polymorpheus exports
3. Add to public API

### Phase 3: Component Usage (Component Generator Agent)

When creating components that need flexible content:

1. Import `PolymorpheusContent` and `PolymorpheusOutlet`
2. Define context interface with `$implicit`
3. Add input accepting `PolymorpheusContent<Context>`
4. Use `*polymorpheusOutlet` in template
5. Document all 4 usage modes in README
6. Add Storybook stories for each mode

**Starting with**: Accordion, Dropdown, Select, ComboBox

---

## 📚 Key Patterns from Taiga UI

Agents should study these Taiga UI components for Polymorpheus usage:

| Component    | Path                                         | Pattern                   |
| ------------ | -------------------------------------------- | ------------------------- |
| Select       | `taiga-family/kit/components/select/`        | Item templates with state |
| Tabs         | `taiga-family/kit/components/tabs/`          | Tab content rendering     |
| Notification | `taiga-family/core/components/notification/` | Alert content             |
| Dialog       | `taiga-family/core/components/dialog/`       | Modal injection           |
| DataList     | `taiga-family/kit/components/data-list/`     | List items                |

---

## ✅ Quality Checklist

For any component using Polymorpheus:

- [ ] All 4 content types supported (string, function, template, component)
- [ ] Default function provided (usually stringify)
- [ ] Context includes all relevant state
- [ ] Context is type-safe with generics
- [ ] Documentation includes examples for all modes
- [ ] Storybook stories for each content type
- [ ] Accessibility verified for all content types
- [ ] Tests cover all usage modes

---

## 🔗 References

### Primary Documentation

- **Polymorpheus Guide**: `.claude/POLYMORPHEUS_GUIDE.md` (comprehensive)
- **Core Agent Rules**: `.claude/rules/core-agent.md` (integration section)
- **Quick Reference**: `.claude/QUICK_REFERENCE.md` (quick example)

### External Resources

- **Medium Article**: https://medium.com/angular-in-depth/agnostic-components-in-angular-2427923b742d
- **NPM Package**: https://www.npmjs.com/package/@taiga-ui/polymorpheus
- **GitHub**: https://github.com/taiga-family/ng-polymorpheus

### Study References

- **Taiga UI Source**: `/Users/aki/Documents/GitHub/nxp/taiga-family/`
  - `kit/components/select/`
  - `kit/components/tabs/`
  - `core/components/notification/`
  - `core/components/dialog/`

---

## 💡 Key Insight

**Before Polymorpheus**:

```typescript
// Interface grows forever
interface MenuItem {
	label: string;
	icon?: string;
	badge?: number;
	disabled?: boolean;
	// ... keeps growing
}
```

**With Polymorpheus**:

```typescript
// Data-agnostic + flexible rendering
interface MenuItem<T = any> {
  data: T;  // Accept anything
}

// Consumer decides rendering
<nxp-menu
  [items]="items"
  [itemContent]="customTemplate" />
```

This is the **Taiga UI way** — build agnostic, flexible components.

---

## 🎯 Success Criteria

✅ Polymorpheus documented in all relevant agent rules  
✅ Comprehensive guide created with examples  
✅ Installation instructions in architecture setup  
✅ Integration plan defined  
✅ Quality checklist established  
✅ Taiga UI pattern references identified

**Status**: Ready for implementation by Architecture Agent → Core Agent → Component Generator Agent

---

**Next Steps**:

1. Architecture Agent: Install package and set up re-exports
2. Core Agent: Integrate into `@nxp/cdk`
3. Component Generator: Use in Accordion (first component), then Dropdown, Select, etc.
