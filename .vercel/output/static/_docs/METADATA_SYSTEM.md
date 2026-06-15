# LIL DEV — METADATA SYSTEM
*Version 1.0 — May 2026*

---

## TONE PRINCIPLES

Every title, description, H1, and alt text should feel:
- **Cinematic** — like the opening of an adventure, not a brochure
- **Emotionally warm** — speaks to both kids and parents
- **Specific** — never vague ("great content for kids")
- **Non-spammy** — keyword-aware but written for humans first
- **Brand-consistent** — the world is curious, joyful, vast, and growing

Write like you're inviting someone into a real world, not advertising a product.

---

## PAGE TITLES — FORMAT

```
[Page Subject] | Lil Dev World — [Brand Benefit]
```

Max 60 characters. Front-load the subject. Brand at the end.

---

## META DESCRIPTIONS — FORMAT

```
[What you'll find here, emotionally framed]. [Who it's for + why it matters]. [Action prompt or curiosity hook].
```

Max 155 characters. No keyword stuffing. Natural language.

---

## PAGE-BY-PAGE METADATA

---

### `/` — Home

**Title**: `Lil Dev World — Adventure. Discovery. Learning.`
*(50 chars — clean, brand-statement format)*

**Meta Description**: `Enter Lil Dev's World — where curiosity leads every adventure. Stories, games, learning, and a universe that grows with your child. Start exploring.`
*(154 chars)*

**H1**: `Welcome to [LilDev Logo]'s World!`
*(Wordmark image inline — already implemented)*

**H2s** (section headings):
- "Pick Your Zone!" (Zones section)
- "Meet Lil Dev!" (Character section)
- "Every Day Is a New Story" (Adventures section)
- "Games Are Coming!" (Play Zone)
- "Science, Tech, Art & Math — Lil Dev Style" (Learn Lab)
- "Create Something Amazing" (Create Space)
- "The Toy Box Is Opening" (Toybox)
- "Built for Curious Kids, Trusted by Parents" (Parents)
- "Join the World" (Newsletter)

**OG Title**: `Lil Dev World — Adventure. Discovery. Learning.`
**OG Description**: `A growing universe of stories, games, and learning for kids ages 3–12. Enter Lil Dev's World.`
**OG Image**: `assets/images/og-cover.jpg` (1200×630 — NEEDS CREATION)
**OG Type**: `website`
**Twitter Card**: `summary_large_image`
**Twitter Title**: `Lil Dev World`
**Twitter Description**: `Where curiosity leads every adventure. Join Lil Dev's growing world.`

---

### `/meet-lil-dev/`

**Title**: `Meet Lil Dev — The Curious Kid Who Never Stops Asking Why`
*(60 chars)*

**Meta Description**: `Lil Dev is a kid with big questions, brave adventures, and a heart full of curiosity. Meet the character at the center of a growing creative universe.`
*(153 chars)*

**H1**: `Meet Lil Dev`

**H2s**:
- "Who Is Lil Dev?"
- "Lil Dev's World"
- "Lil Dev's Companion: Angel"
- "The Heart of Every Adventure"
- "Explore Lil Dev's Universe"

**OG Title**: `Meet Lil Dev — A Curious Kid with a Big World`
**OG Description**: `Lil Dev is the character at the heart of a growing creative universe — stories, learning, and adventures for kids everywhere.`

**Schema type**: `Person` (fictional character) + `BreadcrumbList`

---

### `/the-world/`

**Title**: `The World of Lil Dev — A Neighborhood Full of Stories`
*(55 chars)*

**Meta Description**: `Step inside Lil Dev's neighborhood — a world full of wonder, hidden secrets, and adventures waiting around every corner. Explore the growing universe.`
*(154 chars)*

**H1**: `The World of Lil Dev`

**H2s**:
- "A Neighborhood Built for Discovery"
- "Places in the World"
- "The People and Characters"
- "Hidden Corners & Secret Places"
- "How the World Grows"

**Schema type**: `Place` (fictional setting) + `BreadcrumbList`

---

### `/adventures/`

**Title**: `Lil Dev Adventures — Stories, Books & Animated Series`
*(55 chars)*

**Meta Description**: `Follow Lil Dev through kitchen discoveries, midnight courts, and hidden worlds. Books, animated stories, and interactive adventures for curious kids.`
*(152 chars)*

