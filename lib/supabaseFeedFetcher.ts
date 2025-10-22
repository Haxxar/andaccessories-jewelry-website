import iconv from 'iconv-lite';
import xml2js from 'xml2js';

// Types for better type safety
interface RawProduct {
  produktid?: string[];
  produktnavn?: string[];
  beskrivelse?: string[];
  nypris?: string[];
  glpris?: string[];
  billedurl?: string[];
  vareurl?: string[];
  forhandler?: string[];
  kategorinavn?: string[];
  lagerantal?: string[];
  ean?: string[];
  brand?: string[];
}

interface NormalizedProduct {
  external_id: string;
  title: string;
  description: string;
  brand: string;
  category: string;
  material: string;
  price: number;
  old_price?: number;
  discount?: number;
  image_url?: string;
  product_url?: string;
  shop?: string;
  in_stock: boolean;
  stock_count?: number;
  sku?: string;
  keywords: string[];
  path: string;
  feed_source: string;
}

// Product categorization functions
function categorizeProduct(description: string, title: string): string {
  const text = `${title} ${description}`.toLowerCase();
  
  if (text.includes('ørering') || text.includes('øre') || text.includes('earring')) {
    return 'øreringe';
  } else if (text.includes('ring') && !text.includes('ørering')) {
    return 'ringe';
  } else if (text.includes('armbånd') || text.includes('armband') || text.includes('bracelet')) {
    return 'armbånd';
  } else if (text.includes('vedhæng') || text.includes('vedhang') || text.includes('pendant') || text.includes('charm')) {
    return 'vedhæng';
  } else if (text.includes('halskæde') || text.includes('halskade') || text.includes('necklace') || text.includes('kæde') || text.includes('kade')) {
    return 'halskæder';
  } else if (text.includes('ørestik') || text.includes('ørestikker') || text.includes('stud')) {
    return 'ørestikker';
  } else {
    return 'andet';
  }
}

function categorizeMaterial(description: string, title: string): string {
  const text = `${title} ${description}`.toLowerCase();
  
  if (text.includes('guld') || text.includes('gold')) {
    return 'guld';
  } else if (text.includes('sølv') || text.includes('silver')) {
    return 'sølv';
  } else if (text.includes('diamant') || text.includes('diamond')) {
    return 'diamant';
  } else if (text.includes('perle') || text.includes('pearl')) {
    return 'perle';
  } else if (text.includes('platinum') || text.includes('platin')) {
    return 'platin';
  } else {
    return 'andet';
  }
}

function categorizeBrand(product: RawProduct): string {
  // First, try to use the brand field directly if it exists and is not empty
  const directBrand = product?.brand?.[0];
  if (directBrand && directBrand.trim() && directBrand.toLowerCase() !== 'ukendt') {
    return directBrand.trim();
  }

  // If no direct brand, try to extract from title or description
  const title = product?.produktnavn?.[0] || '';
  const description = product?.beskrivelse?.[0] || '';
  const text = `${title} ${description}`.toLowerCase();

  // Common jewelry brands
  const brandPatterns = [
    { pattern: /pandora/i, brand: 'Pandora' },
    { pattern: /julie sandlau/i, brand: 'Julie Sandlau' },
    { pattern: /maria black/i, brand: 'Maria Black' },
    { pattern: /georg jensen/i, brand: 'Georg Jensen' },
    { pattern: /tiffany/i, brand: 'Tiffany & Co.' },
    { pattern: /cartier/i, brand: 'Cartier' },
    { pattern: /bulgari/i, brand: 'Bulgari' },
    { pattern: /chopard/i, brand: 'Chopard' },
    { pattern: /bylgja/i, brand: 'Bylgja' },
    { pattern: /nuran/i, brand: 'Nuran' },
    { pattern: /sif jakobsen/i, brand: 'Sif Jakobsen' },
    { pattern: /sophie bille brahe/i, brand: 'Sophie Bille Brahe' },
    { pattern: /michael michaud/i, brand: 'Michael Michaud' },
    { pattern: /david yurman/i, brand: 'David Yurman' },
    { pattern: /swarovski/i, brand: 'Swarovski' },
    { pattern: /thomas sabo/i, brand: 'Thomas Sabo' },
    { pattern: /links of london/i, brand: 'Links of London' },
    { pattern: /monica vinader/i, brand: 'Monica Vinader' },
    { pattern: /mejuri/i, brand: 'Mejuri' },
    { pattern: /catbird/i, brand: 'Catbird' }
  ];

  for (const { pattern, brand } of brandPatterns) {
    if (pattern.test(text)) {
      return brand;
    }
  }

  return 'Ukendt';
}

