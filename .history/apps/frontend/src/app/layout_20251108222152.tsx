import type { Metadata } from 'next';
import { Cairo, Inter } from 'next/font/google';
import '../styles/globals.css';
import { LanguageProvider } from '../contexts/LanguageContext';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-arabic',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Nakl Logistics - شركة نقل للنقل والخدمات اللوجستية',
  description:
    'Professional logistics and transport services in Egypt - خدمات نقل وشحن احترافية في مصر',
  keywords: 'logistics, transport, shipping, Egypt, نقل, شحن, لوجستيات, مصر',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} ${inter.variable}`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
