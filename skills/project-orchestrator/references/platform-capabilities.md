# Platform Capabilities Reference

Detailed routing rules for each supported platform. The orchestrator consults this file when deciding where to assign tasks.


## Claude Cowork

### What It Is
Desktop application that gives Claude access to a local folder. Claude can read, create, and edit files within that folder. Operates through a conversational interface with file system access.

### Strengths
- Multi-file content creation (can create 10-20 files in a session)
- Research synthesis across multiple sources
- Document drafting and revision
- Strategic planning and framework creation
- Brand voice development and style guides
- SOPs, playbooks, and process documentation
- Email sequences and campaign copy
- Content calendars and editorial planning

### Limitations
- No code execution (cannot run scripts, tests, or builds)
- No terminal access
- No Git operations
- No deployment capability
- No internet access (works only with local files and conversation context)
- No database access

### Ideal Task Profile
```
INPUT:  Context documents, briefs, reference materials
OUTPUT: Written content, structured documents, plans, frameworks
SCOPE:  5-20 files per session
FORMAT: Markdown, text files, structured documents
```

### Routing Signals
Route to Cowork when the task:
- Produces primarily text/content output
- Requires synthesizing multiple inputs into structured documents
- Benefits from iterative drafting with context from multiple files
- Involves creating a collection of related content pieces
- Needs brand voice consistency across multiple deliverables
- Requires strategic thinking expressed as written frameworks

### Task Naming Convention
`COWORK-{NNN}-{kebab-case-description}.md`


## Claude Code

### What It Is
Command-line tool for agentic coding. Full access to terminal, file system, Git, and code execution. Can spawn sub-agents for parallel work, create branches, push commits, and trigger deployments.

### Strengths
- Full-stack application development
- Complex multi-file code changes with dependency awareness
- Git operations (branch, commit, push, PR creation)
- Running and debugging tests
- Package management and dependency resolution
- Infrastructure as code
- Database migrations
- API development
- CLI tool creation
- Sub-agent orchestration (can spawn parallel workers)
- Script execution and automation
- Code review and refactoring at scale

### Limitations
- No GUI/visual interface (terminal only)
- Overkill for simple, single-file edits
- Requires project to be in a Git repository for best results
- No direct browser preview (use deployment previews instead)

### Ideal Task Profile
```
INPUT:  Requirements, specs, existing codebase
OUTPUT: Code, configs, deployments, Git commits
SCOPE:  Entire repositories, multi-file changes
FORMAT: Any code file, configs, scripts, infrastructure
```

### Routing Signals
Route to Claude Code when the task:
- Requires creating or modifying code across multiple files
- Involves Git operations (branching, committing, PRs)
- Needs terminal/CLI access for execution
- Requires running tests or build processes
- Involves deployment or infrastructure setup
- Benefits from sub-agent parallelism
- Requires dependency installation or package management
- Involves database operations or migrations

### Task Naming Convention
`CODE-{NNN}-{kebab-case-description}.md`


## Cursor

### What It Is
AI-powered code editor (VS Code fork) with inline code generation, multi-file editing, and codebase-aware completions. Best for iterative development within an existing project.

### Strengths
- Rapid UI component iteration with live preview
- Inline code generation and refactoring
- Codebase-aware suggestions (understands project context)
- Multi-file edits with visual diff review
- Fast prototyping with preview
- Working within established code patterns
- Component-level development
- CSS/styling iteration
- Debugging with visual context

### Limitations
- Less effective for greenfield architecture decisions
- No built-in deployment pipeline
- No automation/scheduling capability
- Less suited for pure terminal/CLI tasks
- Better for iteration than initial scaffolding

### Ideal Task Profile
```
INPUT:  Existing codebase, component specs, design references
OUTPUT: Code changes, new components, refactored modules
SCOPE:  Component-level to feature-level changes
FORMAT: Code files within existing project structure
```

### Routing Signals
Route to Cursor when the task:
- Involves iterating on existing code (not greenfield)
- Is component-level or feature-level (not architecture-level)
- Benefits from visual preview during development
- Requires rapid iteration cycles (build-preview-refine)
- Involves UI/frontend work with CSS/styling
- Is a focused code change within a larger project
- Benefits from codebase-aware autocomplete

### Task Naming Convention
`CURSOR-{NNN}-{kebab-case-description}.md`


## Warp.dev

### What It Is
AI-powered terminal application. Combines traditional terminal functionality with AI assistance for command generation, explanation, and debugging. Best for DevOps, server management, and CLI workflows.

### Strengths
- AI-assisted command generation and explanation
- Server management and SSH operations
- Environment setup and configuration
- Docker container management
- CI/CD pipeline debugging
- Log analysis and monitoring
- Performance profiling
- Network diagnostics
- System administration tasks
- Quick scripting and one-liners

