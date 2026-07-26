# SOP Generator — Quick Start

**Time to set up:** 5 minutes per SOP
**What you need:** A process recording transcript, written description, or meeting notes

---

## What This Skill Does

Turns process recordings or descriptions into structured, scannable SOPs. Includes step-by-step instructions, decision trees, error handling, time estimates, tools required, and success criteria. Output is ready to paste into your wiki or knowledge base.

---

## How to Use (5 Minutes)

1. **Record the process** — Have someone do the process while narrating each step (Loom, Zoom, voice memo)
2. **Transcribe** the recording (Otter.ai, Zoom transcription, or any service)
3. **Open Claude** (or ChatGPT)
4. **Paste** the sop-generation-prompt from `scripts/sop-generation-prompt.txt`
5. **Specify** the input type (transcript, written description, or meeting notes)
6. **Paste** your source material below the prompt
7. **Run it** — you get a complete, structured SOP
8. **Review** and refine, then save to your wiki

---

## Folder Contents

```
sop-generator.skill/
  SKILL.md                                    Full framework + 2 complete examples
  README.md                                   This file
  assets/
    sop-template.md                           Blank SOP template (use as starting point)
    decision-tree-format.md                   Decision tree syntax reference
    transcription-guide.md                    How to record and transcribe processes
    examples/
      example-1-customer-onboarding.md        Customer onboarding SOP
      example-1-source-transcript.txt         Source transcript for example 1
      example-2-financial-close.md            Monthly financial close SOP
      example-2-source-transcript.txt         Source meeting notes for example 2
  scripts/
    sop-generation-prompt.txt                 The reusable prompt (copy-paste into Claude)
```

---

## SOP Output Structure

Every generated SOP includes:
- Header (title, owner, version, time estimate, frequency)
- Overview (1-2 sentence purpose)
- Prerequisites (access, tools, dependencies)
- Roles (who does what)
- Step-by-step instructions (numbered, explicit, with expected results)
- Decision points (if/then trees covering all branches)
- Error handling (common mistakes and recovery)
- Tools required (with access levels)
- Time estimates (per step and total)
- Success criteria (verifiable checklist)
- Escalation guide (when to get help)

---

## Tips

- Record people doing the process, do not ask them to write it. Speaking captures the informal knowledge that writers skip.
- The best narrator is someone who does this process regularly, not a manager describing it.
- Have someone who does NOT do the process read the SOP and flag unclear steps. That is the real quality test.
- Review SOPs quarterly. Processes change and documentation goes stale fast.
