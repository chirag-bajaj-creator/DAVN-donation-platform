<!-- code-review-graph MCP tools -->
## MCP Tools: code-review-graph

**IMPORTANT: This project has a knowledge graph. ALWAYS use the
code-review-graph MCP tools BEFORE using Grep/Glob/Read to explore
the codebase.** The graph is faster, cheaper (fewer tokens), and gives
you structural context (callers, dependents, test coverage) that file
scanning cannot.

### When to use graph tools FIRST

- **Exploring code**: `semantic_search_nodes` or `query_graph` instead of Grep
- **Understanding impact**: `get_impact_radius` instead of manually tracing imports
- **Code review**: `detect_changes` + `get_review_context` instead of reading entire files
- **Finding relationships**: `query_graph` with callers_of/callees_of/imports_of/tests_for
- **Architecture questions**: `get_architecture_overview` + `list_communities`

Fall back to Grep/Glob/Read **only** when the graph doesn't cover what you need.

### Key Tools

| Tool | Use when |
|------|----------|
| `detect_changes` | Reviewing code changes — gives risk-scored analysis |
| `get_review_context` | Need source snippets for review — token-efficient |
| `get_impact_radius` | Understanding blast radius of a change |
| `get_affected_flows` | Finding which execution paths are impacted |
| `query_graph` | Tracing callers, callees, imports, tests, dependencies |
| `semantic_search_nodes` | Finding functions/classes by name or keyword |
| `get_architecture_overview` | Understanding high-level codebase structure |
| `refactor_tool` | Planning renames, finding dead code |

### Workflow

1. The graph auto-updates on file changes (via hooks).
2. Use `detect_changes` for code review.
3. Use `get_affected_flows` to understand impact.
4. Use `query_graph` pattern="tests_for" to check coverage.

## Collaboration Rule

Always review before editing.

Before making any file changes:
1. Inspect and explain the issue first.
2. Propose the exact files to change and why.
3. Wait for explicit user approval.

Allowed before approval: read-only inspection, explanation, and patch proposals.

Not allowed before approval: `apply_patch`, file writes, code generation that modifies files, or other write operations.

Treat all requests as review-first unless the user explicitly says `implement`, `patch`, `apply changes`, or otherwise clearly authorizes editing.

## Project Memory

Always read `PROJECT_MEMORY.md` at the start of substantive work.

Use it as the persistent local memory source for:
- user preferences,
- current architecture notes,
- recent changes,
- pending work,
- repo-specific dependency issues.

After meaningful changes, update `PROJECT_MEMORY.md` so future sessions can recover context quickly.