### Limitations
- Not a code editor (poor for multi-file code changes)
- No visual preview
- No content creation capability
- Not suited for long-form development
- Best for discrete terminal operations, not sustained projects

### Ideal Task Profile
```
INPUT:  Server addresses, environment specs, CLI requirements
OUTPUT: Configured systems, executed commands, deployed services
SCOPE:  Discrete terminal operations and workflows
FORMAT: Shell commands, scripts, configuration files
```

### Routing Signals
Route to Warp when the task:
- Is primarily terminal/CLI work
- Involves server management or SSH
- Requires Docker operations
- Involves CI/CD pipeline setup or debugging
- Requires system-level diagnostics or monitoring
- Is a discrete DevOps operation (not sustained development)
- Involves environment variable management or secrets
- Requires network debugging or DNS configuration

### Task Naming Convention
`WARP-{NNN}-{kebab-case-description}.md`


## n8n

### What It Is
Visual workflow automation platform. Creates multi-step automations connecting APIs, databases, and services with a node-based interface. Supports webhooks, schedules, and event triggers.

### Strengths
- Multi-step API integrations (connect any service to any service)
- Scheduled/recurring workflows (cron-based automation)
- Webhook handlers and event-driven automation
- Data transformation pipelines
- Email/notification automation
- CRM integration workflows
- Lead routing and scoring
- Social media posting automation
- Database sync between systems
- Error handling and retry logic
- AI-augmented workflows (Claude API nodes)

### Limitations
- Not for code development
- Not for content creation
- Visual editor means task files describe what to build, not the workflow itself
- Requires n8n instance (cloud or self-hosted)
- Complex logic can become hard to debug in visual editor

### Ideal Task Profile
```
INPUT:  Integration specs, API credentials, trigger conditions
OUTPUT: Running automations, connected systems, data pipelines
SCOPE:  Individual workflows (each workflow = one task)
FORMAT: Workflow descriptions with node specifications
```

### Routing Signals
Route to n8n when the task:
- Requires connecting two or more external services
- Needs to run on a schedule or respond to webhooks
- Involves data transformation between systems
- Requires notification/alert automation
- Involves lead/contact routing or scoring
- Needs retry logic or error handling for API calls
- Automates a manual process that happens repeatedly
- Requires AI processing as part of a larger pipeline

### Task Naming Convention
`N8N-{NNN}-{kebab-case-description}.md`


## Claude.ai (Chat Interface)

### What It Is
Web/mobile/desktop chat interface. Best for one-off interactions, brainstorming, image generation prompts, and quick analysis. Output stays in conversation unless artifacts are created.

### Strengths
- Quick brainstorming and ideation
- Image generation prompt crafting
- One-off analysis of uploaded files
- Artifact creation (HTML, React, documents)
- Web search for research
- Rapid prototyping via artifacts

### Limitations
- No file system persistence (artifacts must be saved manually)
- No terminal access
- No deployment capability
- Conversation context is ephemeral
- Not suited for multi-session projects

### Routing Signals
Route to Claude.ai chat when the task:
- Is a one-off interaction (not part of a sustained project)
- Involves brainstorming or ideation without file output
- Requires image generation prompt development
- Needs web search for current information
- Benefits from artifact creation for quick prototyping
- Is a review or feedback task on a single deliverable

### Task Naming Convention
`CHAT-{NNN}-{kebab-case-description}.md`
(Rarely used — most tasks benefit from a persistent platform)


## Routing Decision Flowchart

```
START: New Task
  │
  ├─ Does it produce code as primary output?
  │   ├─ YES: Is it greenfield/architectural?
  │   │   ├─ YES → Claude Code
  │   │   └─ NO: Is it iterating on existing code?
  │   │       ├─ YES → Cursor
  │   │       └─ NO → Claude Code
  │   └─ NO: Does it produce content/documents?
  │       ├─ YES: Multiple related files?
  │       │   ├─ YES → Claude Cowork
  │       │   └─ NO → Claude.ai (or Cowork if part of larger project)
  │       └─ NO: Is it automation/integration?
  │           ├─ YES: Recurring/scheduled?
  │           │   ├─ YES → n8n
  │           │   └─ NO: One-time script?
  │           │       ├─ YES → Claude Code or Warp
  │           │       └─ NO → n8n
  │           └─ NO: Is it terminal/DevOps?
  │               ├─ YES → Warp.dev
  │               └─ NO → Claude.ai (catch-all)
```


---
*Platform Capabilities Reference v1.0 — February 2026*
*Update this file as platform capabilities evolve*
