================================================================================
GAMMA EXECUTION PROMPT USAGE GUIDE
How to Get Maximum Value from Your Custom Instructions
================================================================================

## TABLE OF CONTENTS

1. Overview: What These Prompts Do
2. Choosing the Right Prompt Version
3. How to Fill Out the Template
4. Content Preparation Best Practices
5. What to Expect in Response
6. Iteration Strategy
7. Troubleshooting Common Issues
8. Advanced Usage Patterns
9. Quick Reference Checklist


================================================================================
1. OVERVIEW: WHAT THESE PROMPTS DO
================================================================================

These execution prompts trigger your Claude Project's custom instructions to:

STAGE 1: ANALYZE
→ Verify current Gamma capabilities via web search
→ Assess your content against Gamma's constraints (card limits, token limits)
→ Identify optimization requirements
→ Diagnose potential issues before they occur

STAGE 2: TRANSFORM
→ Restructure content using Gamma's structure-first methodology
→ Apply `---` delimiters for precise card control
→ Create SPLICE-formatted image prompts
→ Map optimal API parameters and UI settings
→ Condense or split content if needed

STAGE 3: DELIVER
→ Artifact 1: Paste-ready Gamma input (exactly formatted for Gamma)
→ Artifact 2: Comprehensive optimization guide (settings, strategy, checklist)
→ Chat summary: Critical recommendations and next steps


