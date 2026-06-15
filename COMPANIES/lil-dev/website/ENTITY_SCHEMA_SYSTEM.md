# LIL DEV — ENTITY & SCHEMA SYSTEM
*Version 1.0 — May 2026*

---

## WHAT IS AN ENTITY?

Google's Knowledge Graph is built from entities — named, knowable things that exist in the world.
A person. An organization. A character. A place. A product. A creative work.

Right now, LilDev exists on the web but Google does not yet have a confident entity classification for it.

Goal: Make LilDev a **recognized entity** in Google's Knowledge Graph.
This means Google will eventually understand:
- LilDev = a specific named character
- LilDev World = a specific creative universe / IP
- JD Productions = the creator/organization behind it
- The LilDev Store = a commercial entity in that ecosystem

When entities are established, Google begins:
- Surfacing brand knowledge panels
- Connecting related searches
- Attributing authority to branded queries
- Understanding product-character-story relationships

---

## THE LILDEV ENTITY MAP

```
JD Productions (Organization / Creator)
└── LilDev World (CreativeWork / Brand / Fictional Universe)
    ├── Lil Dev (FictionalCharacter / Person)
    │   └── Angel (FictionalCharacter / Animal)
    ├── Adventures (BookSeries / TVSeries / CreativeWorkSeries)
    │   ├── The Kitchen Discovery (Book / Episode)
    │   ├── The Night at the Court (Book / Episode)
    │   └── The Hidden World (Book / Episode)
    ├── LilDev Store (OnlineBusiness / Store)
    │   ├── Plush (Product)
    │   ├── Apparel (Product)
    │   └── Collectibles (Product)
    └── Learn Lab (EducationalProgram)
```

---

## SCHEMA IMPLEMENTATIONS

### 1. ORGANIZATION (Homepage + all pages)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://lildev.world/#organization",
  "name": "Lil Dev World",
  "alternateName": ["LilDev", "Lil Dev", "LilDev World"],
  "url": "https://lildev.world",
  "logo": {
    "@type": "ImageObject",
    "url": "https://lildev.world/assets/images/lildev-logo-cropped.png",
    "width": 8284,
    "height": 2492
  },
  "sameAs": [
    "https://www.instagram.com/lildevworld",
    "https://www.tiktok.com/@lildevworld",
    "https://www.youtube.com/@lildevworld"
  ],
  "foundingOrganization": {
    "@type": "Organization",
    "name": "JD Productions",
    "url": "https://jdproductions.io"
  },
  "description": "Lil Dev World is a children's character universe featuring Lil Dev and his companion Angel — built for stories, learning, games, and imagination.",
  "audience": {
    "@type": "Audience",
    "audienceType": "Children",
    "suggestedMinAge": 3,
    "suggestedMaxAge": 12
  }
}
```

### 2. WEBSITE (Homepage)

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://lildev.world/#website",
  "url": "https://lildev.world",
  "name": "Lil Dev World",
  "description": "Adventure. Discovery. Learning. The official home of Lil Dev — a growing creative universe for curious kids.",
  "publisher": {
    "@id": "https://lildev.world/#organization"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://lildev.world/?s={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

### 3. FICTIONAL CHARACTER — LIL DEV (`/meet-lil-dev/`)

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://lildev.world/meet-lil-dev/#character",
  "name": "Lil Dev",
  "alternateName": ["LilDev", "Lil Dev character"],
  "description": "Lil Dev is a curious, imaginative young character who explores the world with his loyal dog Angel, turning every question into an adventure.",
  "url": "https://lildev.world/meet-lil-dev/",
  "image": "https://lildev.world/assets/images/devin-excited.webp",
  "knowsAbout": ["science", "adventure", "curiosity", "friendship", "learning"],
  "affiliation": {
    "@id": "https://lildev.world/#organization"
  },
  "mainEntityOfPage": "https://lildev.world/meet-lil-dev/",
  "fictional": true
}
```

Note: Schema.org does not have a `FictionalCharacter` type directly — use `Person` with contextual description indicating fictional nature. Google understands this pattern for character IPs.

