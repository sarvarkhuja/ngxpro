# ngxpro Agent Initialization Guide

Step-by-step guide to initialize and use the ngxpro AI agent system with Claude Code.

---

## Prerequisites

- **Claude Code CLI** installed and authenticated
- **Node.js 22+** and **npm**
- The ngxpro repository cloned locally
- Working directory: `/Users/aki/Documents/GitHub/ngxpro/ngxpro/`

---

## Agent System Overview

ngxpro uses **9 specialized Claude Code sub-agents** defined in `.claude/agents/`. Each agent is a markdown file with YAML frontmatter that tells Claude Code when and how to use it.

```
.claude/agents/
├── master-agent.md          # Orchestrator (Opus model)
├── architecture-agent.md    # Nx, Tailwind, CI/CD, builds
├── cdk-agent.md             # Low-level utilities
├── core-agent.md            # Foundation services
├── component-generator.md   # Base UI components
├── block-generator.md       # Composed blocks
├── fintech-agent.md         # Fintech domain
├── testing-agent.md         # Tests & coverage
└── documentation-agent.md   # Docs & stories
```

### How Sub-Agents Work

1. Agent definitions are loaded when a Claude Code session starts
2. Claude automatically delegates to the right agent based on the `description` field
3. Each agent runs in an isolated context with its own tools and system prompt
4. Agents can have persistent memory (`memory: project`) stored in `.claude/agent-memory/`
5. The master-agent can spawn other agents via the `Task` tool

---

## Step 1: Verify Agent Files Exist

```bash
ls -la .claude/agents/
```

You should see 9 `.md` files. If any are missing, create them from the templates in this guide.

---

## Step 2: Start a Claude Code Session

```bash
# Navigate to the ngxpro workspace
cd /Users/aki/Documents/GitHub/ngxpro

# Start Claude Code (agents auto-load from .claude/agents/)
claude
```

Claude Code automatically discovers and loads all agents from `.claude/agents/` at session start.

### Verify Agents Are Loaded

In a Claude Code session, type:
```
/agents
```

This shows all available agents. You should see:
- master-agent
- architecture-agent
- cdk-agent
- core-agent
- component-generator
- block-generator
- fintech-agent
- testing-agent
- documentation-agent

---

## Step 3: Using Agents

### Automatic Delegation

Claude automatically delegates to the right agent based on your request. Examples:

```
# → Routes to component-generator
"Create a Select component for @ngxpro/components"

# → Routes to testing-agent
"Write unit tests for the Accordion component"

# → Routes to architecture-agent
"Add a new secondary entry point for @ngxpro/components/dialog"

# → Routes to block-generator
"Create a KPI card block with metric, trend, and sparkline"

# → Routes to master-agent
"What's the current project status? Plan the next sprint."
```

### Explicit Delegation

You can explicitly request a specific agent:

```
"Use the component-generator agent to create a Tabs component"
"Have the testing-agent validate all CDK utilities"
"Ask the documentation-agent to write README for the Button component"
```

### Running Agents in Background

For long-running tasks, run agents in the background:

```
"Run the testing-agent in the background to generate coverage reports for all packages"
```

---

## Step 4: Agent Workflow by Phase

### Phase 1: Foundation (Already Complete)

The Architecture Agent has already set up:
- [x] Nx workspace with Angular 21.1
- [x] Tailwind CSS v4.1.18 configured
- [x] `@ngxpro/cdk` with utilities, directives, tokens, types
- [x] `@ngxpro/core` with ThemeService, BreakpointService, FormatService, pipes
- [x] `@ngxpro/components` with accordion, button, card, input
- [x] `@ngxpro/blocks` with charts, kpi-cards, tables entry points
- [x] `@ngxpro/fintech` placeholder
- [x] CI/CD workflows

### Phase 2: Core Components

Use the **component-generator** agent to build remaining base components:

