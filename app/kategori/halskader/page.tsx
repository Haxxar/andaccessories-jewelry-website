'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPriceWithCurrency } from '../../../lib/priceFormatter';
import { useAffiliateTracking } from '../../../lib/affiliateTracker';
import Head from 'next/head';

interface Product {
  id: number;
  title: string;
  price: number;
  old_price?: number;
  image_url: string;
  product_url: string;
  brand: string;
  category: string;
  material: string;
  shop: string;
  in_stock: boolean;
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
  };
}

interface Category {
  category: string;
  product_count: number;
}

interface Brand {
  brand: string;
  product_count: number;
}

interface CategoriesResponse {
  success: boolean;
  data: {
    categories: Category[];
    brands: Brand[];
    materials: string[];
  };
}

const sortOptions = [
  { value: 'newest', label: 'Nyeste først' },
  { value: 'price_low', label: 'Laveste pris' },
  { value: 'price_high', label: 'Højeste pris' },
  { value: 'brand', label: 'Mærke A-Z' }
];

export default function HalskaderPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState('alle');
  const [selectedMaterial, setSelectedMaterial] = useState('alle');
  const [sortBy, setSortBy] = useState('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [brands, setBrands] = useState<string[]>(['alle']);
  const [materials, setMaterials] = useState<string[]>(['alle']);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    totalCount: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false
  });

  const { trackClick } = useAffiliateTracking();

  // Fetch products function
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: '1',
        limit: '50',
        category: 'Halskæder',
        ...(selectedBrand !== 'alle' && { brand: selectedBrand }),
        ...(selectedMaterial !== 'alle' && { material: selectedMaterial }),
        sort: sortBy
      });

      const response = await fetch(`/api/products?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data: ApiResponse = await response.json();
      
      if (data.success) {
        setProducts(data.data.products);
        setPagination(data.data.pagination);
      } else {
        setError('Failed to load products');
      }
    } catch (err) {
      setError('Error loading products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedBrand, selectedMaterial, sortBy]);

  // Fetch categories and brands
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data: CategoriesResponse = await response.json();
        if (data.success) {
          const allBrands = ['alle', ...data.data.brands
            .filter(b => b.brand && b.brand !== 'andet' && b.brand !== 'Generisk Mærke')
            .map(b => b.brand)];
          // Extract material names from objects and remove duplicates
          const materialNames = data.data.materials
            .map((m: any) => typeof m === 'object' && m !== null ? m.material : String(m))
            .filter((m: any) => m && m !== 'andet');
          const uniqueMaterials = Array.from(new Set(materialNames));
          const allMaterials = ['alle', ...uniqueMaterials];
          setBrands(allBrands);
          setMaterials(allMaterials);
        }
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, []);

  // Fetch data on mount and when filters change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
  };

  const handleMaterialChange = (material: string) => {
    setSelectedMaterial(material);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
  };

  const handleProductClick = (product: Product) => {
    trackClick(product.product_url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Head>
          <title>Halskæder | &Accessories - Smukke Smykker Online</title>
          <meta name="description" content="Udforsk vores omfattende kollektion af halskæder. Find elegante halskæder, choker og meget mere til de bedste priser." />
        </Head>
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Head>
          <title>Halskæder | &Accessories - Smukke Smykker Online</title>
        </Head>
        
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Fejl ved indlæsning</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={fetchProducts}
              className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Prøv igen
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-100">
      <Head>
        <title>Halskæder | &Accessories - Smukke Smykker Online</title>
        <meta name="description" content="Udforsk vores omfattende kollektion af halskæder. Find elegante halskæder, choker og meget mere til de bedste priser." />
        <meta name="keywords" content="halskæder, choker, guld halskæder, sølv halskæder, smykker" />
      </Head>

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
              <Link href="/" className="font-['Pacifico'] text-2xl text-pink-600">
                &Accessories
              </Link>
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
              <Link href="/blog" className="text-gray-700 hover:text-pink-600 transition-colors">
                Blog
              </Link>
              <Link href="/om-os" className="text-gray-700 hover:text-pink-600 transition-colors">
                Om Os
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-yellow-100 to-pink-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Halskæder</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Udforsk vores omfattende kollektion af halskæder. Find elegante halskæder, choker og meget mere.
            </p>
            <div className="mt-4 text-sm text-gray-600">
              Viser {products.length} af {pagination.totalCount} halskæder
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-pink-100 mb-8">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Filtre</h3>
            <div className="flex flex-wrap items-center gap-4">
              {/* Brand Filter */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Mærke:</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => handleBrandChange(e.target.value)}
                  className="border border-pink-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
                >
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>

              {/* Material Filter */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Materiale:</label>
                <select
                  value={selectedMaterial}
                  onChange={(e) => handleMaterialChange(e.target.value)}
                  className="border border-pink-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
                >
                  {materials.map((material) => (
                    <option key={material} value={material}>
                      {material}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Filter */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Sorter efter:</label>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="border border-pink-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Ingen halskæder fundet</h2>
            <p className="text-gray-600">Prøv at ændre dine filtre for at se flere resultater.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-lg border border-pink-100 overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-2">
                <Link 
                  href={`/produkt/${product.id}`}
                  onClick={() => handleProductClick(product)}
                  className="block"
                >
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src={product.image_url || '/placeholder-jewelry.svg'}
                      alt={`${product.title} - ${product.brand}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-jewelry.svg';
                      }}
                    />
                    {!product.in_stock && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                        Udsolgt
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                      {product.title}
                    </h3>
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">{product.brand}</span>
                      <span className="text-sm text-gray-500">{product.material}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-800">
                          {formatPriceWithCurrency(product.price)}
                        </span>
                        {product.old_price && product.old_price > product.price && (
                          <span className="text-sm text-gray-500 line-through">
                            {formatPriceWithCurrency(product.old_price)}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{product.shop}</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  // TODO: Implement pagination
                }}
                disabled={!pagination.hasPrev}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Forrige
              </button>
              
              <span className="px-4 py-2 text-sm text-gray-700">
                Side {pagination.page} af {pagination.totalPages}
              </span>
              
              <button
                onClick={() => {
                  // TODO: Implement pagination
                }}
                disabled={!pagination.hasNext}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Næste
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-pink-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Image 
                  src="/favicon-32x32.png" 
                  alt="&Accessories Logo" 
                  width={32}
                  height={32}
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
                <li><Link href="/blog" className="text-gray-600 hover:text-pink-600 transition-colors">Blog</Link></li>
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