'use client';

import React from 'react';
import Link from 'next/link';
import { useState } from 'react';

const products = [
  {
    id: '31',
    name: 'Diamant Ørestikker Guld',
    brand: 'Julie Sandlau',
    price: 1299,
    originalPrice: 1599,
    material: 'guld',
    image: 'https://readdy.ai/api/search-image?query=Gold%20diamond%20stud%20earrings%20on%20soft%20pastel%20background%2C%20luxury%20jewelry%20photography%2C%20elegant%20sparkling%20design%2C%20clean%20simple%20backdrop%2C%20professional%20jewelry%20styling%20with%20soft%20lighting&width=400&height=400&seq=601&orientation=squarish',
    affiliateLink: 'https://example.com/affiliate/31',
    inStock: true
  },
  {
    id: '32',
    name: 'Perle Ørestikker Sølv',
    brand: 'Pandora',
    price: 699,
    originalPrice: 899,
    material: 'sølv',
    image: 'https://readdy.ai/api/search-image?query=Silver%20pearl%20stud%20earrings%20on%20soft%20pastel%20background%2C%20elegant%20jewelry%20photography%2C%20classic%20feminine%20design%2C%20clean%20simple%20backdrop%2C%20luxury%20jewelry%20styling%20with%20professional%20lighting&width=400&height=400&seq=602&orientation=squarish',
    affiliateLink: 'https://example.com/affiliate/32',
    inStock: true
  },
  {
    id: '33',
    name: 'Rose Guld Ørestikker',
    brand: 'By Biel',
    price: 899,
    originalPrice: 1199,
    material: 'guld',
    image: 'https://readdy.ai/api/search-image?query=Rose%20gold%20stud%20earrings%20on%20soft%20pastel%20background%2C%20minimalist%20jewelry%20photography%2C%20elegant%20feminine%20design%2C%20clean%20simple%20backdrop%2C%20luxury%20jewelry%20styling%20with%20professional%20lighting&width=400&height=400&seq=603&orientation=squarish',
    affiliateLink: 'https://example.com/affiliate/33',
    inStock: true
  },
  {
    id: '34',
    name: 'Zirkon Ørestikker Sølv',
    brand: 'Julie Sandlau',
    price: 599,
    originalPrice: 799,
    material: 'sølv',
    image: 'https://readdy.ai/api/search-image?query=Silver%20zircon%20stud%20earrings%20on%20soft%20pastel%20background%2C%20sparkling%20jewelry%20photography%2C%20elegant%20design%2C%20clean%20simple%20backdrop%2C%20luxury%20jewelry%20styling%20with%20professional%20lighting&width=400&height=400&seq=604&orientation=squarish',
    affiliateLink: 'https://example.com/affiliate/34',
    inStock: true
  },
  {
    id: '35',
    name: 'Mini Ørestikker Guld',
    brand: 'Pandora',
    price: 499,
    originalPrice: 699,
    material: 'guld',
    image: 'https://readdy.ai/api/search-image?query=Tiny%20gold%20stud%20earrings%20on%20soft%20pastel%20background%2C%20delicate%20jewelry%20photography%2C%20minimalist%20elegant%20design%2C%20clean%20simple%20backdrop%2C%20luxury%20jewelry%20styling%20with%20professional%20lighting&width=400&height=400&seq=605&orientation=squarish',
    affiliateLink: 'https://example.com/affiliate/35',
    inStock: false
  },
  {
    id: '36',
    name: 'Square Ørestikker Sølv',
    brand: 'By Biel',
    price: 749,
    originalPrice: 999,
    material: 'sølv',
    image: 'https://readdy.ai/api/search-image?query=Square%20silver%20stud%20earrings%20on%20soft%20pastel%20background%2C%20geometric%20jewelry%20photography%2C%20modern%20elegant%20design%2C%20clean%20simple%20backdrop%2C%20luxury%20jewelry%20styling%20with%20professional%20lighting&width=400&height=400&seq=606&orientation=squarish',
    affiliateLink: 'https://example.com/affiliate/36',
    inStock: true
  }
];