```
"Create these components one by one:
1. Select component (dropdown select with options)
2. Checkbox component
3. Radio component
4. Toggle/Switch component
5. Dialog/Modal component
6. Tabs component
7. Tooltip component
8. Badge component
9. Dropdown menu component
10. Progress bar component"
```

Each invocation:
1. Studies Taiga architecture pattern for the component
2. Studies Tremor Tailwind styling
3. Creates the component with signals + Tailwind
4. Adds secondary entry point
5. Updates tsconfig.base.json

### Phase 3: Composed Blocks

Use the **block-generator** agent:

```
"Create 5 KPI card variants for @ngxpro/blocks/kpi-cards:
- Simple metric card (title + value)
- Metric with trend indicator (up/down arrow + percentage)
- Metric with sparkline chart
- Comparison card (current vs previous period)
- Category metric card (with colored category bar)"
```

### Phase 4: Fintech Domain

Use the **fintech-agent**:

```
"Create the portfolio holdings table block with:
- Columns: ticker, name, shares, avg cost, current price, value, day change
- Sortable columns
- Color-coded gain/loss
- Responsive (horizontal scroll on mobile)"
```

### Phase 5: Testing & Documentation

Run in parallel:

```
"Use the testing-agent to write tests for all components in @ngxpro/components"
"Use the documentation-agent to create README files for all existing components"
```

---

## Step 5: Agent Memory

Agents with `memory: project` store persistent knowledge in `.claude/agent-memory/`.

### How Memory Works

- Each agent's memory is stored in `.claude/agent-memory/<agent-name>/MEMORY.md`
- First 200 lines are injected into the agent's system prompt on each invocation
- Agents automatically update their memory with learnings and decisions

### View Agent Memory

```bash
# See what agents have learned
cat .claude/agent-memory/component-generator/MEMORY.md
cat .claude/agent-memory/master-agent/MEMORY.md
```

### Reset Agent Memory

```bash
# Clear a specific agent's memory
rm .claude/agent-memory/component-generator/MEMORY.md

# Clear all agent memory
rm -rf .claude/agent-memory/
```

---

## Step 6: Quality Gates

Every agent enforces these quality gates before considering work complete:

### Per Component/Block
- [ ] Standalone component with OnPush
- [ ] Signal inputs (`input()`, NOT `@Input()`)
- [ ] 100% Tailwind CSS (no custom SCSS)
- [ ] Dark mode (`dark:` variants)
- [ ] Responsive (sm/md/lg/xl)
- [ ] Accessible (ARIA, keyboard)
- [ ] Exported via secondary entry point
- [ ] `npx nx build [package]` succeeds

### Per Package
- [ ] ≥80% test coverage
- [ ] 0 lint errors
- [ ] Bundle size <200KB
- [ ] All public APIs documented

### Verify All Builds

```bash
cd /Users/aki/Documents/GitHub/ngxpro/ngxpro
npx nx run-many -t build --parallel=3
npx nx run-many -t lint --parallel=3
npx nx run-many -t test --parallel=3
```

---

## Step 7: Creating New Agents

If you need a new specialized agent, create a markdown file in `.claude/agents/`:

```markdown
---
name: my-new-agent
description: When Claude should delegate to this agent
tools: Read, Grep, Glob, Bash, Edit, Write
model: sonnet
memory: project
---

# Agent System Prompt

Your instructions here...
```

### Key Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Lowercase with hyphens (e.g., `my-agent`) |
| `description` | Yes | When to delegate (Claude reads this to decide routing) |
| `tools` | No | Comma-separated tool list (inherits all if omitted) |
| `model` | No | `haiku` (fast), `sonnet` (balanced), `opus` (powerful) |
| `memory` | No | `project` (shared), `user` (personal), `local` (temp) |
| `maxTurns` | No | Max agent turns before stopping |
| `permissionMode` | No | `default`, `acceptEdits`, `plan`, etc. |

### Tool Options

