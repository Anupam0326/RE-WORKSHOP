---
name: Re Workshop
description: Organic food store and open-kitchen millet café in Jabalpur; soil to plate.
colors:
  forest: "#11221a"
  forest-raised: "#1a3125"
  forest-hover: "#24402f"
  lime: "#cfe89d"
  lime-hover: "#bedd7e"
  lime-soft: "#eef5dc"
  mist: "#f5f8ec"
  paper: "#ffffff"
  sand: "#f2efeb"
  ink: "#141714"
  ink-body: "#5a605b"
  ink-quiet: "#7f8881"
  olive-dim: "#3b4a2c"
  whatsapp: "#1fae55"
typography:
  display:
    fontFamily: "Inter Tight, Inter, system-ui, sans-serif"
    fontSize: "clamp(2.9rem, 1.1rem + 5.4vw, 5.75rem)"
    fontWeight: 700
    lineHeight: 0.94
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Inter Tight, Inter, system-ui, sans-serif"
    fontSize: "clamp(2rem, 1.35rem + 2.9vw, 3.5rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Inter Tight, Inter, system-ui, sans-serif"
    fontSize: "clamp(1.3rem, 1.15rem + 0.6vw, 1.6rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.03em"
  lead:
    fontFamily: "Inter Tight, Inter, system-ui, sans-serif"
    fontSize: "clamp(1.1rem, 1rem + 0.45vw, 1.35rem)"
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  sm: "10px"
  md: "14px"
  lg: "22px"
  pill: "999px"
spacing:
  gutter-phone: "16px"
  gutter-tablet: "24px"
  gutter-desktop: "32px"
  section: "clamp(72px, 10vw, 128px)"
components:
  button-dark:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.paper}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "50px"
  button-dark-hover:
    backgroundColor: "{colors.forest-hover}"
  button-lime:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.forest}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "50px"
  button-lime-hover:
    backgroundColor: "{colors.lime-hover}"
  button-ghost:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.forest}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "50px"
  menu-board:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.lime}"
    rounded: "{rounded.lg}"
    padding: "clamp(20px, 3vw, 40px) clamp(18px, 3.2vw, 44px)"
  nav-pill:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.paper}"
    rounded: "16px"
    height: "60px"
  shelf-pill:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "40px"
---

# Design System: Re Workshop

## Overview

**Creative North Star: "The open-kitchen menu board"**

Re Workshop is a store and a café in one room, so the system is built from two materials of that room: a pale field (mist, with a faint grain of soil noise) and dark forest slabs that carry lime lettering, the way a chalk menu board hangs over a counter. Pages open on the pale field with a two-tone promise in forest ink, then hand the eye to one dark slab. Everything else is quiet: white product cards, hairline rules, dashed band edges.

