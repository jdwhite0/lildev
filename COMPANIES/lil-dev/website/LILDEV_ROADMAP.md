# LIL DEV — IMPLEMENTATION ROADMAP
*Version 1.0 — May 2026*

---

## OVERVIEW

Six phases. Each phase builds on the last.
No phase should be rushed. Each phase must be completed with quality before the next begins.

The roadmap moves from:
**Infrastructure → Entity → Depth → Commerce → Content → Authority**

---

## PHASE 1 — FOUNDATION CLEANUP
*Goal: Make the current single page technically solid*
*Timeline: 1–2 weeks*

### 1.1 Technical Infrastructure
- [ ] Create `sitemap.xml` with current URL (`https://lildev.world/`)
- [ ] Create `robots.txt` (allow all, point to sitemap)
- [ ] Verify site in Google Search Console
- [ ] Verify site in Bing Webmaster Tools
- [ ] Add Google Analytics 4 property + install snippet
- [ ] Create `og-cover.jpg` (1200×630) — hero characters on world background
- [ ] Add `og:image` meta tag to homepage
- [ ] Add `twitter:image` meta tag to homepage
- [ ] Add `twitter:description` meta tag
- [ ] Add `<link rel="icon">` (favicon) — LilDev logo mark, square crop

### 1.2 Schema on Current Page
- [ ] Add `Organization` JSON-LD to `<head>` of index.html
- [ ] Add `WebSite` JSON-LD to `<head>` of index.html
- [ ] Validate schema at schema.org/validator

### 1.3 Image Alt Text Audit
- [ ] Update all character expression alt texts per METADATA_SYSTEM.md
- [ ] Verify scene images have narrative alt texts
- [ ] Check logo alt text: "Lil Dev World logo — official wordmark"

### 1.4 Performance Check
- [ ] Run Lighthouse on lildev.world (target: 90+ performance, 90+ SEO, 90+ accessibility)
- [ ] Compress any uncompressed images
- [ ] Verify all WebP images are being served correctly

### 1.5 Content Cleanup on Index
- [ ] Update meta description to match METADATA_SYSTEM.md template
- [ ] Verify all section `aria-label` attributes are descriptive
- [ ] Confirm nav links work correctly on all breakpoints

### PHASE 1 EXIT CRITERIA
- Lighthouse SEO score ≥ 90
- sitemap.xml accessible at `https://lildev.world/sitemap.xml`
- robots.txt accessible at `https://lildev.world/robots.txt`
- JSON-LD validated with no errors
- og:image resolves and shows in social preview tools
- Google Search Console: site verified, no coverage errors

---

## PHASE 2 — ENTITY CLARITY
*Goal: Make Google understand what LilDev IS*
*Timeline: 2–4 weeks*

### 2.1 Build Core Character Pages

**`/meet-lil-dev/`**
- [ ] Create `meet-lil-dev/index.html`
- [ ] Full character profile content (who, where, why, how)
- [ ] Character expression gallery (interactive, using existing assets)
- [ ] "Meet Angel" section with link to `/angel/`
- [ ] Internal links: → Adventures, → The World, → Store
- [ ] JSON-LD: `Person` (fictional character) schema
- [ ] Add to `sitemap.xml`
- [ ] Add to global nav

**`/angel/`**
- [ ] Create `angel/index.html`
- [ ] Angel character profile
- [ ] Photo gallery using angel-alert, angel-settled, angel-trotting assets
- [ ] Link: → Meet Lil Dev, → Adventures, → Store (Angel plush)
- [ ] JSON-LD: `Person` (fictional animal character) schema
- [ ] Add to `sitemap.xml`

### 2.2 Build World Foundation Page

**`/the-world/`**
- [ ] Create `the-world/index.html`
- [ ] Neighborhood description + feel
- [ ] Key locations section (kitchen, court, porch, desk — use existing scene images)
- [ ] "More to discover" teasers → future lore pages
- [ ] Link: → Adventures, → World Map (coming soon), → Characters
- [ ] JSON-LD: `Place` (fictional setting) schema
- [ ] Add to `sitemap.xml`

### 2.3 Social Entity Signals
- [ ] Create Instagram @lildevworld (or @lildevelopworld) — consistent handle
- [ ] Create TikTok @lildevworld
- [ ] Create YouTube @lildevworld
- [ ] Each profile bio: "The official home of Lil Dev. Enter the world at lildev.world"
- [ ] Add social URLs to `Organization` schema `sameAs` array
- [ ] Post initial content on each platform (can be the hero image + logo)

### 2.4 Update Navigation (All Pages)
- [ ] Update global nav to include `/meet-lil-dev/`, `/the-world/`, `/adventures/`
- [ ] Update footer link columns per INTERNAL_LINK_SYSTEM.md
- [ ] Add "Shop" CTA to nav → `lildev.store` (placeholder URL for now)

