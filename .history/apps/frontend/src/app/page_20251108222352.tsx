'use client';

import Link from 'next/link';
import { 
  Truck, 
  Package, 
  MapPin, 
  Clock, 
  Shield, 
  Users,
  TrendingUp,
  Award,
  Phone,
  Mail,
  MapPinned,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Header from '../components/Header';
import { useEffect } from 'react';

export default function Home() {
  const { language, t } = useLanguage();

  useEffect(() => {
    // Update document direction and language
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);
  return (
    <div 
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white"
      style={{ fontFamily: language === 'ar' ? 'var(--font-arabic)' : 'var(--font-inter)' }}
    >
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {t('hero.title')} <span className="text-primary">{t('hero.title.highlight')}</span> {t('hero.title.suffix')}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {t('hero.description')}
            </p>
            <div className={`flex gap-4 ${language === 'en' ? 'flex-row' : 'flex-row'}`}>
              <Link 
                href="/track"
                className="px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition flex items-center gap-2 text-lg font-medium"
              >
                {t('hero.track')}
                <ArrowRight className={`h-5 w-5 ${language === 'ar' ? '' : 'rotate-180'}`} />
              </Link>
              <a 
                href="#contact"
                className="px-8 py-4 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition text-lg font-medium"
              >
                {t('hero.quote')}
              </a>
            </div>
          </div>
          
          <div className="relative">
            <div className={`absolute top-10 ${language === 'ar' ? 'right-10' : 'left-10'} w-72 h-72 bg-primary/10 rounded-full blur-3xl`}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Truck className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">500+</div>
                  <div className="text-gray-600">{t('hero.operations')}</div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">{t('hero.gps')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">{t('hero.fleet')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">{t('hero.insurance')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('services.title')}</h2>
            <p className="text-xl text-gray-600">{t('services.subtitle')}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <ServiceCard 
              icon={<Truck className="h-12 w-12 text-primary" />}
              title={t('services.transport')}
              description={t('services.transport.desc')}
            />
            <ServiceCard 
              icon={<Package className="h-12 w-12 text-primary" />}
              title={t('services.warehouse')}
              description={t('services.warehouse.desc')}
            />
            <ServiceCard 
              icon={<MapPin className="h-12 w-12 text-primary" />}
              title={t('services.tracking')}
              description={t('services.tracking.desc')}
            />
            <ServiceCard 
              icon={<Clock className="h-12 w-12 text-primary" />}
              title={t('services.delivery')}
              description={t('services.delivery.desc')}
            />
            <ServiceCard 
              icon={<Shield className="h-12 w-12 text-primary" />}
              title={t('services.insurance')}
              description={t('services.insurance.desc')}
            />
            <ServiceCard 
              icon={<Users className="h-12 w-12 text-primary" />}
              title={t('services.support')}
              description={t('services.support.desc')}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('features.title')}</h2>
            <p className="text-xl text-gray-600">{t('features.subtitle')}</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <FeatureCard 
              icon={<TrendingUp className="h-8 w-8 text-primary" />}
              number="15+"
              label={t('features.experience')}
            />
            <FeatureCard 
              icon={<Truck className="h-8 w-8 text-primary" />}
              number="200+"
              label={t('features.trucks')}
            />
            <FeatureCard 
              icon={<Users className="h-8 w-8 text-primary" />}
              number="500+"
              label={t('features.customers')}
            />
            <FeatureCard 
              icon={<Award className="h-8 w-8 text-primary" />}
              number="98%"
              label={t('features.satisfaction')}
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-primary text-white py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">{t('about.title')}</h2>
              <p className="text-lg mb-4 opacity-90">
                {t('about.p1')}
              </p>
              <p className="text-lg mb-4 opacity-90">
                {t('about.p2')}
              </p>
              <p className="text-lg opacity-90">
                {t('about.p3')}
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">{t('about.values')}</h3>
              <div className="space-y-4">
                <ValueItem title={t('about.professionalism')} description={t('about.professionalism.desc')} />
                <ValueItem title={t('about.trust')} description={t('about.trust.desc')} />
                <ValueItem title={t('about.quality')} description={t('about.quality.desc')} />
                <ValueItem title={t('about.innovation')} description={t('about.innovation.desc')} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('contact.title')}</h2>
            <p className="text-xl text-gray-600">{t('contact.subtitle')}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <ContactCard 
              icon={<Phone className="h-8 w-8 text-primary" />}
              title={t('contact.phone')}
              content="+20 2 1234 5678"
            />
            <ContactCard 
              icon={<Mail className="h-8 w-8 text-primary" />}
              title={t('contact.email')}
              content="info@nakl.com"
            />
            <ContactCard 
              icon={<MapPinned className="h-8 w-8 text-primary" />}
              title={t('contact.address')}
              content={t('contact.location')}
            />
          </div>
          
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder={t('contact.form.name')}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="email"
                  placeholder={t('contact.form.email')}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <input
                type="text"
                placeholder={t('contact.form.subject')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <textarea
                rows={5}
                placeholder={t('contact.form.message')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              ></textarea>
              <button
                type="submit"
                className="w-full px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-medium text-lg"
              >
                {t('contact.form.send')}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Truck className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold">
                  {language === 'ar' ? 'نقل' : 'Nakl'}
                </span>
              </div>
              <p className="text-gray-400">
                {t('footer.tagline')}
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">{t('footer.services')}</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">{t('footer.transport')}</a></li>
                <li><a href="#" className="hover:text-white transition">{t('footer.storage')}</a></li>
                <li><a href="#" className="hover:text-white transition">{t('footer.distribution')}</a></li>
                <li><a href="#" className="hover:text-white transition">{t('footer.tracking')}</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">{t('footer.links')}</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#about" className="hover:text-white transition">{t('footer.about')}</a></li>
                <li><a href="#services" className="hover:text-white transition">{t('footer.services.link')}</a></li>
                <li><a href="#features" className="hover:text-white transition">{t('footer.features')}</a></li>
                <li><a href="#contact" className="hover:text-white transition">{t('footer.contact')}</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">{t('footer.follow')}</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition">
                  f
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition">
                  t
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition">
                  in
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>{t('footer.rights')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Helper Components
function ServiceCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function FeatureCard({ icon, number, label }: { icon: React.ReactNode; number: string; label: string }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <div className="text-3xl font-bold text-gray-900 mb-2">{number}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
}

function ValueItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex gap-3">
      <CheckCircle className="h-6 w-6 flex-shrink-0 mt-0.5" />
      <div>
        <div className="font-semibold mb-1">{title}</div>
        <div className="text-sm opacity-80">{description}</div>
      </div>
    </div>
  );
}

function ContactCard({ icon, title, content }: { icon: React.ReactNode; title: string; content: string }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="font-bold text-lg text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{content}</p>
    </div>
  );
}
