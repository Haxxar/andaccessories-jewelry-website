# SEO Forbedringer til &Accessories

## Dato: 16. Oktober 2025

## Problemer Løst

### 1. ✅ Meta Title Længde
**Problem:** Title tag var 67 tegn (for lang - Google anbefaler 20-60 tegn)
**Løsning:** Reduceret til 52 tegn
- **Før:** `&Accessories - Smukke Smykker Online | Danmarks Bedste Smykkeudvalg` (67 tegn)
- **Efter:** `&Accessories - Smukke Smykker til Bedste Priser` (52 tegn)

### 2. ✅ Canonical Tag Omdirigerings-Loop
**Problem:** Inkonsistente canonical URLs forårsagede redirect loops
- Nogle sider brugte fulde URLs (`https://andaccessories.dk/...`)
- Andre brugte relative paths (`/...`)
- Dette skabte konflikt med `metadataBase` konfiguration

**Løsning:** Konsistent brug af relative paths for alle canonical tags
- Alle canonical tags bruger nu relative paths (f.eks. `/`, `/kategori/ringe`)
- Next.js kombinerer automatisk `metadataBase` + relative path
- Ingen flere redirect loops

### 3. ✅ Forbedret Meta Description
**Problem:** Ikke optimal beskrivelse for søgeresultater
**Løsning:** Mere actionable og keyword-rich beskrivelse
- **Før:** Generisk beskrivelse af produkter
- **Efter:** "Sammenlign priser på ringe, halskæder, øreringe og armbånd fra Danmarks bedste smykkemærker..."

## Kategori-Specifikke SEO Metadata

Oprettet dedikerede metadata filer for hver kategori:

### Ringe (`/kategori/ringe`)
- **Title:** Ringe - Forlovelses & Vielsesringe | &Accessories (51 tegn)
- **Keywords:** ringe, forlovelsesringe, vielsesringe, statement ringe, guld ringe, sølv ringe

### Halskæder (`/kategori/halskader`)
- **Title:** Halskæder - Guld & Sølv Kæder | &Accessories (47 tegn)
- **Keywords:** halskæder, guld halskæde, sølv halskæde, kæder, collier

### Øreringe (`/kategori/oreringe`)
- **Title:** Øreringe - Creoler & Hoops | &Accessories (43 tegn)
- **Keywords:** øreringe, creoler, hoops, guld øreringe, sølv øreringe

### Ørestikker (`/kategori/orestikker`)
- **Title:** Ørestikker - Elegante Studs | &Accessories (45 tegn)
- **Keywords:** ørestikker, studs, guld ørestikker, diamant ørestikker

### Armbånd (`/kategori/armband`)
- **Title:** Armbånd - Charm & Lænkearmbånd | &Accessories (48 tegn)
- **Keywords:** armbånd, charmarmbånd, lænkearmbånd, tennisarmbånd

### Vedhæng (`/kategori/vedhang`)
- **Title:** Vedhæng - Charms & Pendants | &Accessories (47 tegn)
- **Keywords:** vedhæng, charms, pendants, guld vedhæng, sølv vedhæng

## Tekniske Ændringer

### Filer Opdateret:
1. `app/layout.tsx` - Hovedlayout metadata
2. `app/kategori/layout.tsx` - Kategori layout metadata
3. `app/kategori/ringe/metadata.ts` - Ny fil
4. `app/kategori/halskader/metadata.ts` - Ny fil
5. `app/kategori/oreringe/metadata.ts` - Ny fil
6. `app/kategori/orestikker/metadata.ts` - Ny fil
7. `app/kategori/armband/metadata.ts` - Ny fil
8. `app/kategori/vedhang/metadata.ts` - Ny fil
9. `vercel.json` - Tilføjet cron job konfiguration

### Canonical URL Struktur:
```typescript
// Korrekt konfiguration
metadataBase: new URL('https://andaccessories.dk')
alternates: {
  canonical: '/' // Relative path - kombineres automatisk med metadataBase
}
```

## Forventede Resultater

1. **Ingen flere redirect loops** - Google kan nu crawle alle sider uden fejl
2. **Bedre synlighed i søgeresultater** - Title tags passer inden for Googles anbefalede længde
3. **Højere CTR (Click-Through Rate)** - Mere relevante og actionable meta descriptions
4. **Bedre keyword targeting** - Specifikke keywords for hver kategori
5. **Forbedret strukturerede data** - Konsistente Open Graph og Twitter Card metadata

## Næste Skridt

1. **Test i Google Search Console:**
   - Anmod om ny indeksering af alle sider
   - Tjek for redirect fejl efter 24-48 timer
   - Monitorer "Coverage" rapporten

2. **Valider med værktøjer:**
   - Google Lighthouse (Performance & SEO score)
   - Google Rich Results Test
   - Bing Webmaster Tools

3. **Løbende optimering:**
   - Monitorer søgeord performance
   - A/B test meta descriptions
   - Opdater structured data efter behov

## Vercel Cron Job

Tilføjet automatisk feed opdatering:
- **Frekvens:** Dagligt kl. 06:00 UTC
- **Endpoint:** `/api/cron/update-feeds`
- **Kræver:** `CRON_SECRET` environment variable i Vercel

## Supabase Feed Opdatering

Manuelt opdateret Supabase database:
- **Produkter uploadet:** 28,779
- **Status:** ✅ Succesfuld
- **Kommando:** `npm run update-feeds-supabase`

