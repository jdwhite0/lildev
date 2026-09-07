# Lil Dev World — production waitlist gate

**Status:** required on production  
**Domain:** https://lildev.world  
**Vercel project:** `lildev-site` (linked to **this** repo `jdwhite0/lildev`)  
**Site root:** `COMPANIES/lil-dev/website/`

## Why this exists

Public `/` is the human front door while the world is unfinished. Casual visitors land on the waitlist. That is a **human gate only**. Google must still be able to crawl and index the real site tree so search is ready when the world opens.

PR #28 locked the marketing tree out of search (robots Disallow, root-only sitemap, noindex, X-Robots-Tag). That lockdown is **reversed**. Do not restore it.

## Law

1. **Public `/` is the waitlist.** `index.html` must present Coming Soon + JOIN THE WAITLIST + the optional access-key escape ("Enter the World"). It is not a stub, and it is not the marketing homepage.
2. **`/home` and interior URLs stay open.** If someone reaches `/home`, a section page, a Google deep link, or a bookmark, leave them in. Do not bounce unauthenticated humans to `/`. Do not require `localStorage.lildev_access_key === "angel"` to browse.
3. **Access key is convenience, not a lock.** From the waitlist, key `angel` may set `lildev_access_key` and send the visitor to `/home`. Already-keyed visitors who hit `/` may skip to `/home`. Deep links must work without the key.
4. **`/soon` consolidates to `/`.** Permanent redirect + a thin alias page. Canonical on both waitlist surfaces is `https://lildev.world/`.
5. **Google may crawl and index the content tree.** `robots.txt` Allows the marketing/content routes. `sitemap.xml` lists `/` (priority 1.0) plus the meaningful public section URLs. **Every `<loc>` must be the final 200 URL.** `vercel.json` is `trailingSlash: false`, so only the homepage keeps a trailing slash (`https://lildev.world/`). Section locs are slashless (`https://lildev.world/meet-lil-dev`). Trailing-slash section URLs 308 and GSC flags them as "Page with redirect". Do not noindex `/home`, interiors, or racer. Do not send `X-Robots-Tag: noindex`. Junk (`/_docs`, `/_experiments`) may stay Disallow / noindex.
6. **Never rewire `/` to `/home`.** A Vercel rewrite or redirect from `/` → `/home` (or replacing `index.html` with `home.html`) is a regression. Do not copy `home.html` over `index.html` when the world is ready — change the gate and the guard in the same PR.
7. **No user-agent cloaking.** Serve the same HTML to Googlebot and humans.

## Fail-closed guards

| Layer | What it does |
|---|---|
| `guard-lildev-waitlist.mjs` | Checks waitlist `index.html`, vercel routes (`/` stays waitlist), crawl/index policy (no content-tree Disallow, sitemap has public URLs, no noindex lockdown) |
| `vercel.json` `installCommand` | Runs the guard on every lildev-site install. **Do not use `buildCommand`** — that switches this static site onto a build-output path |
| `.github/workflows/lildev-waitlist-guard.yml` | Same check on PRs/pushes that touch this folder |

Local check:

```bash
node COMPANIES/lil-dev/website/guard-lildev-waitlist.mjs
# or, from COMPANIES/lil-dev/website/:
npm run guard:waitlist
```

## How to deploy to production

`lildev.world` is the **lildev-site** Vercel project, linked to this repository. Merging to `main` auto-deploys production.

1. Merge the waitlist/SEO PR into `lildev` `main`.
2. Confirm Vercel production deploy for `lildev-site` from `COMPANIES/lil-dev/website/` (`cleanUrls: true`, `trailingSlash: false`).
3. Confirm live `/` shows JOIN THE WAITLIST, `/soon` 308s to `/`, `/home` and section URLs stay open without the key, and `angel` still opens `/home` from the waitlist.
4. Confirm each sitemap `<loc>` except the homepage returns **200 with no redirect**:

```bash
curl -sI --max-redirs 0 https://lildev.world/meet-lil-dev
# expect HTTP 200 (not 308)
```

## When the world is actually ready

Remove the waitlist from `index.html` only as a deliberate launch change. Update the guard, sitemap, and robots in the same PR. Do not "just copy home.html over index.html."
