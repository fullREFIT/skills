# **Logo & Brand Identity Studio Methodology Research**

## **Deep Research Prompt for AI Visual Prompt Architect Development**

### **1\. Introduction and System Architecture Context**

This research report constitutes the foundational technical specification for the "Visual Prompt Architect," a proposed AI system designed to bridge the semantic gap between abstract brand strategy and high-fidelity generative image synthesis. The core challenge in current AI image generation (via models such as Midjourney v6, DALL-E 3, and Flux) is not the capability of the model to render pixels, but the inability of the user to articulate specific visual lineages and strategic nuances in natural language. Users often request "a modern logo," failing to specify whether they mean the "Swiss International Style modernity" of *SmashBrand* or the "Post-Digital Neo-Brutalist modernity" of *Gander*.

To solve this, this report reverse-engineers the proprietary visual methodologies of eleven elite design studios. By analyzing their portfolios, processes, and published philosophies, we extract a controlled vocabulary of "Visual Tokens"—specific combinations of adjectives, technical terms, and stylistic references that reliably steer diffusion models toward distinct aesthetic outcomes. The analysis distinguishes between *high-fidelity boutique branding* (characterized by custom illustration, bespoke typography, and rich narrative textures) and *systematic commercial design* (characterized by scalability, clean vector geometry, and conversion-optimized hierarchies).

The data presented herein is categorized by verification status: \*\*\*\* for visual attributes directly analyzed from portfolio assets; \*\*\*\* for methodologies explicitly published by the studios; \*\*\*\* for logical deductions based on recurring design patterns; and \*\*\*\* for common practices assumed based on professional norms. This document is written for computational linguists and design technologists tasked with encoding these patterns into the Architect's logic.

### ---

**2\. Deliverable 1: Individual Studio Profiles**

#### **2.1 Garage Design Studio**

**Status:** Primary Focus (CPG/Illustration Emphasis)

##### **Section A: Studio Overview**

Garage Design Studio, headquartered in Athens, Greece 1, operates as a "one-stop shop" collaborative that bridges the gap between raw industrial aesthetics and refined brand identity. Their positioning is explicitly rooted in the metaphor of the "garage"—a space of tools, creation, and hands-on craftsmanship.3 Unlike agencies that hide the labor of design, Garage celebrates the "rugged yet stylish" nature of the creative process. The studio operates on a project-based collaborative model, emphasizing rapid communication ("Reply Within 24 Hours") and deep client integration.1 Their client profile is heavily weighted toward Consumer Packaged Goods (CPG), specifically in the coffee culture, spirits, and artisanal product sectors. Notable clients identified in the research include *First Place Coffee*, *Lost & Found*, *SwissRX*, and early influential work for the unicorn brand *Huel*.2

##### **Section B: Visual Signature Analysis**

\*\*\*\* Analysis of *First Place Coffee*, *Lost & Found*, *SwissRX*, and *Huel*.

Color Analysis:
The Garage palette tendency is decidedly \*\*\*\*. They shun the hyper-saturated digital RGB spectrum in favor of CMYK-printable tones that evoke physical materials.

