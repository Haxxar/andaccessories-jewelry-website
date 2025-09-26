import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'products.db');

// Ensure data directory exists
import fs from 'fs';
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Function to check if table exists
function tableExists(tableName: string): boolean {
  const result = db.prepare(`
    SELECT name FROM sqlite_master 
    WHERE type='table' AND name=?
  `).get(tableName);
  return !!result;
}

// Function to check if column exists in table
function columnExists(tableName: string, columnName: string): boolean {
  const result = db.prepare(`
    PRAGMA table_info(${tableName})
  `).all();
  return result.some((col: unknown) => (col as { name: string }).name === columnName);
}

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    external_id TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    brand TEXT,
    category TEXT NOT NULL,
    material TEXT,
    price REAL NOT NULL,
    old_price REAL,
    discount REAL,
    currency TEXT DEFAULT 'DKK',
    image_url TEXT,
    product_url TEXT NOT NULL,
    shop TEXT,
    in_stock BOOLEAN DEFAULT 1,
    stock_count INTEGER,
    sku TEXT,
    keywords TEXT, -- JSON array as string
    path TEXT, -- URL-friendly path
    feed_source TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS feed_sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT UNIQUE NOT NULL,
    name TEXT,
    last_fetched DATETIME,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS feed_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    feed_source_id INTEGER,
    status TEXT NOT NULL, -- 'success', 'error', 'partial'
    products_fetched INTEGER DEFAULT 0,
    products_updated INTEGER DEFAULT 0,
    error_message TEXT,
    execution_time_ms INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (feed_source_id) REFERENCES feed_sources (id)
  );

  CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
  CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
  CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
  CREATE INDEX IF NOT EXISTS idx_products_updated_at ON products(updated_at);
  CREATE INDEX IF NOT EXISTS idx_products_external_id ON products(external_id);
`);

// Handle database migrations for existing databases
try {
  // Check if feed_sources table exists and has the status column
  if (tableExists('feed_sources') && !columnExists('feed_sources', 'status')) {
    console.log('Adding status column to feed_sources table...');
    db.exec('ALTER TABLE feed_sources ADD COLUMN status TEXT DEFAULT "active"');
  }
  
  // Check if feed_sources table exists and has the last_fetched column
  if (tableExists('feed_sources') && !columnExists('feed_sources', 'last_fetched')) {
    console.log('Adding last_fetched column to feed_sources table...');
    db.exec('ALTER TABLE feed_sources ADD COLUMN last_fetched DATETIME');
  }
  
  // Check if feed_sources table exists and has the created_at column
  if (tableExists('feed_sources') && !columnExists('feed_sources', 'created_at')) {
    console.log('Adding created_at column to feed_sources table...');
    db.exec('ALTER TABLE feed_sources ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP');
  }
} catch (error) {
  console.warn('Migration warning:', error);
}

// Insert default feed sources
const insertFeedSource = db.prepare(`
  INSERT OR IGNORE INTO feed_sources (url, name, status) VALUES (?, ?, ?)
`);

const defaultFeeds = [
  ['https://www.partner-ads.com/dk/feed_udlaes.php?partnerid=50210&bannerid=90897&feedid=2357', 'Partner Ads Feed 1'],
  ['ta', 'Partner Ads Feed 2'],
  ['https://www.partner-ads.com/dk/feed_udlaes.php?partnerid=50210&bannerid=75785&feedid=1728', 'Partner Ads Feed 3'],
  ['https://www.partner-ads.com/dk/feed_udlaes.php?partnerid=50210&bannerid=107324&feedid=3381', 'Partner Ads Feed 4'],
  ['https://www.partner-ads.com/dk/feed_udlaes.php?partnerid=50210&bannerid=97470&feedid=2704', 'Partner Ads Feed 5'],
  ['https://www.partner-ads.com/dk/feed_udlaes.php?partnerid=50210&bannerid=99218&feedid=2803', 'Partner Ads Feed 6'],
];

defaultFeeds.forEach(([url, name]) => {
  insertFeedSource.run(url, name, 'active');
});

// Prepared statements for better performance
export const dbStatements = {
  db: db, // Export the database instance
  // Product operations
  insertProduct: db.prepare(`
    INSERT OR REPLACE INTO products (
      external_id, title, description, brand, category, material, price, old_price, 
      discount, image_url, product_url, shop, in_stock, stock_count, sku, 
      keywords, path, feed_source, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `),
  
  getProductById: db.prepare('SELECT * FROM products WHERE id = ?'),
  getProductByExternalId: db.prepare('SELECT * FROM products WHERE external_id = ?'),
  
  getProductsByCategory: db.prepare(`
    SELECT * FROM products 
    WHERE category = ? AND in_stock = 1 
    ORDER BY updated_at DESC 
    LIMIT ? OFFSET ?
  `),
  
  getProductsByBrand: db.prepare(`
    SELECT * FROM products 
    WHERE brand = ? AND in_stock = 1 
    ORDER BY updated_at DESC 
    LIMIT ? OFFSET ?
  `),
  
  searchProducts: db.prepare(`
    SELECT * FROM products 
    WHERE (title LIKE ? OR description LIKE ? OR brand LIKE ?) 
    AND in_stock = 1 
    ORDER BY updated_at DESC 
    LIMIT ? OFFSET ?
  `),
  
  getAllProducts: db.prepare(`
    SELECT * FROM products 
    WHERE in_stock = 1 
    ORDER BY updated_at DESC 
    LIMIT ? OFFSET ?
  `),
  
  getProductCount: db.prepare('SELECT COUNT(*) as count FROM products WHERE in_stock = 1'),
  getProductCountByCategory: db.prepare('SELECT COUNT(*) as count FROM products WHERE category = ? AND in_stock = 1'),
  
  // Feed source operations
  updateFeedSourceLastFetched: db.prepare(`
    UPDATE feed_sources SET last_fetched = CURRENT_TIMESTAMP WHERE url = ?
  `),
  
  getFeedSources: db.prepare('SELECT * FROM feed_sources WHERE status = ?'),
  
  // Feed log operations
  insertFeedLog: db.prepare(`
    INSERT INTO feed_logs (
      feed_source_id, status, products_fetched, products_updated, 
      error_message, execution_time_ms
    ) VALUES (?, ?, ?, ?, ?, ?)
  `),
  
  getRecentFeedLogs: db.prepare(`
    SELECT fl.*, fs.name as feed_name, fs.url as feed_url
    FROM feed_logs fl
    LEFT JOIN feed_sources fs ON fl.feed_source_id = fs.id
    ORDER BY fl.created_at DESC
    LIMIT ?
  `),
  
  // Cleanup operations
  deleteOldProducts: db.prepare(`
    DELETE FROM products 
    WHERE updated_at < datetime('now', '-7 days')
  `),
  
  deleteOldLogs: db.prepare(`
    DELETE FROM feed_logs 
    WHERE created_at < datetime('now', '-30 days')
  `)
};

export default db;
