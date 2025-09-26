import iconv from 'iconv-lite';
import xml2js from 'xml2js';
import { dbStatements } from './database';

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
  product_url: string;
  shop: string;
  in_stock: boolean;
  stock_count?: number;
  sku?: string;
  keywords: string[];
  path: string;
  feed_source: string;
}

// Enhanced categorization functions
function categorizeProduct(description: string, title?: string): string {
  const categories = {
    "Øreringe": ["earring", "earrings", "øreringe", "hoop", "hoops", "ørehængere", "ørering", "ørepynt", "ear", "creoler", "creol", "halvcreoler", "halvcreol", "ørekæde", "ørekæder"],
    "Ringe": ["ring", "rings", "ringe"],
    "Armbånd": ["bracelet", "bracelets", "armbånd", "armlænke", "armring"],
    "Vedhæng": ["pendant", "pendants", "vedhæng", "charm"],
    "Halskæder": ["necklace", "necklaces", "halskæder", "halskæde", "collier", "chain", "kæde", "kæder"],
    "Ørestikker": ["stud", "studs", "ørestikker", "ørestik"],
  };

  const searchText = `${description || ''} ${title || ''}`.toLowerCase();
  
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => searchText.includes(keyword))) {
      return category;
    }
  }
  
  // If no category is found, try to make an educated guess based on common jewelry terms
  if (searchText.includes('smykke') || searchText.includes('jewelry') || searchText.includes('accessory')) {
    return "Vedhæng"; // Default to pendant/accessory category
  }
  
  return "Vedhæng"; // Default fallback category
}

function categorizeMaterial(description: string, title?: string): string {
  const materials = {
    "Guld": ["guld", "platin", "gold", "hvidguld", "rødguld", "rosaguld", "14 karat", "18 karat", "24 karat", "585 guld", "750 guld", "999 guld"],
    "Sølv": ["sølv", "sterling sølv", "925 sølv", "925s", "silver"],
    "Diamant": ["diamant", "diamond", "brilliant"],
    "Perle": ["perle", "pearl", "ferskvandsperle"],
  };

  const searchText = `${description || ''} ${title || ''}`.toLowerCase();
  
  for (const [material, keywords] of Object.entries(materials)) {
    if (keywords.some(keyword => searchText.includes(keyword))) {
      return material;
    }
  }
  
  // If no material is found, try to make an educated guess
  if (searchText.includes('metal') || searchText.includes('metallisk') || searchText.includes('forgyldt')) {
    return "Sølv"; // Default to silver for metal items
  }
  
  return "Sølv"; // Default fallback material
}

function categorizeBrand(product: RawProduct): string {
  // First, try to use the brand field directly if it exists and is not empty
  const directBrand = product?.brand?.[0];
  if (directBrand && directBrand.trim() && directBrand.toLowerCase() !== 'unknown') {
    // Clean up the brand name
    return directBrand.trim();
  }

  // If no direct brand, try to extract from other fields
  const brands = {
    "Julie Sandlau": ["julie sandlau"],
    "Abelstedt": ["abelstedt"],
    "ANNEBRAUNER": ["annebrauner", "charms"],
    "Dirks Jewellery": ["dirks jewellery", "dirks"],
    "Maria Black": ["maria black"],
    "Maanesten": ["maanesten"],
    "Pernille Corydon": ["pernille corydon"],
    "Vincent": ["vincent"],
    "Sif Jakobs": ["sif jakobs"],
    "Polar": ["polar"],
    "Carré": ["carré"],
    "Jane Kønig": ["jane kønig"],
    "Ragbag": ["ragbag"],
    "byBiehl": ["bybiehl"],
    "Pandora": ["pandora"],
    "Tiffany": ["tiffany"],
    "Cartier": ["cartier"],
    "Swarovski": ["swarovski"],
    "Chopard": ["chopard"],
    "Bulgari": ["bulgari"],
    "Van Cleef & Arpels": ["van cleef", "arpels"],
    "Harry Winston": ["harry winston"],
    "Graff": ["graff"],
    "Mikimoto": ["mikimoto"],
    "Bvlgari": ["bvlgari"],
    "Piaget": ["piaget"],
    "Jaeger-LeCoultre": ["jaeger", "lecoultre"],
    "Rolex": ["rolex"],
    "Omega": ["omega"],
    "Tag Heuer": ["tag heuer", "tag"],
    "Breitling": ["breitling"],
    "IWC": ["iwc"],
    "Panerai": ["panerai"],
    "Hublot": ["hublot"],
    "Audemars Piguet": ["audemars", "piguet"],
    "Patek Philippe": ["patek", "philippe"],
    "Vacheron Constantin": ["vacheron", "constantin"],
  };

  const searchFields = [
    product?.brand?.[0],
    product?.forhandler?.[0],
    product?.beskrivelse?.[0],
    product?.produktnavn?.[0],
    product?.vareurl?.[0] // Sometimes brand info is in the URL
  ].filter(Boolean).join(' ').toLowerCase();

  for (const [brand, keywords] of Object.entries(brands)) {
    if (keywords.some(keyword => searchFields.includes(keyword))) {
      return brand;
    }
  }

  // If we still can't find a brand, try to extract from the shop/forhandler field
  const shop = product?.forhandler?.[0];
  if (shop && shop.trim()) {
    return shop.trim();
  }

  // If no brand is found, use a generic brand name
  return "Generisk Mærke";
}

