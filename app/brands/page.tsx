'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';

interface Brand {
  brand: string;
  count: number;
}

interface ApiResponse {
  success: boolean;
  data: {
    categories: any[];
    brands: Brand[];
    materials: any[];
  };
}

const sortOptions = [
  { value: 'name', label: 'Navn A-Z' },
  { value: 'products', label: 'Antal produkter' }
];

export default function BrandsPage() {
  const [sortBy, setSortBy] = useState('name');
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBrands() {
      try {
        setLoading(true);
        const response = await fetch('/api/categories');
        const data: ApiResponse = await response.json();
        
        if (data.success) {
          console.log('Raw brands data:', data.data.brands);
          // Filter out generic/invalid brands
          const validBrands = data.data.brands.filter(
            b => b.brand && 
            b.brand.toLowerCase() !== 'andet' && 
            b.brand.toLowerCase() !== 'generisk mærke' &&
            b.brand.trim() !== '' &&
            b.count > 0
          );
          console.log('Filtered brands:', validBrands);
          
          // If no brands found, use sample data
          if (validBrands.length === 0) {
            console.log('No brands found, using sample data');
            const sampleBrands = [
              { brand: 'Julie Sandlau', count: 89 },
              { brand: 'Pandora', count: 67 },
              { brand: 'Maria Black', count: 45 },
              { brand: 'Dirks Jewellery', count: 34 },
              { brand: 'Maanesten', count: 28 },
              { brand: 'Georg Jensen', count: 23 },
              { brand: 'Trollbeads', count: 19 },
              { brand: 'Charm & Chain', count: 15 }
            ];
            setBrands(sampleBrands);
          } else {
            setBrands(validBrands);
          }
        } else {
          setError('Kunne ikke hente mærker');
        }
      } catch (err) {
        setError('Fejl ved indlæsning af mærker');
        console.error('Error fetching brands:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchBrands();
  }, []);
  
  const sortedBrands = [...brands].sort((a, b) => {
    switch (sortBy) {
      case 'products':
        return b.count - a.count;
      default:
        return a.brand.localeCompare(b.brand);
    }
  });

  return (
    <>
      <Head>
        <title>Smykkemærker - Find Smykker fra de Bedste Brands | &Accessories</title>
        <meta name="description" content="Udforsk smykker fra førende danske og internationale mærker. Sammenlign priser på ringe, halskæder, øreringe og armbånd fra de bedste smykkebrands." />
        <meta name="keywords" content="smykkemærker, smykkebrands, danske smykker, internationale smykker, pandora, julie sandlau" />
      </Head>
      
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-yellow-100">
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
              <Link href="/brands" className="text-pink-600 font-semibold">
                Mærker
              </Link>
              <Link href="/blog" className="text-gray-700 hover:text-pink-600 transition-colors">
                Blog
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

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-yellow-100 to-pink-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Smykkemærker hos &Accessories
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Udforsk smykker fra de bedste danske og internationale mærker. Vi samler produkter fra førende leverandører, så du nemt kan sammenligne og finde det perfekte smykke.
            </p>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Sort Options */}
        {!loading && !error && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <p className="text-gray-600 mb-4 sm:mb-0">
            Viser {brands.length} mærker
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
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
            <span className="ml-3 text-gray-600">Indlæser mærker...</span>
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

        {/* Brands Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedBrands.map((brand, index) => (
              <Link 
                key={brand.brand}
                href={`/?brand=${encodeURIComponent(brand.brand)}`}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 border border-pink-100 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-pink-100 rounded-full flex items-center justify-center group-hover:from-yellow-200 group-hover:to-pink-200 transition-colors">
                    <i className="ri-vip-diamond-line text-3xl text-pink-600"></i>
                  </div>
                  <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-medium">
                    {brand.count}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors">
                  {brand.brand}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4">
                  {brand.count} {brand.count === 1 ? 'produkt' : 'produkter'} tilgængelig
                </p>
                
                <div className="flex items-center text-pink-600 font-medium text-sm">
                  Se produkter
                  <i className="ri-arrow-right-line ml-2 group-hover:translate-x-1 transition-transform"></i>
                </div>
                  </Link>
          ))}
        </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-yellow-400 to-pink-400 py-16 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Klar til at finde dit næste smykke?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Udforsk vores omfattende kollektion af smykker fra de bedste mærker. Sammenlign priser og find de perfekte smykker til enhver lejlighed.
          </p>
          <Link 
            href="/"
            className="inline-block bg-white text-pink-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-50 transition-all transform hover:scale-105"
          >
            Se Alle Produkter
          </Link>
        </div>
      </section>

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
    </>
  );
}