**H1**: `Lil Dev Adventures`

**H2s**:
- "The Story Slate"
- "Books in the Series"
- "The Animated Universe"
- "Interactive Adventures"
- "What's Coming Next"

**Individual Adventure Page Template**:
- Title: `[Adventure Name] — Lil Dev Adventure | Story [#]`
- Description: `[One-sentence emotional hook]. [Format]. [Age range]. Part of the Lil Dev adventure universe.`
- H1: `[Adventure Name]`
- Schema: `Book` or `TVSeries` or `VideoObject` depending on format

---

### `/characters/`

**Title**: `Lil Dev Characters — The Universe's Growing Roster`
*(51 chars)*

**Meta Description**: `Meet every character in the LilDev universe — from Lil Dev himself to Angel, his loyal dog, and the neighbors who make the world feel alive.`
*(143 chars)*

**H1**: `The Characters of Lil Dev's World`

**Schema type**: `ItemList` of `Person` (fictional) entities

---

### `/angel/`

**Title**: `Angel — Lil Dev's Loyal Dog & Companion Character`
*(51 chars)*

**Meta Description**: `Angel is always by Lil Dev's side — trotting, alert, and ready for the next adventure. Meet the dog at the heart of the LilDev universe.`
*(141 chars)*

**H1**: `Angel — Lil Dev's Dog`

**Schema type**: `Person` (fictional animal character) + `BreadcrumbList`

---

### `/learn/`

**Title**: `Learn Lab — STEAM Learning Through Lil Dev Adventures`
*(55 chars)*

**Meta Description**: `Science, Technology, Engineering, Art, and Math — made joyful through Lil Dev's curiosity. Educational content designed for kids ages 3–12.`
*(142 chars)*

**H1**: `The Lil Dev Learn Lab`

**H2s**:
- "Learning Through Adventure"
- "Science & Discovery"
- "Technology Curiosity"
- "Engineering & Building"
- "Art & Creative Expression"
- "Math in the Real World"

**Schema type**: `EducationalOrganization` + `Course` (for specific learning modules)

---

### `/games/`

**Title**: `Lil Dev Games — Play Zone for Curious Kids`
*(44 chars)*

**Meta Description**: `Puzzles, memory games, and adventures that make learning feel like play. Lil Dev's Play Zone is loading — get ready for the fun.`
*(129 chars)*

**H1**: `The Lil Dev Play Zone`

---

### `/parents/`

**Title**: `Parents — Lil Dev's Mission for Curious Kids`
*(46 chars)*

**Meta Description**: `Lil Dev is built for curious kids and trusted by parents. Learn how our educational universe supports creativity, critical thinking, and joy in learning.`
*(155 chars)*

**H1**: `Built With Parents in Mind`

**H2s**:
- "The Educational Mission"
- "Safety & Values"
- "What Your Child Learns"
- "The World Your Child Enters"
- "Trusted by Families"

**Schema type**: `FAQPage` (answer common parent questions) + `Organization`

---

### `/origin-story/`

**Title**: `The Origin Story — How Lil Dev's World Was Created`
*(52 chars)*

**Meta Description**: `Every great universe has an origin. Discover how Lil Dev was born from a vision to build something meaningful for kids — a world, not just a character.`
*(155 chars)*

**H1**: `The Origin Story`

**Schema type**: `Article` + `Person` (creator)

---

### `/updates/`

**Title**: `Lil Dev World Updates — New Stories, Drops & News`
*(51 chars)*

**Meta Description**: `Stay ahead of every new adventure, product drop, and world expansion in the LilDev universe. The world is always growing.`
*(123 chars)*

**H1**: `From the World of Lil Dev`

**Schema type**: `Blog` + individual posts as `BlogPosting`

---

### `/newsletter/`

**Title**: `Join Lil Dev's World — Get Updates & Exclusive News`
*(52 chars)*

**Meta Description**: `Be the first to know about new adventures, games, book releases, and exclusive drops from the LilDev universe. Join the world today.`
*(135 chars)*

**H1**: `Join the World`

---

## ALT TEXT STRATEGY

### Current Images — Recommended Alt Text

