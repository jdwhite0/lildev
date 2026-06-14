# LIL DEV — BUILD LOG
*Errors, learnings, decisions, and continuity notes for future sessions*

---

## SESSION: May 2026 — V1 through V9

### Commits Completed
- `e3151c3` — V1: initial portal
- `1d749da` — V2: immersive world layout
- `4553519` — V3: mobile fixes
- `c04f304` — V4: spacing
- `ed0c079` / `42abb78` — V5: z-index + logo
- `2d244d7` — V6: logo restore + sizes
- `df7060a` — V7: nav logo 110px
- `a075570` — V8: logo overflow nav fix
- `4d42148` — V9: precision fixes + ecosystem architecture docs (committed via another session)

### Errors Encountered

**1. Git staging failure (May 2026)**
- Problem: Ran `git add` for lildev files but commit reported "no changes added to commit"
- Root cause: The files had already been committed by another session (`4d42148`) before the commit command ran in this session
- Learning: When two sessions are running against the same repo, check `git log` BEFORE attempting to commit — the work may have already been captured
- Fix: Verified via `git show HEAD:landing_page/lildev/MASTER_SITE_ARCHITECTURE.md` — files were already in HEAD

**2. Logo background confusion (May 2026)**
- Problem: Logo appeared to have a background on dark nav
- Root cause: Logo 02.1 (cream/beige fills) was swapped in; its fills looked like a background on dark surfaces. Logo 01 has white fills + yellow "DEV" on transparent canvas — correct version.
- Learning: Always confirm which logo file is referenced. Logo 01 = official. Logo 02.1 = orange/cream variant, NOT for use.
- Fix: Restored Logo 01. Created `lildev-logo-cropped.png` (cropped to artwork bounding box from 11384×6400 → 8284×2492) to fix "tiny logo" issue caused by excess transparent canvas

**3. Logo appearing tiny in nav (May 2026)**
- Problem: At `height: 52px`, the logo appeared tiny
- Root cause: Original Logo 01 has 11384×6400 canvas but artwork only occupies a fraction of that. At any fixed height, most of the rendered height is transparent space
- Fix: Cropped to artwork bounding box + 40px padding (8284×2492). Same CSS height now shows actual artwork.
- Tool used: Python PIL + numpy (scipy not available)

**4. BFS flood fill returned 0 removed pixels (May 2026)**
- Problem: Background removal script found no pixels to remove
- Root cause: Logo 01 edge pixels are `R=255, G=255, B=255, A=0` — transparent white. The BFS checked `a > 100` which never matched transparent pixels. The white IS the design (letter fills), not a background.
- Learning: Logo 01 has correct transparency from creation. No background removal is needed or appropriate.

**5. Nav bar expanding when logo height increased (May 2026)**
- Problem: Setting `height: 110px` on logo caused the nav bar itself to grow
- Root cause: Logo was in normal flow inside the nav — its height pushed the nav height
- Fix V8: `position: absolute` on nav-brand + `height: 64px; overflow: visible` on nav → logo overflows below bar (user didn't like this)
- Fix V9: Use cropped logo at `height: 52px` in normal flow with `justify-content: space-between`. Logo fits within 64px nav without overflow. Clean solution.

**6. Edit "string not found" errors (May 2026, multiple occurrences)**
- Problem: Edit tool returned "string not found" when trying to match code
- Root cause: Whitespace differences, extra spaces, or the file had been modified since the last read
- Fix: Always grep for the exact line number first with `grep -n "pattern"`, then read that specific offset before editing
- Learning: Never guess the exact string — read the file at the specific line, copy exactly, then edit

**7. Character hidden behind badge (May 2026)**
- Problem: Characters appeared behind the "A World Built for Curious Kids" badge
- Root cause: chars z-index was 10, hero-content z-index was 20. Badge is inside hero-content.
- Fix: Bumped chars z-index to 25

**8. Characters overlapping buttons after z-index fix (May 2026)**
- Problem: After z-index fix, characters were in front of buttons at the same vertical position
- Root cause: `position: absolute; bottom: 23%` placed chars at the same vertical position as hero-content
- Fix: Changed chars to `position: relative` so it flows above hero-content in the flex layout

**9. Loader progress bar removal (May 2026)**
- Problem: Added a progress bar to loader which user explicitly rejected
- User instruction: "no progress bar for the loading screen i like how you had the brand colored dots in motion"
- Fix: Removed progress bar CSS, HTML, and JS; kept 5 brand-colored bouncing dots

**10. Unsolicited UI elements in loader (May 2026)**
- Problem: Added a large portal ring and floating emoji spawner which user explicitly rejected
- User instruction: "those graphics are not interactive, you just added random graphics....and you added some huge circle"
- Learning: Do not add unrequested visual elements. Every addition must be justified by the brief.

---

### Known Pending Items (Not Errors, Just Incomplete)

**og-cover.jpg** — Needs to be created. Currently og:image points to this file which doesn't exist yet. Until it's created, social shares will show no preview image.
- Required dimensions: 1200×630
- Design brief: Hero characters (Lil Dev + Angel) centered, world background (sky + hills), logo wordmark, tagline "Adventure. Discovery. Learning." — brand blue/yellow palette, cinematic framing

**GA4 Measurement ID** — `G-XXXXXXXXXX` placeholder in index.html and all page files needs to be replaced with the actual GA4 property Measurement ID.
- Action: Create GA4 property at analytics.google.com → get Measurement ID → find and replace `G-XXXXXXXXXX` across all HTML files

**Google Search Console verification** — Requires browser action by Jerry.
- Go to search.google.com/search-console → Add property → `https://lildev.world` → verify via HTML tag or DNS

**Social profiles** — @lildevworld on Instagram, TikTok, YouTube need to be created.
- Currently footer links to these URLs but accounts don't exist yet
- Create accounts → update `sameAs` array in Organization schema once handles are confirmed

**lildev.store** — Store domain is owned but platform/setup not yet configured.
- Recommendation: Shopify
- Navigation links reference `lildev.store` as destination but it's not live yet

---

### File Protection Rules (Always Check Before Editing)

- `assets/images/lildev-logo.png` — Original Logo 01. Do not modify. Never swap for Logo 02.1.
- `assets/images/lildev-logo-cropped.png` — Cropped version of Logo 01. This is the active logo in all UI.
- Character `.webp` files — Production assets. Do not delete or rename.
- `vercel.json` — Security headers config. Only modify when adding routing rules.

---

### Conventions Established

- Logo to use everywhere: `lildev-logo-cropped.png`
- Never use: `lildev-logo-02.1.png` (doesn't exist as a separate file but the orange/cream variant was Logo 02.1 — reject if it appears)
- Nav height: 64px fixed on desktop
- Nav logo height: 52px desktop, 90px mobile (mobile nav is taller because it's a dropdown trigger)
- Color tokens: `--blue: #3B64B6`, `--yellow: #FFC400`, `--purple: #7B3FF2`, `--red: #FF3B30`, `--green: #34C759`, `--orange: #FF9500`, `--dark: #1A2340`
- Font stack: Fredoka (headings), Nunito (subheadings/UI), Inter (body)
- All page HTML files use absolute asset paths: `/assets/images/...`
- All page HTML files follow the same nav + footer structure
- Section IDs on homepage are kept for internal anchor navigation (existing behavior preserved)

---

*Add to this log every session. Every error is a lesson. Every decision is a record.*
