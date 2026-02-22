# nxp Agent Roles

Use this when doing **agent-style optimization or rewrite** of nxp. Adopt the role that matches the task; follow the rules in `.cursor/rules/` and the specs in `.claude/`.

**IMPORTANT**: We are building FROM SCRATCH, NOT on top of Taiga UI. Taiga UI is for **architecture patterns only**. Styling is **100% Tailwind CSS** (Tremor approach).

---

## Role selection

| Task / area                                      | Adopt role                    | Key references                                                                         |
| ------------------------------------------------ | ----------------------------- | -------------------------------------------------------------------------------------- |
| Workspace, Nx, CI/CD, lint, build, Tailwind      | **Architecture Agent**        | `.claude/rules/architecture-agent.md`                                                  |
| CDK utilities (focus, DOM, observables)          | **CDK Agent**                 | `taiga-family/cdk/` (patterns), `.cursor/rules/nxp-core-library.mdc`                   |
| Core services, theme, tokens, base components    | **Core Foundation Agent**     | `taiga-family/core/` (patterns), `.cursor/rules/nxp-core-library.mdc`                  |
| UI components (Accordion, Button, Card, Input)   | **Component Generator Agent** | `taiga-family/kit/components/` (architecture), `tremor-main/src/components/` (styling) |
| Composed blocks (charts, tables, forms, metrics) | **Block Generator Agent**     | `.cursor/rules/nxp-block-standards.mdc`, `.claude/BLOCK_CATALOG.md`                    |
| Fintech blocks or templates                      | **Fintech Domain Agent**      | `.cursor/rules/nxp-fintech.mdc`                                                        |
| README, TypeDoc, Storybook, showcase             | **Documentation Agent**       | `.cursor/rules/nxp-documentation.mdc`                                                  |
| Unit/E2E/a11y tests, coverage                    | **Testing Agent**             | `.cursor/rules/nxp-testing.mdc`                                                        |
| CLI commands, generators, schematics             | **CLI Generator Agent**       | `.claude/NXP_AGENTS.md`                                                                |
| Planning, consistency, quality                   | **Master Agent**              | `.claude/NXP_AGENTS.md`                                                                |

---

## Workflow (for multi-step work)

1. **Foundation**: Architecture → CDK → Core (Nx + Tailwind + @nxp/cdk + @nxp/core)
2. **First Component**: Component Generator → Accordion (Taiga architecture + Tremor styling)
3. **More Components**: Component Generator → Button, Card, Input, Select, etc.
4. **Blocks**: Block Generator → Charts, tables, forms, KPI cards, layouts
5. **Domain**: Fintech blocks and templates
6. **Tools**: CLI generators and docs
7. **Polish**: Showcase, demos, release checklist

---

## Quality gates

- Build: `nx build` succeeds; `nx lint` 0 errors
- Components: Standalone + OnPush + signals + Tailwind + spec + stories + README
- Tests: ≥80% coverage; 0 critical a11y violations
- Styling: 100% Tailwind CSS, NO Taiga styling
- Docs: README with usage and props/events; TypeDoc for public APIs

---

## Architecture references

Study these for patterns (NOT for styling):

- **Taiga CDK**: `taiga-family/cdk/` — Utils, focus, observables, DOM helpers
- **Taiga Core**: `taiga-family/core/` — Services, base components, abstractions
- **Taiga Kit**: `taiga-family/kit/components/` — Component architecture patterns
- **Polymorpheus**: `@taiga-ui/polymorpheus` — Polymorphic templates (see `.claude/POLYMORPHEUS_GUIDE.md`)

Study these for styling:

- **Tremor components**: `tremor-main/src/components/` — Tailwind CSS patterns, dark mode, responsive

---

Full agent specs: `.claude/NXP_AGENTS.md`, `.claude/AGENT_IMPLEMENTATION.md`, `.claude/BLOCK_CATALOG.md`, `.claude/DEVELOPER_GUIDE.md`.
