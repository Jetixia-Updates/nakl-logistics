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

          {/* Active Orders */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900">{stats.orders.active}</h3>
            <p className="text-xs text-gray-600">
              {language === 'ar' ? 'طلبات نشطة' : 'Active Orders'}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              +{stats.orders.pending} {language === 'ar' ? 'معلقة' : 'pending'}
            </p>
          </div>

          {/* Total Customers */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900">{stats.customers.total}</h3>
            <p className="text-xs text-gray-600">
              {language === 'ar' ? 'إجمالي العملاء' : 'Total Customers'}
            </p>
            <p className="text-xs text-purple-600 mt-1">
              +{stats.customers.new} {language === 'ar' ? 'جديد' : 'new'}
            </p>
          </div>

          {/* Active Vehicles */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Truck className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {stats.vehicles.active}/{stats.vehicles.total}
            </h3>
            <p className="text-xs text-gray-600">
              {language === 'ar' ? 'مركبات نشطة' : 'Active Vehicles'}
            </p>
            <p className="text-xs text-orange-600 mt-1">
              {stats.vehicles.available} {language === 'ar' ? 'متاحة' : 'available'}
            </p>
          </div>

          {/* Completed Orders */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900">{stats.orders.completed}</h3>
            <p className="text-xs text-gray-600">
              {language === 'ar' ? 'طلبات مكتملة' : 'Completed'}
            </p>
            <p className="text-xs text-green-600 mt-1">
              91% {language === 'ar' ? 'معدل النجاح' : 'success rate'}
            </p>
          </div>

          {/* Pending Tasks */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900">{stats.orders.pending}</h3>
            <p className="text-xs text-gray-600">{language === 'ar' ? 'طلبات معلقة' : 'Pending'}</p>
            <p className="text-xs text-yellow-600 mt-1">
              {language === 'ar' ? 'تحتاج مراجعة' : 'Need review'}
            </p>
          </div>

          {/* Maintenance */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900">{stats.vehicles.maintenance}</h3>
            <p className="text-xs text-gray-600">
              {language === 'ar' ? 'صيانة مركبات' : 'Maintenance'}
            </p>
            <p className="text-xs text-red-600 mt-1">
              {language === 'ar' ? 'يجب المتابعة' : 'Need attention'}
            </p>
          </div>
        </div>

        {/* Charts and Analytics Row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 mb-6">
          {/* Revenue Trend */}
          <div className="xl:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900">
                {language === 'ar' ? 'اتجاه الإيرادات' : 'Revenue Trend'}
              </h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {stats.revenue.monthly.map((month, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-10 text-xs font-medium text-gray-600">{month.month}</div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-100 rounded-full h-6 relative overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-6 rounded-full flex items-center justify-end px-2 transition-all duration-500"
                        style={{ width: `${(month.value / 550000) * 100}%` }}
                      >
                        <span className="text-xs font-medium text-white">
                          {formatCurrency(month.value)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900">
                {language === 'ar' ? 'أفضل الأداء' : 'Top Performers'}
              </h3>
              <Target className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {topPerformers.map((performer, index) => (
                <div
                  key={performer.id}
                  className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full text-blue-600 font-bold text-xs">
                    #{index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 truncate">
                      {performer.driver}
                    </p>
                    <p className="text-xs text-gray-500">
                      {performer.id} • {performer.trips} {language === 'ar' ? 'رحلة' : 'trips'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-green-600">
                      {formatCurrency(performer.revenue)}
                    </p>
                    <p className="text-xs text-gray-500">{performer.efficiency}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity and Tasks Row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900">
                {language === 'ar' ? 'النشاط الأخير' : 'Recent Activity'}
              </h3>
              <Activity className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-2">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className={`p-1.5 rounded-full ${getStatusColor(activity.status)}`}>
                    {activity.type === 'order' && <ShoppingCart className="w-3 h-3" />}
                    {activity.type === 'payment' && <CreditCard className="w-3 h-3" />}
                    {activity.type === 'alert' && <AlertTriangle className="w-3 h-3" />}
                    {activity.type === 'delivery' && <Package className="w-3 h-3" />}
                    {activity.type === 'customer' && <Users className="w-3 h-3" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900">
                {language === 'ar' ? 'المهام المعلقة' : 'Pending Tasks'}
              </h3>
              <FileText className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-2">
              {pendingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900">{task.task}</p>
                    <p className="text-xs text-gray-500">
                      {language === 'ar' ? 'الموعد:' : 'Due:'} {task.due}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}
                  >
                    {getPriorityText(task.priority)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
