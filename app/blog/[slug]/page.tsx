import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogPost from './BlogPost';

// Blog post data
const blogPosts: Record<string, {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  keywords: string[];
}> = {
  'smykkepleje-guide': {
    title: 'Komplet Guide til Smykkepleje: Hold Dine Smykker Smukke i Årevis',
    excerpt: 'Lær hvordan du passer på dine værdifulde smykker med vores professionelle tips til rengøring, opbevaring og vedligeholdelse af guld, sølv og ædelstene.',
    category: 'Pleje & Vedligeholdelse',
    date: '2024-10-01',
    readTime: '5 min',
    author: '&Accessories Team',
    keywords: ['smykkepleje', 'rengøring af smykker', 'vedligeholdelse af smykker', 'sølvpleje', 'guldpleje'],
    content: `
# Komplet Guide til Smykkepleje: Hold Dine Smykker Smukke i Årevis

Smykker er mere end blot accessories - de er ofte værdifulde investeringer og sentimentale skatte, der fortjener den bedste pleje. Uanset om du ejer en ægte diamantring, et sølvarmbånd eller forgyldte øreringe, kan korrekt pleje og vedligeholdelse forlænge deres levetid og bevare deres skønhed.

## Hvorfor er Smykkepleje Vigtigt?

Selv de mest holdbare smykker kan miste deres glans og skønhed over tid uden ordentlig pleje. Daglig eksponering for hudolier, lotion, parfume, sved og miljøfaktorer kan få dine smykker til at se matte og beskidte ud. Regelmæssig rengøring og vedligeholdelse sikrer:

- **Bevarelse af glans og lysstyrke**
- **Forlængelse af smykkernes levetid**
- **Opretholdelse af ædelstenes brillans**
- **Forebyggelse af skader og slitage**
- **Beskyttelse af din investering**

## Generelle Plejeregler for Alle Smykker

Før vi dykker ned i specifikke materialer, er her nogle universelle regler, der gælder for de fleste smykker:

### 1. Tag Smykker Af Ved Særlige Aktiviteter

Fjern altid dine smykker, når du:
- **Træner eller laver fysisk arbejde** - sved og gnidning kan beskadige både metal og ædelstene
- **Svømmer** - klorvand kan misfarve og beskadige visse metaller
- **Bruger rengøringsmidler** - kemikalier kan reagere med smykker
- **Påfører kosmetik** - parfume, hårspray og lotion kan få smykker til at anlø

### 2. Påfør Smykker Sidst

En god tommelfingerregel: **Smykker skal være det første, du tager af, og det sidste, du tager på.** Påfør din makeup, parfume og hårprodukter først, og vent et par minutter før du tager dine smykker på.

### 3. Opbevar Korrekt

- **Brug separate opbevaringsbokse** eller smykkeskrin med bløde foringer
- **Adskil forskellige stykker** for at undgå ridser og sammenfiltring
- **Opbevar på et køligt, tørt sted** væk fra direkte sollys
- **Hæng halskæder op** for at forhindre knuder

## Pleje Efter Materiale

### Guld Smykker

Guld er et relativt blødt metal, der kræver blid behandling:

**Rengøring:**
1. Bland lunkent vand med et par dråber mildt opvaskemiddel
2. Læg smykkerne i blanden i 10-15 minutter
3. Brug en blød tandbørste til forsigtigt at fjerne snavs i revner
4. Skyl grundigt med rent vand
5. Tør med en blød, fnugfri klud

**Hyppighed:** Hver 2-4 uge for hyppigt brugte smykker

**Tips:** 14 og 18 karat guld er mere holdbart end 8 karat og tåler daglig brug bedre.

### Sølv Smykker

Sølv har tendens til at anlø over tid, men det er let at gendanne glansen:

**Rengøring:**
1. Brug en speciel sølvpudseklud eller sølvpolish
2. For stærkt anløbet sølv: Læg aluminiumsfolie i en skål, tilsæt varmt vand og en spsk salt, læg sølvet i 2-3 minutter
3. Skyl og tør grundigt

**Hyppighed:** Ved behov, når anlø begynder at vise sig

**Forebyggelse:** Opbevar sølvsmykker i anti-anlø poser eller strips

### Diamanter og Ædelstene

Selvom diamanter er verdens hårdeste naturlige materiale, kan de stadig samle snavs:

**Rengøring:**
1. Bland varmt vand med et par dråber opvaskemiddel
2. Læg smykkerne i blæk og lad dem ligge i 20-30 minutter
3. Brug en blød børste til at rengøre bag ved stenen (hvor snavs samler sig)
4. Skyl under rindende varmt vand
5. Tør med en fnugfri klud

**Forsigtighedsregler for bløde ædelstene:**
- **Perler, opaler, turquoise:** Brug kun en fugtig klud - aldrig dyp i vand
- **Smaragder:** Meget følsomme - få dem professionelt rengjort
- **Akvamariner, topas:** Kan tåle samme behandling som diamanter

### Forgyldte Smykker

Forgyldte smykker kræver ekstra forsigtighed, da belægningen er tynd:

**Rengøring:**
1. Brug kun en blød, fugtig klud
2. Tør straks efter rengøring
3. Undgå kemikalier og skrappe børster

**Tips:** Forgyldte smykker holder længere hvis de opbevares i lufttætte poser mellem brug.

## Professionel Pleje og Inspektion

Selv med den bedste hjemmepleje, bør du få dine værdifulde smykker professionelt rengjort og inspiceret:

- **Årlig inspektion** hos en guldsmed for at tjekke for løse sten og slidte fatninger
- **Professionel rengøring** 1-2 gange om året for ædelstenssmykker
- **Omkalibrering af ringe** hvis de bliver for løse eller stramme

## Hurtigt Cheatsheet

| Materiale | Rengøringsmetode | Hyppighed | Undgå |
|-----------|------------------|-----------|-------|
| **Guld** | Mildt sæbevand + blød børste | Hver 2-4 uge | Hårde kemikalier |
| **Sølv** | Sølvpudseklud eller sølvbad | Ved anlø | Gummibånd (får det til at anlø) |
| **Diamanter** | Varmt sæbevand + børste | Hver 2-4 uge | Hårdt fysisk arbejde |
| **Perler** | Fugtig klud | Efter hvert brug | Vand, parfume, hårspray |
| **Forgyldt** | Fugtig klud | Ved behov | Vand, kemikalier |

## Konklusion

Med den rette pleje kan dine smykker bevare deres skønhed i generationer. Husk at:

✓ **Rengør regelmæssigt** for at forhindre opbygning af snavs
✓ **Opbevar korrekt** i adskilte rum
✓ **Vær forsigtig** med kemikalier og vand
✓ **Få professionel hjælp** til værdifulde stykker

Ved at følge denne guide vil dine smykker forblive lige så smukke som den dag, du købte dem.

## Shop Smykker hos &Accessories

Er du på udkig efter nye smykker til din kollektion? Besøg vores [shop](/), hvor vi samler de bedste tilbud på smykker fra Danmarks førende mærker - alt samlet ét sted.
    `
  },
  'vaelg-forlovelsesring': {
    title: 'Sådan Vælger Du Den Perfekte Forlovelsesring: Ekspertguide 2024',
    excerpt: 'Alt du behøver at vide om at vælge den rigtige forlovelsesring - fra diamantkvalitet og cuts til at finde den perfekte størrelse og stil.',
    category: 'Købsguide',
    date: '2024-09-28',
    readTime: '8 min',
    author: '&Accessories Team',
    keywords: ['forlovelsesring', 'diamantring', 'køb forlovelsesring', 'diamantkvalitet', 'ringstørrelse'],
    content: `
# Sådan Vælger Du Den Perfekte Forlovelsesring: Ekspertguide 2024

At købe en forlovelsesring er en af de mest betydningsfulde investeringer, du nogensinde vil lave. Det er ikke bare et stykke smykke - det er et symbol på kærlighed og en promise om en fælles fremtid.

## De 4 C'er: Fundamentet for Diamantkvalitet

Når du vælger en diamant forlovelsesring, bør du kende de 4 C'er:

### 1. Cut (Slibning)
Det vigtigste aspekt - bestemmer diamantens ildspil og brillans.
- **Excellent/Ideal:** Maksimal lysstyrke
- **Very Good:** Fantastisk kvalitet til bedre pris
- **Good:** Stadig smuk, men mindre ildspil

### 2. Color (Farve)
Diamanter graderes fra D (farveløs) til Z (gul tone):
- **D-F:** Farveløse - dyrest
- **G-J:** Næsten farveløse - bedst value
- **K-M:** Let gul tone - budget-venlig

### 3. Clarity (Renhed)
Henviser til indeslutninger i diamanten:
- **FL-IF:** Fejlfri (meget sjælden)
- **VVS1-VVS2:** Meget meget små indeslutninger
- **VS1-VS2:** Små indeslutninger (bedst value)
- **SI1-SI2:** Små indeslutninger synlige ved forstørrelse

### 4. Carat (Vægt)
Størrelsen af diamanten:
- **0.5-0.75 ct:** Elegant og klassisk
- **1.0 ct:** Populær størrelse
- **1.5+ ct:** Statement-størrelse

## Populære Forlovelsesring Stile

### Solitaire
Den klassiske stil med én diamant - tidløs og elegant.

### Halo
Mindre diamanter omkranser den centrale sten - gør ringen større.

### Three-Stone
Tre sten symboliserer fortid, nutid og fremtid.

### Vintage
Inspireret af art deco og viktoriansk design - unikt og romantisk.

### Pavé
Små diamanter langs båndet - ekstra sparkle.

## Find Den Rigtige Størrelse

Tips til at finde hendes ringstørrelse:
1. **Lån en ring** hun allerede bærer (fra samme finger)
2. **Spørg hendes veninder eller familie**
3. **Køb justerbar størrelse** hos guldsmed
4. **Standard størrelse:** Mange kvinder bruger størrelse 52-54

## Budget Guide

**Skal du bruge 3 måneders løn?** Det er en gammel marketingregel - brug hvad du har råd til.

Realistiske budget-ranges:
- **10.000-20.000 DKK:** Smuk ring med mindre diamant
- **20.000-40.000 DKK:** 0.5-1 carat med god kvalitet
- **40.000-80.000 DKK:** 1+ carat premium kvalitet
- **80.000+ DKK:** Stor sten eller designer brand

## Metaller til Forlovelsesringe

### Hvidguld
Moderne look, kræver replating hvert 2-3 år

### Guld (gul)
Klassisk, varm farve, holder godt

### Roséguld
Trendy, romantisk, flattering på mange hudtoner

### Platin
Mest holdbar, hypoallergen, dyreste

## Certificering

Køb altid en diamant med certifikat fra:
- **GIA (Gemological Institute of America)** - Gold standard
- **IGI (International Gemological Institute)**
- **HRD (Hoge Raad voor Diamant)**

## Konklusion

Den perfekte forlovelsesring er:
✓ Inden for dit budget
✓ Matcher hendes personlige stil
✓ Af god kvalitet med certifikat
✓ Fra en pålidelig forhandler

[Shop forlovelsesringe](/kategori/ringe) og sammenlign priser fra Danmarks bedste smykke-brands.
    `
  }
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts[slug];
  
  if (!post) {
    return {
      title: 'Blog Post Not Found'
    };
  }

  return {
    title: `${post.title} | &Accessories Blog`,
    description: post.excerpt,
    keywords: post.keywords.join(', '),
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts[slug];

  if (!post) {
    notFound();
  }

  return <BlogPost post={{ ...post, slug }} />;
}

export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({
    slug,
  }));
}

