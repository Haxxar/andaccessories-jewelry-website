
import ProductDetail from './ProductDetail';
import { Metadata } from 'next';
import path from 'path';
import fs from 'fs';

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const dbPath = path.join(process.cwd(), 'data', 'products.db');
    if (fs.existsSync(dbPath)) {
      const Database = require('better-sqlite3');
      const db = new Database(dbPath);
      
      const product = db.prepare(`
        SELECT title, description, brand, category, price, old_price, image_url, shop
        FROM products 
        WHERE id = ? AND in_stock = 1
      `).get(id);
      
      db.close();
      
      if (product) {
        const title = `${product.title} - ${product.brand} | &Accessories`;
        const description = product.description || `Køb ${product.title} fra ${product.brand} til kun ${product.price} kr. Gratis levering og hurtig service hos &Accessories.`;
        
        return {
          title,
          description,
          keywords: `${product.title}, ${product.brand}, ${product.category}, smykker, ${product.material || ''}`,
          openGraph: {
            title,
            description,
            images: product.image_url ? [product.image_url] : ['/android-chrome-512x512.png'],
            type: 'product',
            siteName: '&Accessories',
            locale: 'da_DK',
          },
          twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: product.image_url ? [product.image_url] : ['/android-chrome-512x512.png'],
          },
          alternates: {
            canonical: `/produkt/${id}`,
          },
        };
      }
    }
  } catch (error) {
    console.error('Error generating product metadata:', error);
  }
  
  // Fallback metadata
  return {
    title: `Produkt ${id} | &Accessories`,
    description: 'Opdag smukke smykker hos &Accessories - Danmarks bedste smykkeudvalg.',
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductDetail productId={id} />;
}
