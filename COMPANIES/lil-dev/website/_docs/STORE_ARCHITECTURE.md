# LIL DEV STORE — ARCHITECTURE
*Domain: lildev.store | Version 1.0 — May 2026*

---

## STORE PHILOSOPHY

This is not a merch store.
This is an **extension of the LilDev universe into the physical world.**

Every product should feel like it belongs inside the story.
Every collection should feel like a chapter.
Every drop should feel like an event.

The store is where fans become collectors.
The store is where kids bring the world home.
The store is where the brand becomes tangible.

---

## BRAND POSITION IN COMMERCE

LilDev store sits at the intersection of:
- **Character merchandise** (Funko, Build-a-Bear positioning)
- **Educational products** (Melissa & Doug, LeapFrog positioning)
- **Collectible culture** (Kidrobot, Pop Mart positioning)
- **Cultural lifestyle brand** (future: Pokémon, Star Wars adjacency)

Products must always answer: "Why does this belong in Lil Dev's world?"

---

## DOMAIN & PLATFORM STRATEGY

- **Domain**: `lildev.store`
- **Platform recommendation**: Shopify (scalable, SEO-capable, inventory management, future app support)
- **Alternative (early stage)**: Squarespace Commerce (if already on Squarespace ecosystem)
- **World link**: Every store page links back to `lildev.world`
- **Store link**: `lildev.world` has "Shop" CTA in nav → `lildev.store`

---

## COLLECTION ARCHITECTURE

### TIER 1 — HERO COLLECTIONS (Launch with these)

#### `/collections/plush-figures/` — Plush & Figures
*"Bring Lil Dev Home"*
- Lil Dev Plush (small, medium, large)
- Angel Plush (small, medium, large)
- Lil Dev + Angel Bundle Set
- Future: expanded character roster as IP grows
- **SEO target**: "Lil Dev plush toy", "kids character stuffed animal", "educational character plush"
- **Price range**: $18–$65
- **Story connection**: "The same Lil Dev from the adventures — now in your hands."

#### `/collections/apparel/` — Apparel
*"Wear the World"*
- Lil Dev Character Tee (kids sizes 2T–14)
- Lil Dev Hoodie (kids + adult unisex)
- Angel the Dog Tee
- "Curious Kid" statement tee
- "Ask More Questions" tee (STEAM education message)
- LilDev World Logo cap
- **SEO target**: "kids character t-shirt", "Lil Dev shirt", "educational kids clothing"
- **Price range**: $22–$55
- **Identity message**: Wearing LilDev = you're part of the world

#### `/collections/accessories/` — Accessories
*"Carry the Adventure"*
- LilDev backpack (kids school bag)
- LilDev lunch box
- Angel water bottle
- LilDev sticker pack (6-sheet set)
- LilDev enamel pin set
- LilDev notebook + journal
- **SEO target**: "kids character backpack", "educational character accessories", "Lil Dev merchandise"
- **Price range**: $8–$45

---

### TIER 2 — WORLD COLLECTIONS (Phase 2 launch)

#### `/collections/books/` — Books & Stories
*"The Stories That Started It All"*
- "The Kitchen Discovery" — Book 1 (hardcover + softcover)
- "The Night at the Court" — Book 2
- "The Hidden World" — Book 3
- LilDev Complete Book Set Bundle
- Activity/coloring book (kids engagement)
- **SEO target**: "Lil Dev book", "kids adventure story book", "educational picture book curious kid"
- **Price range**: $14–$45 (bundles higher)
- **Story connection**: Directly connected to the Adventures page on lildev.world

#### `/collections/art-prints/` — Art & Posters
*"Decorate Your World"*
- LilDev Character Poster (multiple expressions)
- "The World of Lil Dev" map print
- Angel the Dog art print
- Scene prints (kitchen-beam, court-night, discovered-space aesthetics)
- Limited edition signed prints (future drops)
- **SEO target**: "kids room wall art", "character poster kids", "educational art print"
- **Price range**: $18–$85

#### `/collections/learning/` — Learning Tools
*"Learn the Lil Dev Way"*
- LilDev STEAM activity kit
- LilDev puzzle (1000-piece world map)
- LilDev flashcard learning set
- LilDev science experiment kit
- **SEO target**: "kids STEAM kit", "educational toy curious child", "science kit for kids"
- **Price range**: $24–$65

---

### TIER 3 — PREMIUM & COLLECTIBLE (Phase 3 launch)

#### `/collections/collectibles/` — Collectibles Universe
*"The Collector's Edition"*
- LilDev Series 1 Figure Set (blind box style)
- Angel Series 1 Figure
- LilDev Limited Color Variants (1 per character per season)
- World Diorama Set (neighborhood scene)
- **SEO target**: "kids collectible figures", "character blind box", "collector figure kids IP"
- **Price range**: $18–$150
- **Collectible mechanics**: Each figure includes a code that unlocks content on lildev.world

#### `/collections/limited/` — Limited Drops
*"Only For the True Explorers"*
- Seasonal drops (Summer of Discovery, Winter Stories, etc.)
- Birthday edition (LilDev anniversary drops)
- Collab drops (future: artist collaborations, educator collaborations)
- Archive section for sold-out drops (social proof)
- **Drop cadence**: 4× per year minimum
- **Urgency mechanism**: Countdown timer, "X remaining" stock indicators