### 4. FICTIONAL CHARACTER — ANGEL (`/angel/`)

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://lildev.world/angel/#character",
  "name": "Angel",
  "alternateName": ["Angel the Dog", "Lil Dev's dog"],
  "description": "Angel is Lil Dev's loyal dog companion — always alert, always by his side, and always ready for the next adventure.",
  "url": "https://lildev.world/angel/",
  "image": "https://lildev.world/assets/images/angel-trotting.webp",
  "affiliation": {
    "@id": "https://lildev.world/#organization"
  },
  "fictional": true
}
```

### 5. CREATIVE WORK SERIES — ADVENTURES (`/adventures/`)

```json
{
  "@context": "https://schema.org",
  "@type": "CreativeWorkSeries",
  "@id": "https://lildev.world/adventures/#series",
  "name": "Lil Dev Adventures",
  "description": "A growing series of stories, books, and animated episodes following Lil Dev and Angel through curiosity-driven adventures.",
  "url": "https://lildev.world/adventures/",
  "genre": ["Children's Fiction", "Adventure", "Educational"],
  "audience": {
    "@type": "Audience",
    "suggestedMinAge": 3,
    "suggestedMaxAge": 12
  },
  "publisher": {
    "@id": "https://lildev.world/#organization"
  },
  "character": [
    {"@id": "https://lildev.world/meet-lil-dev/#character"},
    {"@id": "https://lildev.world/angel/#character"}
  ]
}
```

### 6. INDIVIDUAL BOOK (`/adventures/kitchen-discovery/`)

```json
{
  "@context": "https://schema.org",
  "@type": "Book",
  "@id": "https://lildev.world/adventures/kitchen-discovery/#book",
  "name": "The Kitchen Discovery",
  "description": "Lil Dev finds something amazing in grandma's kitchen — and it kicks off the biggest science experiment of the week.",
  "url": "https://lildev.world/adventures/kitchen-discovery/",
  "image": "https://lildev.world/assets/images/kitchen-beam.webp",
  "genre": ["Children's Fiction", "Educational Adventure"],
  "audience": {"@type": "Audience", "suggestedMinAge": 4, "suggestedMaxAge": 10},
  "isPartOf": {"@id": "https://lildev.world/adventures/#series"},
  "character": [{"@id": "https://lildev.world/meet-lil-dev/#character"}],
  "publisher": {"@id": "https://lildev.world/#organization"}
}
```

### 7. EDUCATIONAL PROGRAM (`/learn/`)

```json
{
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "@id": "https://lildev.world/learn/#education",
  "name": "Lil Dev Learn Lab",
  "description": "STEAM education through storytelling — Science, Technology, Engineering, Art, and Math made joyful for kids ages 3–12.",
  "url": "https://lildev.world/learn/",
  "educationalCredentialAwarded": "Discovery Badges",
  "audience": {
    "@type": "Audience",
    "suggestedMinAge": 3,
    "suggestedMaxAge": 12
  },
  "parentOrganization": {"@id": "https://lildev.world/#organization"}
}
```

### 8. PRODUCT (Store — per product)

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Lil Dev Plush Toy — Medium",
  "description": "Soft plush figure of Lil Dev, the curious character from Lil Dev World. A collectible for fans ages 3 and up.",
  "image": "https://lildev.store/images/lil-dev-plush-medium.jpg",
  "brand": {
    "@type": "Brand",
    "name": "Lil Dev World",
    "url": "https://lildev.world"
  },
  "sku": "LDW-PLU-DEV-MD",
  "audience": {
    "@type": "Audience",
    "suggestedMinAge": 3
  },
  "offers": {
    "@type": "Offer",
    "price": "29.99",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "url": "https://lildev.store/products/lil-dev-plush-medium"
  },
  "isRelatedTo": {
    "@id": "https://lildev.world/meet-lil-dev/#character"
  }
}
```

### 9. BREADCRUMB (All non-home pages)

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Lil Dev World",
      "item": "https://lildev.world/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Adventures",
      "item": "https://lildev.world/adventures/"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "The Kitchen Discovery",
      "item": "https://lildev.world/adventures/kitchen-discovery/"
    }
  ]
}
```

### 10. FAQ (Parents page)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What age group is Lil Dev World designed for?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Lil Dev World is designed for children ages 3–12, with content spanning early learning for toddlers through adventure stories for older kids."
      }
    },
    {
      "@type": "Question",
      "name": "Is Lil Dev World safe for children?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. All content in Lil Dev's World is created with child safety and positive values in mind — curiosity, kindness, learning, and imagination."
      }
    },
    {
      "@type": "Question",
      "name": "What is the educational mission of Lil Dev World?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Lil Dev's World uses storytelling to teach STEAM concepts — Science, Technology, Engineering, Art, and Math — in ways that feel like adventure, not school."
      }
    }
  ]
}
```

---

## IMPLEMENTATION METHOD

### For Static HTML Pages (Current Setup)
Embed JSON-LD in `<head>` of each page using `<script type="application/ld+json">`:

```html
<head>
  ...
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    ...
  }
  </script>
  ...
</head>
```

Stack multiple schemas per page in separate `<script>` tags:
```html
<script type="application/ld+json">[Organization schema]</script>
<script type="application/ld+json">[WebSite schema]</script>
<script type="application/ld+json">[BreadcrumbList schema]</script>
```

### For Shopify (Store)
- Use Shopify's native `product` schema (auto-generated)
- Augment via theme edits or apps (Schema Plus, SEO Manager)
- Manually add `Organization` schema in theme `<head>`
- Ensure `@id` references match `lildev.world` entity IDs (cross-domain entity connection)

---

## ENTITY SIGNALS BEYOND SCHEMA

Schema is the technical signal. These are the contextual signals:

| Signal | How to Build It |
|---|---|
| Wikipedia / Wikidata presence | After brand establishes enough coverage, create entry |
| Google Knowledge Panel | Claimed after organic entity recognition; strengthened by schema + consistent NAP |
| Press mentions | Target children's media, education, pop culture outlets |
| Social profiles | @lildevworld on all major platforms, consistent handles |
| Creator mention | JD Productions credited with `creator` schema relationship |
| ISBN for books | Register each book for an ISBN → Google Books cross-reference |
| IMDB / character databases | When animation launches, register |
| YouTube channel | Google owns it — YouTube presence strongly signals media entity |

---

## ENTITY HEALTH CHECKLIST

- [ ] JSON-LD `Organization` schema on homepage
- [ ] JSON-LD `WebSite` schema with `SearchAction` on homepage
- [ ] `Person` schema for Lil Dev on `/meet-lil-dev/`
- [ ] `Person` schema for Angel on `/angel/`
- [ ] `CreativeWorkSeries` schema on `/adventures/`
- [ ] `Book` schema on each individual adventure page
- [ ] `FAQPage` schema on `/parents/`
- [ ] `BreadcrumbList` on all non-home pages
- [ ] `Product` + `Offer` schema on all store product pages
- [ ] Consistent `@id` references linking all schemas into one entity graph
- [ ] Social profiles all use consistent brand name "Lil Dev World"
- [ ] All social bios link to `https://lildev.world`
- [ ] Google Search Console verified on `lildev.world`
- [ ] Google Search Console verified on `lildev.store`
- [ ] `sameAs` arrays updated as social profiles are created
