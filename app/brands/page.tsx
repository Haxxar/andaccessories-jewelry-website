'use client';

import { useState } from 'react';
import Link from 'next/link';

const brands = [
  {
    id: 'julie-sandlau',
    name: 'Julie Sandlau',
    description: 'Dansk smykkedesigner kendt for elegante og tidløse designs med focus på kvalitet og håndværk.',
    image: 'https://readdy.ai/api/search-image?query=Elegant%20Danish%20jewelry%20brand%20showcase%20with%20minimalist%20design%2C%20luxury%20jewelry%20display%20on%20soft%20pastel%20background%2C%20professional%20brand%20photography%20with%20sophisticated%20styling%2C%20clean%20modern%20aesthetic&width=600&height=400&seq=brand1&orientation=landscape',
    productCount: 24,
    specialties: ['Øreringe', 'Halskæder', 'Ringe'],
    founded: '2010',
    origin: 'Danmark'
  },
  {
    id: 'pandora',
    name: 'Pandora',
    description: 'Verdenskendt dansk smykkemærke der skaber håndlavede og moderne smykker til kvinder over hele verden.',
    image: 'https://readdy.ai/api/search-image?query=Pandora%20jewelry%20brand%20display%20with%20charm%20bracelets%20and%20elegant%20pieces%2C%20luxury%20jewelry%20photography%20on%20soft%20pastel%20background%2C%20professional%20brand%20showcase%20with%20modern%20styling&width=600&height=400&seq=brand2&orientation=landscape',
    productCount: 67,
    specialties: ['Charms', 'Armbånd', 'Ringe'],
    founded: '1982',
    origin: 'Danmark'
  },
  {
    id: 'by-biel',
    name: 'By Biel',
    description: 'Skandinavisk smykkemærke der kombinerer minimalistisk design med moderne elegance og bæredygtighed.',
    image: 'https://readdy.ai/api/search-image?query=Scandinavian%20minimalist%20jewelry%20brand%20display%20with%20clean%20modern%20design%2C%20sustainable%20jewelry%20photography%20on%20soft%20pastel%20background%2C%20elegant%20brand%20showcase%20with%20contemporary%20styling&width=600&height=400&seq=brand3&orientation=landscape',
    productCount: 18,
    specialties: ['Minimalistiske designs', 'Bæredygtige materialer', 'Stackable smykker'],
    founded: '2018',
    origin: 'Danmark'
  },
  {
    id: 'georg-jensen',
    name: 'Georg Jensen',
    description: 'Ikonisk dansk design- og smykkehus med over 100 års tradition for ekstraordinært håndværk.',
    image: 'https://readdy.ai/api/search-image?query=Georg%20Jensen%20luxury%20jewelry%20brand%20showcase%20with%20iconic%20Danish%20design%2C%20premium%20silver%20jewelry%20photography%20on%20soft%20pastel%20background%2C%20heritage%20brand%20display%20with%20sophisticated%20styling&width=600&height=400&seq=brand4&orientation=landscape',
    productCount: 35,
    specialties: ['Sølvsmykker', 'Designklassikere', 'Heritage'],
    founded: '1904',
    origin: 'Danmark'
  },
  {
    id: 'maria-black',
    name: 'Maria Black',
    description: 'Københavnsk smykkemærke der skaber moderne og skulpturelle designs med focus på individuel stil.',
    image: 'https://readdy.ai/api/search-image?query=Maria%20Black%20contemporary%20jewelry%20brand%20display%20with%20sculptural%20modern%20designs%2C%20artistic%20jewelry%20photography%20on%20soft%20pastel%20background%2C%20Copenhagen%20brand%20showcase%20with%20avant-garde%20styling&width=600&height=400&seq=brand5&orientation=landscape',
    productCount: 29,
    specialties: ['Skulpturelle designs', 'Moderne æstetik', 'Statement pieces'],
    founded: '2013',
    origin: 'Danmark'
  },
  {
    id: 'pernille-corydon',
    name: 'Pernille Corydon',
    description: 'Dansk smykkedesigner der skaber feminine og poetiske smykker inspireret af naturen.',
    image: 'https://readdy.ai/api/search-image?query=Pernille%20Corydon%20feminine%20jewelry%20brand%20display%20with%20nature-inspired%20designs%2C%20delicate%20jewelry%20photography%20on%20soft%20pastel%20background%2C%20Danish%20brand%20showcase%20with%20organic%20styling&width=600&height=400&seq=brand6&orientation=landscape',
    productCount: 22,
    specialties: ['Naturinspirerede designs', 'Feminine æstetik', 'Organiske former'],
    founded: '2007',
    origin: 'Danmark'
  }
];

