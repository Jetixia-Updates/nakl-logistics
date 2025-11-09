'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation data
const translations = {
  ar: {
    // Header
    'nav.services': 'الخدمات',
    'nav.about': 'من نحن',
    'nav.features': 'المميزات',
    'nav.contact': 'اتصل بنا',
    'nav.login': 'تسجيل الدخول',
    'nav.language': 'EN',

    // Hero Section
    'hero.title': 'حلول نقل وشحن',
    'hero.title.highlight': 'احترافية',
    'hero.title.suffix': 'لأعمالك',
    'hero.description':
      'نوفر خدمات النقل والشحن واللوجستيات المتكاملة بأعلى معايير الجودة والأمان في جميع أنحاء مصر',
    'hero.track': 'تتبع الشحنة',
    'hero.quote': 'اطلب عرض سعر',
    'hero.operations': 'عملية نقل شهرياً',
    'hero.gps': 'تتبع لحظي بنظام GPS',
    'hero.fleet': 'أسطول شاحنات حديث',
    'hero.insurance': 'تأمين شامل على البضائع',

    // Services Section
    'services.title': 'خدماتنا المتكاملة',
    'services.subtitle': 'نقدم حلول نقل شاملة تلبي جميع احتياجات عملك',
    'services.transport': 'النقل البري',
    'services.transport.desc': 'خدمات نقل برية متكاملة بأسطول حديث ومتنوع يشمل جميع أنواع الشاحنات',
    'services.warehouse': 'التخزين والتوزيع',
    'services.warehouse.desc': 'مستودعات حديثة مجهزة بأنظمة إدارة متقدمة لضمان سلامة البضائع',
    'services.tracking': 'التتبع اللحظي',
    'services.tracking.desc': 'نظام تتبع متطور بتقنية GPS لمعرفة موقع شحنتك في أي وقت',
    'services.delivery': 'التسليم السريع',
    'services.delivery.desc': 'خدمة توصيل سريعة مع التزام تام بمواعيد التسليم المحددة',
    'services.insurance': 'التأمين الشامل',
    'services.insurance.desc': 'تأمين كامل على جميع الشحنات لضمان راحة بالك',
    'services.support': 'دعم العملاء',
    'services.support.desc': 'فريق دعم محترف متاح 24/7 للرد على استفساراتك',

    // Features Section
    'features.title': 'لماذا تختار نقل؟',
    'features.subtitle': 'نتميز بالخبرة والاحترافية والتزام بأعلى معايير الجودة',
    'features.experience': 'سنة خبرة',
    'features.trucks': 'شاحنة',
    'features.customers': 'عميل راضٍ',
    'features.satisfaction': 'معدل الرضا',

    // About Section
    'about.title': 'من نحن',
    'about.p1':
      'شركة نقل هي إحدى الشركات الرائدة في مجال النقل والخدمات اللوجستية في مصر. نعمل منذ أكثر من 15 عاماً على تقديم حلول نقل متكاملة تلبي احتياجات مختلف القطاعات.',
    'about.p2':
      'نفخر بامتلاكنا أسطول حديث من الشاحنات ونظام إدارة متطور يضمن تتبع الشحنات لحظياً وتسليمها في الوقت المحدد بأعلى معايير الأمان.',
    'about.p3':
      'رؤيتنا هي أن نكون الخيار الأول لخدمات النقل في مصر والشرق الأوسط، من خلال الابتكار المستمر والالتزام بأعلى معايير الجودة.',
    'about.values': 'قيمنا',
    'about.professionalism': 'الاحترافية',
    'about.professionalism.desc': 'نلتزم بأعلى معايير الاحترافية في كل ما نقوم به',
    'about.trust': 'الأمانة',
    'about.trust.desc': 'نحافظ على ثقة عملائنا من خلال الشفافية والنزاهة',
    'about.quality': 'الجودة',
    'about.quality.desc': 'نسعى دائماً لتقديم خدمات بأعلى مستوى من الجودة',
    'about.innovation': 'الابتكار',
    'about.innovation.desc': 'نستخدم أحدث التقنيات لتطوير خدماتنا',

    // Contact Section
    'contact.title': 'تواصل معنا',
    'contact.subtitle': 'نحن هنا للإجابة على استفساراتك وخدمتك',
    'contact.phone': 'الهاتف',
    'contact.email': 'البريد الإلكتروني',
    'contact.address': 'العنوان',
    'contact.location': 'القاهرة، مصر',
    'contact.form.name': 'الاسم',
    'contact.form.email': 'البريد الإلكتروني',
    'contact.form.subject': 'الموضوع',
    'contact.form.message': 'رسالتك',
    'contact.form.send': 'إرسال الرسالة',

    // Footer
    'footer.tagline': 'حلول نقل وشحن احترافية لأعمالك',
    'footer.services': 'خدماتنا',
    'footer.transport': 'النقل البري',
    'footer.storage': 'التخزين',
    'footer.distribution': 'التوزيع',
    'footer.tracking': 'التتبع',
    'footer.links': 'روابط سريعة',
    'footer.about': 'من نحن',
    'footer.services.link': 'الخدمات',
    'footer.features': 'المميزات',
    'footer.contact': 'اتصل بنا',
    'footer.follow': 'تابعنا',
    'footer.rights': '© 2024 نقل. جميع الحقوق محفوظة.',
  },
  en: {
    // Header
    'nav.services': 'Services',
    'nav.about': 'About',
    'nav.features': 'Features',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    'nav.language': 'ع',

    // Hero Section
    'hero.title': 'Professional Transport &',
    'hero.title.highlight': 'Logistics',
    'hero.title.suffix': 'Solutions',
    'hero.description':
      'We provide comprehensive transport, shipping, and logistics services with the highest quality and safety standards across Egypt',
    'hero.track': 'Track Shipment',
    'hero.quote': 'Request Quote',
    'hero.operations': 'monthly operations',
    'hero.gps': 'Real-time GPS tracking',
    'hero.fleet': 'Modern truck fleet',
    'hero.insurance': 'Comprehensive cargo insurance',

    // Services Section
    'services.title': 'Our Comprehensive Services',
    'services.subtitle':
      'We provide complete transport solutions that meet all your business needs',
    'services.transport': 'Ground Transport',
    'services.transport.desc':
      'Comprehensive ground transport services with a modern and diverse fleet including all types of trucks',
    'services.warehouse': 'Storage & Distribution',
    'services.warehouse.desc':
      'Modern warehouses equipped with advanced management systems to ensure cargo safety',
    'services.tracking': 'Real-time Tracking',
    'services.tracking.desc': 'Advanced GPS tracking system to know your shipment location anytime',
    'services.delivery': 'Fast Delivery',
    'services.delivery.desc':
      'Fast delivery service with full commitment to specified delivery times',
    'services.insurance': 'Comprehensive Insurance',
    'services.insurance.desc': 'Full insurance on all shipments for your peace of mind',
    'services.support': 'Customer Support',
    'services.support.desc': 'Professional support team available 24/7 to answer your inquiries',

    // Features Section
    'features.title': 'Why Choose Nakl?',
    'features.subtitle':
      'We excel in experience, professionalism, and commitment to the highest quality standards',
    'features.experience': 'Years Experience',
    'features.trucks': 'Trucks',
    'features.customers': 'Happy Clients',
    'features.satisfaction': 'Satisfaction Rate',

    // About Section
    'about.title': 'About Us',
    'about.p1':
      'Nakl Company is one of the leading companies in transport and logistics services in Egypt. We have been working for more than 15 years to provide comprehensive transport solutions that meet the needs of various sectors.',
    'about.p2':
      'We are proud to own a modern fleet of trucks and an advanced management system that ensures real-time shipment tracking and delivery on time with the highest safety standards.',
    'about.p3':
      'Our vision is to be the first choice for transport services in Egypt and the Middle East, through continuous innovation and commitment to the highest quality standards.',
    'about.values': 'Our Values',
    'about.professionalism': 'Professionalism',
    'about.professionalism.desc':
      'We commit to the highest standards of professionalism in everything we do',
    'about.trust': 'Trust',
    'about.trust.desc': "We maintain our clients' trust through transparency and integrity",
    'about.quality': 'Quality',
    'about.quality.desc': 'We always strive to provide services at the highest level of quality',
    'about.innovation': 'Innovation',
    'about.innovation.desc': 'We use the latest technologies to develop our services',

    // Contact Section
    'contact.title': 'Contact Us',
    'contact.subtitle': 'We are here to answer your inquiries and serve you',
    'contact.phone': 'Phone',
    'contact.email': 'Email',
    'contact.address': 'Address',
    'contact.location': 'Cairo, Egypt',
    'contact.form.name': 'Name',
    'contact.form.email': 'Email',
    'contact.form.subject': 'Subject',
    'contact.form.message': 'Your Message',
    'contact.form.send': 'Send Message',

    // Footer
    'footer.tagline': 'Professional transport and shipping solutions for your business',
    'footer.services': 'Our Services',
    'footer.transport': 'Ground Transport',
    'footer.storage': 'Storage',
    'footer.distribution': 'Distribution',
    'footer.tracking': 'Tracking',
    'footer.links': 'Quick Links',
    'footer.about': 'About',
    'footer.services.link': 'Services',
    'footer.features': 'Features',
    'footer.contact': 'Contact',
    'footer.follow': 'Follow Us',
    'footer.rights': '© 2024 Nakl. All rights reserved.',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ar');

  useEffect(() => {
    // Load language from localStorage
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'ar' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);

    // Update document attributes
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