```yaml
# Full capability
tools: Read, Grep, Glob, Bash, Edit, Write

# Read-only (research/exploration)
tools: Read, Grep, Glob

# Can spawn other agents
tools: Read, Grep, Glob, Bash, Edit, Write, Task

# Restrict specific tools
disallowedTools: Write, Edit
```

---

## Step 8: Advanced Patterns

### Parallel Agent Execution

Run multiple agents simultaneously for independent tasks:

```
"In parallel:
1. Use component-generator to create the Select component
2. Use testing-agent to write tests for Button and Card
3. Use documentation-agent to create README for Accordion"
```

### Agent Chaining

Sequential workflow where one agent's output feeds another:

```
"First, use component-generator to create a Dialog component.
Then, use testing-agent to write tests for it.
Finally, use documentation-agent to document it."
```

### Master Orchestration

Let the master-agent coordinate a full sprint:

```
"Use the master-agent to plan and execute Phase 2:
Create all remaining core components with tests and docs."
```

---

## Troubleshooting

### Agents Not Showing Up

```bash
# Verify files exist and have correct YAML frontmatter
ls .claude/agents/
head -10 .claude/agents/component-generator.md

# Restart Claude Code session (agents load at startup)
# Exit and re-enter the session
```

### Agent Using Wrong Model

Check the `model` field in the agent's frontmatter. Options:
- `haiku` — Fastest, cheapest
- `sonnet` — Balanced (default for most agents)
- `opus` — Most capable (used for master-agent)
- `inherit` — Same model as parent conversation

### Build Failures After Agent Work

```bash
# Reset Nx cache
npx nx reset

# Rebuild all
npx nx run-many -t build --parallel=3

# Check for missing exports (common issue)
# ng-packagr requires at least one export per entry point
```

### npm Install Issues

```bash
# Always use one of these flags
npm install --legacy-peer-deps
# OR
npm install --cache /tmp/npm-cache
```

---

## Quick Reference: Agent Selection

| Task | Agent | Example Prompt |
|------|-------|---------------|
| Add new library/package | architecture-agent | "Add @ngxpro/layout package" |
| Create CDK utility | cdk-agent | "Add a trapFocus directive" |
| Create core service | core-agent | "Add a NotificationService" |
| Create UI component | component-generator | "Create a Tabs component" |
| Create composed block | block-generator | "Create chart blocks" |
| Create fintech feature | fintech-agent | "Build a portfolio tracker" |
| Write tests | testing-agent | "Test the Select component" |
| Write docs/stories | documentation-agent | "Document the Card component" |
| Plan/review/release | master-agent | "Plan the next sprint" |

---

## File Structure Summary

```
.claude/
├── CLAUDE.md                    # Main project instructions
├── AGENT_INIT_GUIDE.md          # This guide
├── agents/                      # Sub-agent definitions (loaded by Claude Code)
│   ├── master-agent.md          # Orchestrator (Opus)
│   ├── architecture-agent.md    # Infrastructure (Sonnet)
│   ├── cdk-agent.md             # CDK utilities (Sonnet)
│   ├── core-agent.md            # Core services (Sonnet)
│   ├── component-generator.md   # UI components (Sonnet)
│   ├── block-generator.md       # Composed blocks (Sonnet)
│   ├── fintech-agent.md         # Fintech domain (Sonnet)
│   ├── testing-agent.md         # Testing & coverage (Sonnet)
│   └── documentation-agent.md   # Docs & stories (Sonnet)
├── rules/                       # Detailed rule files (referenced by agents)
│   ├── architecture-agent.md
│   ├── block-generator-agent.md
│   ├── core-agent.md
│   ├── code-style.md
│   ├── documentation-agent.md
│   └── master-agent.md
└── agent-memory/                # Persistent agent memory (auto-created)
    ├── master-agent/MEMORY.md
    ├── component-generator/MEMORY.md
    └── ...
```
