import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import { appWithTranslation } from 'next-i18next';
import '../styles/globals.css';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-arabic',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Nakl Logistics - شركة نقل للنقل والخدمات اللوجستية',
  description: 'Professional logistics and transport services in Egypt - خدمات نقل وشحن احترافية في مصر',
  keywords: 'logistics, transport, shipping, Egypt, نقل, شحن, لوجستيات, مصر',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={cairo.variable}>
        {children}
      </body>
    </html>
  );
}
