'use client';

import React from 'react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

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

interface Material {
  material: string;
  count: number;
}

interface ApiResponse {
  success: boolean;
  data: {
    categories: Category[];
    brands: Brand[];
    materials: Material[];
  };
}

const categoryDescriptions: Record<string, string> = {
  'Øreringe': 'Fra elegante studs til statement øreringe - find det perfekte par til enhver lejlighed.',
  'Halskæder': 'Smukke halskæder i alle længder og stilarter - fra fine kæder til store statement pieces.',
  'Ringe': 'Fra forlovelsesringe til hverdagsringe - discover ringe til enhver finger og anledning.',
  'Armbånd': 'Elegante armbånd fra fine kæder til chunky designs - perfekt til at complete dit look.',
  'Vedhæng': 'Smukke vedhæng til enhver halskæde - fra symbolske designs til elegante statements.',
  'Ørestikker': 'Klassiske ørestikker i forskellige designs - fra simple studs til elegante ørestikker med sten.',
  'andet': 'Diverse smykker der ikke passer ind i de andre kategorier.'
};

const categoryImagePrompts: Record<string, string> = {
  'Øreringe': 'Beautiful elegant gold and silver earrings collection displayed on soft pastel background, various styles including studs, hoops, and dangly earrings, jewelry photography with soft lighting and minimalist aesthetic, warm tones',
  'Halskæder': 'Elegant gold and silver necklaces layered beautifully on soft pastel pink background, various chain styles and pendants, luxury jewelry photography with gentle lighting and sophisticated presentation',
  'Ringe': 'Stunning collection of gold and silver rings arranged on soft yellow pastel background, engagement rings, wedding bands, and fashion rings, luxury jewelry photography with elegant presentation',
  'Armbånd': 'Beautiful bracelet collection in gold and silver displayed on soft pastel background, chain bracelets, charm bracelets, and bangles, jewelry photography with warm lighting and elegant styling',
  'Vedhæng': 'Beautiful pendant collection in gold and silver on soft pastel background, various symbolic and elegant designs including hearts, stars, and crosses, luxury jewelry photography with professional lighting',
  'Ørestikker': 'Classic stud earrings collection in gold and silver on soft pastel background, various designs including diamond, pearl, and geometric studs, jewelry photography with elegant presentation',
  'andet': 'Beautiful jewelry collection on soft pastel background, various styles and materials, luxury jewelry photography with elegant presentation'
};

export default function CategoriesPage() {
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        const response = await fetch('/api/categories');
        const data: ApiResponse = await response.json();
        
        if (data.success) {
          setCategories(data.data.categories);
        } else {
          setError('Failed to fetch categories');
        }
      } catch (err) {
        setError('Error loading categories');
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  const sortedCategories = [...categories].sort((a, b) => {
    switch (sortBy) {
      case 'products':
        return b.product_count - a.product_count;
      case 'name':
        return a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });

  const getEnglishName = (category: string): string => {
    const mapping: Record<string, string> = {
      'Øreringe': 'oreringe',
      'Halskæder': 'halskader',
      'Ringe': 'ringe',
      'Armbånd': 'armband',
      'Vedhæng': 'vedhang',
      'Ørestikker': 'orestikker',
      'andet': 'andet'
    };
    return mapping[category] || category.toLowerCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-pink-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-yellow-100 to-pink-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
              Smykke Kategorier
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Udforsk vores omfattende kollektion af smykker organiseret i kategorier. 
              Find præcis det du søger, fra klassiske øreringe til moderne herresmykker.
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <label className="text-gray-700 font-medium">Sorter efter:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="pr-8 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
            >
              <option value="name">Navn</option>
              <option value="products">Antal produkter</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-gray-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 rounded-md transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-yellow-200 text-gray-800' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <i className="ri-grid-line"></i>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-md transition-colors ${
                viewMode === 'list' 
                  ? 'bg-yellow-200 text-gray-800' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <i className="ri-list-unordered"></i>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
            <span className="ml-3 text-gray-600">Indlæser kategorier...</span>
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

        {/* Categories Grid/List */}
        {!loading && !error && (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : 'space-y-4'
          }>
            {sortedCategories.map((category, index) => (
              <div
                key={category.category}
                className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer ${
                  viewMode === 'list' ? 'flex items-center' : ''
                }`}
              >
                <div className={viewMode === 'list' ? 'w-48 h-32 flex-shrink-0' : 'aspect-[4/3]'}>
                  <img
                    src={`https://readdy.ai/api/search-image?query=${encodeURIComponent(categoryImagePrompts[category.category] || categoryImagePrompts['andet'])}&width=400&height=300&seq=${index + 1}&orientation=landscape`}
                    alt={category.category}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-jewelry.svg';
                    }}
                  />
                </div>
                
                <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-yellow-600 transition-colors">
                      {category.category}
                    </h3>
                    <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-medium">
                      {category.product_count}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {categoryDescriptions[category.category] || 'Smukke smykker i denne kategori.'}
                  </p>
                  
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                      <span>Fra {Math.round(category.min_price)} kr</span>
                      <span>•</span>
                      <span>Til {Math.round(category.max_price)} kr</span>
                      <span>•</span>
                      <span>Gennemsnit: {Math.round(category.avg_price)} kr</span>
                    </div>
                  </div>
                  
                  <Link 
                    href={`/kategori/${getEnglishName(category.category)}`}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-pink-400 text-white px-4 py-2 rounded-lg font-medium hover:from-yellow-500 hover:to-pink-500 transition-all duration-300 whitespace-nowrap"
                  >
                    Se produkter
                    <i className="ri-arrow-right-line"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Vores Kollektion i Tal
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Vi arbejder konstant på at udvide vores sortiment med de nyeste trends og tidløse klassikere.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-600 mb-2">
                {loading ? '...' : categories.reduce((sum, cat) => sum + cat.product_count, 0)}
              </div>
              <div className="text-gray-600 font-medium">Produkter Total</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-pink-600 mb-2">
                {loading ? '...' : categories.length}
              </div>
              <div className="text-gray-600 font-medium">Kategorier</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {loading ? '...' : '25+'}
              </div>
              <div className="text-gray-600 font-medium">Brands</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                100%
              </div>
              <div className="text-gray-600 font-medium">Autentiske</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-yellow-400 to-pink-400 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Kan du ikke finde det du søger?
          </h2>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Udforsk vores omfattende kollektion af smykker og find det perfekte smykke til enhver anledning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/brands"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-800 transition-colors whitespace-nowrap"
            >
              Se alle brands
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}