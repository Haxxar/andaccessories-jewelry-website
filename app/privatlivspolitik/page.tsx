
import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <span className="font-['Pacifico'] text-2xl text-gray-800">&Accessories</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-yellow-500 transition-colors">Hjem</Link>
            <a href="/kategorier" className="text-gray-700 hover:text-yellow-500 transition-colors">Kategorier</a>
            <a href="/brands" className="text-gray-700 hover:text-yellow-500 transition-colors">Mærker</a>
            <a href="/om-os" className="text-gray-700 hover:text-yellow-500 transition-colors">Om os</a>
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden w-6 h-6 flex items-center justify-center">
            <i className="ri-menu-line text-gray-700 text-xl"></i>
          </button>
        </div>
      </div>
    </header>
  );
};

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <span className="font-['Pacifico'] text-2xl text-gray-800 mb-4 block">&Accessories</span>
            <p className="text-gray-600 text-sm leading-relaxed">
              Din destination for smukke og elegante smykker fra førende mærker
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Hurtige links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-600 hover:text-yellow-500 transition-colors text-sm">Hjem</Link></li>
              <li><a href="/kategorier" className="text-gray-600 hover:text-yellow-500 transition-colors text-sm">Kategorier</a></li>
              <li><a href="/brands" className="text-gray-600 hover:text-yellow-500 transition-colors text-sm">Mærker</a></li>
              <li><a href="/om-os" className="text-gray-600 hover:text-yellow-500 transition-colors text-sm">Om os</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Kategorier</h3>
            <ul className="space-y-2">
              <li><a href="/kategori/earrings" className="text-gray-600 hover:text-yellow-500 transition-colors text-sm">Øreringe</a></li>
              <li><a href="/kategori/ringe" className="text-gray-600 hover:text-yellow-500 transition-colors text-sm">Ringe</a></li>
              <li><a href="/kategori/necklaces" className="text-gray-600 hover:text-yellow-500 transition-colors text-sm">Halskæder</a></li>
              <li><a href="/kategori/bracelets" className="text-gray-600 hover:text-yellow-500 transition-colors text-sm">Armbånd</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Kontakt</h3>
            <ul className="space-y-2">
              <li className="text-gray-600 text-sm">kontakt@&Accessories.dk</li>
              <li className="text-gray-600 text-sm">+45 12 34 56 78</li>
              <li className="text-gray-600 text-sm">Smykkevej 123<br />2100 København Ø</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © 2024 &Accessories. Alle rettigheder forbeholdes.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="/privatlivspolitik" className="text-gray-500 hover:text-yellow-500 transition-colors text-sm">
              Privatlivspolitik
            </a>
            <a href="/handelsbetingelser" className="text-gray-500 hover:text-yellow-500 transition-colors text-sm">
              Handelsbetingelser
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function PrivatlivspolitikPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-yellow-50">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Privatlivspolitik
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Vi værner om dit privatliv og er forpligtet til at beskytte dine personoplysninger
            </p>
          </div>
        </section>

        {/* Privacy Policy Content */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              
              {/* Last Updated */}
              <div className="mb-8 pb-6 border-b border-gray-200">
                <p className="text-sm text-gray-500">
                  Sidst opdateret: {new Date().toLocaleDateString('da-DK')}
                </p>
              </div>

              {/* Introduction */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Introduktion</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Denne privatlivspolitik beskriver, hvordan &Accessories (&quot;vi&quot;, &quot;os&quot;, &quot;vores&quot;) indsamler, 
                  bruger og beskytter dine personoplysninger, når du besøger vores hjemmeside og 
                  bruger vores tjenester.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Vi er forpligtet til at beskytte dit privatliv og sikre, at dine personoplysninger 
                  behandles i overensstemmelse med gældende databeskyttelseslove, herunder 
                  GDPR (Databeskyttelsesforordningen).
                </p>
              </div>

              {/* Data Collection */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Hvilke oplysninger indsamler vi?</h2>
                
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Personoplysninger du giver os</h3>
                <ul className="list-disc pl-6 text-gray-600 leading-relaxed mb-6 space-y-2">
                  <li>Navn og kontaktoplysninger (e-mail, telefonnummer, adresse)</li>
                  <li>Betalingsoplysninger ved køb af produkter</li>
                  <li>Oplysninger du giver ved henvendelser til kundeservice</li>
                  <li>Oplysninger ved tilmelding til nyhedsbrev</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-700 mb-4">Automatisk indsamlede oplysninger</h3>
                <ul className="list-disc pl-6 text-gray-600 leading-relaxed mb-6 space-y-2">
                  <li>IP-adresse og browseroplysninger</li>
                  <li>Cookies og lignende sporingsdata</li>
                  <li>Brugsstatistikker og navigationsmønstre</li>
                  <li>Enhedsoplysninger og tekniske data</li>
                </ul>
              </div>

              {/* Data Usage */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Hvordan bruger vi dine oplysninger?</h2>
                <ul className="list-disc pl-6 text-gray-600 leading-relaxed space-y-2">
                  <li>At behandle og levere dine bestillinger</li>
                  <li>At kommunikere med dig om dine køb og henvendelser</li>
                  <li>At sende dig nyhedsbreve og markedsføringsmateriale (kun med dit samtykke)</li>
                  <li>At forbedre vores hjemmeside og tjenester</li>
                  <li>At overholde juridiske forpligtelser</li>
                  <li>At forebygge svindel og sikre systemsikkerhed</li>
                </ul>
              </div>

              {/* Cookies */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Cookies</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Vi bruger cookies til at forbedre din brugeroplevelse på vores hjemmeside. 
                  Cookies er små tekstfiler, der gemmes på din enhed.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Typer af cookies vi bruger:</h3>
                <ul className="list-disc pl-6 text-gray-600 leading-relaxed space-y-2">
                  <li><strong>Nødvendige cookies:</strong> Kræves for grundlæggende funktionalitet</li>
                  <li><strong>Funktionelle cookies:</strong> Husker dine præferencer</li>
                  <li><strong>Analytiske cookies:</strong> Hjælper os med at forstå, hvordan du bruger siden</li>
                  <li><strong>Marketing cookies:</strong> Bruges til at vise dig relevante annoncer</li>
                </ul>
              </div>

              {/* Data Sharing */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Deling af oplysninger</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Vi sælger, udlejer eller deler ikke dine personoplysninger med tredjeparter, 
                  undtagen i følgende tilfælde:
                </p>
                <ul className="list-disc pl-6 text-gray-600 leading-relaxed space-y-2">
                  <li>Med dit udtrykkelige samtykke</li>
                  <li>Med tjenesteudbydere, der hjælper os med at drive vores forretning</li>
                  <li>Når det kræves af loven eller ved juridiske procedurer</li>
                  <li>For at beskytte vores rettigheder og sikkerhed</li>
                </ul>
              </div>

              {/* Data Security */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Datasikkerhed</h2>
                <p className="text-gray-600 leading-relaxed">
                  Vi implementerer passende tekniske og organisatoriske foranstaltninger for 
                  at beskytte dine personoplysninger mod uautoriseret adgang, ændring, 
                  videregivelse eller ødelæggelse. Dette inkluderer kryptering, sikre servere 
                  og regelmæssige sikkerhedsopdateringer.
                </p>
              </div>

              {/* Your Rights */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Dine rettigheder</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Under GDPR har du følgende rettigheder:
                </p>
                <ul className="list-disc pl-6 text-gray-600 leading-relaxed space-y-2">
                  <li><strong>Ret til indsigt:</strong> Du kan anmode om en kopi af dine personoplysninger</li>
                  <li><strong>Ret til berigtigelse:</strong> Du kan anmode om rettelse af unøjagtige oplysninger</li>
                  <li><strong>Ret til sletning:</strong> Du kan anmode om sletning af dine oplysninger</li>
                  <li><strong>Ret til begrænsning:</strong> Du kan begrænse behandlingen af dine oplysninger</li>
                  <li><strong>Ret til dataportabilitet:</strong> Du kan få dine oplysninger i et maskinlæsbart format</li>
                  <li><strong>Ret til indsigelse:</strong> Du kan gøre indsigelse mod behandlingen</li>
                </ul>
              </div>

              {/* Changes */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Ændringer til privatlivspolitikken</h2>
                <p className="text-gray-600 leading-relaxed">
                  Vi kan opdatere denne privatlivspolitik fra tid til anden. Væsentlige 
                  ændringer vil blive kommunikeret til dig via e-mail eller gennem en 
                  meddelelse på vores hjemmeside. Vi opfordrer dig til at gennemgå 
                  denne politik regelmæssigt.
                </p>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