const brands = ['alle', 'Julie Sandlau', 'Pandora', 'By Biel'];
const materials = ['alle', 'guld', 'sølv'];
const sortOptions = [
  { value: 'newest', label: 'Nyeste først' },
  { value: 'price-low', label: 'Laveste pris' },
  { value: 'price-high', label: 'Højeste pris' },
  { value: 'brand', label: 'Mærke A-Z' }
];

export default function OrestikkerPage() {
  const [selectedBrand, setSelectedBrand] = useState('alle');
  const [selectedMaterial, setSelectedMaterial] = useState('alle');
  const [sortBy, setSortBy] = useState('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredAndSortedProducts = products
    .filter(product => selectedBrand === 'alle' || product.brand === selectedBrand)
    .filter(product => selectedMaterial === 'alle' || product.material === selectedMaterial)
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'brand':
          return a.brand.localeCompare(b.brand);
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-yellow-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-300 to-pink-300 rounded-full flex items-center justify-center">
                <i className="ri-gem-line text-white text-lg"></i>
              </div>
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
              <Link href="/om-os" className="text-gray-700 hover:text-pink-600 transition-colors">
                Om Os
              </Link>
            </nav>

            <button className="md:hidden w-6 h-6 flex items-center justify-center">
              <i className="ri-menu-line text-xl text-gray-700"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-pink-600 transition-colors">Hjem</Link>
          <i className="ri-arrow-right-s-line"></i>
          <Link href="/kategorier" className="hover:text-pink-600 transition-colors">Kategorier</Link>
          <i className="ri-arrow-right-s-line"></i>
          <span className="text-gray-800">Ørestikker</span>
        </nav>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-yellow-100 to-pink-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Ørestikker
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Klassiske ørestikker i forskellige designs - fra simple studs til elegante ørestikker med sten.
            </p>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
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
                {/* Material Filter */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Materiale</h4>
                  <div className="space-y-2">
                    {materials.map(material => (
                      <button
                        key={material}
                        onClick={() => setSelectedMaterial(material)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                          selectedMaterial === material
                            ? 'bg-gradient-to-r from-yellow-100 to-pink-100 text-pink-700 border border-pink-200'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {material.charAt(0).toUpperCase() + material.slice(1)}
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
                            ? 'bg-gradient-to-r from-yellow-100 to-pink-100 text-pink-700 border border-pink-200'
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
              <p className="text-gray-600 mb-4 sm:mb-0">
                Viser {filteredAndSortedProducts.length} ørestikker
              </p>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-200 pr-8"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8" data-product-shop>
              {filteredAndSortedProducts.map(product => (
                <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 border border-pink-50">
                  <Link href={`/produkt/${product.id}`}>
                    <div className="relative aspect-square">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover object-top"
                      />
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
                          <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                            Udsolgt
                          </span>
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="bg-gradient-to-r from-yellow-400 to-pink-400 text-white px-2 py-1 rounded-full text-xs font-medium">
                          {Math.round((1 - product.price / product.originalPrice) * 100)}% rabat
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="bg-white/90 px-2 py-1 rounded-full text-xs font-medium text-gray-700 capitalize">
                          {product.material}
                        </span>
                      </div>
                    </div>
                  </Link>
                  
                  <div className="p-6">
                    <div className="text-sm text-pink-600 font-medium mb-2">{product.brand}</div>
                    <h3 className="font-semibold text-gray-800 mb-2 text-lg">{product.name}</h3>
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-2xl font-bold text-gray-800">{product.price} kr</span>
                      <span className="text-lg text-gray-400 line-through">{product.originalPrice} kr</span>
                    </div>
                    
                    <a
                      href={product.affiliateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full block text-center py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                        product.inStock
                          ? 'bg-gradient-to-r from-yellow-400 to-pink-400 text-white hover:from-yellow-500 hover:to-pink-500 transform hover:scale-105'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                      onClick={product.inStock ? undefined : (e) => e.preventDefault()}
                    >
                      {product.inStock ? 'Køb Nu' : 'Udsolgt'}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-pink-100 mt-20">
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
          
          <div className="border-t border-pink-100 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between">
            <p className="text-gray-600 text-sm">
              © 2024 &Accessories. Alle rettigheder forbeholdes.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}