Density is low and reading-led. Each page does one job (home: who we are and the two doors; Café; Our story; Shop), and each section holds one idea. Motion is rare and authored: the menu board's lines are written in once on the home page; on Our story the visitor's scroll walks the seven-step arc (a glowing seed travels the band; the one authored scroll moment on the site) and the grain tracker replays its dig when a new grain is picked; elsewhere content simply fades in as it arrives. Nothing plays with reduced motion. Imagery is the client's own photography: phone photos of the café, the shelves, the shop front and, from the farm, seed work only (sowing, tilled soil, grain and oilseed crops, the harvest; never vegetables), bundled in client/public/site/, and the studio product shots. **One Photo, One Place:** no site photo appears twice anywhere on the site; each slot is shown in one place and no photo is the default of two slots. Product packshots are the one exception (a product's photo on its card and its page; the gallery's thumbnail strip). Founder portraits are the client's own (all three since 26 Oct 2026). Any slot still without a real photo (the consultation card's photo of Dr. Swati) shows the Re seal or a monogram in a dashed frame, never stock or generated images.

The client copy rules are part of the visual system: no italics anywhere, no all-caps labels, no em or en dashes in visible copy, sentence case, no decorative numbering.

**Key Characteristics:**
- Pale mist field plus one dark forest slab per view; lime only on forest or as an action.
- Inter Tight display at tight tracking, Figtree for everything you read.
- Two-tone headings: a quiet line, then the main line.
- Equal doors: the café and the store always get the same button treatment.
- Grids always end on a full row (3 desktop, 2 tablet, 1 phone).
- Photo slots are honest: a placeholder until a real photo exists.

## Colors

A two-material palette: forest and lime for the board, mist and white for the room around it.

### Primary
- **Forest** (#11221a): the dark slab. Menu board, navigation pill, dark panels, the footer, primary buttons, and strong headline ink on light grounds.
- **Lime** (#cfe89d): lettering and highlights on forest (menu dishes, board titles, the active nav item, "Zero"), and the one lime action on a dark panel. Never body text on white.

### Neutral
- **Mist** (#f5f8ec): the pale field. Page intros, the home hero, the "today" band, photo placeholders.
- **Paper** (#ffffff): the page body behind products and long reading.
- **Ink** (#141714): headings and primary text on light grounds.
- **Body ink** (#5a605b): paragraphs on white or mist (6.4:1 on white).
- **Quiet ink** (#7f8881): the first, muted half of two-tone headlines; large text only (3.4:1 on mist, 3.7:1 on white; never lighter).
- **Olive dim** (#3b4a2c): the quiet line of a heading on the mist field, and unlit words on forest.
- **Sand** (#f2efeb): badge fills.
- **WhatsApp green** (#1fae55): WhatsApp actions only.

### Named Rules
**The Board Rule.** Lime lettering lives on forest. On light grounds lime may only fill an action or a highlight, never carry text.

**The One Slab Rule.** A view holds one dominant dark slab (the board, a dark panel, the footer). Two dark slabs back to back read as a wall, not a board: put a light section between them, or use the mist panel (dashed edge, grain) for the second one.

## Typography

**Display Font:** Inter Tight (with Inter, system-ui)
**Body Font:** Figtree (with system-ui)

**Character:** A compressed, confident grotesque for anything announced, paired with a rounded, friendly sans for anything read. Tight tracking on display, never below -0.04em.

### Hierarchy
- **Display** (700, clamp(2.9rem → 5.75rem), 0.94): the home promise "We restore life." and page intro headings (up to 4.5rem). Never above 6rem.
- **Headline** (600, clamp(2rem → 3.5rem), 1.05): section headings, often two-tone.
- **Title** (600, about 1.3 to 2.05rem): menu dishes, founder names, step names, card titles.
- **Lead** (500, clamp(1.1rem → 1.35rem), 1.35 to 1.4): the line under a heading that says what the page is.
- **Body** (400, 1rem to 1.0625rem, 1.6 to 1.75): paragraphs, 52 to 64ch.
- **Label** (500 to 600, 0.875 to 0.9375rem): grain tags on the board, roles, counts, captions. Sentence case, never letter-spaced capitals.

### Named Rules
**The Two-Tone Rule.** A heading may have a quiet first line (quiet ink or olive dim) and a main line (forest or ink). One quiet line, never more.

**The No-Italic Rule.** Emphasis comes from weight, size or the two-tone split. Italics are reset site-wide.

## Layout

Content sits in a 1200px column with a 16 / 24 / 32px gutter (phone / tablet / desktop). Sections breathe at clamp(72px, 10vw, 128px). Page intros and the home hero clear the floating nav with about 100 to 130px of top padding.

Intros split from 1024px into a heading column (about 60%) and a side column (what the page is, then its actions), with one wide photo below (4:3 on phones, 21:8 on desktop). The home stage puts the menu board beside a portrait photo slot (about 24vw, 260 to 340px). The menu board lists dishes in one column on phones and two from 720px.

**The Full Row Rule.** Every grid ends on a full row: 3 per row on desktop, 2 on tablets, 1 on phones (product grids: 2 on phones). When real items don't fill a row, add a useful closing tile, never a fake item. A plain list (the seven steps) is the answer when a count can't fill rows.

## Elevation & Depth

Mostly flat, with depth reserved for the dark slabs. Light surfaces are separated by hairlines (rgba(17, 34, 26, 0.12)) and dashed band edges, not shadows.

### Shadow Vocabulary
- **Slab** (`box-shadow: 0 2px 2px rgba(17,34,26,.12), 0 24px 48px -24px rgba(17,34,26,.55)`): the menu board.
- **Panel** (`box-shadow: 0 18px 50px rgba(17,34,26,.22)`): dark panels (No-Compromise Code, shop CTA panels, the dig).
- Buttons on the pale field (the hero doors, intro actions) are flat.

### Named Rules
**The Light Is Flat Rule.** Nothing on mist or white carries a shadow except a dark slab, and one named exception: **the Mounted Photo**, the small photo laid over a spread's large one, which carries a soft drop shadow so it reads as a print set on top.

## Shapes

Softly rounded rectangles: 22px on slabs, panels and photos, 14px on cards and founder portraits, 10px on buttons, 999px on shelf pills. One organic exception: the No-Compromise panel and the Re card keep a single 96px leaf corner. Photo placeholders and empty portrait slots use a 1px dashed frame so they read as slots, not as content.

## Components

### Buttons
- **Shape:** gently rounded (10px), 50px tall (54px for the hero doors), icon left of the label.
- **Dark:** forest with white text; the default for doors and page actions. Hover lifts to forest-hover (#24402f).
- **Lime:** lime with forest text; the one action on a dark panel.
- **Ghost:** white with a forest hairline border; secondary actions such as Call.
- **Focus:** a 2px green outline, offset 3px (lime on forest).

### Navigation
- A floating forest pill (60px, 16px radius) with the Re mark, five items (Shop, Café, Our story, Track your grain, Visit us), one lime action ("Free consultation"), and admin + basket icons. The current page is lit lime. Links show from 860px; below that a full-screen forest menu sheet lists the same five at 1.85rem with the basket and a call button.

### Menu board (signature)
- The forest slab with grain. The title in lime at up to 2.25rem; the location link top right.
- Each dish in lime display type, a dotted leader, and the grain at right where a board would print a price. Since 22 Oct 2026 the eight dishes are real menu items (data/cafeMenu.ts), short names chosen to fit a line or two, each tagged with every grain its menu name or description states.
- One foot line with a lime underlined link (5px offset) to the full menu (/cafe#menu). Lines are written in once (clip from left, 90ms stagger); static with reduced motion. No interaction.

### Free consultation (home, second section)
- A lime-soft band with grain right under the hero (dashed lower edge), so it is the first thing after the menu board. Left: a two-tone heading ("Free consultation" strong, "on reversal of lifestyle issues." quiet), her story as a lead line, and the safety note right under it in a soft white box with an info icon (the story never shows without the note). Right: one white card (hairline, no shadow): who (round avatar: her consultation photo when uploaded, else the Re seal on forest), her qualifications with lime check badges, the exact first message as a lime chat bubble on mist ("WhatsApp opens with this message"), and the forest button "Chat with Dr. Swati on WhatsApp" to her own number.
- Reached from everywhere: the lime "Free consultation" button in the navigation ("Free consult" below 1100px; on phones the admin icon moves into the menu sheet to make room), a lime button at the top of the phone menu sheet, and a lime-soft link on her card on Our story.

### Café menu book (Café page)
- Header: a two-tone heading and the section tabs as pills (wrapping on wider screens, a sideways rail on phones). A tab opens the page where its section starts.
- A compact row of six of the café's own dish photos (6 across from 860px, 3 by 2 on phones), name and price under each; a photo opens the page with that dish and lights the dish up (lime wash, 2.6s). These are the only place the dish photos appear, so the book has no thumbnails.
- The book: the forest slab with the board title, then pages of one fixed height (about the screen height minus the header, 380 to 640px), so it never jumps. From 1024px an open two-page spread: two framed pages meeting at a lime hairline spine with a soft inner shadow, page numbers in the outer corners. Below 1024px one page; below 640px the page is the board itself (no inner frame) and the arrows move under it, either side of the page count.
- Round arrows either side (52px; next is lime), the keyboard arrows when the book has focus, and a sideways swipe on touch. A turn swings the new page in from the spine side (420ms; nothing with reduced motion).
- Pages are filled by measuring every dish at the real page width; a section that runs over carries on as "Section, continued" in a smaller lime heading; a section never starts with a lone dish at the foot of a page.
- Inside: section titles in lime with a hairline, dish names in mist, prices in lime with tabular figures and a dotted leader, descriptions in quieter mist.
- "See every dish at once" (under the book) swaps it for the whole menu in two columns, for scanning, find-in-page and screen readers. Data only from data/cafeMenu.ts. No dietary badges, nutrition or descriptions the menu doesn't give.

### Journey arc (Our story)
- The seven steps (Soil to Health) on a half circle: white icon tiles on a pale field, a forest band with a faint lime track, the step text in the centre (under the arc on phones).
- Scroll-driven (26 Oct 2026): the arc pins under the navigation while the page scrolls one screen plus six step-lengths (40svh each). Scroll position drives everything, no timer: a glowing lime seed travels the band from Soil to Health drawing a lime trail; each step ignites as the seed reaches it (forest tile, lime ring burst, lime label) and stays lit behind it; the glow behind the arc warms from faint to full lime like a sunrise; the centre text rises in at each step. A "1 / 7" counter between the arrows; arrows and step tiles scroll the page to that step. "Scroll to walk from soil to health" shows until the seed moves.
- Arrival: the arc rises into place (1s, expo ease-out), then the seven tiles appear one by one around it (90ms apart). The seed's halo breathes only while the arc is on screen.
- Reduced motion: no pinning, no travel, no arrival; arrows and tiles change the step instantly.

### Track your grain (Our story)
- The dig, per grain: a select of every grain and dal on the shelves, then forest layers getting darker downward (On our shelf, Mill, Harvest when known, Farm, Seed).
- Two tags keep truth visible: lime "This grain" for facts recorded in /admin or printed on the label; outline "How we work" for the brief's general method. A grain without recorded facts says so in a note under the pack.
- Picking a grain replays the dig: layers blur-rise in one after another (140ms apart), nodes pop, the dotted line draws down.

### Spread (home)
- Two columns from 1024px: words (5 parts) and media (7 parts), swapping sides from one spread to the next; stacked on phones.
- Words: the headline (brief copy, no label in front of it), a lead line in display type, one paragraph, one dark button: one way out.
- Media: one large 4:3 photo (22px radius) with a smaller square photo mounted over its outer bottom corner (6px border in the ground colour, soft drop shadow). The large photo carries its caption as a forest chip, bottom left.
- Full-bleed variant (the farm): the photo runs edge to edge (21:8 on desktop), the words sit under it, the mounted photo overlaps its lower edge. Use it once per page, for the change of scale.
- Alternates paper and mist grounds; a mist spread gets dashed top and bottom edges.

### Pick a grain row (home)
- The millets in their white studio bowls on the page itself: 6 in one row on desktop, 3 on tablets, 2 on phones. Name, then a lime-underlined "Track it". The bowl lifts and tilts on hover. Opens the grain tracker on Our story at that grain.

### Name panel (home)
- Forest slab with the faint Re seal: the name heading, a 6rem lime "Re" beside the five Re- lines (lime "Re" prefix, hairline rules), the workshop line, a light text link.

### Page intro
- Mist field, two-tone heading, a lead line plus body copy and actions in the side column, one wide photo slot with a forest caption chip once a real photo exists.

### Founder card
- A square portrait slot (monogram in a dashed mist frame until uploaded), name, role, credentials as lime-soft chips, the lead line, then the bio (Our story). The compact home version has no portrait (the portraits live on Our story only) and stops after the lead line.

### Mist panel
- The light counterpart of the dark panel: mist with grain, a 1px dashed edge, forest text and a dark button. Used when a page already has its dark slab (the café page's "The Organic Grocery Store" panel).

### Product card
- White card, 14px radius, hairline border, studio photo on white, shelf name, product name, short note, price and pack, and a lime add button.

## Do's and Don'ts

### Do:
- **Do** put lime lettering only on forest, and keep one dark slab per view.
- **Do** give the café and the store the same button treatment wherever both appear.
- **Do** end every grid on a full row (3 / 2 / 1).
- **Do** use a dashed placeholder for any photo the client hasn't supplied, and replace it from /admin → Site photos.
- **Do** keep display tracking at or above -0.04em and display size at or below 6rem.

### Don't:
- **Don't** use italics, all-caps letter-spaced labels, em or en dashes in visible copy, or decorative numbering.
- **Don't** put products, prices or buy buttons on the home first screen.
- **Don't** use stock or AI-generated photos of the farm, café, store or founders.
- **Don't** repeat the "zero maida" statement more than once on a page.
- **Don't** add a colored side stripe (border-left over 1px) or animate padding.