// Main feed fetcher class
export class ProductFeedFetcher {
  private feedUrls: string[] = [
    'https://www.partner-ads.com/dk/feed_udlaes.php?partnerid=50210&bannerid=90897&feedid=2357',
    'https://www.partner-ads.com/dk/feed_udlaes.php?partnerid=50210&bannerid=100221&feedid=2878',
    'https://www.partner-ads.com/dk/feed_udlaes.php?partnerid=50210&bannerid=107324&feedid=3381',
    'https://www.partner-ads.com/dk/feed_udlaes.php?partnerid=50210&bannerid=99218&feedid=2803',
    'https://www.partner-ads.com/dk/feed_udlaes.php?partnerid=50210&bannerid=112634&feedid=3858',
    'https://www.partner-ads.com/dk/feed_udlaes.php?partnerid=50210&bannerid=102133&feedid=3003',
    'https://www.partner-ads.com/dk/feed_udlaes.php?partnerid=50210&bannerid=106164&feedid=3290',
    'https://www.partner-ads.com/dk/feed_udlaes.php?partnerid=50210&bannerid=81998&feedid=1965',
    'https://www.partner-ads.com/dk/feed_udlaes.php?partnerid=50210&bannerid=112943&feedid=3880',
    'https://www.partner-ads.com/dk/feed_udlaes.php?partnerid=50210&bannerid=111261&feedid=3711',
];

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
        product_url: rawProduct.vareurl?.[0] || '',
        shop: rawProduct.forhandler?.[0] || '',
        in_stock: stockCount !== undefined ? stockCount > 0 : true, // Default to in stock if no stock info
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

  async fetchAndStoreAllFeeds(): Promise<{ success: number; errors: number; total: number }> {
    const startTime = Date.now();
    let totalFetched = 0;
    let totalStored = 0;
    let errors = 0;

    console.log('🚀 Starting product feed fetch...');

    for (const feedUrl of this.feedUrls) {
      try {
        const rawProducts = await this.fetchSingleFeed(feedUrl);
        totalFetched += rawProducts.length;

        // Normalize and store products
        let storedCount = 0;
        for (const rawProduct of rawProducts) {
          const normalizedProduct = this.normalizeProduct(rawProduct, feedUrl);
          if (normalizedProduct) {
            try {
              dbStatements.insertProduct.run(
                normalizedProduct.external_id,
                normalizedProduct.title,
                normalizedProduct.description,
                normalizedProduct.brand,
                normalizedProduct.category,
                normalizedProduct.material,
                normalizedProduct.price,
                normalizedProduct.old_price,
                normalizedProduct.discount,
                normalizedProduct.image_url,
                normalizedProduct.product_url,
                normalizedProduct.shop,
                normalizedProduct.in_stock ? 1 : 0,
                normalizedProduct.stock_count,
                normalizedProduct.sku,
                JSON.stringify(normalizedProduct.keywords),
                normalizedProduct.path,
                normalizedProduct.feed_source
              );
              storedCount++;
            } catch (dbError) {
              console.error('Database error storing product:', dbError);
            }
          }
        }

        totalStored += storedCount;
        
        // Update feed source last fetched time
        dbStatements.updateFeedSourceLastFetched.run(feedUrl);
        
        // Log the feed operation
        const executionTime = Date.now() - startTime;
        dbStatements.insertFeedLog.run(
          null, // feed_source_id (we'll get this from URL later)
          'success',
          rawProducts.length,
          storedCount,
          null,
          executionTime
        );

        console.log(`✅ Stored ${storedCount}/${rawProducts.length} products from ${feedUrl}`);
      } catch (error) {
        errors++;
        console.error(`❌ Failed to process feed ${feedUrl}:`, error);
        
        // Log the error
        const executionTime = Date.now() - startTime;
        dbStatements.insertFeedLog.run(
          null,
          'error',
          0,
          0,
          error instanceof Error ? error.message : 'Unknown error',
          executionTime
        );
      }
    }

    const totalTime = Date.now() - startTime;
    console.log(`🎉 Feed fetch completed in ${totalTime}ms. Total: ${totalFetched} fetched, ${totalStored} stored, ${errors} errors`);

    return {
      success: totalStored,
      errors,
      total: totalFetched
    };
  }

