import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | &Accessories - Smukke Smykker Online',
    default: 'Kategorier | &Accessories - Smukke Smykker Online',
  },
  description: 'Udforsk vores omfattende kollektion af smykker. Find ringe, halskæder, øreringe, armbånd og meget mere til de bedste priser.',
  keywords: 'smykker, ringe, halskæder, øreringe, armbånd, vedhæng, ørestikker, smykkeudvalg, danske smykker',
  openGraph: {
    title: 'Smykke Kategorier | &Accessories',
    description: 'Udforsk vores omfattende kollektion af smykker. Find ringe, halskæder, øreringe, armbånd og meget mere.',
    type: 'website',
    locale: 'da_DK',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Smykke Kategorier | &Accessories',
    description: 'Udforsk vores omfattende kollektion af smykker. Find ringe, halskæder, øreringe, armbånd og meget mere.',
  },
};

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
