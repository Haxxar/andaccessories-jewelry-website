
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPriceWithCurrency } from '../lib/priceFormatter';
import { useAffiliateTracking } from '../lib/affiliateTracker';

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

interface Category {
  category: string;
  product_count: number;
  min_price: number;
  max_price: number;
  avg_price: number;
}

interface Brand {
  brand: string;
  count: number;
}

interface ApiResponse {
  success: boolean;
  data: {
    products: Product[];
    pagination: {
      page: number;
      limit: number;
      totalCount: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    filters: {
      category?: string;
      brand?: string;
      search?: string;
      sort?: string;
    };
  };
}

const sortOptions = [
  { value: 'random', label: 'Tilfældig rækkefølge' },
  { value: 'newest', label: 'Nyeste først' },
  { value: 'price-low', label: 'Laveste pris' },
  { value: 'price-high', label: 'Højeste pris' },
  { value: 'brand', label: 'Mærke A-Z' }
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('alle');
  const [selectedBrand, setSelectedBrand] = useState('alle');
  const [sortBy, setSortBy] = useState('random');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['alle']);
  const [brands, setBrands] = useState<string[]>(['alle']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    totalCount: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });
  
  // Search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  // Affiliate tracking
  const { trackClick } = useAffiliateTracking();

  // Search function
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      // If search is empty, fetch normal products
      fetchProducts();
      return;
    }

    try {
      setIsSearching(true);
      setError(null);

      const searchParams = new URLSearchParams({
        page: '1',
        limit: '50',
        q: query.trim(),
        ...(selectedCategory !== 'alle' && { category: selectedCategory }),
        ...(selectedBrand !== 'alle' && { brand: selectedBrand }),
        sort: sortBy
      });

      const response = await fetch(`/api/search?${searchParams}`);
      const data = await response.json();

      if (data.success) {
        setProducts(data.data.products);
        setPagination(data.data.pagination);
      } else {
        setError('Søgning fejlede');
      }
    } catch (err) {
      setError('Fejl ved søgning');
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  }, [selectedCategory, selectedBrand, sortBy]);

  // Fetch products function
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      
      const productParams = new URLSearchParams({
        page: '1',
        limit: '50',
        ...(selectedCategory !== 'alle' && { category: selectedCategory }),
        ...(selectedBrand !== 'alle' && { brand: selectedBrand }),
        sort: sortBy
      });

      const [productsResponse, categoriesResponse] = await Promise.all([
        fetch(`/api/products?${productParams}`),
        fetch('/api/categories')
      ]);

      if (productsResponse.ok && categoriesResponse.ok) {
        const productsData: ApiResponse = await productsResponse.json();
        const categoriesData = await categoriesResponse.json();

        if (productsData.success) {
          setProducts(productsData.data.products);
          setPagination(productsData.data.pagination);
        }

        if (categoriesData.success) {
          const allCategories = ['alle', ...categoriesData.data.categories.map((c: Category) => c.category)];
          const allBrands = ['alle', ...categoriesData.data.brands
            .filter((b: Brand) => b.brand && b.brand !== 'andet' && b.brand !== 'Generisk Mærke')
            .map((b: Brand) => b.brand)];
          setCategories(allCategories);
          setBrands(allBrands);
        }
      } else {
        setError('Failed to fetch data');
      }
    } catch (err) {
      setError('Error loading products');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedBrand, sortBy]);

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setIsSearchOpen(false);
    setSortBy('random'); // Reset to default sort
    fetchProducts();
  };

  // Fetch products and categories on mount and when filters change
  useEffect(() => {
    if (!searchQuery.trim()) {
      fetchProducts();
    }
  }, [selectedCategory, selectedBrand, sortBy, fetchProducts, searchQuery]);

  // Handle search when query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      const timeoutId = setTimeout(() => {
        performSearch(searchQuery);
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, performSearch]);

  return (
    <div className="min-h-screen bg-pink-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-pink-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Image 
                src="/favicon-32x32.png" 
                alt="&Accessories Logo" 
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <h1 className="font-['Pacifico'] text-2xl text-pink-600">
                &Accessories
              </h1>
            </div>
            
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
              <Link href="/om-os" className="text-gray-700 hover:text-pink-600 transition-colors">
                Om Os
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="w-6 h-6 flex items-center justify-center"
              >
                <i className="ri-search-line text-xl text-gray-700"></i>
              </button>
              <button className="md:hidden w-6 h-6 flex items-center justify-center">
                <i className="ri-menu-line text-xl text-gray-700"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Drawer */}
      {isSearchOpen && (
        <div className="bg-white border-b border-pink-200 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Søg efter smykker, mærker, materialer..."
                  className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-200 text-lg"
                  autoFocus
                />
                <i className="ri-search-line absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl"></i>
              </div>
              
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              )}
              
              <button
                onClick={() => setIsSearchOpen(false)}
                className="px-4 py-3 bg-pink-100 text-pink-700 rounded-xl hover:bg-pink-200 transition-colors"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            
            {searchQuery && (
              <div className="mt-3 text-sm text-gray-600">
                {isSearching ? 'Søger...' : `Søger efter: "${searchQuery}"`}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hero Section with Animated Jewelry Background - Hidden when searching */}
      {!searchQuery && (
        <section className="relative py-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-pink-50">
          {/* Floating Jewelry Elements */}
          <div className="absolute inset-0">
            {/* Ring Animation */}
            <div className="absolute top-20 left-20 w-12 h-12 animate-spin" style={{ animationDuration: '8s' }}>
              <div className="w-full h-full border-4 border-yellow-300 rounded-full opacity-60 animate-pulse"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-pink-400 rounded-full animate-ping"></div>
            </div>

            {/* Heart Pendant */}
            <div className="absolute top-32 right-32 animate-bounce" style={{ animationDelay: '1s' }}>
              <i className="ri-heart-line text-4xl text-pink-300 opacity-70"></i>
            </div>

            {/* Diamond Shape */}
            <div className="absolute top-40 left-1/3 w-8 h-8 bg-yellow-200 opacity-60 rotate-45 animate-pulse" style={{ animationDelay: '2s' }}></div>

            {/* Chain Links */}
            <div className="absolute top-60 right-20 flex space-x-1 animate-bounce" style={{ animationDelay: '0.5s' }}>
              <div className="w-3 h-6 border-2 border-pink-300 rounded-full opacity-50"></div>
              <div className="w-3 h-6 border-2 border-yellow-300 rounded-full opacity-50"></div>
              <div className="w-3 h-6 border-2 border-pink-300 rounded-full opacity-50"></div>
            </div>

            {/* Earring Pair */}
            <div className="absolute bottom-20 left-40 flex flex-col space-y-2 animate-sway">
              <div className="w-2 h-8 bg-gradient-to-b from-yellow-300 to-pink-300 rounded-full opacity-60"></div>
              <div className="w-4 h-4 bg-pink-300 rounded-full opacity-70"></div>
            </div>

            {/* Bracelet Circle */}
            <div className="absolute bottom-32 right-40 w-16 h-16 border-3 border-dashed border-yellow-300 rounded-full opacity-50 animate-spin" style={{ animationDuration: '12s' }}></div>

            {/* Star Elements */}
            <div className="absolute top-1/4 left-1/2 animate-twinkle">
              <i className="ri-star-line text-2xl text-yellow-400 opacity-60"></i>
            </div>

            <div className="absolute bottom-1/3 left-1/4 animate-twinkle" style={{ animationDelay: '3s' }}>
              <i className="ri-star-fill text-xl text-pink-400 opacity-50"></i>
            </div>

            {/* Necklace Arc */}
            <div className="absolute top-1/2 right-1/4 w-20 h-10 border-t-4 border-yellow-300 rounded-t-full opacity-50 animate-pulse" style={{ animationDelay: '1.5s' }}></div>

            {/* Gem Shapes */}
            <div className="absolute top-1/3 right-1/3 w-6 h-8 bg-gradient-to-b from-pink-200 to-pink-400 opacity-60 clip-path-hexagon animate-float"></div>

            {/* Pearl String */}
            <div className="absolute bottom-40 left-1/2 flex space-x-1 animate-sway" style={{ animationDelay: '2.5s' }}>
              <div className="w-3 h-3 bg-white border border-pink-200 rounded-full opacity-70 shadow-sm"></div>
              <div className="w-3 h-3 bg-white border border-pink-200 rounded-full opacity-70 shadow-sm"></div>
              <div className="w-3 h-3 bg-white border border-pink-200 rounded-full opacity-70 shadow-sm"></div>
              <div className="w-3 h-3 bg-white border border-pink-200 rounded-full opacity-70 shadow-sm"></div>
            </div>

            {/* Crown Element */}
            <div className="absolute top-16 left-1/2 animate-bounce" style={{ animationDelay: '4s' }}>
              <div className="flex items-end space-x-1">
                <div className="w-1 h-4 bg-yellow-300 opacity-60"></div>
                <div className="w-1 h-6 bg-yellow-400 opacity-70"></div>
                <div className="w-1 h-8 bg-yellow-300 opacity-60"></div>
                <div className="w-1 h-6 bg-yellow-400 opacity-70"></div>
                <div className="w-1 h-4 bg-yellow-300 opacity-60"></div>
              </div>
            </div>

            {/* Infinity Symbol */}
            <div className="absolute bottom-1/4 right-1/3 text-3xl text-pink-300 opacity-50 animate-pulse" style={{ animationDelay: '3.5s' }}>
              ∞
            </div>
          </div>

          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-transparent to-white/40"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
              Smykker fra Danmarks største mærker
              <span className="block text-pink-600">
                – samlet ét sted
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Få overblik over eksklusive kollektioner og se de nyeste rabatter på højkvalitetssmykker fra flere af landets førende leverandører.
            </p>
            <button
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-pink-400 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-pink-500 transition-all transform hover:scale-105 whitespace-nowrap cursor-pointer"
            >
              Shop Nu
            </button>
          </div>
        </div>
        </section>
      )}


      {/* Filters */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Filtre</h3>
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="lg:hidden w-6 h-6 flex items-center justify-center"
                >
                  <i className={`ri-${isFilterOpen ? 'close' : 'filter'}-line text-lg text-gray-600`}></i>
                </button>
              </div>
              
              <div className={`space-y-6 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
                {/* Category Filter */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Kategori</h4>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                          selectedCategory === category
                            ? 'bg-yellow-100 text-pink-700 border border-pink-200'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brand Filter */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Mærke</h4>
                  <div className="space-y-2">
                    {brands.map(brand => (
                      <button
                        key={brand}
                        onClick={() => setSelectedBrand(brand)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                          selectedBrand === brand
                            ? 'bg-yellow-100 text-pink-700 border border-pink-200'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {brand.charAt(0).toUpperCase() + brand.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="lg:w-3/4">
            {/* Sort and Results */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <p className="text-gray-600 mb-1">
                  {loading || isSearching ? 'Indlæser...' : `Viser ${pagination.totalCount} produkter`}
                </p>
                {searchQuery && (
                  <p className="text-sm text-pink-600">
                    Søgeresultater for: <span className="font-medium">&ldquo;{searchQuery}&rdquo;</span>
                    <button 
                      onClick={clearSearch}
                      className="ml-2 text-gray-500 hover:text-gray-700 underline"
                    >
                      Ryd søgning
                    </button>
                  </p>
                )}
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-200 pr-8"
                disabled={loading}
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
                <span className="ml-3 text-gray-600">Indlæser produkter...</span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <div className="text-red-600 mb-4">
                  <i className="ri-error-warning-line text-4xl"></i>
                </div>
                <p className="text-gray-600">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 bg-pink-400 text-white px-6 py-2 rounded-lg hover:bg-pink-500 transition-colors"
                >
                  Prøv igen
                </button>
              </div>
            )}

            {/* Product Grid */}
            {!loading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {products.map(product => (
                  <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 border border-pink-100">
                    <Link href={`/produkt/${product.id}`}>
                      <div className="relative aspect-square">
                        <img
                          src={product.image_url || '/placeholder-jewelry.svg'}
                          alt={product.title}
                          className="w-full h-full object-cover object-top"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-jewelry.svg';
                          }}
                        />
                        {!product.in_stock && (
                          <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
                            <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                              Udsolgt
                            </span>
                          </div>
                        )}
                        {product.old_price && product.old_price > product.price && (
                          <div className="absolute top-3 left-3">
                            <span className="bg-pink-400 text-white px-2 py-1 rounded-full text-xs font-medium">
                              {Math.round((1 - product.price / product.old_price) * 100)}% rabat
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>
                    
                    <div className="p-6">
                      <div className="text-sm text-pink-600 font-medium mb-2">{product.brand}</div>
                      <h3 className="font-semibold text-gray-800 mb-2 text-lg">{product.title}</h3>
                      <div className="flex items-center space-x-2 mb-4">
                        <span className="text-2xl font-bold text-gray-800">{formatPriceWithCurrency(product.price)}</span>
                        {product.old_price && product.old_price > product.price && (
                          <span className="text-lg text-gray-400 line-through">{formatPriceWithCurrency(product.old_price)}</span>
                        )}
                      </div>
                      
                      <a
                        href={product.in_stock ? trackClick(product.product_url) : '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full block text-center py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                          product.in_stock
                            ? 'bg-pink-400 text-white hover:bg-pink-500 transform hover:scale-105'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                        onClick={product.in_stock ? undefined : (e) => e.preventDefault()}
                      >
                        {product.in_stock ? 'Køb Nu' : 'Udsolgt'}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No Products */}
            {!loading && !error && products.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <i className="ri-search-line text-4xl"></i>
                </div>
                <p className="text-gray-600">Ingen produkter fundet med de valgte filtre.</p>
                <button 
                  onClick={() => {
                    setSelectedCategory('alle');
                    setSelectedBrand('alle');
                  }} 
                  className="mt-4 bg-pink-400 text-white px-6 py-2 rounded-lg hover:bg-pink-500 transition-colors"
                >
                  Ryd filtre
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-pink-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="/favicon-32x32.png" 
                  alt="&Accessories Logo" 
                  className="w-8 h-8"
                />
                <h3 className="font-['Pacifico'] text-xl text-pink-600">
                  &Accessories
                </h3>
              </div>
              <p className="text-gray-600">
                Din destination for smukke smykker fra de bedste mærker.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Information</h4>
              <ul className="space-y-2">
                <li><Link href="/om-os" className="text-gray-600 hover:text-pink-600 transition-colors">Om Os</Link></li>
                <li><Link href="/privatlivspolitik" className="text-gray-600 hover:text-pink-600 transition-colors">Privatlivspolitik</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-pink-200 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between">
            <p className="text-gray-600 text-sm">
              © 2024 &Accessories. Alle rettigheder forbeholdes.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* Add custom CSS animations */
const styles = `
  @keyframes sway {
    0%, 100% { transform: rotate(-3deg); }
    50% { transform: rotate(3deg); }
  }
  
  @keyframes twinkle {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.2); }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  .animate-sway {
    animation: sway 3s ease-in-out infinite;
  }
  
  .animate-twinkle {
    animation: twinkle 2s ease-in-out infinite;
  }
  
  .animate-float {
    animation: float 4s ease-in-out infinite;
  }
`;

if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}
