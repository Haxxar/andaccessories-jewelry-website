# Jewelry Affiliate Website - Database & Feed System Setup

This document explains how to set up the database and product feed system for your jewelry affiliate marketing website.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Initialize Database

Run the database initialization script to create the database and fetch initial product data:

```bash
npm run init-db
```

This will:
- Create the SQLite database in `data/products.db`
- Set up all necessary tables
- Fetch products from all partner feeds
- Normalize and categorize the products
- Store them in the database

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📊 System Overview

### Database Schema

The system uses SQLite with the following main tables:

- **products**: Normalized product data with categorization
- **feed_sources**: Configuration for partner feed URLs
- **feed_logs**: Logs of feed update operations

### Product Feed Processing

1. **Fetch**: Downloads XML feeds from partner URLs
2. **Parse**: Converts XML to structured data using xml2js
3. **Normalize**: Categorizes products by type, material, and brand
4. **Store**: Saves to database with proper indexing

### Categorization System

The system automatically categorizes products based on:

- **Product Type**: Øreringe, Ringe, Armbånd, Vedhæng, Halskæder, Ørestikker
- **Material**: Guld, Sølv, Diamant, Perle
- **Brand**: Julie Sandlau, Pandora, Maria Black, etc.

## 🔄 Cron Jobs

The system includes automated cron jobs:

- **Daily Feed Update**: Runs at 6 AM to fetch latest products
- **Weekly Cleanup**: Removes old data on Sundays at 2 AM
- **Health Check**: Monitors system status every hour

### Manual Operations

```bash
# Update feeds manually
npm run update-feeds

# Check feed status
curl http://localhost:3000/api/feed/status
```

## 🛠️ API Endpoints

### Products
- `GET /api/products` - List all products with filtering
- `GET /api/products/[id]` - Get specific product details
- `GET /api/categories` - Get categories, brands, and materials

### Feed Management
- `GET /api/feed/status` - Check feed update status
- `POST /api/feed/update` - Trigger manual feed update

### Query Parameters

**Products API:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 50, max: 100)
- `category`: Filter by category
- `brand`: Filter by brand
- `search`: Search in title, description, brand

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
# Optional: Token for manual feed updates in production
FEED_UPDATE_TOKEN=your-secure-token-here

# Database path (optional, defaults to data/products.db)
DATABASE_PATH=./data/products.db
```

### Feed Sources

The system is configured with these partner feeds:
- Partner Ads Feed 1-7 (various jewelry retailers)

To add new feeds, update the `feedUrls` array in `lib/productFeedFetcher.ts`.

## 📈 Monitoring

### Feed Status Dashboard

Visit `/api/feed/status` to see:
- Total product count
- Recent feed update logs
- Cron job status
- System health

### Logs

Feed operations are logged with:
- Success/error status
- Products fetched vs stored
- Execution time
- Error messages

## 🚨 Troubleshooting

### Common Issues

1. **Database not found**: Run `npm run init-db`
2. **Feed fetch errors**: Check network connectivity and feed URLs
3. **Cron jobs not running**: Ensure the application is running in production mode

### Manual Database Operations

```bash
# Reset database (WARNING: Deletes all data)
rm data/products.db
npm run init-db

# Check database integrity
sqlite3 data/products.db "PRAGMA integrity_check;"
```

## 🔒 Production Deployment

### Security Considerations

1. Set `FEED_UPDATE_TOKEN` for manual feed updates
2. Use proper database backups
3. Monitor feed update logs
4. Set up proper error alerting

### Performance Optimization

1. Database indexes are automatically created
2. Feed updates run in background
3. API responses are paginated
4. Old data is automatically cleaned up

## 📝 Development

### Adding New Categorization Rules

Update the categorization functions in `lib/productFeedFetcher.ts`:

```typescript
function categorizeProduct(description: string, title?: string): string {
  const categories = {
    "New Category": ["keyword1", "keyword2"],
    // ... existing categories
  };
  // ... rest of function
}
```

### Extending Product Schema

1. Update database schema in `lib/database.ts`
2. Modify normalization in `lib/productFeedFetcher.ts`
3. Update API responses
4. Run database migration

## 🎯 Next Steps

1. **Customize categorization**: Adjust the categorization rules for your specific needs
2. **Add more feeds**: Include additional partner feeds
3. **Enhance UI**: Update the frontend to better display the normalized data
4. **Add analytics**: Track product performance and user interactions
5. **Implement caching**: Add Redis or similar for better performance

## 📞 Support

For issues or questions:
1. Check the logs in `/api/feed/status`
2. Review the database directly with SQLite tools
3. Check the console output during feed updates

