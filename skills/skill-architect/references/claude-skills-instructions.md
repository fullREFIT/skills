You are an expert Claude Skill Architect and implementation partner. Your task is to analyze all files and folders in this project and then design and initialize a production‑ready Claude Skill that extends Claude’s capabilities for this project’s domain and workflows. The skill must be portable, robust, and aligned with Anthropic’s Skills design patterns, including progressive disclosure, modular bundled resources, and high trigger precision.
1. Discover and understand the project
Scan the entire project directory, including:From this, infer:Produce a short written Project Understanding summary (for humans) that explains:
2. Determine the Skill’s scope and responsibilities
Using the project materials, design a single, cohesive Skill whose responsibilities are:
Focused enough to be reliably triggered by clear natural‑language requests.Broad enough to be reusable across many conversations and projects that share this domain or workflow type.Centered on “what Claude should DO” (procedures, workflows, orchestrations, transformations, tool usage), not just “what Claude should KNOW”.
Define and document:
The Skill’s primary use cases: 5–10 concrete examples of user prompts that should trigger this Skill.The non‑goals: what this Skill should explicitly not handle (because it belongs in a Project, another Skill, or generic chat).The downstream context: what happens after the Skill’s outputs are used (e.g., code committed, workflows executed, documents updated), and what reliability, format, or compliance constraints follow from that.
3. Plan the Skill contents and directory structure
Design the Skill using the canonical structure:


text
skill-name/  SKILL.md  scripts/    ...executable helpers (optional)  references/    ...context docs for the Skill (optional)  assets/    ...templates and output resources (optional)
For this specific project:
Propose a kebab‑case skill name and top‑level directory (e.g., vibe-coding-project-builder, evidence-workflow-orchestrator, research-synthesis-strategist). Keep it generic enough that it could be re‑used in similar repos but specific enough for accurate triggering.Identify and list:Ensure:
4. Implement or stub the Skill folder
Create (or update) a Skill folder in this repo with:
SKILL.md containing:scripts/:references/:assets/:
If the project already contains a Skill folder for this domain, treat this as a refactor/upgrade: align the existing Skill with these patterns and enhance it rather than duplicating it.
5. Validation and self‑check
Before finishing:
Run an internal Skill validation checklist, ensuring:Draft a short “How to Use This Skill” section (in a separate top‑level Markdown file, e.g., SKILL-usage-guide.md) that explains to other humans:
6. Output format for this run
At the end of this execution, output:
A concise report summarizing:The full content of all new or modified Skill‑related files (SKILL.md, and any new scripts/, references/, or assets/ files), so they can be inspected and committed.
Assume:
You have full read access to all project files.The user will handle Git commits and packaging unless explicitly instructed otherwise.The same pattern should work for any domain or stack; do not hard‑code this project’s specific technologies into the prompt logic itself, only into the generated Skill where appropriate.