### PHASE 2 EXIT CRITERIA
- `/meet-lil-dev/`, `/angel/`, `/the-world/` all live and indexed
- Google Search Console shows new pages crawled
- Social profiles created and pointing to lildev.world
- Global nav includes real page links (not just anchors)

---

## PHASE 3 — WORLD-BUILDING EXPANSION
*Goal: Build enough content depth that the universe feels real*
*Timeline: 4–8 weeks*

### 3.1 Adventures System

**`/adventures/`** — Index Page
- [ ] Create `adventures/index.html`
- [ ] 3 adventure cards (Kitchen Discovery, Night at the Court, Hidden World)
- [ ] "Coming Soon" teaser slots for future adventures
- [ ] JSON-LD: `CreativeWorkSeries` schema
- [ ] Internal links: → each adventure, → Meet Lil Dev, → Books (store)

**Individual Adventure Pages**
- [ ] `/adventures/kitchen-discovery/`
- [ ] `/adventures/night-at-the-court/`
- [ ] `/adventures/hidden-world/`
- Each page: story preview, characters involved, format (book/episode), status, "Get the Book" → store link
- Each page: JSON-LD `Book` or `Episode` schema

### 3.2 Supporting Pages
- [ ] `/characters/` — roster with Lil Dev + Angel, tease future characters
- [ ] `/parents/` — dedicated page (not just a section)
- [ ] `/learn/` — dedicated page with full STEAM framework
- [ ] `/origin-story/` — creator vision, brand mythology

### 3.3 Updates System
- [ ] `/updates/` — simple blog-style page
- [ ] First 3 posts:
  - "Lil Dev's World Is Just Beginning" (launch announcement)
  - "Meet Angel — The Story Behind the Dog" (character spotlight)
  - "What's Coming in 2026" (excitement builder)
- [ ] JSON-LD: `Blog` schema on index, `BlogPosting` on each post

### 3.4 Newsletter Infrastructure
- [ ] `/newsletter/` — dedicated signup page
- [ ] Connect to email platform (Mailchimp, ConvertKit, or Klaviyo)
- [ ] Create welcome sequence (3 emails): Welcome → Meet the World → What's Coming
- [ ] Add newsletter CTA to footer of every page

### PHASE 3 EXIT CRITERIA
- 10+ pages live on lildev.world
- Adventures index + 3 individual adventure pages live
- Updates section has at least 3 posts
- Email list capture working
- Sitemap updated with all new pages

---

## PHASE 4 — STORE ARCHITECTURE
*Goal: Launch lildev.store with initial product catalog*
*Timeline: 4–8 weeks (can overlap with Phase 3)*

### 4.1 Platform Setup
- [ ] Choose and set up Shopify (recommended) or alternative
- [ ] Connect domain `lildev.store`
- [ ] Install recommended apps (reviews, email, analytics)
- [ ] Set up GA4 + Meta Pixel on store

### 4.2 Collection Setup
- [ ] `/collections/plush-figures/` — Lil Dev + Angel plush
- [ ] `/collections/apparel/` — tees + hoodie
- [ ] `/collections/accessories/` — stickers, pins, backpack
- [ ] `/collections/books/` — placeholder until books are produced
- [ ] `/collections/limited/` — archive for future drops

### 4.3 Initial Product Catalog
- [ ] Lil Dev Plush (SM, MD, LG)
- [ ] Angel Plush (SM, MD)
- [ ] Lil Dev Character Tee (youth sizes)
- [ ] Lil Dev Hoodie (youth + adult)
- [ ] Sticker Pack (6-sheet set)
- [ ] LilDev Notebook

### 4.4 Store SEO Foundation
- [ ] All product pages: title, meta description, alt text per METADATA_SYSTEM.md
- [ ] All product pages: Schema.org `Product` + `Offer` JSON-LD
- [ ] Collection pages: 150+ words of world-building copy each
- [ ] Store homepage: links to lildev.world prominently
- [ ] Every product: "From the LilDev Universe" with link back to world page

### 4.5 Cross-Domain Linking
- [ ] Update `lildev.world` nav: "Shop" → `lildev.store`
- [ ] Update `lildev.world` toybox section: link to `lildev.store`
- [ ] Update `lildev.world` footer: store links
- [ ] Store homepage: "← Back to Lil Dev World" header link

### PHASE 4 EXIT CRITERIA
- Store live at `lildev.store`
- 6+ products available for purchase
- All collections have copy and schema
- Cross-linking between world and store is complete
- First product sold

---

## PHASE 5 — CONTENT ECOSYSTEM GROWTH
*Goal: Build enough topical content to establish authority*
*Timeline: Ongoing (3–6 months)*

### 5.1 Regular Updates Cadence
- [ ] 2× per month minimum on `/updates/`
- [ ] Content mix: story previews, character spotlights, product announcements, world-building
- [ ] Repurpose each post to social channels