  // Method to get products by category (for API endpoints)
  getProductsByCategory(category: string, limit: number = 50, offset: number = 0, sort: string = 'newest'): Product[] {
    return this.getProductsWithSort(`AND category = ?`, limit, offset, sort, [category]);
  }

  // Method to get products by brand (for API endpoints)
  getProductsByBrand(brand: string, limit: number = 50, offset: number = 0, sort: string = 'newest'): Product[] {
    return this.getProductsWithSort(`AND brand = ?`, limit, offset, sort, [brand]);
  }

  // Method to search products
  searchProducts(query: string, limit: number = 50, offset: number = 0, sort: string = 'newest'): Product[] {
    const searchTerm = `%${query}%`;
    return this.getProductsWithSort(`AND (title LIKE ? OR description LIKE ? OR brand LIKE ?)`, limit, offset, sort, [searchTerm, searchTerm, searchTerm]);
  }

  // Method to get all products
  getAllProducts(limit: number = 50, offset: number = 0, sort: string = 'newest'): Product[] {
    return this.getProductsWithSort('', limit, offset, sort);
  }

  // Helper method to get products with custom sorting
  private getProductsWithSort(whereClause: string, limit: number, offset: number, sort: string, params: string[] = []): Product[] {
    let orderBy = '';
    
    switch (sort) {
      case 'newest':
        orderBy = 'ORDER BY updated_at DESC';
        break;
      case 'price-low':
        orderBy = 'ORDER BY price ASC';
        break;
      case 'price-high':
        orderBy = 'ORDER BY price DESC';
        break;
      case 'brand':
        orderBy = 'ORDER BY brand ASC';
        break;
      case 'random':
        orderBy = 'ORDER BY RANDOM()';
        break;
      default:
        orderBy = 'ORDER BY updated_at DESC';
    }

    const query = `
      SELECT * FROM products 
      WHERE in_stock = 1 
      ${whereClause}
      ${orderBy}
      LIMIT ? OFFSET ?
    `;
    
    const allParams = [...params, limit, offset];
    return dbStatements.db.prepare(query).all(...allParams);
  }

  // Method to get featured products (biggest discounts)
  getFeaturedProducts(limit: number = 8): Product[] {
    const query = `
      SELECT * FROM products 
      WHERE in_stock = 1 
      AND old_price IS NOT NULL 
      AND old_price > price 
      AND old_price > 0
      ORDER BY ((old_price - price) / old_price) DESC
      LIMIT ?
    `;
    return dbStatements.db.prepare(query).all(limit);
  }

  // Method to get product by ID
  getProductById(id: number): Product | undefined {
    return dbStatements.getProductById.get(id);
  }

  // Method to get product by external ID
  getProductByExternalId(externalId: string): Product | undefined {
    return dbStatements.getProductByExternalId.get(externalId);
  }

  // Method to get product counts
  getProductCount(): number {
    const result = dbStatements.getProductCount.get() as { count: number } | undefined;
    return result?.count || 0;
  }

  getProductCountByCategory(category: string): number {
    const result = dbStatements.getProductCountByCategory.get(category) as { count: number } | undefined;
    return result?.count || 0;
  }

  // Method to get recent feed logs
  getRecentFeedLogs(limit: number = 10): { id: number; feed_source: string; status: string; products_fetched: number; errors: string; created_at: string }[] {
    return dbStatements.getRecentFeedLogs.all(limit);
  }

  // Cleanup method
  cleanupOldData(): void {
    const deletedProducts = dbStatements.deleteOldProducts.run().changes;
    const deletedLogs = dbStatements.deleteOldLogs.run().changes;
    console.log(`🧹 Cleanup: Deleted ${deletedProducts} old products and ${deletedLogs} old logs`);
  }
}

// Export singleton instance
export const productFeedFetcher = new ProductFeedFetcher();