// Standalone feed fetcher for Supabase (no local database dependency)
export class SupabaseFeedFetcher {
  async fetchSingleFeed(feedUrl: string): Promise<RawProduct[]> {
    try {
      console.log(`🔄 Fetching feed: ${feedUrl}`);
      
      const response = await fetch(feedUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; JewelryBot/1.0)',
        },
        // Add timeout
        signal: AbortSignal.timeout(30000) // 30 seconds timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const buffer = await response.arrayBuffer();
      const xml = iconv.decode(Buffer.from(buffer), "iso-8859-1");

      if (xml.includes("Feedid findes ikke")) {
        console.warn(`⚠️ Feed not found: ${feedUrl}`);
        return [];
      }

      const parsed = await xml2js.parseStringPromise(xml, {
        explicitArray: true,
        trim: true,
        normalize: true
      });

      const products = parsed?.produkter?.produkt || [];
      console.log(`✅ ${products.length} products fetched from ${feedUrl}`);
      
      return products;
    } catch (error) {
      console.error(`❌ Error fetching feed ${feedUrl}:`, error);
      return [];
    }
  }

  normalizeProduct(rawProduct: RawProduct, feedUrl: string): NormalizedProduct | null {
    try {
      const title = rawProduct.produktnavn?.[0];
      const description = rawProduct.beskrivelse?.[0];
      const externalId = rawProduct.produktid?.[0];
      const price = parseFloat(rawProduct.nypris?.[0] || '0');
      const oldPrice = rawProduct.glpris?.[0] ? parseFloat(rawProduct.glpris[0]) : undefined;
      
      // Parse stock count - handle both numeric and text values
      let stockCount: number | undefined;
      const lagerantal = rawProduct.lagerantal?.[0];
      if (lagerantal) {
        if (lagerantal.toLowerCase().includes('in stock') || lagerantal.toLowerCase().includes('på lager')) {
          stockCount = 999; // Assume in stock with high number
        } else {
          const parsed = parseInt(lagerantal);
          stockCount = isNaN(parsed) ? undefined : parsed;
        }
      }

      // Skip invalid products
      if (!title || !externalId || !price || price <= 0) {
        return null;
      }

      const category = categorizeProduct(description || '', title);
      const material = categorizeMaterial(description || '', title);
      const brand = categorizeBrand(rawProduct);
      const discount = oldPrice ? oldPrice - price : undefined;
      const keywords = title.split(' ').filter(word => word.length > 2);
      const path = title.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 100);

      return {
        external_id: externalId,
        title,
        description: description || '',
        brand,
        category,
        material,
        price,
        old_price: oldPrice,
        discount,
        image_url: rawProduct.billedurl?.[0],
        product_url: rawProduct.vareurl?.[0],
        shop: rawProduct.forhandler?.[0],
        in_stock: stockCount !== undefined && stockCount > 0,
        stock_count: stockCount,
        sku: rawProduct.ean?.[0],
        keywords,
        path,
        feed_source: feedUrl
      };
    } catch (error) {
      console.error('Error normalizing product:', error);
      return null;
    }
  }
}

// Export singleton instance
export const supabaseFeedFetcher = new SupabaseFeedFetcher();