### 5.2 Deep Content Pages
- [ ] `/lore/` — world mythology, hidden details, easter eggs
- [ ] `/world-map/` — interactive or illustrated neighborhood map
- [ ] `/books/` — dedicated book series hub (as books are produced)
- [ ] `/collectibles/` — bridge page between world and store

### 5.3 Learning Content
- [ ] `/learn/` — add 5 specific "missions" with full content
- [ ] First 5 missions tied to adventure themes (Kitchen Discovery → food science activity)
- [ ] Parent-oriented: each mission includes "What your child learns"

### 5.4 Email Ecosystem
- [ ] Monthly newsletter active
- [ ] Abandoned cart sequence (store)
- [ ] New drop announcement sequences
- [ ] Birthday email (collect birthdate at signup for kids' universe)

### PHASE 5 EXIT CRITERIA
- `/updates/` has 12+ posts
- Email list: 500+ subscribers
- 15+ pages indexed on lildev.world
- Monthly organic traffic growing (track via GA4)

---

## PHASE 6 — AUTHORITY & DISCOVERABILITY GROWTH
*Goal: LilDev recognized as an entity; branded searches ranking; growing organic presence*
*Timeline: Ongoing (6–18 months)*

### 6.1 Press & Coverage
- [ ] Press kit page on site (`/press/`)
- [ ] Pitch to children's media blogs and parenting sites
- [ ] Target: 5+ quality backlinks from relevant domains in Year 1
- [ ] Educational institution mentions (STEAM education angle)

### 6.2 YouTube Authority
- [ ] YouTube channel active (character trailers, world tours, story previews)
- [ ] Each video links to lildev.world in description
- [ ] Video titles use branded + discovery keywords
- [ ] Target: 100+ subscribers organically before any push

### 6.3 Knowledge Panel
- [ ] Monitor Google for entity recognition
- [ ] If panel appears: claim and verify via Google
- [ ] Ensure `sameAs` social profiles are all consistent

### 6.4 Backlink Strategy
- [ ] Guest posts on educational/parenting blogs (STEAM angle)
- [ ] Collaborations with children's book reviewers
- [ ] Educator resources that link back to `/learn/`
- [ ] App or game directories (when games launch)

### 6.5 International Foundation (if growth warrants)
- [ ] `/es/` — Spanish language homepage (Lil Dev is culturally universal)
- [ ] Hreflang tags
- [ ] Spanish social handles

### PHASE 6 EXIT CRITERIA
- LilDev branded queries show Knowledge Panel or rich result
- 10+ quality backlinks from relevant domains
- Monthly organic search traffic: 1,000+ sessions
- Email list: 2,000+
- Store generating recurring revenue

---

## PRIORITY STACK — NEXT 25 ACTIONS

In exact execution order:

1. `sitemap.xml` — create and upload
2. `robots.txt` — create and upload
3. `og-cover.jpg` — design and add to site
4. Add `og:image` + `twitter:image` meta tags to index.html
5. Add `Organization` + `WebSite` JSON-LD to index.html
6. Verify lildev.world in Google Search Console
7. Install Google Analytics 4
8. Update all image alt texts per METADATA_SYSTEM.md
9. Create `/meet-lil-dev/` page (full character profile)
10. Create `/angel/` page (companion character)
11. Create `/the-world/` page (universe setting)
12. Update global nav to include real page URLs (not just anchors)
13. Update footer with all internal link columns
14. Create social profiles: Instagram + TikTok + YouTube @lildevworld
15. Add social `sameAs` to `Organization` schema
16. Create `/adventures/` index page
17. Create `/adventures/kitchen-discovery/` detail page
18. Create `/adventures/night-at-the-court/` detail page
19. Create `/updates/` and publish first post
20. Create `/parents/` dedicated page
21. Create `/newsletter/` standalone page + connect email platform
22. Set up Shopify store at `lildev.store`
23. Launch first product collection (plush or apparel)
24. Wire `lildev.world` nav "Shop" → `lildev.store`
25. Create press kit page + pitch first 3 media outlets

---

## DECISION LOG

| Decision | Rationale |
|---|---|
| Keep lildev.world as static HTML initially | Speed of deployment, full control, no platform lock-in |
| Use Vercel for hosting | Already wired, global CDN, easy deployments |
| Build store on lildev.store (separate domain) | Separates commerce and world clearly; store can have its own platform (Shopify) |
| World pages before store | Entity signals before commerce = stronger long-term authority |
| Avoid single-page architecture for SEO | Each page = a crawlable entity with its own search potential |
| No social sharing buttons on pages | Reduces page weight; world-first brand doesn't need ShareThis widgets |
| English-first, Spanish-capable | LilDev's visual aesthetic crosses language; Spanish is logical expansion |
