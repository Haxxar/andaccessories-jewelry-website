'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
}

const blogPosts: BlogPost[] = [
  {
    slug: 'smykkepleje-guide',
    title: 'Komplet Guide til Smykkepleje: Hold Dine Smykker Smukke i Årevis',
    excerpt: 'Lær hvordan du passer på dine værdifulde smykker med vores professionelle tips til rengøring, opbevaring og vedligeholdelse af guld, sølv og ædelstene.',
    category: 'Pleje & Vedligeholdelse',
    date: '2024-10-01',
    readTime: '5 min',
    image: '/placeholder-jewelry.svg'
  },
  {
    slug: 'vaelg-forlovelsesring',
    title: 'Sådan Vælger Du Den Perfekte Forlovelsesring: Ekspertguide 2024',
    excerpt: 'Alt du behøver at vide om at vælge den rigtige forlovelsesring - fra diamantkvalitet og cuts til at finde den perfekte størrelse og stil.',
    category: 'Købsguide',
    date: '2024-09-28',
    readTime: '8 min',
    image: '/placeholder-jewelry.svg'
  },
  {
    slug: 'smykke-trends-2024',
    title: 'Smykketrends 2024: De Hotteste Styles og Designs Dette År',
    excerpt: 'Opdag de nyeste smykketrends for 2024 - fra chunky chains og statement øreringe til bæredygtige materialer og vintage-inspirerede designs.',
    category: 'Trends & Inspiration',
    date: '2024-09-25',
    readTime: '6 min',
    image: '/placeholder-jewelry.svg'
  },
  {
    slug: 'gaver-til-hende-smykker',
    title: 'De Bedste Smykkegaver til Hende: Ideer til Enhver Lejlighed',
    excerpt: 'Find den perfekte smykkegave til hende - uanset om det er fødselsdag, jubilæum eller bare fordi. Personlige og tankevækkende gaveidéer.',
    category: 'Gaveguides',
    date: '2024-09-20',
    readTime: '7 min',
    image: '/placeholder-jewelry.svg'
  },
  {
    slug: 'forskel-guld-typer',
    title: 'Forskellen på 8, 14 og 18 Karat Guld: Hvilken Skal Du Vælge?',
    excerpt: 'Forstå forskellene mellem forskellige guldkarats, deres fordele og ulemper, og find ud af hvilken type guld der passer bedst til dine behov.',
    category: 'Materialer & Kvalitet',
    date: '2024-09-15',
    readTime: '5 min',
    image: '/placeholder-jewelry.svg'
  },
  {
    slug: 'kombiner-smykker-stil',
    title: 'Sådan Kombinerer Du Smykker som en Professionel: Styling Tips',
    excerpt: 'Mestre kunsten at style og kombinere forskellige smykker. Lær lagdeling, mix and match og hvordan du skaber en sammenhængende look.',
    category: 'Styling & Tips',
    date: '2024-09-10',
    readTime: '6 min',
    image: '/placeholder-jewelry.svg'
  }
];

export default function BlogPage() {
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
              <Link href="/blog" className="text-pink-600 font-semibold">
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
      <section className="relative py-16 bg-gradient-to-br from-yellow-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Smykkeblog: Tips, Guides & Inspiration
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ekspertråd om smykkepleje, styling tips, købsguides og de nyeste trends i smykkeverdenen.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link 
              key={post.slug} 
              href={`/blog/${post.slug}`}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 border border-pink-100"
            >
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-pink-400 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime} læsning</span>
                </div>
                
                <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                  {post.title}
                </h2>
                
                <p className="text-gray-600 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="mt-4 text-pink-600 font-medium flex items-center">
                  Læs mere
                  <i className="ri-arrow-right-line ml-2"></i>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-pink-400 to-yellow-400 rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Få Smykketips Direkte i Din Inbox
          </h2>
          <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
            Tilmeld dig vores nyhedsbrev og få eksklusive tips, guides og de bedste tilbud på smykker.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Din email adresse"
              className="flex-1 px-6 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-pink-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors whitespace-nowrap">
              Tilmeld
            </button>
          </div>
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
  );
}