const sortOptions = [
  { value: 'name', label: 'Navn A-Z' },
  { value: 'products', label: 'Antal produkter' },
  { value: 'founded', label: 'Grundlagt' }
];

export default function BrandsPage() {
  const [sortBy, setSortBy] = useState('name');
  
  const sortedBrands = [...brands].sort((a, b) => {
    switch (sortBy) {
      case 'products':
        return b.productCount - a.productCount;
      case 'founded':
        return parseInt(a.founded) - parseInt(b.founded);
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-yellow-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-300 to-pink-300 rounded-full flex items-center justify-center">
                <i className="ri-gem-line text-white text-lg"></i>
              </div>
              <Link href="/">
                <h1 className="font-['Pacifico'] text-2xl bg-gradient-to-r from-yellow-600 to-pink-600 bg-clip-text text-transparent cursor-pointer">
                  &Accessories
                </h1>
              </Link>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-pink-600 transition-colors">
                Hjem
              </Link>
              <Link href="/kategorier" className="text-gray-700 hover:text-pink-600 transition-colors">
                Kategorier
              </Link>
              <Link href="/brands" className="text-pink-600 font-medium">
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

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-yellow-100 to-pink-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Vores
              <span className="block bg-gradient-to-r from-yellow-600 to-pink-600 bg-clip-text text-transparent">
                Smykkemærker
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Opdag de fineste danske og internationale smykkemærker, som vi har kurateret specielt til dig. 
              Fra klassiske designhuse til moderne innovatører.
            </p>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Sort Options */}
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

        {/* Brands Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {sortedBrands.map(brand => (
            <div key={brand.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 border border-pink-50">
              <div className="relative h-64">
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-6">
                  <h2 className="text-2xl font-bold text-white mb-2">{brand.name}</h2>
                  <div className="flex items-center space-x-4 text-white/90 text-sm">
                    <span className="flex items-center space-x-1">
                      <i className="ri-calendar-line w-4 h-4 flex items-center justify-center"></i>
                      <span>Grundlagt {brand.founded}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <i className="ri-map-pin-line w-4 h-4 flex items-center justify-center"></i>
                      <span>{brand.origin}</span>
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {brand.description}
                </p>
                
                <div className="mb-4">
                  <h4 className="font-medium text-gray-800 mb-2">Specialiteter:</h4>
                  <div className="flex flex-wrap gap-2">
                    {brand.specialties.map(specialty => (
                      <span 
                        key={specialty}
                        className="bg-gradient-to-r from-yellow-100 to-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm border border-pink-200"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <i className="ri-shopping-bag-line w-5 h-5 flex items-center justify-center"></i>
                    <span>{brand.productCount} produkter</span>
                  </div>
                  
                  <Link 
                    href={`/brands/${brand.id}`}
                    className="bg-gradient-to-r from-yellow-400 to-pink-400 text-white px-6 py-2 rounded-full font-medium hover:from-yellow-500 hover:to-pink-500 transition-all transform hover:scale-105 whitespace-nowrap cursor-pointer"
                  >
                    Se Produkter
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-yellow-100 to-pink-100 py-16 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            Kan du ikke finde dit yndlingsmærke?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Vi tilføjer konstant nye mærker til vores kollektion. 
            Kontakt os hvis der er et specifikt mærke, du gerne vil se.
          </p>
          <Link 
            href="#"
            className="inline-block bg-gradient-to-r from-yellow-400 to-pink-400 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-yellow-500 hover:to-pink-500 transition-all transform hover:scale-105 whitespace-nowrap cursor-pointer"
          >
            Kontakt Os
          </Link>
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