* **Palette Tendency:** Deep, grounded earth tones are dominant. Burnt siennas, roasted coffee browns (\#4D2F1E), warm unbleached creams, and industrial slate greys form the backbone of their work.5
* **Color Relationships:** The studio frequently employs an **analogous warmth** model anchored by high-contrast darks. A recurring pattern is the "Neutral-plus-Rust" technique, where a beige or kraft paper background is offset by deep charcoal (\#1F2B34) and a single vibrant accent like Rust Orange (\#EA4225).6
* **Psychology:** These colors align with "Authenticity" and "Craft." They signal to the consumer that the product is made by humans, not machines.

**Typography Patterns:**

* **Dominant Style:** A hybrid of \*\*\*\*. Garage rarely relies solely on off-the-shelf fonts. There is a distinct blend of hand-drawn, imperfect script (evoking human craft) paired with rigid, industrial sans-serifs (evoking machinery and reliability).2
* **Lettering Approach:** **\[Heavily Modified\]**. Logotypes for clients like *Lost & Found* feature custom ligatures and rough edges that simulate ink bleed.
* **Text Integration:** \*\*\*\*. Text is often secondary to, or enclosed within, a dominant badge or emblem shape.

**Illustration/Imagery Style:**

* **Style Category:** \*\*\*\*. Illustrations often resemble technical schematics, vintage patent drawings, or etching-style artwork.
* **Line Quality:** \*\*\*\*. Lines are rarely uniform vector strokes; they simulate the pressure of a nib pen, often with "bleed" or "stamp" effects to simulate physical print processes.
* **Texture:** High usage of grit, grain, and paper textures. The "digital sheen" of vector graphics is actively suppressed in favor of a tactile finish.7

##### **Section C: Strategic Translation Patterns**

**Personality Translation:**

* **Authenticity/Craft:** Garage visualizes "authenticity" through **imperfection**. They reject perfect geometric circles in favor of "stamp-style" edges that suggest a manual printing process.8 To prompt this, the AI must be instructed to introduce "micro-distress" or "letterpress texture."
* **Trustworthy:** Trust is conveyed not through corporate minimalism, but through "legacy cues"—establishing dates, location markers (e.g., "Athens, Greece"), and badge structures that imply longevity.

Category Approach (Coffee/CPG):
Garage subverts the modern "clean/minimal/Scandi" coffee trend by adding density and narrative clutter. They utilize "maximalist badge design"—badges, secondary icons, and dense typographic lockups that suggest a legacy brand even for startups.7 This differentiates their clients from the sea of minimalist sans-serif coffee brands.

##### **Section D: Process Documentation**

* \*\* Collaborative Looping:\*\* The studio emphasizes a non-linear process: "Our collaborative process keeps you in the loop, so that your vision is realized".1
* \*\* Iterative "Badge" Exploration:\*\* Portfolio evidence shows exhaustive exploration of badge and emblem variations (e.g., "FPC Bag \#2," "FPC Label \#2"). This suggests a process that does not just generate a logo, but simultaneously generates an entire asset class of stickers, stamps, and patches.8 The prompt architect should support "asset sheet generation" to mimic this output.

##### **Section E: Signature Techniques**

**TECHNIQUE:** The "Industrial Badge" Lockup.

* **OBSERVATION:** Logos are rarely floating text; they are contained within containment shapes (circles, diamonds, shields) filled with secondary data (est. dates, locations, origin).
* **APPLICATION:** Used extensively in CPG packaging labels (*First Place Coffee*, *Lost & Found*).
* **PROMPT TRANSLATION:** "Vintage industrial badge logo, contained geometric emblem, dense typographic layout, secondary iconography, stamp texture finish, vector line art with ink bleed."

##### **Section F: Case Study Deep Dives**

**Case Study 1: First Place Coffee**

* **Project/Client:** First Place Coffee.6
* **Category:** Specialty Coffee (Mobile/Truck).
* **Brief:** Create an identity for a mobile coffee truck that feels established, rugged, and premium, avoiding the "cute" tropes of mobile food vendors.
* **Visual Analysis:**
  * *Logo Type:* \*\*\*\*.
  * *Color:* Deep charcoal (\#1F2B34), Rust Orange (\#EA4225), and Tan (\#ECDEBB). Rationale: High contrast for visibility on a moving truck; rust/tan evokes roasting and machinery.
  * *Typography:* Custom hand-drawn sans-serif for the name, paired with utilitarian sans for secondary text ("Phoenix, AZ"). Rationale: Hand-drawn suggests "hand-crafted coffee."
  * *Imagery:* A stylized "winged wheel" or "drip" icon integrated into a diamond or circular badge.
* **Effectiveness:** The badge format is perfectly suited for the constraints of a coffee cup sticker and a truck door decal. The density of the design makes the brand feel substantial.
* **Prompt Reconstruction:** logo design for a mobile coffee truck, style of Garage Design Studio, vintage badge emblem, diamond shape container, typography: "FIRST PLACE" in gritty hand-drawn sans-serif, icon: winged coffee drip, colors: rust orange and charcoal grey, texture: rubber stamp ink bleed on kraft paper, industrial americana aesthetic \--v 6.0

**Case Study 2: Lost & Found**

* **Project/Client:** Lost & Found.4
* **Category:** Maker/Artisan Goods.
* **Visual Analysis:**
  * *Logo Type:* \*\*\*\*.
  * *Color:* A complex earthy palette: \#4D2F1E (Dark Brown), \#9A7256 (Medium Brown), \#963B29 (Red-Brown). Rationale: Evokes leather, wood, and clay materials used by the maker.
  * *Typography:* Custom serif with decorative swashes and ligatures connecting the letters.
* **Effectiveness:** The interconnected letters visually represent the concept of "finding" or "connection."
* **Prompt Reconstruction:** brand identity for artisan maker studio, style of Garage Design Studio, custom serif typography with decorative ligatures, wordmark "Lost & Found", texture: gold foil stamp on dark brown leather, elegant but rugged, vintage craftsmanship aesthetic \--v 6.0

#### ---

**2.2 Buttermilk Creative**

**Status:** Primary Focus (CPG/Illustration Emphasis)

##### **Section A: Studio Overview**

Buttermilk Creative, based in Greensboro, North Carolina 10, is a specialized agency dedicated exclusively to the world of specialty Food & Beverage CPG.11 Their positioning is clear: they take products from the "farmers market" stage to the "national retail shelf" stage. Their work is characterized by FDA-compliant precision mixed with vibrant, consumer-centric storytelling. They offer branding, packaging design, production, and website design.12

##### **Section B: Visual Signature Analysis**

\*\*\*\* Analysis of *Oats in Coats*, *Piedmont Pennies*, *NoBull Burger*, *Eureka Tortilla*.

**Color Analysis:**

* **Palette Tendency:** \*\*\*\*. Buttermilk utilizes color for shelf velocity. Their palettes are vibrant, often using electric pastels and high-chroma primaries that compete aggressively for attention in a grocery aisle.
* **Color Relationships:** \*\*\*\*. For *My Better Batch*, they employed a Teal \+ Purple combination to create maximum vibration.13 For *Eureka Tortilla*, they used "zesty" pastel backgrounds (green/orange) to code flavor variants.11
* **Psychology:** Colors map directly to flavor cues (Red \= Apple, Green \= Jalapeño) but are amped up to "neon" levels to trigger impulse purchases.

**Typography Patterns:**

* **Dominant Style:** \*\*\*\*. Typefaces are often rounded, soft, and approachable, avoiding sharp aggressive angles or cold corporate sans-serifs.
* **Text Integration:** \*\*\*\*. Typography is legible and large (for shelf reading) but often woven into the illustration (e.g., *Oats in Coats* where the oat character interacts with the header).11

**Illustration/Imagery Style:**

* **Style Category:** \*\*\*\*. Highly illustrative, featuring anthropomorphic ingredients. *Oatis the Oat* is a prime example of a mascot-driven identity.
* **Line Quality:** **\[Clean Vector\]**. Unlike Garage's grit, Buttermilk's lines are clean, uniform, and optimized for flexographic printing on plastic pouches.
* **Character Use:** **\[Mascots\]**. Frequent use of whimsical characters to tell a story and appeal to family demographics.

##### **Section C: Strategic Translation Patterns**

**Personality Translation:**

* **Playful:** "Playful" is translated through **anthropomorphism**. By putting a coat on an oat or giving a face to a vegetable, they instantly lower the barrier to entry for consumers, signaling "fun" and "family-friendly."
* **Flavor Visualization:** Buttermilk translates flavor profiles into **background patterns**. A "spicy" product gets dynamic, angular confetti patterns; a "wholesome" product gets soft, organic ingredient scatters.

**Audience Alignment:**

* **Families/Mainstream:** The use of "storybook" illustration styles appeals to parents shopping for children, leveraging nostalgia for children's books to build trust.11

##### **Section D: Process Documentation**

* \*\* FDA Compliance Integration:\*\* Uniquely, their process explicitly mentions knowledge of technical FDA packaging requirements as a core step.12 This implies a "constraints-first" creative process where the layout is dictated by regulatory text space.
* \*\* Shelf-Pop Optimization:\*\* The consistent use of "content bands" (e.g., *Eureka Tortilla*) suggests a process that prioritizes shelf navigability—ensuring the brand name and flavor are visible from 5 feet away.11

##### **Section E: Signature Techniques**

**TECHNIQUE:** The "Ingredient Narrative" Band.

* **OBSERVATION:** Using a dedicated visual band on packaging to display isolated ingredient illustrations (e.g., berries, grains).
* **APPLICATION:** Used in *Oats in Coats* and *Eureka Tortilla*.
* **PROMPT TRANSLATION:** "Packaging design featuring an ingredient illustration band, isolated vector fruits and grains, clean white background strip, colorful pouch design, flat vector style."

##### **Section F: Case Study Deep Dives**

**Case Study 1: Oats in Coats**

* **Project/Client:** Oats in Coats.11
* **Category:** Breakfast Food (Oatmeal).
* **Brief:** Make oatmeal, a traditionally boring category, exciting for kids and convenient for parents.
* **Visual Analysis:**
  * *Logo Type:* \*\*\*\*.
  * *Color:* Vibrant Red (Apple flavor) and other "lively" colors.
  * *Typography:* "Bumped up" font sizes for clarity; quirky custom font that feels handwritten but legible.
  * *Imagery:* "Oatis," a stylish oat character wearing a coat.
* **Effectiveness:** The mascot provides an emotional hook; the "coat" visual pun makes the brand memorable.
* **Prompt Reconstruction:** packaging design for oatmeal brand "Oats in Coats", style of Buttermilk Creative, vibrant red pouch, central mascot: a cute anthropomorphic oat grain wearing a yellow raincoat, whimsical vector illustration, chunky soft serif typography, playful, kid-friendly, flat color style \--v 6.0

**Case Study 2: Piedmont Pennies**

* **Project/Client:** Piedmont Pennies.11
* **Category:** Snack Food (Cheese Biscuits).
* **Visual Analysis:**
  * *Logo Type:* \*\*\*\*.
  * *Color:* Color-coded bands (e.g., Purple for Jalapeño) against a clean background.
  * *Imagery:* High-quality photography of the biscuit with "colorful accents" (confetti/ingredients).
* **Effectiveness:** Balances "southern heritage" (biscuit) with "modern snacking" (bright colors). The photography proves the texture ("crunch"), while the colors signal flavor intensity.
* **Prompt Reconstruction:** snack packaging design for cheese biscuits, style of Buttermilk Creative, clean layout with vibrant purple color blocking, photography of crispy cheese crackers, confetti pattern background, bold serif typography, southern artisan aesthetic but modern \--v 6.0

#### ---

**2.3 Gander**

**Status:** Primary Focus (High-End CPG/Trendsetter)

##### **Section A: Studio Overview**

Gander, located in Brooklyn, NY 14, is arguably the most influential studio in the modern Direct-to-Consumer (DTC) CPG space. Founded in 2015, they position themselves as creators of "Brands with Soul and Substance".15 They are the architects of the "Millennial/Gen Z" aesthetic, having designed for unicorns like *Graza*, *Magic Spoon*, *Banza*, and *Gotham Greens*.16 Their work is characterized by a rejection of corporate polish in favor of "intentional awkwardness" and "ugly-cool" aesthetics that stop the scroll on Instagram.

##### **Section B: Visual Signature Analysis**

\*\*\*\* Analysis of *Graza*, *Magic Spoon*, *Wooden Spoon Herbs*.

**Color Analysis:**

* **Palette Tendency:** \*\*\*\*. Gander shuns standard category colors. For *Graza*, they avoided the traditional "Italian Gold/Green" of olive oil in favor of a "Squeeze Bottle Green" and unbleached matte textures.17 For *Magic Spoon*, they utilized "Saturday Morning Cartoon" purples and electric blues.18
* **Signature:** High-chroma pairings that vibrate (e.g., Pink and Red, or Lime Green and Lavender).

**Typography Patterns:**

* **Dominant Style:** \*\*\*\*. They popularized the use of "wonky" typefaces—fonts that look slightly melted, flared, or hand-drawn but are vector-perfect.17
* **Layout:** Type is treated as an image; often warped, arched, or integrated into the illustration. They frequently use the "Cooper Black" style of rounded, friendly serifs.

**Illustration/Imagery Style:**

* **Style Category:** **\[Naïve/Faux-Folk\]**. Illustrations often look deceptively simple, like sketches or doodles, but with high-end composition. *Graza’s* illustrations look like marker drawings on a whiteboard.
* **Character Use:** **\[Heavy\]**. Heavy use of non-human mascots (e.g., smiling spoons, dancing vegetables, anthropomorphic drops).

##### **Section C: Strategic Translation Patterns**

**Personality Translation:**

* **Disruptive:** Gander visualizes "disruption" by **violating category norms**. For olive oil (usually serious, glass bottles, gold foil), they used a plastic squeeze bottle with a "marker" logo. This visual choice signals "for cooking, not for display" and instantly separates the brand from competitors.17
* **Nostalgia:** Visualizing "childlike joy for adults" (*Magic Spoon*) by using high-chroma palettes and mascot styles reminiscent of 1990s cartoons but with elevated negative space and matte finishes.18

##### **Section D: Process Documentation**

* \*\* Collaborative Collective:\*\* "We consider our best work to be the result of a collective rather than of an individual".19 This implies a process where files are passed around and iterated upon by multiple designers with different styles.
* \*\* "Personality First" Briefing:\*\* The visual output is so heavily skewed toward brand voice (e.g., "Squeezable") that their discovery process likely focuses on finding a single "verb" or "adjective" to build the entire visual world around.

##### **Section E: Signature Techniques**

**TECHNIQUE:** The "Utilitarian Doodle."

* **OBSERVATION:** Combining extremely clean, Swiss-style typography with "rough" or "doodle" style illustrations.
* **PROMPT TRANSLATION:** "Brand identity combining Swiss international typography with hand-drawn marker doodles, high contrast, naive illustration style, sophisticated layout, matte finish."

##### **Section F: Case Study Deep Dives**

**Case Study 1: Graza Olive Oil**

* **Project/Client:** Graza.17
* **Category:** Cooking Oil.
* **Brief:** Make olive oil accessible, fun, and explicitly for *cooking* (squeezing), not just dressing.
* **Visual Analysis:**
  * *Logo Type:* \*\*\*\*.
  * *Color:* Deep Forest Green (Text) on Pale Chartreuse/Cream (Bottle).
  * *Typography:* Custom marker-style lettering that looks like it was written by a chef on a prep label.
  * *Composition:* Asymmetric, text-heavy but informal.
* **Effectiveness:** The "squeeze bottle" form factor combined with the "marker" typography communicates the product's use case (kitchen utility) instantly.
* **Prompt Reconstruction:** packaging design for olive oil in a plastic squeeze bottle, style of Gander, typography: "GRAZA" in bold hand-drawn marker font, illustration: simple line art of an olive tree, palette: dark forest green and cream, matte plastic texture, playful, casual, chef-grade utility aesthetic \--v 6.0

**Case Study 2: Magic Spoon**

* **Project/Client:** Magic Spoon.18
* **Category:** Cereal (Keto/Protein).
* **Brief:** Recreate the joy of sugary childhood cereals for health-conscious adults.
* **Visual Analysis:**
  * *Logo Type:* \*\*\*\*.
  * *Color:* Psychedelic pastels (Purple, Teal, Pink).
  * *Typography:* 1970s style flared serif, warped into a wave shape.
  * *Imagery:* Surreal, psychedelic characters (e.g., a muscular wizard) rendered in a flat, grain-textured vector style.
* **Effectiveness:** It signals "fun" first and "healthy" second. It looks like a treat, which is the core value proposition.
* **Prompt Reconstruction:** cereal box design, style of Gander, psychedelic saturday morning cartoon aesthetic, surreal vector illustration of a wizard, typography: "Magic Spoon" in warped 70s serif font, vibrant purple and teal color palette, grainy texture shading, playful, nostalgic, adult-oriented branding \--v 6.0

#### ---

**2.4 Eye Candy Design**

**Status:** Primary Focus (International/Australia)

##### **Section A: Studio Overview**

Eye Candy Design, based in Melbourne (Sandringham) and Brisbane, Australia 20, positions itself as a "boutique branding and packaging studio" with a specific focus on "ethnic and heritage brands" as well as major FMCG players. Their client list includes global giants like *Coca-Cola European Partners* and *Monster Energy*, alongside boutique producers like *Original Spirit Co.*.20 Their aesthetic is polished, commercially robust, and often leans into "premium" codes of luxury.

##### **Section B: Visual Signature Analysis**

\*\*\*\* Analysis of *Steamrail Brews*, *Go Ginger Beer*, *Original Spirit Co.*

**Color Analysis:**

* **Palette Tendency:** \*\*\*\*. Eye Candy makes extensive use of foils, metallics (copper, gold, silver), and deep saturated backgrounds (emerald greens, midnight blues, matte blacks).20
* **Finish:** High emphasis on light interaction—contrasting matte paper stocks with high-gloss spot varnishes.

**Typography Patterns:**

* **Dominant Style:** \*\*\*\*. Usage of Victorian-inspired, ornamental typefaces for spirits and craft beers.
* **Integration:** Typography is often embossed, shadowed, or treated as a "label within a label."

**Composition Patterns:**

* **Layout:** \*\*\*\*. Classic packaging layouts that emphasize stability and heritage.
* **Shape Language:** High use of crests, shields, and filigree borders.

##### **Section C: Strategic Translation Patterns**

**Personality Translation:**

* **Premium/Heritage:** Eye Candy visualizes "heritage" through **complexity**. Intricate linework, etching-style illustrations, and multi-layered finishes signal "time-honored" quality.20
* **Category Approach (Alcohol):** They align strictly with "craft" codes—textured paper, limited color palettes with metallic accents, and detailed botanical illustrations. They do not subvert the category (like Gander); they *elevate* it.

##### **Section E: Signature Techniques**

**TECHNIQUE:** The "Tactile Finish" Simulation.

* **OBSERVATION:** Designs heavily rely on the *suggestion* of material—wood grain textures, metallic foils, and embossed paper effects in the digital presentation.
* **PROMPT TRANSLATION:** "Packaging design, luxury foil stamping, embossed texture, matte black paper background, intricate gold filigree details, photorealistic 3D render, studio lighting."

##### **Section F: Case Study Deep Dives**

**Case Study 1: Steamrail Brews (Coles Liquor)**

* **Project/Client:** Steamrail Brews.20
* **Category:** Craft Beer (Private Label).
* **Brief:** Create a credible craft beer brand for a major retailer that feels independent and historic.
* **Visual Analysis:**
  * *Logo Type:* \*\*\*\*.
  * *Visuals:* Victorian-era industrial aesthetic (steam trains, gears).
  * *Typography:* ornate slab serifs and copperplate gothic.
* **Effectiveness:** The "Steampunk" aesthetic provides an instant backstory ("Steamrail") that distracts from the corporate origin of the product.
* **Prompt Reconstruction:** beer label design, style of Eye Candy Design, steampunk aesthetic, intricate copper foil illustration of a steam train, victorian typography, deep blue and copper palette, metallic finish, premium craft beer branding \--v 6.0

#### ---

**2.5 SmashBrand**

**Status:** Primary Focus (Data-Driven CPG)

##### **Section A: Studio Overview**

SmashBrand (USA/Remote) operates on a unique "Data-Driven Brand Development" model. They differentiate themselves by *testing* designs against consumer purchase intent data before launch.22 Their philosophy is "Design for Performance," meaning every visual choice is justified by conversion metrics. Their clients include *Earth Breeze*, *Groove Life*, and *Yucatan Guacamole*.

##### **Section B: Visual Signature Analysis**

\*\*\*\* Analysis of *Earth Breeze*, *Groove Life*, *Yucatan*.

**Color Analysis:**

* **Palette Tendency:** \*\*\*\*. They use colors that consumers *expect* for the category but optimized for brightness. For *Earth Breeze* (laundry), they used clean whites, cyans, and greens—standard category codes but executed with higher contrast.24
* **Contrast:** High contrast between background and "Claim" text is paramount for readability.

**Typography Patterns:**

* **Dominant Style:** \*\*\*\*. Typography is treated as *information architecture*. Claims ("Plastic Free," "60 Loads") are massive, bold, and typically set in geometric sans-serifs.
* **Hierarchy:** Strict visual hierarchy: Brand Name \> Primary Benefit \> Flavor/Scent.

**Composition Patterns:**

* **White Space:** \*\*\*\*. Explicitly stated use of white space to increase shelf visibility and purchase intent.25
* **Front-of-Pack:** "Claim-forward" design. Visuals support the textual claim rather than creating an abstract mood.

##### **Section C: Strategic Translation Patterns**

**Personality Translation:**

* **Trust:** SmashBrand visualizes "trust" through **clarity**. By reducing clutter and using clean, medical-grade sans-serifs, they signal efficacy and lack of hidden ingredients.25
* **Innovation:** "Innovation" is not visualized through weirdness but through **structural differentiation** (e.g., showing the unique sheet format of Earth Breeze) or **simplified usage diagrams** on the pack.24

##### **Section E: Signature Techniques**

**TECHNIQUE:** The "Benefit Hierarchy" Stack.

* **OBSERVATION:** Vertical stacking of key benefits in high-contrast text, often bulleted or icon-supported, directly on the front-of-pack.
* **PROMPT TRANSLATION:** "CPG packaging design, clean white space, bold sans-serif typography, high-contrast benefit hierarchy, photorealistic product render, retail shelf lighting, conversion optimized layout."

##### **Section F: Case Study Deep Dives**

**Case Study 1: Earth Breeze**

* **Project/Client:** Earth Breeze.25
* **Category:** Laundry Detergent (Eco-Sheets).
* **Brief:** Optimize packaging for Walmart shelves to compete with legacy liquid jugs.
* **Visual Analysis:**
  * *Logo Type:* \*\*\*\*.
  * *Color:* Clinical White background, Fresh Green and Cyan accents.
  * *Typography:* Massive sans-serif "EARTH BREEZE".
  * *Imagery:* A clean vector icon of the earth; clear depiction of the "sheet" product.
* **Effectiveness:** The white space acts as a "spotlight" on the shelf amongst the cluttered orange/blue jugs of competitors. It signals "clean" instantly.
* **Prompt Reconstruction:** laundry detergent packaging design, style of SmashBrand, eco-friendly paper envelope, clean white background, massive bold sans-serif typography "EARTH BREEZE", vector earth icon, fresh green and cyan accents, high key lighting, retail shelf context \--v 6.0

#### ---

**2.6 Designity**

**Status:** Secondary Focus (Subscription/Service)

##### **Section A: Studio Overview**

Designity (USA) operates a "Creative-as-a-Service" (CaaS) model.27 They are not a single studio but a platform matching clients with Creative Directors who manage teams. This results in a diverse, competent, but generally "safe" corporate aesthetic tailored to tech and B2B clients.

##### **Section B: Visual Signature Analysis**

\*\*\*\* Analysis of *Mimo Health*, *Throne Kingdom*.

* **Visual Style:** \*\*\*\*. Designs tend to be clean, professional, and adhere to modern UI/UX trends (flat design, gradients, isometric illustrations).
* **Typography:** Clean Google Fonts (Montserrat, Open Sans).
* **Prompt Translation:** "Modern corporate branding, isometric vector illustration, gradient blue and purple palette, clean sans-serif typography, tech startup aesthetic."

#### ---

**2.7 Duck.Design**

**Status:** Secondary Focus (Subscription/Volume)

##### **Section A: Studio Overview**

Duck.Design (London/Remote) focuses on speed and volume ("Same-day delivery").28 Their work represents the "fast fashion" of design—polished, trend-aware, but standardized.

##### **Section B: Visual Signature Analysis**

\*\*\*\* General Portfolio.

* **Visual Style:** **\[Corporate Memphis / Flat Vector\]**. Heavy reliance on flat characters with exaggerated limbs, bright primary colors, and clean vector lines. This style is chosen for its speed of production and broad acceptability.
* **Prompt Translation:** "Flat vector corporate illustration, corporate memphis style, bright primary colors, clean lines, minimal shading, scalable vector graphics."

#### ---

**2.8 Evyo Studio (Evo Design Studio)**

**Status:** Secondary Focus (UX/UI & Digital)

##### **Section A: Studio Overview**

Evyo Studio (Remote) specializes in UX/UI and SaaS branding.29 Their visual output is almost exclusively digital—interfaces, dashboards, and app icons.

##### **Section B: Visual Signature Analysis**

\*\*\*\* Analysis of *Plankk*, *Refundo*.

* **Visual Style:** \*\*\*\*. High prevalence of deep black or navy backgrounds with neon accent colors (electric blue, cyber green) to signal "tech." usage of blurred glass effects (glassmorphism) in UI cards.
* **Prompt Translation:** "SaaS brand identity, dark mode UI aesthetic, neon gradient glow, glassmorphism, rounded corners, tech interface style, dashboard visualization."

#### ---

**2.9 Happyland Creative**

**Status:** Tertiary Focus (Boutique/Story)

##### **Section A: Studio Overview**

Happyland Creative (Oregon), led by Brittany Wong, is a boutique agency positioning itself as the champion of "small businesses" and female entrepreneurs.30 Their motto "The vibe you want" suggests an emotionally led design process.

##### **Section B: Visual Signature Analysis**

\*\*\*\* Analysis of *Popcast Media*, *Nashville Sweets*.

* **Visual Style:** **\[Feminine / Vibrant / Playful\]**. High usage of "millennial pink," warm oranges, and teals.
* **Typography:** Frequent use of **custom script logos** (signaling personal touch) paired with clean serifs.
* **Technique:** \*\*\*\*. Creating dense, colorful patterns derived from the logo marks.
* **Prompt Translation:** "Playful boutique branding, vibrant color palette, custom script typography, seamless confetti pattern background, feminine entrepreneur aesthetic, warm and approachable."

#### ---

**2.10 Honor Creative**

**Status:** Tertiary Focus (Luxury/Boutique)

##### **Section A: Studio Overview**

Honor Creative (Nashville, TN) focuses on "Timeless" and "Intentional" branding for lifestyle and beauty clients.31 Their aesthetic is restrained, high-end, and editorial.

##### **Section B: Visual Signature Analysis**

\*\*\*\* Analysis of *Rustler Hat Co.*, *Catalyst Beauty*.

* **Visual Style:** \*\*\*\*. Palettes are neutral (saddle leather, oak, cream).32
* **Typography:** \*\*\*\*. High-contrast serifs that look like fashion magazine headers, often with generous tracking (letter-spacing).
* **Imagery:** **\[Photography-First\]**. Branding relies on art-directed photography rather than vector illustration.
* **Prompt Reconstruction:** luxury lifestyle branding, style of Honor Creative, high-contrast serif typography, wide letter spacing, neutral earth tone palette, minimalist editorial layout, photography-driven identity \--v 6.0

#### ---

**2.11 Hardy Brands**

**Status:** Tertiary Focus (Strategy/Regional)

##### **Section A: Studio Overview**

Hardy Brands (Bozeman, Montana) serves the "Northern Rockies" region.33 Their work blends modern design principles with a "Western" or "Americana" regional flavor.

##### **Section B: Visual Signature Analysis**

\*\*\*\* Analysis of *Genuine Ice Cream*.

* **Visual Style:** \*\*\*\*. For *Genuine Ice Cream*, they created custom illustrations of "Montanan summer" (bears, bees).
* **Typography:** \*\*\*\*. Usage of slab serifs and western-inspired type that fits the "Ranch/Mountain" aesthetic but refined for modern use.
* **Prompt Translation:** "Modern western branding, americana typography, slab serif, painterly nature illustration, mountain region aesthetic, warm rustic palette, montana style."

### ---

**3\. Deliverable 2: Cross-Studio Pattern Analysis**

#### **2.1 Universal Principles**

These principles are observed across the most successful studios (Garage, Gander, Buttermilk, SmashBrand) and should be "hard-coded" into the AI architect's base logic.

| Principle | Observed In | Implementation | Prompt Implication |
| :---- | :---- | :---- | :---- |
| **The Container Rule** | Garage, Eye Candy, Buttermilk | Logos are rarely floating; they are anchored in shapes (badges, circles, lozenges). | ...contained in a geometric vector shape... |
| **Texture is Premium** | Garage, Gander, Honor | High-end work avoids "perfect" digital color; it adds grain/noise. | ...subtle grain texture, matte paper finish... |
| **The 3-Color Limit** | All Studios | Strong identities typically rely on 2 main colors \+ 1 accent. | ...limited color palette of \[Color A\] and with \[Color C\] accents... |
| **Vector-First** | SmashBrand, Buttermilk, Duck | Regardless of style, the underlying structure is clean geometry. | ...clean vector lines, svg style... |
| **Type-Image Fusion** | Gander, Buttermilk | Illustration and text interact (overlap, intertwine). | ...typography integrated with illustration, text interacting with graphical elements... |
| **Strategic White Space** | SmashBrand, Honor | Space is used to signal either "Luxury" (Honor) or "Clarity" (SmashBrand). | ...generous negative space, minimalist composition... |

#### **2.2 Differentiating Approaches**

**Dimension 1: Illustration Integration**

* **\[Heavy\] Narrative-Driven:** *Gander, Buttermilk, Garage*. These studios use illustration as the primary brand vehicle.
* **\[Moderate\] Accent-Driven:** *Hardy, Happyland*. Illustration supports the logo but doesn't dominate.
* **\[Minimal\] Type/Photo-Driven:** *SmashBrand, Honor, Designity*. Focus is on typography, photography, or data hierarchy.

**Dimension 2: Typography Approach**

* **\[Hand-Lettered/Custom\]:** *Garage* (Imperfect, gritty), *Gander* (Wonky).
* **:** *SmashBrand* (Helvetica/Sans-heavy), *Duck.Design*.
* **:** *Honor* (High-fashion).

**Dimension 3: CPG Specifics**

* **Food & Beverage (Gander/Buttermilk):** High saturation, character mascots, matte finishes, soft geometry.
* **Health/Supplements (SmashBrand):** White space, clinical sans-serifs, metallic accents, rigid hierarchy.
* **Alcohol (Eye Candy/Hardy):** Tactile textures, intricate linework, copper/gold foils, dark backgrounds.

### ---

**4\. Deliverable 3: Visual Vocabulary Extraction**

#### **3.1 Color Vocabulary**

**Palette Types:**

* **Monochromatic:** Single hue with variations in lightness/saturation. *Use for:* Tech/SaaS (Evyo) to signal focus.
* **Complementary:** Opposing colors (e.g., Teal/Orange). *Use for:* CPG Shelf Pop (Buttermilk).
* **Neutral-plus-Accent:** Greys/Beiges with one neon pop. *Use for:* Industrial/Authentic (Garage).

**Color Personality Mapping:**

| Color Family | Associated Qualities | Industry Affinities | Prompt Language |
| :---- | :---- | :---- | :---- |
| **Electric Pastels** | Disruptive, Gen Z, Playful | DTC CPG (Gander) | "electric pastel palette, dopamine colors" |
| **Earth Tones** | Authentic, Rugged, Craft | Coffee, Maker (Garage) | "warm earth tones, burnt sienna, kraft paper" |
| **Clinical White** | Trust, Efficacy, Clean | Laundry, Med (SmashBrand) | "clinical white, high key lighting, fresh cyan" |
| **Deep Jewel** | Premium, Heritage, Luxury | Spirits (Eye Candy) | "deep emerald, midnight blue, gold foil" |

#### **3.2 Typography Vocabulary**

**Type Personality Descriptors:**

* **"Wonky":** Imperfect, melting, flared serifs. (Gander). Prompt: wonky soft serif, 70s retro type.
* **"Gritty":** Textured, eroded edges. (Garage). Prompt: gritty hand-drawn sans, stamped ink texture.
* **"Editorial":** High contrast, thin hairlines. (Honor). Prompt: high-contrast fashion serif, elegant.
* **"Utilitarian":** Geometric, monoline. (SmashBrand). Prompt: bold geometric sans-serif, medical grade type.

#### **3.4 Illustration Vocabulary**

**Style Categories:**

* **Naive Marker:** Whiteboard style, thick lines. (Gander).
* **Technical Etching:** Vintage patent style. (Garage).
* **Flat Mascot:** Vector character, no gradients. (Buttermilk).
* **Corporate Memphis:** Flat human figures, exaggerated limbs. (Duck).

### ---

**5\. Deliverable 4: Prompt Reconstruction Library**

#### **1\. Garage Design Studio — First Place Coffee**

* **Logo Type:** Emblem.
* **Visual Description:** Diamond badge with winged coffee drip.
* **Midjourney Prompt:** logo design for a coffee brand, vintage industrial garage aesthetic, typography: "FIRST PLACE" in hand-drawn gritty sans-serif, enclosed in a rough diamond badge shape, icon: a stylized line-art coffee drip with wings, textures: rubber stamp ink bleed, unbleached kraft paper background, color palette: burnt orange and charcoal grey, rugged, authentic, masculine design \--v 6.0

#### **2\. Gander — Graza Olive Oil**

* **Logo Type:** Wordmark.
* **Visual Description:** Green marker text on cream plastic.
* **Midjourney Prompt:** packaging design for olive oil squeeze bottle, style by Gander, typography: "GRAZA" in bold hand-drawn green marker font, illustration: simple naive line art of an olive tree, palette: dark forest green and cream, matte plastic texture, playful, casual, chef-grade utility aesthetic, minimalist \--v 6.0

#### **3\. Buttermilk Creative — Oats in Coats**

* **Logo Type:** Mascot/Logomark.
* **Visual Description:** Oat grain wearing a raincoat.
* **Midjourney Prompt:** packaging design for oatmeal brand, style of Buttermilk Creative, vibrant red pouch, central mascot: a cute anthropomorphic oat grain wearing a yellow raincoat, whimsical vector illustration, chunky soft serif typography, playful, kid-friendly, flat color style \--v 6.0

#### **4\. SmashBrand — Earth Breeze**

* **Logo Type:** Wordmark/System.
* **Visual Description:** Clean white eco-envelope with bold text.
* **Midjourney Prompt:** product packaging design for eco-friendly laundry sheets, style by SmashBrand, clean white paper envelope, massive bold sans-serif text "PLASTIC FREE", high contrast visual hierarchy, visual: a simple vector earth icon, color palette: clinical white and fresh cyan, bright retail lighting, photorealistic 3D render, conversion optimized \--v 6.0

#### **5\. Honor Creative — Rustler Hat Co.**

* **Logo Type:** Editorial Logotype.
* **Visual Description:** High-contrast serif on leather tones.
* **Midjourney Prompt:** logo design for a custom hat maker, style by Honor Creative, "RUSTLER" in high-contrast editorial serif typography, wide letter spacing (tracking), symbol: a minimal branding iron mark, palette: saddle brown and cream, texture: subtle leather grain, elegant, timeless, nashville boutique aesthetic \--v 6.0

#### **6\. Eye Candy — Steamrail Brews**

* **Logo Type:** Badge.
* **Visual Description:** Copper foil steampunk train.
* **Midjourney Prompt:** beer label design, style of Eye Candy Design, steampunk aesthetic, intricate copper foil illustration of a steam train, victorian typography, deep blue and copper palette, metallic finish, premium craft beer branding \--v 6.0

#### **7\. Happyland Creative — Nashville Sweets**

* **Logo Type:** Script Wordmark.
* **Visual Description:** Custom pink script on patterned background.
* **Midjourney Prompt:** logo design for a boutique bakery, style of Happyland Creative, custom feminine script typography "Nashville Sweets", playful and vibrant, palette: millennial pink and teal, background: seamless confetti pattern, fun, approachable, girl boss aesthetic \--v 6.0

#### **8\. Hardy Brands — Genuine Ice Cream**

* **Logo Type:** Illustrated Wordmark.
* **Visual Description:** Slab serif with painterly bear illustration.
* **Midjourney Prompt:** ice cream pint packaging, style of Hardy Brands, modern western aesthetic, typography: bold slab serif, illustration: painterly style bear eating berries, palette: warm cream and berry red, rustic, montana summer vibe, high quality \--v 6.0

#### **9\. Evyo Studio — Plankk**

* **Logo Type:** App Icon / Wordmark.
* **Visual Description:** Neon blue on dark mode background.
* **Midjourney Prompt:** app icon design for fitness brand, style of Evyo Studio, dark mode aesthetic, neon blue gradient, glassmorphism texture, rounded corners, clean sans-serif typography, modern tech UI feel \--v 6.0

#### **10\. Garage Design Studio — Lost & Found**

* **Logo Type:** Ligature Wordmark.
* **Visual Description:** Intertwined serif letters.
* **Midjourney Prompt:** logo design for artisan maker, style of Garage Design Studio, custom serif typography with complex ligatures connecting letters, wordmark "Lost & Found", texture: gold foil stamp on dark brown leather, elegant but rugged, vintage craftsmanship aesthetic \--v 6.0

#### **11\. Gander — Magic Spoon**

* **Logo Type:** Warped Wordmark.
* **Visual Description:** Psychedelic purple/teal character art.
* **Midjourney Prompt:** cereal box design, style of Gander, psychedelic saturday morning cartoon aesthetic, surreal vector illustration of a wizard, typography: "Magic Spoon" in warped 70s serif font, vibrant purple and teal color palette, grainy texture shading, playful, nostalgic \--v 6.0

#### **12\. Buttermilk Creative — Eureka Tortilla**

* **Logo Type:** Content Band Layout.
* **Visual Description:** Color-coded band on transparent pack.
* **Midjourney Prompt:** tortilla packaging design, style of Buttermilk Creative, clear plastic pack with broad color-coded content band in pastel green, bold whimsical typography, ingredient pattern background, shelf-pop aesthetic \--v 6.0

#### **13\. SmashBrand — Groove Life**

* **Logo Type:** Kinetic Wordmark.
* **Visual Description:** Dynamic angular text for activewear.
* **Midjourney Prompt:** packaging for activewear ring, style of SmashBrand, dark grey and neon orange palette, bold angular sans-serif typography, dynamic composition, masculine, adventure-ready aesthetic, high contrast retail box \--v 6.0

#### **14\. Eye Candy — Original Spirit Co.**

* **Logo Type:** Ornamental Label.
* **Visual Description:** Gin label with botanical etching.
* **Midjourney Prompt:** gin bottle label design, style of Eye Candy Design, botanical illustration of juniper berries, intricate etching style, typography: ornamental serif, palette: sage green and silver foil, luxury textured paper, premium spirits branding \--v 6.0

#### **15\. Designity — Mimo Health**

* **Logo Type:** Abstract Tech Mark.
* **Visual Description:** Gradient isometric shape.
* **Midjourney Prompt:** logo design for health tech startup, style of Designity, abstract isometric vector shape, blue to purple gradient, clean modern sans-serif typography, corporate memphis aesthetic, minimalist, approachable tech \--v 6.0

### ---

**6\. Deliverable 5: Studio Style Cards**

#### **Style Card:**

* **Signature:** Industrial, Gritty, Badge-heavy.
* **Color:** Earth tones, Charcoal, Rust.
* **Type:** Hand-drawn Sans \+ Utilitarian.
* **Prompt Fragment:** ...in the style of Garage Design Studio, gritty industrial badge aesthetic, hand-lettered typography with ink bleed textures, unbleached kraft paper...

#### **Style Card:**

* **Signature:** Vibrant, Mascot-driven, CPG-focused.
* **Color:** Electric Pastels, High Saturation.
* **Type:** Chunky Soft Serif.
* **Prompt Fragment:** ...in the style of Buttermilk Creative, vibrant CPG packaging, playful vector mascot, chunky soft serif typography, flat color illustration...

#### **Style Card:**

* **Signature:** Wonky, Naive, Disruptive.
* **Color:** Acid Green, Purple, Cream.
* **Type:** Warped Retro Serif, Marker Hand.
* **Prompt Fragment:** ...in the style of Gander branding, playful naive vector illustration, wonky retro typography, vibrant electric pastel palette, matte finish...

#### **Style Card:**

* **Signature:** Premium, Metallic, Heritage.
* **Color:** Deep Jewel tones, Gold/Copper Foil.
* **Type:** Ornamental Display Serif.
* **Prompt Fragment:** ...in the style of Eye Candy Design, premium heritage packaging, intricate foil stamping, ornamental typography, deep rich color palette...

#### **Style Card:**

* **Signature:** Data-driven, Clean, Hierarchical.
* **Color:** Clinical White, High Contrast.
* **Type:** Bold Geometric Sans.
* **Prompt Fragment:** ...in the style of SmashBrand, conversion-optimized retail packaging, massive bold sans-serif typography, clean white space, benefit hierarchy...

#### **Style Card:**

* **Signature:** Editorial, Restrained, Luxury.
* **Color:** Neutral, Saddle Leather, Oak.
* **Type:** High-Contrast Fashion Serif.
* **Prompt Fragment:** ...in the style of Honor Creative, luxury editorial branding, high-contrast serif typography, wide letter spacing, neutral earth tone palette...

#### **Style Card:**

* **Signature:** Modern Western, Pastoral.
* **Color:** Warm Rustic, Berry, Cream.
* **Type:** Slab Serif.
* **Prompt Fragment:** ...in the style of Hardy Brands, modern western aesthetic, slab serif typography, painterly nature illustration, rustic mountain vibes...

#### **Style Card:**

* **Signature:** Feminine, Patterned, Script.
* **Color:** Millennial Pink, Teal, Orange.
* **Type:** Custom Script \+ Serif.
* **Prompt Fragment:** ...in the style of Happyland Creative, playful boutique branding, vibrant color palette, custom script typography, seamless pattern background...

#### **Style Card:**

* **Signature:** Corporate, Isometric, Safe.
* **Color:** Corporate Blue/Purple Gradients.
* **Type:** Clean Google Sans.
* **Prompt Fragment:** ...in the style of Designity, modern corporate branding, isometric vector illustration, gradient color palette, clean sans-serif...

#### **Style Card:**

* **Signature:** Flat, Vector, Scalable.
* **Color:** Primary Colors.
* **Type:** Standard Sans.
* **Prompt Fragment:** ...in the style of Duck.Design, flat vector corporate illustration, corporate memphis style, clean lines, bright primary colors...

#### **Style Card:**

* **Signature:** Dark Mode, Neon, Tech.
* **Color:** Black, Electric Blue.
* **Type:** UI Sans.
* **Prompt Fragment:** ...in the style of Evyo Studio, dark mode SaaS aesthetic, neon gradient glow, glassmorphism, modern tech UI...

#### **Works cited**

1. The Design Plans by Garage Design Studio, accessed January 14, 2026, [https://thedesignplans.com/studio.html](https://thedesignplans.com/studio.html)
2. Salih Küçükağa has always had a curious mind. Born into a family of entrepreneurs, Salih carved out his career early on by attending design school in Melbourne, Australia, and taking on a liking early on to typography and brand design. It was in the sophisticated metropolitan landscape of Melbourne that Salih caught the design bug that he eventually brought to Garage Design Studio. With a nomadic personality and zest for life, Salih's design sensibilities have shaped many brands; from start-up food and beverage companies that have gone on to achieve international recognition to larger corporations that need to be relevant., accessed January 14, 2026, [https://garagedesignstudio.com/studio](https://garagedesignstudio.com/studio)
3. Garage Studio & Design \- Your solution for garage space organization, accessed January 14, 2026, [https://garagestudiodesign.com/](https://garagestudiodesign.com/)
4. Garage Design Studio / Branding & Packaging Design, accessed January 14, 2026, [https://garagedesignstudio.com/](https://garagedesignstudio.com/)
5. Lost & Found Branding & Packaging \- Dribbble, accessed January 14, 2026, [https://dribbble.com/shots/14461879-Lost-Found-Branding-Packaging](https://dribbble.com/shots/14461879-Lost-Found-Branding-Packaging)
6. First Place Coffee by Garage Design Studio on Dribbble, accessed January 14, 2026, [https://dribbble.com/shots/2695269-First-Place-Coffee](https://dribbble.com/shots/2695269-First-Place-Coffee)
7. Garage Design Studio | Dribbble, accessed January 14, 2026, [https://dribbble.com/salihkucukaga?page=2](https://dribbble.com/salihkucukaga?page=2)
8. Garage Design Studio / Projects / First Place Coffee \- Dribbble, accessed January 14, 2026, [https://dribbble.com/salihkucukaga/projects/617457-First-Place-Coffee](https://dribbble.com/salihkucukaga/projects/617457-First-Place-Coffee)
9. Lost & Found Pantry Provisions \- Garage Design Studio, accessed January 14, 2026, [https://garagedesignstudio.com/lost-found](https://garagedesignstudio.com/lost-found)
10. Interact | Nombase CPG Company Database, accessed January 14, 2026, [https://www.nombase.com/companies/interact-](https://www.nombase.com/companies/interact-)
11. Buttermilk Creative, accessed January 14, 2026, [https://buttermilkcreative.com/](https://buttermilkcreative.com/)
12. Best CPG Packaging and Website Designers \- Julee Ho Media, accessed January 14, 2026, [https://juleeho.com/best-cpg-designers](https://juleeho.com/best-cpg-designers)
13. My Better Batch | Discover Easy Baking Solutions \- Buttermilk Creative, accessed January 14, 2026, [https://buttermilkcreative.com/buttermilk-work/mybetterbatch](https://buttermilkcreative.com/buttermilk-work/mybetterbatch)
14. Jury \- International Creative Awards, accessed January 14, 2026, [https://www.creativeawards.international/judges/](https://www.creativeawards.international/judges/)
15. Careers \- Gander, accessed January 14, 2026, [https://takeagander.com/careers](https://takeagander.com/careers)
16. DESIGN IS A LOT LIKE MAGIC: WITH GANDER \- YouTube, accessed January 14, 2026, [https://www.youtube.com/watch?v=ldtYm0rs28M](https://www.youtube.com/watch?v=ldtYm0rs28M)
17. Graza Olive Oil by Gander – BP\&O, accessed January 14, 2026, [https://bpando.org/2023/04/06/squeezable-olive-oil-branding-packaging/](https://bpando.org/2023/04/06/squeezable-olive-oil-branding-packaging/)
18. Work \- Gander, accessed January 14, 2026, [https://takeagander.com/work](https://takeagander.com/work)
19. Inside the rebrand with Gander \- Pop Up Grocer, accessed January 14, 2026, [https://popupgrocer.com/blogs/shelf-talk/inside-the-rebrand-designing-for-timelessness-with-gander](https://popupgrocer.com/blogs/shelf-talk/inside-the-rebrand-designing-for-timelessness-with-gander)
20. Eye Candy Melbourne | Branding, Logo Design & Digital Web ..., accessed January 14, 2026, [https://www.eyecandydesign.com.au/](https://www.eyecandydesign.com.au/)
21. About \- Eyecandy, accessed January 14, 2026, [https://eyecandyportfolio.com/about/](https://eyecandyportfolio.com/about/)
22. CPG Packaging Experience: How To Create a Memorable Design. \- SmashBrand, accessed January 14, 2026, [https://www.smashbrand.com/articles/cpg-packaging-experience/](https://www.smashbrand.com/articles/cpg-packaging-experience/)
23. Understanding Package Design Testing for CPG Brands \- SmashBrand, accessed January 14, 2026, [https://www.smashbrand.com/articles/understanding-package-design-testing-for-cpg-brands/](https://www.smashbrand.com/articles/understanding-package-design-testing-for-cpg-brands/)
24. How Smart Laundry Packaging Design Drives Shelf Performance. \- SmashBrand, accessed January 14, 2026, [https://www.smashbrand.com/articles/laundry-packaging-design/](https://www.smashbrand.com/articles/laundry-packaging-design/)
25. The Strategic Use of White Space in Packaging Design. \- SmashBrand, accessed January 14, 2026, [https://www.smashbrand.com/articles/white-space-in-packaging-design/](https://www.smashbrand.com/articles/white-space-in-packaging-design/)
26. Earth Breeze Packaging Design Case Study I SmashBrand, accessed January 14, 2026, [https://www.smashbrand.com/work/earth-breeze/](https://www.smashbrand.com/work/earth-breeze/)
27. Creative Services \- Designity, accessed January 14, 2026, [https://www.designity.com/services](https://www.designity.com/services)
28. Design Subscription \- Duck Design, accessed January 14, 2026, [https://duck.design/design-subscription/](https://duck.design/design-subscription/)
29. Evo Design Studio, accessed January 14, 2026, [https://evodesign.studio/](https://evodesign.studio/)
30. Happyland Creative: Boutique Creative Agency, accessed January 14, 2026, [https://www.happylandcreative.com/](https://www.happylandcreative.com/)
31. Honor Creative: Nashville, Tennessee Creative Design Studio, accessed January 14, 2026, [https://honorcreative.com/](https://honorcreative.com/)
32. The Branding Chronicles: Rustler Hat Co. | Showit Blog \- Honor Creative, accessed January 14, 2026, [https://honorcreative.com/the-branding-chronicles-rustler-hat-co/](https://honorcreative.com/the-branding-chronicles-rustler-hat-co/)
33. Hardy Brands: Marketing and Branding Agency, accessed January 14, 2026, [https://www.hardybrands.com/](https://www.hardybrands.com/)