THE VALUE:
Instead of manually formatting content and guessing at Gamma settings, you get:
✓ Professional restructuring that respects Gamma's limits
✓ Precise parameter recommendations (no trial-and-error)
✓ Strategic image prompts (not generic "add images")
✓ Post-generation refinement plan (Gamma Agent commands)
✓ Tier-specific guidance (leverages your plan's features)
✓ Limitation awareness (prevents export disasters)


================================================================================
2. CHOOSING THE RIGHT PROMPT VERSION
================================================================================

You have three prompt versions. Here's when to use each:


┌─────────────────────────────────────────────────────────────────────────┐
│ FULL TEMPLATE (gamma_execution_prompt_template.md)                     │
├─────────────────────────────────────────────────────────────────────────┤
│ Use when:                                                               │
│ • High-stakes project (investor pitch, client proposal, conference)    │
│ • Complex content with many constraints                                │
│ • Multiple stakeholders with different requirements                    │
│ • Budget/timeline/brand requirements are strict                        │
│ • You've failed with simpler approaches before                         │
│                                                                         │
│ Effort: 15-30 minutes to fill out                                      │
│ Result: Highly tailored, strategic output with minimal iteration       │
└─────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│ WORKED EXAMPLE (gamma_execution_prompt_example.md)                     │
├─────────────────────────────────────────────────────────────────────────┤
│ Use as:                                                                 │
│ • Reference for how to fill out the template properly                  │
│ • Inspiration for the level of detail to provide                       │
│ • Model for communicating complex requirements                         │
│                                                                         │
│ DO NOT copy verbatim - it's a specific use case (investor pitch)       │
│ DO study it to understand what good specification looks like           │
└─────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│ QUICK-START (gamma_execution_prompt_quickstart.md)                     │
├─────────────────────────────────────────────────────────────────────────┤
│ Use when:                                                               │
│ • Straightforward content transformation                               │
│ • Time is critical                                                      │
│ • You're comfortable with AI making judgment calls                     │
│ • Internal/low-stakes use case                                         │
│                                                                         │
│ Effort: 2-5 minutes to fill out                                        │
│ Result: Good baseline, may need more iteration                         │
└─────────────────────────────────────────────────────────────────────────┘


GENERAL RULE OF THUMB:

Low Stakes + Simple Content → Quick-Start
High Stakes OR Complex Content → Full Template
Learning/Reference → Study Worked Example


================================================================================
3. HOW TO FILL OUT THE TEMPLATE
================================================================================

SECTION-BY-SECTION GUIDANCE:

┌─────────────────────────────────────────────────────────────────────────┐
│ PROJECT OVERVIEW                                                        │
├─────────────────────────────────────────────────────────────────────────┤
│ Purpose: Establish context                                             │
│                                                                         │
│ Project Name: Be specific, not generic                                 │
│ ✗ "Presentation"                                                        │
│ ✓ "Q3 Sales Enablement Training Deck"                                  │
│                                                                         │
│ Content Type: Describe format AND state                                │
│ ✗ "Document"                                                            │
│ ✓ "34-page Word doc with detailed analysis but no visual structure"    │
│                                                                         │
│ Current State: This helps AI understand transformation scope           │
│ ✓ "Rough bullet points needing polish"                                 │
│ ✓ "Dense technical report needing simplification"                      │
│ ✓ "Well-structured outline, just needs Gamma formatting"               │
└─────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│ GAMMA OUTPUT GOALS                                                      │
├─────────────────────────────────────────────────────────────────────────┤
│ This is THE MOST IMPORTANT section. Be very specific.                  │
│                                                                         │
│ Target Audience: Generic = generic output                              │
│ ✗ "Business people"                                                     │
│ ✓ "VP-level decision makers at healthcare companies, familiar with     │
│    HIPAA compliance, skeptical of new software"                        │
│                                                                         │
│ Intended Use Case: Affects structure and density                       │
│ ✓ "Standalone doc sent via email (they'll read alone)"                 │
│ ✓ "Presentation aid while I talk (minimal text)"                       │
│ ✓ "Reference doc after training (needs to be comprehensive)"           │
│                                                                         │
│ Desired Outcome: Be concrete about success                             │
│ ✗ "Make a good impression"                                              │
│ ✓ "Secure 30-minute follow-up meeting within 1 week"                   │
│ ✓ "Reduce support tickets by 40% by standardizing onboarding"          │
└─────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│ GAMMA PLAN TIER                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│ Critical for recommendations. Your tier determines:                    │
│ • Card limit per generation (Free: 10, Plus: 20, Pro: 60, Ultra: 75)  │
│ • Image model availability (Free: basic, Ultra: all premium models)    │
│ • Custom theme capability (Pro+)                                       │
│ • API access (Pro+)                                                    │
│                                                                         │
│ If unsure which plan you have: Check gamma.app/settings               │
│                                                                         │
│ "Willing to upgrade" matters:                                          │
│ If No: AI will work within current constraints                        │
│ If Yes: AI may recommend upgrade for specific features                │
└─────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│ CONTENT SPECIFICATIONS                                                  │
├─────────────────────────────────────────────────────────────────────────┤
│ Key Sections/Topics: Think "table of contents"                        │
│ • List logical sections/chapters/themes                                │
│ • Don't micro-specify every bullet point                               │
│ • Indicate hierarchy: "Must cover X, nice to have Y"                   │
│                                                                         │
│ Existing Structure:                                                     │
│ If YES → AI preserves your structure                                   │
│ If NO → AI creates structure from content                              │
│ If PARTIAL → AI refines what you have                                  │
└─────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│ VISUAL REQUIREMENTS                                                     │
├─────────────────────────────────────────────────────────────────────────┤
│ Image Needs: Be specific about WHERE images matter                     │
│ ✗ "Use AI images"                                                       │
│ ✓ "Title slide + problem slide need images, rest can be text-focused"  │
│                                                                         │
│ Image Style: Describe or reference examples                            │
│ ✗ "Professional"                                                        │
│ ✓ "Clean minimalist like Apple marketing, high contrast, modern"       │
│ ✓ "Reference: Stripe's website aesthetic"                              │
│                                                                         │
│ Must-Have Visuals: Specify non-negotiables                             │
│ ✓ "Market sizing must be funnel diagram, not text"                     │
│ ✓ "Competitive landscape must be 2x2 matrix"                           │
└─────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│ TONE & STYLE                                                            │
├─────────────────────────────────────────────────────────────────────────┤
│ This shapes Gamma's AI text generation heavily.                        │
│                                                                         │
│ Desired Tone: Use adjectives, not vague labels                         │
│ ✗ "Professional"                                                        │
│ ✓ "Confident but humble, data-driven, direct"                          │
│ ✓ "Friendly and accessible, slightly playful"                          │
│                                                                         │
│ Language Complexity: Match audience sophistication                     │
│ • Simple: Explain jargon, use analogies                                │
│ • Technical: Assume domain knowledge, use precise terms               │
│ • Balanced: Mix (explain first use, then use freely)                   │
└─────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│ CONSTRAINTS & REQUIREMENTS                                              │
├─────────────────────────────────────────────────────────────────────────┤
│ Must Include: Non-negotiable elements                                  │
│ • Specific data points, quotes, legal disclaimers                      │
│ • Company branding requirements                                        │
│ • Regulatory language that must appear verbatim                        │
│                                                                         │
│ Must Avoid: Deal-breakers                                              │
│ • Competitor mentions, controversial topics                            │
│ • Colors that conflict with brand or accessibility                     │
│ • Language that violates company policy                                │
│                                                                         │
│ Length Constraints: Guide the scope                                    │
│ • Preferred card count (AI will hit target ±10%)                       │
│ • Text density per card                                                │
└─────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│ SPECIAL REQUESTS                                                        │
├─────────────────────────────────────────────────────────────────────────┤
│ This is where you communicate unique challenges.                       │
│                                                                         │
│ Specific Challenges: Be honest about difficulties                      │
│ ✓ "Content is very technical, audience is non-technical"               │
│ ✓ "Too much content to fit in target card count"                       │
│ ✓ "Multiple stakeholders disagree on messaging"                        │
│                                                                         │
│ Previous Attempts: Learn from past failures                            │
│ ✓ "Tried PowerPoint, took 40 hours, still looked generic"              │
│ ✓ "Used Canva but couldn't capture technical nuance"                   │
│                                                                         │
│ This helps AI avoid approaches that already failed.                    │
└─────────────────────────────────────────────────────────────────────────┘


================================================================================
4. CONTENT PREPARATION BEST PRACTICES
================================================================================

BEFORE pasting content into your prompt:

✓ CLEAN UP OBVIOUS ERRORS
  - Fix glaring typos (AI will fix minor ones, but major errors waste tokens)
  - Remove duplicate sections
  - Delete irrelevant boilerplate (email signatures, footers)

✓ ORGANIZE MULTIPLE SOURCES
  - If providing multiple documents, clearly label each:
    "--- SOURCE 1: Product spec ---"
    "--- SOURCE 2: Market research ---"
  - Indicate priority: "Source 1 is primary, Source 2 is supplemental"

✓ PRESERVE STRUCTURE (if you have good structure)
  - Keep your existing headings/outlines
  - The AI will use them as starting points

✓ ANNOTATE UNCLEAR SECTIONS
  - If something needs context, add a note: "[Note: This data is from Q3 2024]"
  - If content is draft/rough, say so: "[ROUGH DRAFT - needs polish]"

✗ DON'T over-prepare
  - Don't pre-format for Gamma (AI will redo it anyway)
  - Don't try to add `---` breaks yourself (unless you're certain)
  - Don't remove technical details thinking "AI won't need this"


