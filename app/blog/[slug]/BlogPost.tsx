'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';

interface BlogPostProps {
  post: {
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    category: string;
    date: string;
    readTime: string;
    author: string;
  };
}

export default function BlogPost({ post }: BlogPostProps) {
  const [readingProgress, setReadingProgress] = useState(0);
  const [isSticky, setIsSticky] = useState(false);

  // Reading progress calculation
  useEffect(() => {
    const updateReadingProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(progress);
    };

    const handleScroll = () => {
      updateReadingProgress();
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Generate structured data for the blog post
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "datePublished": post.date,
    "author": {
      "@type": "Organization",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "&Accessories",
      "logo": {
        "@type": "ImageObject",
        "url": "https://andaccessories.dk/android-chrome-512x512.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://andaccessories.dk/blog/${post.slug}`
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Hjem",
        "item": "https://andaccessories.dk"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://andaccessories.dk/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `https://andaccessories.dk/blog/${post.slug}`
      }
    ]
  };

  return (
    <div className="min-h-screen bg-pink-100">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-gradient-to-r from-pink-500 to-pink-600 transition-all duration-300 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Header */}
      <header className={`bg-white/80 backdrop-blur-sm border-b border-pink-200 sticky top-0 z-40 transition-all duration-300 ${isSticky ? 'shadow-lg' : ''}`}>
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

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-pink-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-600 hover:text-pink-600">Hjem</Link>
            <span className="text-gray-400">/</span>
            <Link href="/blog" className="text-gray-600 hover:text-pink-600">Blog</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-800 font-medium">{post.title}</span>
          </nav>
        </div>
      </div>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="bg-pink-100 text-pink-700 px-4 py-1 rounded-full text-sm font-medium">
              {post.category}
            </span>
            <span className="text-gray-500 text-sm">{post.date}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500 text-sm">{post.readTime} læsning</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500 text-sm">Af {post.author}</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl p-8 mb-8 border-l-4 border-pink-400">
            <div className="flex items-start">
              <div className="text-pink-500 text-3xl mr-4 mt-1">
                <i className="ri-quote-mark"></i>
              </div>
              <p className="text-xl text-gray-700 leading-relaxed italic font-medium">
            {post.excerpt}
          </p>
            </div>
          </div>

          {/* Table of Contents */}
          <div className="bg-white border border-pink-200 rounded-xl p-6 mb-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <i className="ri-list-check text-pink-500 mr-2"></i>
              Indholdsfortegnelse
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-pink-400 rounded-full mr-3"></span>
                <span>Hvorfor er Smykkepleje Vigtigt?</span>
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-pink-400 rounded-full mr-3"></span>
                <span>Generelle Plejeregler for Alle Smykker</span>
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-pink-400 rounded-full mr-3"></span>
                <span>Pleje Efter Materiale</span>
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-pink-400 rounded-full mr-3"></span>
                <span>Professionel Pleje og Inspektion</span>
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-pink-400 rounded-full mr-3"></span>
                <span>Hurtigt Cheatsheet</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-xl max-w-none
            prose-headings:text-gray-900 prose-headings:font-bold prose-headings:tracking-tight
            prose-h1:text-4xl prose-h1:mt-16 prose-h1:mb-8 prose-h1:border-b prose-h1:border-pink-200 prose-h1:pb-4
            prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-8 prose-h2:text-pink-700 prose-h2:border-l-4 prose-h2:border-pink-300 prose-h2:pl-4
            prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-6 prose-h3:text-gray-800
            prose-h4:text-xl prose-h4:mt-8 prose-h4:mb-4 prose-h4:text-gray-700
            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-8 prose-p:text-lg
            prose-a:text-pink-600 prose-a:no-underline hover:prose-a:underline hover:prose-a:text-pink-700 prose-a:font-medium
            prose-strong:text-gray-900 prose-strong:font-bold
            prose-ul:my-8 prose-ul:space-y-3 prose-ul:pl-6
            prose-ol:my-8 prose-ol:space-y-3 prose-ol:pl-6
            prose-li:text-gray-700 prose-li:text-lg prose-li:leading-relaxed
            prose-blockquote:border-l-4 prose-blockquote:border-pink-400 prose-blockquote:bg-pink-50 prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:my-8 prose-blockquote:italic prose-blockquote:text-gray-700 prose-blockquote:text-lg
            prose-table:border-collapse prose-table:w-full prose-table:my-8 prose-table:shadow-lg prose-table:rounded-lg prose-table:overflow-hidden
            prose-th:bg-gradient-to-r prose-th:from-pink-500 prose-th:to-pink-600 prose-th:p-4 prose-th:text-left prose-th:font-bold prose-th:text-white prose-th:text-lg
            prose-td:border prose-td:border-gray-200 prose-td:p-4 prose-td:text-gray-700 prose-td:bg-white
            prose-tr:even:bg-gray-50
            prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:text-gray-800
            prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-6 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:my-8
            prose-img:rounded-lg prose-img:shadow-lg prose-img:my-8
          ">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-4xl font-bold text-gray-900 mt-16 mb-8 border-b-2 border-pink-200 pb-4">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-3xl font-bold text-pink-700 mt-16 mb-8 border-l-4 border-pink-300 pl-4 bg-pink-50 py-2 rounded-r-lg">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-2xl font-bold text-gray-800 mt-12 mb-6 flex items-center">
                    <span className="w-2 h-2 bg-pink-500 rounded-full mr-3 mt-3"></span>
                    {children}
                  </h3>
                ),
                h4: ({ children }) => (
                  <h4 className="text-xl font-semibold text-gray-700 mt-8 mb-4">
                    {children}
                  </h4>
                ),
                p: ({ children }) => (
                  <p className="text-lg text-gray-700 leading-relaxed mb-8">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="my-8 space-y-3 pl-6">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="my-8 space-y-3 pl-6">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-lg text-gray-700 leading-relaxed flex items-start">
                    <span className="w-2 h-2 bg-pink-400 rounded-full mt-3 mr-3 flex-shrink-0"></span>
                    <span>{children}</span>
                  </li>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-pink-400 bg-gradient-to-r from-pink-50 to-pink-100 pl-6 py-4 my-8 italic text-gray-700 text-lg rounded-r-lg shadow-sm">
                    <div className="flex items-start">
                      <span className="text-pink-500 text-2xl mr-3 mt-1">"</span>
                      <div>{children}</div>
                    </div>
                  </blockquote>
                ),
                // Custom components for professional callouts
                'tip': ({ children }: { children?: React.ReactNode }) => (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400 rounded-r-lg p-6 my-8 shadow-sm">
                    <div className="flex items-start">
                      <div className="text-green-500 text-2xl mr-4 mt-1">
                        <i className="ri-lightbulb-line"></i>
                      </div>
                      <div className="text-green-800">
                        <div className="font-semibold text-lg mb-2">💡 Pro Tip</div>
                        <div>{children}</div>
                      </div>
                    </div>
                  </div>
                ),
                'warning': ({ children }: { children?: React.ReactNode }) => (
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 rounded-r-lg p-6 my-8 shadow-sm">
                    <div className="flex items-start">
                      <div className="text-yellow-500 text-2xl mr-4 mt-1">
                        <i className="ri-alert-line"></i>
                      </div>
                      <div className="text-yellow-800">
                        <div className="font-semibold text-lg mb-2">⚠️ Vigtigt</div>
                        <div>{children}</div>
                      </div>
                    </div>
                  </div>
                ),
                'info': ({ children }: { children?: React.ReactNode }) => (
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-400 rounded-r-lg p-6 my-8 shadow-sm">
                    <div className="flex items-start">
                      <div className="text-blue-500 text-2xl mr-4 mt-1">
                        <i className="ri-information-line"></i>
                      </div>
                      <div className="text-blue-800">
                        <div className="font-semibold text-lg mb-2">ℹ️ Information</div>
                        <div>{children}</div>
                      </div>
                    </div>
                  </div>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto my-8">
                    <table className="w-full border-collapse shadow-lg rounded-lg overflow-hidden">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-gradient-to-r from-pink-500 to-pink-600">
                    {children}
                  </thead>
                ),
                th: ({ children }) => (
                  <th className="p-4 text-left font-bold text-white text-lg">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border border-gray-200 p-4 text-gray-700 bg-white">
                    {children}
                  </td>
                ),
                tr: ({ children }) => (
                  <tr className="even:bg-gray-50 hover:bg-pink-50 transition-colors">
                    {children}
                  </tr>
                ),
                code: ({ children }) => (
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto my-8 shadow-lg">
                    {children}
                  </pre>
                ),
                strong: ({ children }) => (
                  <strong className="font-bold text-gray-900">
                    {children}
                  </strong>
                ),
                a: ({ href, children }) => (
                  <a 
                    href={href} 
                    className="text-pink-600 no-underline hover:underline hover:text-pink-700 font-medium transition-colors"
                    target={href?.startsWith('http') ? '_blank' : undefined}
                    rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {children}
                  </a>
                ),
              } as Components & Record<string, any>}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Share Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4">Del denne artikel:</p>
            <div className="flex items-center space-x-4">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=https://andaccessories.dk/blog/${post.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-pink-600 transition-colors"
              >
                <i className="ri-facebook-circle-line text-2xl"></i>
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=https://andaccessories.dk/blog/${post.slug}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-pink-600 transition-colors"
              >
                <i className="ri-twitter-line text-2xl"></i>
              </a>
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=https://andaccessories.dk/blog/${post.slug}&title=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-pink-600 transition-colors"
              >
                <i className="ri-linkedin-line text-2xl"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Back to Blog */}
        <div className="mt-8 text-center">
          <Link 
            href="/blog"
            className="inline-flex items-center text-pink-600 hover:text-pink-700 font-medium bg-pink-50 hover:bg-pink-100 px-6 py-3 rounded-full transition-all duration-300"
          >
            <i className="ri-arrow-left-line mr-2"></i>
            Tilbage til blog
          </Link>
        </div>
      </article>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-30">
        <div className="flex flex-col space-y-3">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-pink-500 hover:bg-pink-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
            title="Til toppen"
          >
            <i className="ri-arrow-up-line text-xl"></i>
          </button>
          <button 
            onClick={() => window.print()}
            className="bg-white hover:bg-gray-50 text-pink-600 border border-pink-200 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
            title="Print artikel"
          >
            <i className="ri-printer-line text-xl"></i>
          </button>
        </div>
      </div>

      {/* Related Articles Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <i className="ri-book-open-line text-pink-500 mr-3"></i>
            Relaterede Artikler
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link 
              href="/blog/vaelg-forlovelsesring"
              className="group bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
            >
              <h4 className="font-semibold text-gray-900 group-hover:text-pink-600 transition-colors mb-2">
                Sådan Vælger Du Den Perfekte Forlovelsesring
              </h4>
              <p className="text-gray-600 text-sm">
                Alt du behøver at vide om at vælge den rigtige forlovelsesring...
              </p>
            </Link>
            <Link 
              href="/blog/smykke-trends-2024"
              className="group bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
            >
              <h4 className="font-semibold text-gray-900 group-hover:text-pink-600 transition-colors mb-2">
                Smykketrends 2024: De Hotteste Styles
              </h4>
              <p className="text-gray-600 text-sm">
                Opdag de nyeste smykketrends for 2024...
              </p>
            </Link>
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
            <div className="mt-4 sm:mt-0 text-center sm:text-right">
              <p className="text-gray-500 text-xs mb-1">Besøg også vores anden affiliate side:</p>
              <a 
                href="https://equinord.dk" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-pink-600 transition-colors text-sm font-semibold"
              >
                Equinord.dk →
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

