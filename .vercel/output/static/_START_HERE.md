# Lil Dev — Website (landing_page/lildev/)

This is the **static HTML website** for the Lil Dev world, deployed to `lildev.world`.  
It is a portal destination — the public-facing entry point to the Lil Dev franchise.

---

## Lil Dev Ecosystem Map

The Lil Dev franchise spans three separate locations in the file system:

| Layer | Location | Purpose |
|---|---|---|
| **IP Brain** | `JD Command Vault/projects/LILDEV/` | Story bible, characters, world, visual dev, music, production pipeline — 60+ docs in Obsidian |
| **Website** | `landing_page/lildev/` ← you are here | Static HTML site deployed to lildev.world |
| **App/Platform** | `lildev-app/` | Next.js 15 MVP — interactive world platform (Clerk + Supabase) |

---

## This Folder Structure

```
landing_page/lildev/
├── _START_HERE.md              ← You are here
├── _docs/                      ← Planning, strategy, architecture docs for the website
│   ├── MASTER_SITE_ARCHITECTURE.md
│   ├── LILDEV_ROADMAP.md
│   ├── LAUNCH_PLAN.md
│   ├── WORLD_EXPANSION_SYSTEM.md
│   ├── ENTITY_SCHEMA_SYSTEM.md
│   ├── METADATA_SYSTEM.md
│   ├── INTERNAL_LINK_SYSTEM.md
│   ├── STORE_ARCHITECTURE.md
│   ├── FUTURE_PIPELINE.md
│   ├── BUILD_LOG.md
│   ├── BOOK_ILLUSTRATION_BRIEF.md
│   └── CHARACTER_COMMISSION_BRIEF.md
├── _experiments/               ← Prototype/concept HTML files — NOT deployed
│   ├── lildev-v1.html
│   ├── lildev-v2.html
│   └── lildev-v3.html
├── index.html                  ← ⚡ LIVE — Lil Dev world homepage
├── adventures/                 ← Adventure story pages
├── angel/                      ← Angel companion page
├── characters/                 ← Characters page
├── games/                      ← Games hub (placeholder)
├── learn/                      ← Learning section
├── meet-lil-dev/               ← Character intro page
├── newsletter/                 ← Newsletter signup
├── origin-story/               ← Origin story page
├── parents/                    ← Parents guide
├── press/                      ← Press kit
├── the-world/                  ← World overview
├── updates/                    ← Updates/news
├── assets/images/              ← Character art, scene illustrations (webp)
├── robots.txt
├── sitemap.xml
└── vercel.json                 ← Deploys to lildev.world
```

---

## IP Brain Reference (DO NOT edit, read-only reference)

The full creative canon lives in `JD Command Vault/projects/LILDEV/`:
- `00_ADMIN/` — Franchise overview, vault architecture
- `01_DOCTRINE/` — Franchise DNA, protagonist DNA
- `02_CANON/` — Book canon, series inventory
- `03_WORLD/` — World bible, locations, community, emotional geography
- `04_CHARACTERS/` — Character bible, Angel companion standard
- `05_STORIES/` — Narrative bible, episode engine, conflict grammar
- `06_EPISODES/` — Pilot, season 1, episode pipeline, storyboard
- `07_BOOKS/` — Books index, individual book docs
- `08_VISUAL_DEVELOPMENT/` — Production bible, visual direction, color doctrine
- `09_ANIMATION/` — Expression system, generation plan
- `11_MUSIC_AUDIO/` — Sonic identity, composer outreach, opening theme brief
- `13_PRODUCTION_PIPELINE/` — Character sheets, prototypes, proof of tone
- `14_PROMPTS_AI/` — Influence system, AI generation prompts

---

## App Reference

For the interactive platform (kids world, Sunshine Points, Angel companion), see:  
`lildev-app/_START_HERE.md`

Image generation scripts (FAL.ai): `lildev-app/scripts/`

---

## Rules for AI Collaboration

1. **IP canon lives in the Vault** — check `JD Command Vault/projects/LILDEV/` before making story/character decisions
2. **Website = public-facing portal** — keep it cinematic, no generic web patterns
3. **Never deploy `_experiments/` or `_docs/`** — those folders are local-only work
4. **App and website are separate deployments** — website changes don't affect the app
