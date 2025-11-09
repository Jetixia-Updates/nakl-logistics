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
  X,
  Bell,
  Search,
  User,
  LogOut,
  ChevronRight,
  Zap,
  Sparkles,
  Globe,
  Languages,
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
      label: language === 'ar' ? 'لوحة التحكم' : 'Dashboard',
    },
    {
      href: '/admin/tenders',
      icon: FileText,
      label: language === 'ar' ? 'المناقصات' : 'Tenders',
    },
    {
      href: '/admin/work-orders',
      icon: Package,
      label: language === 'ar' ? 'أوامر العمل' : 'Work Orders',
    },
    {
      href: '/admin/vehicles',
      icon: Truck,
      label: language === 'ar' ? 'الأسطول' : 'Vehicles',
    },
    {
      href: '/admin/customers',
      icon: Users,
      label: language === 'ar' ? 'العملاء والموردين' : 'Customers & Vendors',
    },
    {
      href: '/admin/invoices',
      icon: CreditCard,
      label: language === 'ar' ? 'الفواتير' : 'Invoices',
    },
    {
      href: '/admin/accounting',
      icon: DollarSign,
      label: language === 'ar' ? 'المحاسبة' : 'Accounting',
    },
    {
      href: '/admin/warehouse',
      icon: Building2,
      label: language === 'ar' ? 'المستودعات' : 'Warehouse',
    },
    {
      href: '/admin/gps',
      icon: MapPin,
      label: language === 'ar' ? 'تتبع GPS' : 'GPS Tracking',
    },
    {
      href: '/admin/reports',
      icon: BarChart3,
      label: language === 'ar' ? 'التقارير' : 'Reports',
    },
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
      <aside
        className={`fixed inset-y-0 ${language === 'ar' ? 'right-0' : 'left-0'} z-50 w-64 bg-white shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : language === 'ar' ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0'} transition-transform duration-300 ease-in-out`}
      >
        <div className="relative flex items-center justify-between h-20 px-6 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 overflow-hidden">
          {/* Background Animation Effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse"></div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl"></div>
          
          <div className="relative flex items-center gap-3">
            <div className="relative p-2 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 shadow-xl group-hover:scale-110 transition-transform">
              <Truck className="w-7 h-7 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <span className="text-xl font-bold text-white flex items-center gap-2">
                {language === 'ar' ? 'نقل - الإدارة' : 'Nakl Admin'}
                <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
              </span>
              <p className="text-xs text-blue-100 font-medium">{language === 'ar' ? 'نظام متقدم' : 'Advanced System'}</p>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="relative lg:hidden text-white hover:bg-white/20 p-2 rounded-xl backdrop-blur-sm transition-all hover:scale-110"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-6 overflow-y-auto h-[calc(100vh-5rem)] px-3 pb-6">
          <div className="space-y-1.5">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex items-center gap-3 px-4 py-3.5 text-sm font-semibold rounded-xl transition-all duration-300 overflow-hidden ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-200 scale-105'
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-blue-50 hover:text-blue-700 hover:shadow-md hover:scale-102'
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-50"></div>
                  )}
                  
                  {/* Icon with Badge */}
                  <div className={`relative p-2 rounded-lg transition-all ${
                    isActive 
                      ? 'bg-white/20 backdrop-blur-sm' 
                      : 'bg-transparent group-hover:bg-blue-100 group-hover:scale-110'
                  }`}>
                    <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                      isActive ? 'animate-pulse' : ''
                    }`} />
                  </div>
                  
                  {/* Label */}
                  <span className="relative flex-1">{item.label}</span>
                  
                  {/* Arrow Indicator */}
                  {isActive && (
                    <ChevronRight className="w-4 h-4 animate-pulse" />
                  )}
                  
                  {/* Hover Effect */}
                  {!isActive && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Zap className="w-4 h-4 text-blue-500" />
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
          
          {/* Sidebar Footer */}
          <div className="mt-6 mx-3 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">{language === 'ar' ? 'النسخة المتقدمة' : 'Pro Version'}</p>
                <p className="text-xs text-gray-500">v2.0</p>
              </div>
            </div>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <div className={`flex-1 ${language === 'ar' ? 'lg:mr-64' : 'lg:ml-64'}`}>
        {/* Top bar - Modern Design */}
        <header className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-100 sticky top-0 z-30">
          <div className="flex items-center justify-between h-20 px-6 gap-4">
            {/* Mobile Menu + Welcome */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden text-gray-600 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-xl transition-all hover:scale-110"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <div className="hidden md:block">
                <h2 className="text-lg font-bold text-gray-900">
                  {language === 'ar' ? 'مرحباً بك 👋' : 'Welcome Back 👋'}
                </h2>
                <p className="text-xs text-gray-500">
                  {new Date().toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={language === 'ar' ? 'بحث سريع...' : 'Quick search...'}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:bg-white"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Language Toggle */}
              <button 
                onClick={() => {
                  const { setLanguage } = useLanguage();
                  const newLang = language === 'ar' ? 'en' : 'ar';
                  setLanguage(newLang);
                }}
                className="relative group p-3 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all hover:scale-110"
              >
                <div className="relative">
                  <Languages className="w-5 h-5" />
                  <Globe className="absolute -bottom-1 -right-1 w-3 h-3 text-blue-500 animate-pulse" />
                </div>
                {/* Language Badge */}
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {language === 'ar' ? 'ع' : 'EN'}
                </span>
                {/* Hover Tooltip */}
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {language === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
                </span>
              </button>

              {/* Notifications */}
              <button className="relative p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all hover:scale-110 group">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">3</span>
              </button>

              {/* User Profile */}
              <div className="flex items-center gap-3 pl-3 border-l">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-bold text-gray-900">{language === 'ar' ? 'المدير' : 'Admin'}</p>
                  <p className="text-xs text-gray-500">{language === 'ar' ? 'مدير النظام' : 'System Admin'}</p>
                </div>
                <div className="relative">
                  <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg hover:scale-110 transition-transform cursor-pointer">
                    {language === 'ar' ? 'م' : 'A'}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
              </div>

              {/* Logout */}
              <Link 
                href="/login" 
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 hover:text-white bg-red-50 hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 rounded-xl transition-all hover:shadow-lg hover:scale-105 group"
              >
                <LogOut className="w-4 h-4 group-hover:animate-pulse" />
                <span className="hidden sm:inline">{language === 'ar' ? 'خروج' : 'Logout'}</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      </div>
    </div>
  );
}