CONTENT SIZE CONSIDERATIONS:

│ Size         │ Strategy                                                 │
├──────────────┼──────────────────────────────────────────────────────────┤
│ < 1,000 words│ Paste directly into prompt                              │
│ 1K-10K words │ Paste OR attach document (either works)                 │
│ 10K-50K words│ Attach document (pasting may hit interface limits)      │
│ 50K+ words   │ Note in prompt: "Exceeds Gamma limits, needs splitting" │
│              │ AI will recommend how to split                           │


SPECIAL CONTENT TYPES:

Data/Tables:
  • Keep tables intact (AI can convert to Gamma format)
  • Indicate if critical: "This table MUST appear in deck"

Transcripts:
  • No need to clean up speech patterns (AI handles it)
  • Do note who's speaking if multiple people: "[CEO]: ... [CFO]: ..."

Outlines/Bullets:
  • Perfect for Gamma - minimal transformation needed
  • Use consistent bullet style (-, *, or numbered)

Technical Docs:
  • Keep technical terms (specify audience's knowledge level instead)
  • Highlight what's critical vs. supplemental


================================================================================
5. WHAT TO EXPECT IN RESPONSE
================================================================================

Your Claude Project will deliver:


┌─────────────────────────────────────────────────────────────────────────┐
│ IN CHAT: Transformation Summary                                        │
├─────────────────────────────────────────────────────────────────────────┤
│ Contains:                                                               │
│ • What was changed and why (high-level rationale)                      │
│ • Critical recommendations (3-5 bullets)                               │
│ • Immediate next steps                                                 │
│ • Any clarifying questions (if input was ambiguous)                    │
│                                                                         │
│ Read this FIRST - it provides context for the artifacts.               │
└─────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│ ARTIFACT 1: Paste-Ready Gamma Input                                    │
├─────────────────────────────────────────────────────────────────────────┤
│ Title: "[Project Name] - Gamma Input [Format]"                         │
│                                                                         │
│ Contents:                                                               │
│ • Fully structured content with `---` delimiters                       │
│ • Clear H1/H2 headings for each section                                │
│ • Organized bullets/sub-points                                         │
│ • Ready to copy-paste into Gamma's "Generate" or "Paste" input        │
│                                                                         │
│ DO NOT edit this before pasting - it's precisely formatted.            │
│ If you want changes, iterate with Claude, don't manually edit.         │
└─────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│ ARTIFACT 2: Gamma Optimization Guide                                   │
├─────────────────────────────────────────────────────────────────────────┤
│ Title: "[Project Name] - Gamma Optimization Guide"                     │
│                                                                         │
│ Sections:                                                               │
│ I.   Recommended Gamma Settings (with specific values)                 │
│ II.  Image Generation Strategy (SPLICE prompts for key images)         │
│ III. Gamma Agent Usage Plan (post-generation refinement commands)      │
│ IV.  Known Limitations & Workarounds (your specific edge cases)        │
│ V.   Post-Generation Checklist (step-by-step verification)             │
│ VI.  Optimization Opportunities (advanced features you could use)      │
│                                                                         │
│ Treat this as your implementation playbook.                            │
└─────────────────────────────────────────────────────────────────────────┘


TYPICAL TIMING:
• Simple transformation (< 5K words): 30-90 seconds
• Medium project (5K-20K words): 2-4 minutes
• Complex project (20K+ words with analysis): 5-8 minutes

If it's taking longer than expected, Claude is likely doing thorough web research to verify current Gamma capabilities.


================================================================================
6. ITERATION STRATEGY
================================================================================

You'll rarely get perfect output on first try. Here's how to iterate effectively:


ITERATION 1: STRUCTURAL FEEDBACK

After receiving initial output, review for:
✓ Did AI break content at logical points?
✓ Is card count appropriate (not too many, not too few)?
✓ Are priorities correct (important stuff upfront)?
✓ Is any critical content missing?

If issues exist, provide specific feedback:
✗ "This isn't quite right"
✓ "Cards 5-7 should be condensed into 2 cards"
✓ "The competitive analysis section is missing - it was in Source 2"


ITERATION 2: TONE & DETAIL REFINEMENT

Paste into Gamma, generate, then assess:
✓ Is text density right (too much/little per card)?
✓ Is tone hitting target (too formal, too casual)?
✓ Are images conceptually appropriate?
✓ Is technical level correct?

Iterate with Claude using Gamma Agent approach:
✓ "Make all card text 30% more concise"
✓ "Adjust tone to be more conversational"
✓ "Regenerate image prompts with warmer color palette"


ITERATION 3: POLISH & EDGE CASES

Final refinements:
✓ Specific word choice changes
✓ Adding missing examples
✓ Adjusting image details
✓ Fine-tuning headers/subheaders


EFFICIENCY TIP: Batch Feedback

Instead of:
  Iteration 1: "Make title shorter"
  [wait for response]
  Iteration 2: "Change tone of card 3"
  [wait for response]
  Iteration 3: "Add image to card 5"

Do this:
  Single request: "Three changes: (1) Make title shorter, (2) Change tone of
  card 3 to be more conversational, (3) Add image to card 5 showing [concept]"


================================================================================
7. TROUBLESHOOTING COMMON ISSUES
================================================================================

PROBLEM: "Output is too long - exceeds my Gamma plan's card limit"

SOLUTION:
1. Ask Claude: "Condense this to fit [X] card limit for my tier"
2. Prioritize sections: "Keep sections 1-3, make 4-6 into appendix"
3. Consider splitting: "Create two separate Gammas - core and deep-dive"


PROBLEM: "The structure doesn't match my mental model"

SOLUTION:
• Provide explicit outline: "Restructure to follow this order: [list]"
• Explain rationale: "Problem-solution structure works better than
  chronological because..."
• Reference example: "Structure should mirror [this deck]"


PROBLEM: "Tone is off - too formal/casual/technical"

SOLUTION:
• Be specific about what's wrong:
  ✗ "This sounds weird"
  ✓ "This sounds like a textbook, should sound like a conversation"
• Provide tone exemplar:
  ✓ "Use tone similar to Mailchimp's marketing content"
• Adjust textOptions:
  ✓ "Regenerate with tone: 'warm, friendly, non-technical'"


PROBLEM: "Images aren't what I envisioned"

SOLUTION:
• Refine SPLICE prompts with more detail:
  ✓ "For title slide image, add: Style = photorealistic (not illustration),
     Lighting = golden hour sunset, Emotion = hopeful and inspiring"
• Try different image models (if on Pro/Ultra)
• Specify what to avoid:
  ✓ "No generic stock photo aesthetics - need authentic, modern feel"


PROBLEM: "Content from Source 2 didn't get incorporated"

SOLUTION:
• Check if you labeled sources clearly
• Explicitly instruct: "Integrate data from Source 2, especially [section]"
• Verify Claude read all sources: "Did you see the table on page 15 of Source 2?"


PROBLEM: "Output is missing critical requirement I specified"

SOLUTION:
1. Verify it was in prompt (maybe got lost in copy-paste)
2. Restate forcefully: "CRITICAL: Must include [X] on every slide"
3. Use post-generation Agent: "Add [X] to all cards"


PROBLEM: "Gamma settings recommended don't match what I see in UI"

SOLUTION:
• Gamma's UI may have changed - settings evolve
• Follow the conceptual guidance, adapt to current UI
• Ask Claude: "These settings seem outdated, search for current Gamma UI"


PROBLEM: "I'm overwhelmed by the optimization guide - too much information"

SOLUTION:
• Start with Section I (Recommended Settings) - that's minimum viable
• Implement Sections II-III after first generation
• Treat Sections IV-VI as reference (read only if you hit issues)


================================================================================
8. ADVANCED USAGE PATTERNS
================================================================================


PATTERN 1: Template Creation
─────────────────────────────────────────────────────────────────────────────
Goal: Create reusable Gamma template for repeated use (e.g., customer case
studies, weekly reports)

Workflow:
1. Use Full Template prompt with: "I want to create a reusable template"
2. Specify: "Variable sections that will change: [X, Y, Z]"
3. Claude delivers: Template structure + guidance on what to customize each time
4. Save in Gamma as template, use API/Zapier for automation

Example: "Create template for monthly sales performance decks. Variable data:
revenue, top deals, team highlights. Fixed structure: cover, exec summary,
metrics, wins, forecast, team spotlight, next month goals."


PATTERN 2: Multi-Format Output
─────────────────────────────────────────────────────────────────────────────
Goal: Create presentation + separate document from same content

Workflow:
1. Initial request: "Create presentation version"
2. Follow-up: "Now create document version of same content, optimized for
   reading vs. presenting"
3. Claude adapts: More text per card, different structure, less visual
4. You get: Two Gamma-optimized outputs from single source

Use case: Sales deck (presentation) + leave-behind document (detailed)


PATTERN 3: Audience Variants
─────────────────────────────────────────────────────────────────────────────
Goal: Multiple versions for different audiences from same content

Workflow:
1. Request: "Create executive version (high-level) and technical version
   (detailed) from this product spec"
2. Claude produces: Two different structures/depths from same source
3. Specify differences: "Executive = 12 cards, business focus; Technical =
   30 cards, implementation focus"

Use case: Product launch - exec deck for leadership, technical deck for
engineering teams


PATTERN 4: Progressive Disclosure
─────────────────────────────────────────────────────────────────────────────
Goal: Core deck with optional deep-dive sections

Workflow:
1. Request: "Main deck (15 cards) + appendix (10 cards) with toggles"
2. Claude structures: Essential content upfront, details in collapsible
   sections or appendix cards
3. Use Gamma's interactive toggles for in-deck optional content
4. Result: Deck works for both quick overview and detailed review

Use case: Sales proposals where some buyers want detail, others want brevity


PATTERN 5: Content Refresh
─────────────────────────────────────────────────────────────────────────────
Goal: Update existing Gamma with new information

Workflow:
1. Provide: Current Gamma export (PDF or text) + new information to add
2. Request: "Update this deck with new Q4 data, preserving existing structure"
3. Claude delivers: Revised input maintaining flow, integrating new content
4. Paste into Gamma, compare, iterate

Use case: Quarterly business reviews, annual report updates


PATTERN 6: Cross-Tool Workflow
─────────────────────────────────────────────────────────────────────────────
Goal: Use Gamma as part of larger content pipeline

Example workflow:
1. Notion doc → Claude optimization → Gamma presentation
2. Gamma deck → PDF export → WordPress embed
3. Google Doc → Claude → Gamma → LinkedIn carousel

Claude can guide API automation: "I want to automate: Airtable record →
Gamma deck via Zapier. Provide API configuration and Zap structure."


================================================================================
9. QUICK REFERENCE CHECKLIST
================================================================================


BEFORE SUBMITTING PROMPT:
────────────────────────────────────────────────────────────────────────────
[ ] Chose appropriate prompt version (Full/Quick-Start)
[ ] Filled in all critical sections (at minimum: project, audience, format)
[ ] Specified Gamma plan tier (affects recommendations)
[ ] Attached or pasted content clearly
[ ] Stated desired outcome (what success looks like)
[ ] Listed must-include and must-avoid items (if any)
[ ] Provided timeline (if urgent)


AFTER RECEIVING OUTPUT:
────────────────────────────────────────────────────────────────────────────
[ ] Read chat summary first (context for artifacts)
[ ] Review Artifact 1 structure (logical flow? right length?)
[ ] Check Artifact 2 settings (make sense for your tier?)
[ ] Copy Artifact 1 into Gamma exactly as-is
[ ] Configure Gamma using Section I of Artifact 2
[ ] Generate in Gamma
[ ] Assess output quality
[ ] Use Gamma Agent with commands from Artifact 2 Section III
[ ] Verify against checklist in Artifact 2 Section V


ITERATION CHECKLIST:
────────────────────────────────────────────────────────────────────────────
[ ] Batch feedback (don't iterate one change at a time)
[ ] Be specific (not "fix this" but "change X to Y because Z")
[ ] Test in Gamma between iterations (don't iterate in Claude only)
[ ] Use Gamma Agent for minor tweaks (faster than re-generating via Claude)
[ ] Know when to stop (diminishing returns after 2-3 rounds)


BEFORE FINALIZING:
────────────────────────────────────────────────────────────────────────────
[ ] Verify all must-include content is present
[ ] Check that must-avoid items are absent
[ ] Test export (if you'll need PDF/PPTX)
[ ] Review analytics settings (if sharing externally)
[ ] Apply custom theme (if using branded theme)
[ ] Test on target device/browser (if presenting)
[ ] Share with colleague for quick feedback (if high-stakes)


================================================================================

This guide is comprehensive but not exhaustive. The beauty of the Claude
Project is that it learns your patterns. After 3-5 projects, you'll develop
intuition for how much detail to provide and which sections matter most for
your use cases.

Remember: More context upfront = less iteration later. But don't let perfect
be the enemy of done - start with Quick-Start if needed, upgrade to Full
Template when stakes increase.

================================================================================
END USAGE GUIDE
================================================================================