#### `/collections/bundles/` — World Bundles
*"The Complete World"*
- Starter Pack (plush + book + stickers)
- School Year Bundle (backpack + notebook + sticker pack + tee)
- Collector's Bundle (figures + art print + book)
- Gift Box Bundle (premium packaging, seasonal)
- **SEO target**: "kids gift set character", "complete kids bundle educational"
- **Price range**: $45–$150+

---

## PRODUCT PAGE STRUCTURE (Template)

Every product page must include:

```
[Product name]
[Character/world connection blurb — 2 sentences]
[Product images — 4+ angles]
[Size/variant selector]
[Quantity + Add to Cart]
[Story badge: "Featured in [Adventure Name]" → links to lildev.world/adventures/]
[Character badge: "Lil Dev's Collection" → links to lildev.world/meet-lil-dev/]
[Details accordion]
[Reviews section]
[Related products grid: "Also From This World"]
[Back to LilDev World link]
```

---

## SEO PRODUCT STRUCTURE

### URL Format
```
lildev.store/products/[descriptor]-[character]-[type]
```
Examples:
- `lildev.store/products/lil-dev-plush-medium`
- `lildev.store/products/angel-dog-plush-small`
- `lildev.store/products/kitchen-discovery-book-hardcover`
- `lildev.store/products/curious-kid-tee-youth-medium`

### Product Title Format
```
[Product Type] | [Character/World name] | [Key benefit/differentiator]
```
Example: `Lil Dev Plush Toy | Soft Stuffed Character | LilDev World Collectible`

### Meta Description Formula
```
[Product] from the LilDev universe. [Key feature/emotion]. [Age appropriateness]. Part of the [Collection]. Free shipping over $[X].
```

### Schema Markup Required (per product)
- `Product` schema (name, image, description, brand, offers, sku)
- `BreadcrumbList` schema
- `Organization` schema (brand reference)
- `Review` / `AggregateRating` (when reviews exist)

---

## INVENTORY / SKU LOGIC

### SKU Format
```
LDW-[CATEGORY]-[ITEM]-[VARIANT]
```
Examples:
- `LDW-PLU-DEV-SM` (Plush, Lil Dev, Small)
- `LDW-APR-LOGOTEE-Y4` (Apparel, Logo Tee, Youth 4)
- `LDW-BK-KIT-HC` (Book, Kitchen Discovery, Hardcover)
- `LDW-COL-FIG-S1-01` (Collectible, Figure, Series 1, #01)

Categories:
- PLU = Plush
- APR = Apparel
- ACC = Accessories
- BK = Books
- ART = Art/Prints
- LRN = Learning
- COL = Collectibles
- BND = Bundles

---

## ECOMMERCE AUTHORITY STRATEGY

1. **Cross-link everything**: Each product links to its story origin on lildev.world
2. **Content on collection pages**: Each collection page has 150-200 words of world-building copy, not just product grids
3. **Characters as curators**: Products are framed as "Lil Dev's picks" or "Angel's corner" — character voice throughout
4. **Review strategy**: Encourage reviews with post-purchase emails; reviews = fresh content = SEO signal
5. **Blog/updates on store**: "New Drops" blog tied to lildev.world/updates/
6. **Structured data**: Full schema on every product, collection, and store page
7. **Image alt text**: All product images use descriptive alts: `alt="Lil Dev plush stuffed toy medium size soft LilDev World collectible"`
8. **Page speed**: Shopify's CDN + optimized images (WebP) — Core Web Vitals priority

---

## DROP CALENDAR FRAMEWORK

| Season | Drop Name | Products |
|---|---|---|
| Spring | "Discovery Season" | New plush + spring apparel |
| Summer | "Summer of Curiosity" | Activity kits + figures |
| Back to School | "Explorer Pack" | School bundles + new books |
| Holiday | "World Holiday Edition" | Limited collectibles + gift sets |

---

## FUTURE EXPANSION MODULES

- **Mystery Boxes**: Rotating seasonal blind box (drives recurring revenue)
- **Subscription**: "Lil Dev Monthly" — new activity + collectible each month
- **Digital + Physical**: Book purchase includes unlock code for digital version on lildev.world
- **Licensing**: Once IP is established, license for third-party manufacturing (Build-a-Bear, school supply retailers)
- **Wholesale**: Educational retailers, children's bookstores, museum shops
- **International**: Once English market is strong, translate and expand

---

## PLATFORM INTEGRATION

### Shopify Apps (Recommended)
- **Yotpo** or **Okendo** — Reviews with photo uploads
- **Klaviyo** — Email flows (abandoned cart, new drop announcements)
- **Judge.me** — Affordable reviews alternative
- **Loop Returns** — Easy returns (builds parent trust)
- **Afterpay/Shop Pay Installments** — Lower barrier for higher-ticket bundles
- **Gorgias** — Customer support (brand voice consistent)
- **TikTok + Instagram** shop integration — Social commerce

### Analytics
- Google Analytics 4 (GA4)
- Meta Pixel
- TikTok Pixel
- Shopify analytics dashboard

---

## STORE → WORLD INTEGRATION TOUCHPOINTS

| Store Touchpoint | World Link | Anchor |
|---|---|---|
| Product badge | `/adventures/[adventure]/` | "From this adventure" |
| Character description | `/meet-lil-dev/` | "Meet Lil Dev" |
| Collection header | `/the-world/` | "Explore the world" |
| Footer | `lildev.world` | "Return to the World" |
| Post-purchase email | `/learn/` | "While you wait, explore" |
| Packaging insert | `lildev.world` | QR code → World portal |
