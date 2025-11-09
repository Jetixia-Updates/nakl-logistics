'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Truck,
  Package,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Activity,
  Target,
  ShoppingCart,
  Warehouse,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Award,
  Eye,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  MoreVertical,
  Star,
  Send
} from 'lucide-react';

export default function AdminDashboard() {
  const { language } = useLanguage();
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Enhanced mock data with comprehensive metrics
  const stats = {
    revenue: {
      total: 2750000,
      growth: 15.2,
      target: 3000000,
      monthly: [
        { month: 'Jan', value: 450000 },
        { month: 'Feb', value: 480000 },
        { month: 'Mar', value: 420000 },
        { month: 'Apr', value: 550000 },
        { month: 'May', value: 500000 },
        { month: 'Jun', value: 350000 },
      ],
    },
    orders: {
      total: 156,
      active: 89,
      completed: 142,
      pending: 23,
      cancelled: 8,
    },
    customers: {
      total: 847,
      active: 623,
      new: 45,
    },
    vehicles: {
      total: 28,
      active: 24,
      maintenance: 3,
      available: 18,
    },
  };

  const recentActivities = [
    {
      id: 1,
      type: 'order',
      action:
        language === 'ar' ? 'طلب جديد من شركة النصر للتجارة' : 'New order from Al-Nasr Trading',
      time: language === 'ar' ? 'منذ 5 دقائق' : '5 minutes ago',
      status: 'success',
    },
    {
      id: 2,
      type: 'payment',
      action: language === 'ar' ? 'تم دفع فاتورة بقيمة 125,000 ج.م' : 'Invoice paid EGP 125,000',
      time: language === 'ar' ? 'منذ 12 دقيقة' : '12 minutes ago',
      status: 'success',
    },
    {
      id: 3,
      type: 'alert',
      action:
        language === 'ar' ? 'صيانة مركبة VEH-012 مطلوبة' : 'Vehicle VEH-012 maintenance required',
      time: language === 'ar' ? 'منذ 25 دقيقة' : '25 minutes ago',
      status: 'warning',
    },
    {
      id: 4,
      type: 'delivery',
      action: language === 'ar' ? 'تم توصيل شحنة SHP-2024-089' : 'Shipment SHP-2024-089 delivered',
      time: language === 'ar' ? 'منذ 1 ساعة' : '1 hour ago',
      status: 'success',
    },
    {
      id: 5,
      type: 'customer',
      action:
        language === 'ar'
          ? 'عميل جديد: المجموعة المتحدة للاستيراد'
          : 'New customer: United Import Group',
      time: language === 'ar' ? 'منذ 2 ساعة' : '2 hours ago',
      status: 'info',
    },
  ];

  const topPerformers = [
    {
      id: 'VEH-001',
      driver: language === 'ar' ? 'أحمد محمد' : 'Ahmed Mohamed',
      trips: 45,
      revenue: 285000,
      rating: 4.8,
      efficiency: 96,
    },
    {
      id: 'VEH-003',
      driver: language === 'ar' ? 'خالد أحمد' : 'Khaled Ahmed',
      trips: 42,
      revenue: 268000,
      rating: 4.7,
      efficiency: 94,
    },
    {
      id: 'VEH-005',
      driver: language === 'ar' ? 'سارة حسن' : 'Sara Hassan',
      trips: 38,
      revenue: 245000,
      rating: 4.9,
      efficiency: 97,
    },
  ];

  const pendingTasks = [
    {
      id: 1,
      task:
        language === 'ar' ? 'مراجعة عروض المناقصة TND-2024-015' : 'Review tender bids TND-2024-015',
      priority: 'high',
      due: language === 'ar' ? 'اليوم' : 'Today',
    },
    {
      id: 2,
      task: language === 'ar' ? 'الموافقة على طلبات الشراء (3)' : 'Approve purchase orders (3)',
      priority: 'medium',
      due: language === 'ar' ? 'غداً' : 'Tomorrow',
    },
    {
      id: 3,
      task: language === 'ar' ? 'تحديث بيانات المستودع الرئيسي' : 'Update main warehouse data',
      priority: 'low',
      due: language === 'ar' ? '3 أيام' : '3 days',
    },
    {
      id: 4,
      task: language === 'ar' ? 'إعداد تقرير الربع السنوي' : 'Prepare quarterly report',
      priority: 'high',
      due: language === 'ar' ? '2 أيام' : '2 days',
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-50';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50';
      case 'danger':
        return 'text-red-600 bg-red-50';
      case 'info':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityText = (priority: string) => {
    const map = {
      high: language === 'ar' ? 'عالية' : 'High',
      medium: language === 'ar' ? 'متوسطة' : 'Medium',
      low: language === 'ar' ? 'منخفضة' : 'Low',
    };
    return map[priority as keyof typeof map];
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 min-h-screen">
      <div className="container mx-auto px-4 py-6 max-w-[2560px]">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
              {language === 'ar' ? 'لوحة التحكم الرئيسية' : 'Main Dashboard'}
            </h1>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {language === 'ar' ? 'آخر تحديث: اليوم 3:45 م' : 'Last updated: Today 3:45 PM'}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="7days">{language === 'ar' ? 'آخر 7 أيام' : 'Last 7 days'}</option>
              <option value="30days">{language === 'ar' ? 'آخر 30 يوم' : 'Last 30 days'}</option>
              <option value="90days">{language === 'ar' ? 'آخر 90 يوم' : 'Last 90 days'}</option>
              <option value="year">{language === 'ar' ? 'هذا العام' : 'This year'}</option>
            </select>
            
            <button
              onClick={handleRefresh}
              className={`p-2 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all ${isRefreshing ? 'animate-spin' : ''}`}
            >
              <RefreshCw className="w-5 h-5 text-gray-600" />
            </button>
            
            <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-200 flex items-center gap-2 font-medium">
              <Download className="w-4 h-4" />
              {language === 'ar' ? 'تصدير' : 'Export'}
            </button>
          </div>
        </div>

        {/* Key Performance Indicators - Ninja Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Revenue Card - Enhanced */}
          <div className="group relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white overflow-hidden hover:shadow-2xl hover:shadow-green-200 transition-all duration-300 cursor-pointer">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                  <ArrowUpRight className="w-4 h-4" />
                  <span className="text-sm font-bold">{stats.revenue.growth}%</span>
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-1">{formatCurrency(stats.revenue.total)}</h3>
              <p className="text-green-100 text-sm font-medium mb-3">
                {language === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue'}
              </p>
              <div className="flex items-center justify-between text-xs">
                <span className="opacity-80">{language === 'ar' ? 'الهدف' : 'Target'}</span>
                <span className="font-semibold">{formatCurrency(stats.revenue.target)}</span>
              </div>
              <div className="mt-2 w-full bg-white/20 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${(stats.revenue.total / stats.revenue.target) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Active Orders - Blue Card */}
          <div className="group relative bg-white rounded-2xl p-6 border-2 border-blue-100 hover:border-blue-300 overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-xl group-hover:scale-110 transition-transform">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                </div>
                <Zap className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.orders.active}</h3>
              <p className="text-sm text-gray-600 font-medium mb-2">
                {language === 'ar' ? 'طلبات نشطة' : 'Active Orders'}
              </p>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                  +{stats.orders.pending} {language === 'ar' ? 'معلقة' : 'pending'}
                </span>
              </div>
            </div>
          </div>

          {/* Total Customers - Purple Card */}
          <div className="group relative bg-white rounded-2xl p-6 border-2 border-purple-100 hover:border-purple-300 overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-xl group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <Award className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.customers.total}</h3>
              <p className="text-sm text-gray-600 font-medium mb-2">
                {language === 'ar' ? 'إجمالي العملاء' : 'Total Customers'}
              </p>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                  +{stats.customers.new} {language === 'ar' ? 'جديد' : 'new'}
                </span>
              </div>
            </div>
          </div>

          {/* Active Vehicles - Orange Card */}
          <div className="group relative bg-white rounded-2xl p-6 border-2 border-orange-100 hover:border-orange-300 overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 rounded-xl group-hover:scale-110 transition-transform">
                  <Truck className="w-6 h-6 text-orange-600" />
                </div>
                <Activity className="w-5 h-5 text-orange-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">
                {stats.vehicles.active}<span className="text-lg text-gray-400">/{stats.vehicles.total}</span>
              </h3>
              <p className="text-sm text-gray-600 font-medium mb-2">
                {language === 'ar' ? 'مركبات نشطة' : 'Active Vehicles'}
              </p>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full font-medium">
                  {stats.vehicles.available} {language === 'ar' ? 'متاحة' : 'available'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Analytics Row - Ninja Enhanced */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
          {/* Revenue Trend - Modern Chart */}
          <div className="xl:col-span-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                  {language === 'ar' ? 'اتجاه الإيرادات الشهرية' : 'Monthly Revenue Trend'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{language === 'ar' ? 'آخر 6 أشهر' : 'Last 6 months'}</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Eye className="w-5 h-5 text-gray-400" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {stats.revenue.monthly.map((month, index) => {
                const maxValue = Math.max(...stats.revenue.monthly.map(m => m.value));
                const percentage = (month.value / maxValue) * 100;
                const isHighest = month.value === maxValue;
                
                return (
                  <div key={index} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700 w-12">{month.month}</span>
                      <span className="text-sm font-bold text-gray-900">{formatCurrency(month.value)}</span>
                    </div>
                    <div className="relative w-full bg-gradient-to-r from-gray-100 to-gray-50 rounded-full h-8 overflow-hidden shadow-inner">
                      <div
                        className={`absolute inset-y-0 left-0 rounded-full flex items-center justify-end px-3 transition-all duration-1000 ease-out ${
                          isHighest 
                            ? 'bg-gradient-to-r from-green-400 via-blue-500 to-purple-600' 
                            : 'bg-gradient-to-r from-blue-400 to-blue-600'
                        } group-hover:shadow-lg`}
                        style={{ width: `${percentage}%` }}
                      >
                        {percentage > 30 && (
                          <span className="text-xs font-bold text-white drop-shadow">
                            {((month.value / stats.revenue.target) * 100).toFixed(0)}%
                          </span>
                        )}
                      </div>
                      {isHighest && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 animate-pulse" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">{language === 'ar' ? 'المتوسط' : 'Average'}</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(stats.revenue.monthly.reduce((a, b) => a + b.value, 0) / 6)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">{language === 'ar' ? 'الأعلى' : 'Highest'}</p>
                <p className="text-lg font-bold text-green-600">
                  {formatCurrency(Math.max(...stats.revenue.monthly.map(m => m.value)))}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">{language === 'ar' ? 'النمو' : 'Growth'}</p>
                <p className="text-lg font-bold text-blue-600 flex items-center justify-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  {stats.revenue.growth}%
                </p>
              </div>
            </div>
          </div>

          {/* Top Performers - Enhanced Leaderboard */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Award className="w-6 h-6 text-yellow-500" />
                  {language === 'ar' ? 'قادة الأداء' : 'Top Performers'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{language === 'ar' ? 'هذا الشهر' : 'This month'}</p>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Filter className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-3">
              {topPerformers.map((performer, index) => {
                const isFirst = index === 0;
                const medals = ['🥇', '🥈', '🥉'];
                
                return (
                  <div
                    key={performer.id}
                    className={`group relative p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                      isFirst 
                        ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 hover:shadow-lg' 
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent hover:border-gray-200'
                    }`}
                  >
                    {/* Rank Badge */}
                    <div className="absolute -left-2 -top-2 text-2xl">{medals[index]}</div>
                    
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className={`flex items-center justify-center w-12 h-12 rounded-xl font-bold text-sm ${
                        isFirst 
                          ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg' 
                          : 'bg-gradient-to-br from-blue-400 to-blue-600 text-white'
                      }`}>
                        {performer.driver.split(' ').map(n => n[0]).join('')}
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate flex items-center gap-2">
                          {performer.driver}
                          {isFirst && <Zap className="w-4 h-4 text-yellow-500" />}
                        </p>
                        <p className="text-xs text-gray-500">
                          {performer.id} • {performer.trips} {language === 'ar' ? 'رحلة' : 'trips'}
                        </p>
                      </div>
                      
                      {/* Stats */}
                      <div className="text-right">
                        <p className="text-sm font-bold text-green-600">
                          {formatCurrency(performer.revenue)}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < Math.floor(performer.rating) 
                                    ? 'text-yellow-400 fill-yellow-400' 
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500 ml-1">{performer.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Efficiency Bar */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-500">{language === 'ar' ? 'الكفاءة' : 'Efficiency'}</span>
                        <span className="font-semibold text-gray-700">{performer.efficiency}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-1000 ${
                            performer.efficiency >= 95 
                              ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                              : 'bg-gradient-to-r from-blue-400 to-blue-600'
                          }`}
                          style={{ width: `${performer.efficiency}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* View All */}
            <button className="w-full mt-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-700 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 group">
              {language === 'ar' ? 'عرض جميع السائقين' : 'View All Drivers'}
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Activity and Tasks Row - Modern Design */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Recent Activities - Timeline Style */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-blue-500" />
                  {language === 'ar' ? 'النشاط المباشر' : 'Live Activity'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{language === 'ar' ? 'آخر ساعة' : 'Last hour'}</p>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600 font-medium">{language === 'ar' ? 'مباشر' : 'Live'}</span>
              </div>
            </div>
            
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute right-[19px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-purple-200 to-transparent"></div>
              
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={activity.id}
                    className="relative flex items-start gap-4 group"
                  >
                    {/* Timeline Dot */}
                    <div className={`relative z-10 p-2 rounded-xl ${getStatusColor(activity.status)} shadow-lg group-hover:scale-110 transition-transform`}>
                      {activity.type === 'order' && <ShoppingCart className="w-4 h-4" />}
                      {activity.type === 'payment' && <CreditCard className="w-4 h-4" />}
                      {activity.type === 'alert' && <AlertTriangle className="w-4 h-4" />}
                      {activity.type === 'delivery' && <Package className="w-4 h-4" />}
                      {activity.type === 'customer' && <Users className="w-4 h-4" />}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0 bg-gray-50 p-4 rounded-xl group-hover:bg-gray-100 transition-colors border border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 mb-1">{activity.action}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {activity.time}
                        </p>
                        {index < 2 && (
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                            {language === 'ar' ? 'جديد' : 'New'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* View All Activities */}
            <button className="w-full mt-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 text-blue-700 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2">
              {language === 'ar' ? 'عرض جميع الأنشطة' : 'View All Activities'}
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* Pending Tasks - Interactive Cards */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-purple-500" />
                  {language === 'ar' ? 'المهام العاجلة' : 'Priority Tasks'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {pendingTasks.length} {language === 'ar' ? 'مهام معلقة' : 'pending tasks'}
                </p>
              </div>
              <button className="text-xs px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-medium">
                {language === 'ar' ? 'إضافة مهمة' : 'Add Task'}
              </button>
            </div>
            
            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <div
                  key={task.id}
                  className="group relative bg-gradient-to-br from-gray-50 to-gray-100 hover:from-white hover:to-gray-50 p-4 rounded-xl border border-gray-200 hover:border-purple-200 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex items-start gap-3">
                    {/* Custom Checkbox */}
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        className="peer w-5 h-5 appearance-none border-2 border-gray-300 rounded-lg hover:border-purple-500 cursor-pointer transition-all checked:bg-gradient-to-br checked:from-purple-500 checked:to-blue-600 checked:border-transparent"
                      />
                      <CheckCircle className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                          {task.task}
                        </p>
                        {/* Priority Badge */}
                        <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-bold ${getPriorityColor(task.priority)}`}>
                          {task.priority === 'high' && <AlertTriangle className="w-3 h-3" />}
                          {task.priority === 'medium' && <Clock className="w-3 h-3" />}
                          {task.priority === 'low' && <CheckCircle className="w-3 h-3" />}
                          {getPriorityText(task.priority)}
                        </span>
                      </div>
                      
                      {/* Due Date Chip */}
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Calendar className="w-3 h-3" />
                        <span className="font-medium">{task.due}</span>
                        {task.priority === 'high' && (
                          <span className="text-red-600 font-semibold animate-pulse">
                            • {language === 'ar' ? 'اليوم' : 'Today'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Indicator for High Priority */}
                  {task.priority === 'high' && (
                    <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-red-500 to-orange-500 animate-pulse" style={{ width: '75%' }}></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* View All Tasks */}
            <button className="w-full mt-4 py-3 bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 text-purple-700 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 group">
              {language === 'ar' ? 'عرض جميع المهام' : 'View All Tasks'}
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
