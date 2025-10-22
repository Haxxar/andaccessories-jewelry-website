
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatPriceWithCurrency } from '../../../lib/priceFormatter';
import { enhancedAffiliateTracker } from '../../../lib/enhancedAffiliateTracker';

interface Product {
  id: number;
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
  created_at: string;
  updated_at: string;
}

interface ProductDetailProps {
  productId: string;
}

export default function ProductDetail({ productId }: ProductDetailProps) {
  // const [selectedImageIndex] = useState(0); // Currently unused - for future image gallery
  const [activeTab, setActiveTab] = useState('produktdetaljer');
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Enhanced affiliate tracking that works across browser sessions
  const trackClick = (url: string) => enhancedAffiliateTracker.trackClick(url);

  useEffect(() => {
    // Initialize enhanced affiliate tracking
    enhancedAffiliateTracker.setTracking();
    
    async function fetchProduct() {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${productId}`);
        const data = await response.json();
        
        if (data.success) {
          setProduct(data.data);
        } else {
          setError(data.error || 'Product not found');
        }
      } catch (err) {
        setError('Failed to fetch product');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-yellow-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Indlæser produkt...</h1>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-yellow-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {error || 'Produkt ikke fundet'}
          </h1>
          <Link href="/" className="bg-gradient-to-r from-yellow-400 to-pink-400 text-white px-6 py-3 rounded-full hover:from-yellow-500 hover:to-pink-500 transition-all whitespace-nowrap">
            Tilbage til forsiden
          </Link>
        </div>
      </div>
    );
  }

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": product.brand
    },
    "category": product.category,
    "sku": product.sku || product.external_id,
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "DKK",
      "availability": product.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": product.shop
      },
      "url": product.product_url
    },
    "image": product.image_url,
    "url": `https://andaccessories.dk/produkt/${productId}`,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.5",
      "reviewCount": "1"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-yellow-100">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <img 
                src="/favicon-32x32.png" 
                alt="&Accessories Logo" 
                className="w-8 h-8"
              />
              <h1 className="font-['Pacifico'] text-2xl bg-gradient-to-r from-yellow-600 to-pink-600 bg-clip-text text-transparent">
                &Accessories
              </h1>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-pink-600 transition-colors">
                Hjem
              </Link>
              <Link href="/kategorier" className="text-gray-700 hover:text-pink-600 transition-colors">
                Kategorier
              </Link>
              <Link href="/brands" className="text-gray-700 hover:text-pink-600 transition-colors">
                Mærker
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-pink-600 transition-colors">Hjem</Link>
          <i className="ri-arrow-right-s-line"></i>
          <Link href={`/kategori/${product.category.toLowerCase()}`} className="hover:text-pink-600 transition-colors capitalize">
            {product.category}
          </Link>
          <i className="ri-arrow-right-s-line"></i>
          <span className="text-gray-800">{product.title}</span>
        </nav>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-lg">
              <img
                src={product.image_url || '/placeholder-jewelry.svg'}
                alt={product.title}
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-jewelry.svg';
                }}
              />
            </div>
            
            {/* Single image for now - can be extended to support multiple images */}
            {product.image_url && (
              <div className="flex space-x-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-pink-400 ring-2 ring-pink-200">
                    <img
                      src={product.image_url}
                      alt={product.title}
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-jewelry.svg';
                      }}
                    />
                </div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="text-pink-600 font-medium mb-2">{product.brand}</div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">{product.title}</h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-gray-800">{formatPriceWithCurrency(product.price)}</span>
                {product.old_price && product.old_price > product.price && (
                  <>
                    <span className="text-xl text-gray-400 line-through">{formatPriceWithCurrency(product.old_price)}</span>
                    <span className="bg-gradient-to-r from-yellow-400 to-pink-400 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {Math.round((1 - product.price / product.old_price) * 100)}% rabat
                    </span>
                  </>
                )}
              </div>

              <div className="flex items-center space-x-2 mb-6">
                {product.in_stock ? (
                  <>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-green-600 font-medium">
                      På lager {product.stock_count ? `(${product.stock_count} stk.)` : ''}
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <span className="text-red-600 font-medium">Udsolgt</span>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <a
                href={product.in_stock ? trackClick(product.product_url) : '#'}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full block text-center py-4 rounded-xl text-lg font-semibold transition-all whitespace-nowrap ${
                  product.in_stock
                    ? 'bg-gradient-to-r from-yellow-400 to-pink-400 text-white hover:from-yellow-500 hover:to-pink-500 transform hover:scale-105'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                onClick={product.in_stock ? undefined : (e) => e.preventDefault()}
              >
                {product.in_stock ? 'Køb Nu - Gå til Forhandler' : 'Udsolgt'}
              </a>
              
              <p className="text-sm text-gray-600 text-center">
                Du bliver videresendt til {product.shop} for at gennemføre købet
              </p>
            </div>

            {/* Product Description */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-pink-100">
              <h3 className="font-semibold text-gray-800 mb-4">Produktbeskrivelse</h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 text-lg leading-relaxed">{product.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="border-b border-pink-100">
            <nav className="flex space-x-8">
              {['produktdetaljer', 'specifikationer'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap cursor-pointer ${
                    activeTab === tab
                      ? 'border-pink-500 text-pink-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === 'produktdetaljer' && (
              <div className="bg-white rounded-xl p-6 shadow-lg border border-pink-100">
                <h3 className="font-semibold text-gray-800 mb-4">Produktegenskaber</h3>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-3">
                    <i className="ri-check-line text-green-500"></i>
                    <span className="text-gray-700">Materiale: {product.material}</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <i className="ri-check-line text-green-500"></i>
                    <span className="text-gray-700">Kategori: {product.category}</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <i className="ri-check-line text-green-500"></i>
                    <span className="text-gray-700">Mærke: {product.brand}</span>
                  </li>
                  {product.sku && (
                    <li className="flex items-center space-x-3">
                      <i className="ri-check-line text-green-500"></i>
                      <span className="text-gray-700">SKU: {product.sku}</span>
                    </li>
                  )}
                </ul>
              </div>
            )}

            {activeTab === 'specifikationer' && (
              <div className="bg-white rounded-xl p-6 shadow-lg border border-pink-100">
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-b border-gray-100 pb-2">
                    <dt className="font-medium text-gray-800">Produkt ID</dt>
                    <dd className="text-gray-600">{product.external_id}</dd>
                  </div>
                  <div className="border-b border-gray-100 pb-2">
                    <dt className="font-medium text-gray-800">Materiale</dt>
                    <dd className="text-gray-600">{product.material}</dd>
                  </div>
                  <div className="border-b border-gray-100 pb-2">
                    <dt className="font-medium text-gray-800">Kategori</dt>
                    <dd className="text-gray-600">{product.category}</dd>
                  </div>
                  <div className="border-b border-gray-100 pb-2">
                    <dt className="font-medium text-gray-800">Mærke</dt>
                    <dd className="text-gray-600">{product.brand}</dd>
                  </div>
                  <div className="border-b border-gray-100 pb-2">
                    <dt className="font-medium text-gray-800">Forhandler</dt>
                    <dd className="text-gray-600">{product.shop}</dd>
                  </div>
                  {product.sku && (
                    <div className="border-b border-gray-100 pb-2">
                      <dt className="font-medium text-gray-800">SKU</dt>
                      <dd className="text-gray-600">{product.sku}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