| File | Current Alt | Recommended Alt |
|---|---|---|
| `devin-excited.webp` | "Lil Dev — excited and ready for adventure" | ✅ Keep — good |
| `devin-curious.webp` | "Lil Dev — curious expression" | `"Lil Dev looking curious and inquisitive — character from Lil Dev World"` |
| `devin-determined.webp` | "Determined" | `"Lil Dev with a determined expression — ready to solve any problem"` |
| `devin-thinking.webp` | "Thinking" | `"Lil Dev deep in thought — the curious kid who always asks why"` |
| `devin-joy.webp` | "Joyful" | `"Lil Dev filled with joy and excitement — celebrating a discovery"` |
| `devin-nervous.webp` | (unused in main UI) | `"Lil Dev looking nervous — a relatable moment from the adventures"` |
| `angel-trotting.webp` | "Angel — Lil Dev's loyal dog companion" | ✅ Keep — descriptive |
| `angel-alert.webp` | (expression switcher) | `"Angel the dog alert and attentive — Lil Dev's loyal companion character"` |
| `angel-settled.webp` | (expression switcher) | `"Angel the dog resting contentedly — Lil Dev's best friend"` |
| `kitchen-beam.webp` | "Morning light in the kitchen — Lil Dev's first adventure" | ✅ Keep — narrative |
| `court-night.webp` | "Basketball court at night under the stars" | `"Basketball court at night under stars — setting of a Lil Dev adventure"` |
| `discovered-space.webp` | "A hidden world discovered by Lil Dev" | ✅ Keep — narrative |
| `grandma-kitchen.webp` | (used in site?) | `"Grandma's kitchen — a warm scene from the Lil Dev story universe"` |
| `porch-dusk.webp` | (used in site?) | `"Porch at dusk — a quiet moment in Lil Dev's neighborhood world"` |
| `desk-night.webp` | (used in site?) | `"A desk at night — Lil Dev's creative and curious workspace"` |
| `lildev-logo-cropped.png` | "Lil Dev" | `"Lil Dev World logo — official wordmark for the LilDev character universe"` |

### Rules
- Never empty alt on meaningful images
- Decorative images get `alt=""`
- Character images: always identify character name + emotional state + universe reference
- Scene images: always name the scene + its narrative context
- Logo: include "official wordmark" or "logo" + brand name + IP descriptor

---

## OPEN GRAPH IMAGE SPECS

| Use | Dimensions | Format | File |
|---|---|---|---|
| Homepage default | 1200×630 | JPG | `og-cover.jpg` |
| Character page | 1200×630 | JPG | `og-meet-lil-dev.jpg` |
| Adventures page | 1200×630 | JPG | `og-adventures.jpg` |
| Store | 1200×630 | JPG | `og-store.jpg` |

**og-cover.jpg design brief**: Hero characters (Lil Dev + Angel) centered, world background (sky + hills), logo wordmark top-left, tagline "Adventure. Discovery. Learning." bottom — on brand blue/yellow palette. Should look cinematic, not generic.

---

## SLUG STANDARDS

| Page | Correct Slug | Avoid |
|---|---|---|
| Home | `/` | — |
| Meet Lil Dev | `/meet-lil-dev/` | `/meet`, `/character`, `/about` |
| The World | `/the-world/` | `/world`, `/about-world` |
| Adventures | `/adventures/` | `/stories`, `/episodes` |
| Characters | `/characters/` | `/roster`, `/cast` |
| Angel | `/angel/` | `/angel-dog`, `/companions` |
| Learn Lab | `/learn/` | `/steam`, `/learning` |
| Games | `/games/` | `/play-zone`, `/play` |
| Parents | `/parents/` | `/for-parents`, `/education` |
| Origin Story | `/origin-story/` | `/about-us`, `/our-story` |
| Updates | `/updates/` | `/news`, `/blog` |
| Newsletter | `/newsletter/` | `/signup`, `/subscribe` |

Trailing slashes: use them consistently.
Lowercase only. Hyphens only (no underscores).

---

## CANONICAL TAG RULES

Every page:
```html
<link rel="canonical" href="https://lildev.world/[slug]/">
```

Homepage:
```html
<link rel="canonical" href="https://lildev.world/">
```

No `www.` in canonical — use naked domain.

---

## TITLE TAG TEMPLATE (HTML)

```html
<title>[Page Title] | Lil Dev World</title>
```

Exception — Homepage:
```html
<title>Lil Dev World — Adventure. Discovery. Learning.</title>
```
