# Re Workshop Frontend Design Direction

## Three stylistic approaches

### Theme Name: Seed Archive Editorial

Very Brief Intro: A warm, tactile editorial system that treats ingredients as cultural artefacts: ivory paper space, deep green panels, ochre details, documentary photography, and deliberate print-like framing. It makes the catalogue feel trusted and collected rather than mass-market.

Probability: 0.07

### Theme Name: Courtyard Harvest

Very Brief Intro: A sunlit, material-led café direction with clay, linen, hand-painted marks, and a more relaxed rhythm. It would foreground the in-person tasting experience and make the site feel like a small, welcoming place in Jabalpur.

Probability: 0.04

### Theme Name: Field Notes Commerce

Very Brief Intro: A restrained, high-contrast retail interface that uses compact product data, archival labels, and botanical diagrams to make browsing efficient while still feeling rooted in farming and provenance.

Probability: 0.09

## Selected approach: Seed Archive Editorial

### Design Movement

Contemporary editorial naturalism, informed by independent food journals, archival seed catalogues, and premium direct-to-consumer food packaging.

### Core Principles

1. **Provenance before promotion.** The site should explain where food comes from before asking visitors to buy it.
2. **Tactile restraint.** Use ivory space, paper-like surfaces, fine borders, and natural imagery instead of loud gradients or generic commerce gloss.
3. **Product-led storytelling.** Every story section should lead naturally into a category, a product, or a visit to taste the ingredients.
4. **Mobile clarity.** On a phone, the eye should always know what to read, what to tap, and where the basket lives.

### Color Philosophy

Forest green carries trust, cultivation, and the grounded structure of the store. Warm ivory keeps the page calm and legible on mobile. Muted ochre introduces the warmth of grain, jaggery, brass, and sunlight without turning the brand rustic or decorative. Soft sage transitions connect sections like a field margin between editorial spreads.

### Layout Paradigm

Use a vertical editorial route with offset visual blocks, dark full-bleed panels, horizontal category rails, and carefully framed product collections. Avoid a centred stack of identical cards. Use asymmetric image-and-copy pairings on larger screens while allowing mobile to become a deliberate single-column reading sequence.

### Signature Elements

1. Thin archival rule lines with tiny section labels such as `SEED / TABLE / PLACE`.
2. Forest-green rounded panels with subtle inner linework for featured categories and order prompts.
3. Ochre seed-dot details and small circular stamp motifs used sparingly as visual anchors.

### Interaction Philosophy

Interactions should feel like handling a considered object: direct, tactile, and calm. Buttons respond immediately with a small press, drawers enter from the thumb side, filters remain easy to dismiss, and no motion should interrupt reading or shopping.

### Animation

Use 120–240 ms opacity and transform transitions with a strong ease-out. Stagger editorial reveals lightly, avoid animating layout dimensions, and respect `prefers-reduced-motion`. Product-card hover may lift the image subtly on pointer devices, but every action must remain equally usable by touch and keyboard.

### Typography System

Use **DM Serif Display** for short editorial headlines and **Manrope** for navigation, product data, labels, and body copy. Keep display headlines compact, sentence-case, and high-contrast; use uppercase micro-labels with generous tracking only for metadata. Never use Inter as the primary typeface.

### Brand Essence

Re Workshop is Jabalpur’s organic store and heritage café for people who want to taste, understand, and take home food with a deeper seed story. Personality: **grounded, curious, generous**.

### Brand Voice

Headlines should be warm, specific, and slightly reflective. Calls to action should sound like an invitation to discover rather than a pressure tactic. Microcopy should explain the next step plainly.

Example lines:

> Grown from the seeds worth remembering.

> Taste it at the café. Take the ingredient home.

### Wordmark & Logo

Use the client-approved Re Workshop wordmark when supplied. Until then, the generated symbol is a simple seed-and-cycle mark: a bold forest-green seed silhouette crossed by a single flowing line, paired with a text wordmark set in the selected editorial display face. The symbol must also work independently as the favicon and basket/brand accent.

### Signature Brand Color

`#123D2E` — **Workshop Forest**, a deep green with enough warmth to belong to food, soil, and a local store while remaining distinct from generic organic-brand greens.

## Style Decisions

- Keep the storefront light and editorial rather than dark or neon.
- Use the supplied vertical screenshot as a structural reference for visual pacing: compact header, central hero story, rounded dark category panel, spacious transition, and partner/trust content. Translate the structure into Re Workshop’s own brand, content, and imagery.
- Treat the shop as the primary conversion surface; the café is a supporting local discovery experience.
- Do not fabricate reviews, ratings, testimonials, certification claims, or customer-generated content.

