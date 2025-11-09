'use client';

import Link from 'next/link';
import { Truck } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Header() {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Truck className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">
              {language === 'ar' ? 'نقل' : 'Nakl'}
            </span>
          </div>

          <div className="hidden md:flex gap-8">
            <a href="#services" className="text-gray-700 hover:text-primary transition">
              {t('nav.services')}
            </a>
            <Link href="/track" className="text-gray-700 hover:text-primary transition">
              {language === 'ar' ? 'تتبع الشحنات' : 'Track Shipment'}
            </Link>
            <a href="#about" className="text-gray-700 hover:text-primary transition">
              {t('nav.about')}
            </a>
            <a href="#features" className="text-gray-700 hover:text-primary transition">
              {t('nav.features')}
            </a>
            <a href="#contact" className="text-gray-700 hover:text-primary transition">
              {t('nav.contact')}
            </a>
          </div>

          <div className="flex gap-4">
            <Link
              href="/login"
              className="px-6 py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition"
            >
              {t('nav.login')}
            </Link>
            <button
              onClick={toggleLanguage}
              className="px-4 py-2 text-gray-600 hover:text-primary transition border border-gray-300 rounded-lg hover:border-primary font-medium"
            >
              {t('nav.language')}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
