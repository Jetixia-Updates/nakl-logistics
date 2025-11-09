'use client';

import type { Metadata } from 'next';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  LayoutDashboard, 
  FileText, 
  Truck, 
  Users, 
  Package, 
  DollarSign, 
  MapPin, 
  Settings,
  Building2,
  CreditCard,
  BarChart3,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

const metadata: Metadata = {
  title: 'إدارة نقل - لوحة التحكم الإدارية',
  description: 'لوحة تحكم إدارية آمنة لنظام إدارة النقل واللوجستيات',
  robots: 'noindex, nofollow',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navigationItems = [
    {
      href: '/admin/dashboard',
      icon: LayoutDashboard,
      label: language === 'ar' ? 'لوحة التحكم' : 'Dashboard'
    },
    {
      href: '/admin/tenders',
      icon: FileText,
      label: language === 'ar' ? 'المناقصات' : 'Tenders'
    },
    {
      href: '/admin/work-orders',
      icon: Package,
      label: language === 'ar' ? 'أوامر العمل' : 'Work Orders'
    },
    {
      href: '/admin/vehicles',
      icon: Truck,
      label: language === 'ar' ? 'الأسطول' : 'Vehicles'
    },
    {
      href: '/admin/customers',
      icon: Users,
      label: language === 'ar' ? 'العملاء والموردين' : 'Customers & Vendors'
    },
    {
      href: '/admin/invoices',
      icon: CreditCard,
      label: language === 'ar' ? 'الفواتير' : 'Invoices'
    },
    {
      href: '/admin/accounting',
      icon: DollarSign,
      label: language === 'ar' ? 'المحاسبة' : 'Accounting'
    },
    {
      href: '/admin/warehouse',
      icon: Building2,
      label: language === 'ar' ? 'المستودعات' : 'Warehouse'
    },
    {
      href: '/admin/gps',
      icon: MapPin,
      label: language === 'ar' ? 'تتبع GPS' : 'GPS Tracking'
    },
    {
      href: '/admin/reports',
      icon: BarChart3,
      label: language === 'ar' ? 'التقارير' : 'Reports'
    }
  ];

  return (
    <div className={`min-h-screen bg-gray-50 ${language === 'ar' ? 'font-arabic' : 'font-inter'}`}>
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 ${language === 'ar' ? 'right-0' : 'left-0'} z-50 w-64 bg-white shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : language === 'ar' ? 'translate-x-full' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-4 bg-blue-600">
          <div className="flex items-center gap-3">
            <Truck className="w-8 h-8 text-white" />
            <span className="text-xl font-bold text-white">
              {language === 'ar' ? 'نقل - الإدارة' : 'Nakl Admin'}
            </span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-white hover:bg-blue-700 p-1 rounded"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="mt-8">
          <div className="px-4 space-y-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className={`lg:${language === 'ar' ? 'mr-64' : 'ml-64'}`}>
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                {language === 'ar' ? 'مرحباً بك في لوحة التحكم' : 'Welcome to Admin Panel'}
              </div>
              <Link
                href="/login"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                {language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
              </Link>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}
