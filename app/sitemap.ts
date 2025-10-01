import { MetadataRoute } from 'next'
import path from 'path'
import fs from 'fs'
import Database from 'better-sqlite3'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://andaccessories.dk'
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/kategorier`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/brands`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/om-os`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privatlivspolitik`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ]

  // Blog posts
  const blogPosts = [
    'smykkepleje-guide',
    'vaelg-forlovelsesring',
    'smykke-trends-2024',
    'gaver-til-hende-smykker',
    'forskel-guld-typer',
    'kombiner-smykker-stil'
  ]
  
  const blogPages = blogPosts.map(slug => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Category pages
  const categories = [
    'ringe', 'oreringe', 'halskader', 'armband', 'orestikker', 'vedhang'
  ]
  
  const categoryPages = categories.map(category => ({
    url: `${baseUrl}/kategori/${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Product pages - get from database
  let productPages: MetadataRoute.Sitemap = []
  
  try {
    const dbPath = path.join(process.cwd(), 'data', 'products.db')
    if (fs.existsSync(dbPath)) {
      const db = new Database(dbPath)
      
      const products = db.prepare(`
        SELECT id, updated_at 
        FROM products 
        WHERE in_stock = 1 
        ORDER BY updated_at DESC 
        LIMIT 1000
      `).all()
      
      productPages = (products as { id: number; updated_at: string }[]).map((product) => ({
        url: `${baseUrl}/produkt/${product.id}`,
        lastModified: new Date(product.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
      
      db.close()
    }
  } catch (error) {
    console.error('Error generating product sitemap:', error)
  }

  return [...staticPages, ...blogPages, ...categoryPages, ...productPages]
}
