'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function AboutPage() {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }));
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-yellow-100 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute top-20 left-10 w-32 h-32 bg-yellow-200/20 rounded-full blur-3xl animate-pulse"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        ></div>
        <div 
          className="absolute top-40 right-20 w-48 h-48 bg-pink-200/20 rounded-full blur-3xl animate-pulse delay-1000"
          style={{ transform: `translateY(${scrollY * -0.15}px)` }}
        ></div>
        <div 
          className="absolute bottom-40 left-1/4 w-24 h-24 bg-purple-200/20 rounded-full blur-2xl animate-pulse delay-500"
          style={{ transform: `translateY(${scrollY * 0.08}px)` }}
        ></div>
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-300 to-pink-300 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
                <i className="ri-gem-line text-white text-lg"></i>
              </div>
              <Link href="/" className="font-['Pacifico'] text-2xl bg-gradient-to-r from-yellow-600 to-pink-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
                &Accessories
              </Link>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-pink-600 transition-all duration-300 relative group">
                Hjem
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/kategorier" className="text-gray-700 hover:text-pink-600 transition-all duration-300 relative group">
                Kategorier
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/brands" className="text-gray-700 hover:text-pink-600 transition-all duration-300 relative group">
                Mærker
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/om-os" className="text-pink-600 font-medium relative">
                Om Os
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-600"></span>
              </Link>
            </nav>

            <button className="md:hidden w-6 h-6 flex items-center justify-center hover:scale-110 transition-transform duration-300">
              <i className="ri-menu-line text-xl text-gray-700"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with Parallax */}
      <section className="relative py-32 bg-gradient-to-r from-yellow-100 to-pink-100 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-30"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        >
          <img
            src="https://readdy.ai/api/search-image?query=Abstract%20elegant%20jewelry%20pattern%20background%20with%20floating%20gold%20and%20silver%20elements%2C%20soft%20pastel%20colors%2C%20minimalist%20luxury%20design%2C%20ethereal%20and%20dreamy%20atmosphere%2C%20artistic%20jewelry%20photography%20with%20bokeh%20effects&width=1920&height=800&seq=hero1&orientation=landscape"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div 
            className="text-center transform transition-all duration-1000"
            data-animate
            id="hero-content"
            style={{
              transform: `translateY(${isVisible['hero-content'] ? '0' : '50px'})`,
              opacity: isVisible['hero-content'] ? 1 : 0
            }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-8 leading-tight">
              Om 
              <span className="bg-gradient-to-r from-yellow-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
                &Accessories
              </span>
            </h1>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Vi er din pålidelige partner for at finde de smukkeste smykker fra de bedste mærker. 
              Vores passion er at hjælpe dig med at opdage smykker, der passer perfekt til din stil og personlighed.
            </p>
          </div>
        </div>
        
        {/* Floating Decorative Elements */}
        <div className="absolute top-1/4 left-20 animate-bounce delay-300">
          <div className="w-8 h-8 bg-yellow-400/30 rounded-full blur-sm"></div>
        </div>
        <div className="absolute top-1/3 right-32 animate-bounce delay-700">
          <div className="w-12 h-12 bg-pink-400/30 rounded-full blur-sm"></div>
        </div>
        <div className="absolute bottom-1/4 left-1/3 animate-bounce delay-1000">
          <div className="w-6 h-6 bg-purple-400/30 rounded-full blur-sm"></div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
          <div 
            data-animate
            id="story-text"
            className="transform transition-all duration-1000 delay-200"
            style={{
              transform: `translateX(${isVisible['story-text'] ? '0' : '-50px'})`,
              opacity: isVisible['story-text'] ? 1 : 0
            }}
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-8 relative">
              Vores Historie
              <div className="absolute -bottom-2 left-0 w-20 h-1 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full"></div>
            </h2>
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p className="hover:text-gray-800 transition-colors duration-300">
                &Accessories blev grundlagt med en simpel mission: at gøre det nemt og trygt at finde og købe 
                smukke smykker online. Vi startede som smykkeentusiaster, der var trætte af at skulle søge 
                gennem utallige webshops for at finde de perfekte smykker.
              </p>
              <p className="hover:text-gray-800 transition-colors duration-300">
                I dag samarbejder vi med førende danske og internationale mærker som Julie Sandlau, Pandora, 
                og By Biel for at bringe dig en kurateret kollektion af kvalitetssmykker til de bedste priser.
              </p>
              <p className="hover:text-gray-800 transition-colors duration-300">
                Vores team af smykkeeksperter arbejder dagligt på at opdatere vores sortiment og sikre, 
                at du altid har adgang til de nyeste trends og klassiske designs.
              </p>
            </div>
          </div>
          <div 
            data-animate
            id="story-image"
            className="relative group transform transition-all duration-1000 delay-400"
            style={{
              transform: `translateX(${isVisible['story-image'] ? '0' : '50px'})`,
              opacity: isVisible['story-image'] ? 1 : 0
            }}
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
            <img
              src="https://readdy.ai/api/search-image?query=Elegant%20jewelry%20collection%20display%20in%20a%20modern%20boutique%20setting%20with%20pastel%20yellow%20and%20pink%20lighting%2C%20curated%20selection%20of%20necklaces%20rings%20and%20earrings%20on%20display%20stands%2C%20soft%20minimalist%20background%2C%20professional%20jewelry%20photography%20with%20warm%20ambient%20lighting%2C%20luxurious%20and%20inviting%20atmosphere&width=600&height=500&seq=7&orientation=landscape"
              alt="Vores smykkekollektion"
              className="relative w-full h-auto rounded-3xl shadow-2xl object-cover object-top transform group-hover:scale-105 transition-all duration-700"
            />
          </div>
        </div>

        {/* Values Section with Stagger Animation */}
        <div className="mb-32">
          <h2 
            data-animate
            id="values-title"
            className="text-4xl font-bold text-gray-800 text-center mb-16 transform transition-all duration-1000"
            style={{
              transform: `translateY(${isVisible['values-title'] ? '0' : '30px'})`,
              opacity: isVisible['values-title'] ? 1 : 0
            }}
          >
            Vores Værdier
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: 'ri-shield-check-line',
                title: 'Tillid & Sikkerhed',
                description: 'Vi arbejder kun med verificerede forhandlere og sikrer, at alle produkter er ægte. Dine køb er altid beskyttet gennem vores partneres garantier.',
                delay: 200
              },
              {
                icon: 'ri-heart-line',
                title: 'Passion for Smykker',
                description: 'Vores team består af smykkeentusiaster, der personligt udvælger hver enkelt smykke i vores kollektion baseret på kvalitet, stil og værdi.',
                delay: 400
              },
              {
                icon: 'ri-customer-service-line',
                title: 'Fremragende Service',
                description: 'Vi stræber efter at give dig den bedste oplevelse fra browsing til køb. Vores kundeservice er altid klar til at hjælpe dig med spørgsmål.',
                delay: 600
              }
            ].map((value, index) => (
              <div 
                key={index}
                data-animate
                id={`value-${index}`}
                className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-xl border border-pink-100 text-center group hover:shadow-2xl hover:scale-105 transform transition-all duration-500"
                style={{
                  transform: `translateY(${isVisible[`value-${index}`] ? '0' : '50px'})`,
                  opacity: isVisible[`value-${index}`] ? 1 : 0,
                  transitionDelay: `${value.delay}ms`
                }}
              >
                <div className="w-20 h-20 bg-gradient-to-r from-yellow-300 to-pink-300 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <i className={`${value.icon} text-white text-3xl`}></i>
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-6 group-hover:text-pink-600 transition-colors duration-300">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Price Information Section */}
        <div className="mb-32">
          <div 
            data-animate
            id="price-info"
            className="bg-gradient-to-r from-yellow-50 to-pink-50 rounded-3xl p-12 shadow-xl border border-pink-100 transform transition-all duration-1000"
            style={{
              transform: `translateY(${isVisible['price-info'] ? '0' : '50px'})`,
              opacity: isVisible['price-info'] ? 1 : 0
            }}
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-300 to-pink-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-price-tag-3-line text-white text-3xl"></i>
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                Om Vores Priser
              </h2>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-pink-100">
                <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                  <p className="text-center font-medium text-gray-800 mb-6">
                    <i className="ri-information-line text-pink-500 mr-2"></i>
                    Vigtig information om priser
                  </p>
                  
                  <div className="space-y-4">
                    <p>
                      <strong>Prisvariationer:</strong> De priser, du ser på vores hjemmeside, kan variere fra de priser, 
                      der vises direkte på forhandlernes egne hjemmesider. Dette kan skyldes forskelle i opdateringsfrekvens, 
                      lokale tilbud, eller ændringer i forhandlernes priser.
                    </p>
                    
                    <p>
                      <strong>Opdateringer:</strong> Vi stræber efter at holde alle priser opdaterede, men anbefaler altid, 
                      at du tjekker den endelige pris direkte hos forhandleren, før du foretager dit køb.
                    </p>
                    
                    <p>
                      <strong>Rabatter og tilbud:</strong> Særlige tilbud og rabatter kan være tidsbegrænsede og kan variere 
                      mellem forskellige forhandlere. Vi viser de bedste tilgængelige priser på tidspunktet for vores opdatering.
                    </p>
                    
                    <p>
                      <strong>Valuta og gebyrer:</strong> Alle priser er vist i danske kroner (DKK), men endelige priser 
                      kan påvirkes af valutaomregning, leveringsgebyrer og andre gebyrer, der tilføjes af forhandleren.
                    </p>
                  </div>
                  
                  <div className="mt-8 p-6 bg-gradient-to-r from-yellow-100 to-pink-100 rounded-xl border border-yellow-200">
                    <p className="text-center font-semibold text-gray-800">
                      <i className="ri-shield-check-line text-green-500 mr-2"></i>
                      Vi anbefaler altid at verificere den endelige pris direkte hos forhandleren før køb
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works with Interactive Steps */}
        <div 
          data-animate
          id="how-it-works"
          className="bg-white/60 backdrop-blur-sm rounded-3xl p-16 shadow-2xl border border-pink-100 transform transition-all duration-1000"
          style={{
            transform: `translateY(${isVisible['how-it-works'] ? '0' : '50px'})`,
            opacity: isVisible['how-it-works'] ? 1 : 0
          }}
        >
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-16">
            Sådan Fungerer Det
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {[
              { step: '1', title: 'Gennemse', description: 'Udforsk vores kuraterede kollektion af smykker fra førende mærker' },
              { step: '2', title: 'Sammenlign', description: 'Se priser fra forskellige forhandlere og find den bedste deal' },
              { step: '3', title: 'Køb Sikkert', description: 'Køb direkte fra vores verificerede partnere med fuld garanti' },
              { step: '4', title: 'Nyd', description: 'Modtag dine smukke smykker og nyd dem i mange år fremover' }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-yellow-300 to-pink-300 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                    <span className="text-white font-bold text-2xl">{item.step}</span>
                  </div>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-10 left-full w-10 h-0.5 bg-gradient-to-r from-yellow-300 to-pink-300 opacity-30"></div>
                  )}
                </div>
                <h3 className="font-semibold text-gray-800 mb-3 text-xl group-hover:text-pink-600 transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with Animated Background */}
      <section className="relative bg-gradient-to-r from-yellow-100 to-pink-100 py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-yellow-400/10 to-pink-400/10 animate-pulse"></div>
        </div>
        <div 
          className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10"
          data-animate
          id="cta-section"
          style={{
            transform: `translateY(${isVisible['cta-section'] ? '0' : '30px'})`,
            opacity: isVisible['cta-section'] ? 1 : 0
          }}
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-8">
            Klar til at Finde Dit Perfekte Smykke?
          </h2>
          <p className="text-2xl text-gray-600 mb-10 leading-relaxed">
            Gennemse vores kollektion og find smykker, der matcher din stil
          </p>
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-yellow-400 to-pink-400 text-white px-12 py-5 rounded-full text-xl font-semibold hover:from-yellow-500 hover:to-pink-500 transition-all transform hover:scale-110 hover:shadow-2xl duration-300 whitespace-nowrap"
          >
            Se Vores Kollektion
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/90 backdrop-blur-sm border-t border-pink-100 mt-20">
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
                <li><Link href="/om-os" className="text-gray-600 hover:text-pink-600 transition-colors duration-300">Om Os</Link></li>
                <li><Link href="/privatlivspolitik" className="text-gray-600 hover:text-pink-600 transition-colors duration-300">Privatlivspolitik</Link></li>
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