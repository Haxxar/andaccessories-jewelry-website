import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | &Accessories',
    default: 'Smykke Kategorier | &Accessories',
  },
  description: 'Udforsk ringe, halskæder, øreringe og armbånd. Sammenlign priser og find de bedste tilbud på smykker.',
  keywords: 'smykker, ringe, halskæder, øreringe, armbånd, vedhæng, ørestikker, smykkeudvalg, danske smykker',
  openGraph: {
    title: 'Smykke Kategorier | &Accessories',
    description: 'Udforsk ringe, halskæder, øreringe og armbånd. Sammenlign priser og find de bedste tilbud.',
    type: 'website',
    locale: 'da_DK',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Smykke Kategorier | &Accessories',
    description: 'Udforsk ringe, halskæder, øreringe og armbånd. Sammenlign priser og find de bedste tilbud.',
  },
};

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
