'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Users,
  Truck,
  FileText,
  Calendar,
  Download,
  Filter,
  Eye,
  RefreshCw,
  PieChart,
  LineChart,
  Target,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export default function ReportsPage() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('30days');

  // Sample data for reports
  const overviewStats = {
    totalRevenue: 2750000,
    revenueGrowth: 15.2,
    totalOrders: 156,
    ordersGrowth: 8.5,
    activeVehicles: 28,
    vehiclesGrowth: 12.1,
    customerSatisfaction: 4.7,
    satisfactionGrowth: 3.2
  };

  const monthlyRevenue = [
    { month: language === 'ar' ? 'يناير' : 'Jan', revenue: 850000, orders: 45 },
    { month: language === 'ar' ? 'فبراير' : 'Feb', revenue: 920000, orders: 52 },
    { month: language === 'ar' ? 'مارس' : 'Mar', revenue: 780000, orders: 38 },
    { month: language === 'ar' ? 'أبريل' : 'Apr', revenue: 1100000, orders: 61 },
    { month: language === 'ar' ? 'مايو' : 'May', revenue: 950000, orders: 48 },
    { month: language === 'ar' ? 'يونيو' : 'Jun', revenue: 1200000, orders: 67 }
  ];

  const topCustomers = [
    { name: language === 'ar' ? 'شركة النصر للتجارة' : 'Al-Nasr Trading', revenue: 650000, orders: 28, growth: 23.5 },
    { name: language === 'ar' ? 'المجموعة المتحدة' : 'United Group', revenue: 480000, orders: 22, growth: 15.8 },
    { name: language === 'ar' ? 'مؤسسة الشرق الأوسط' : 'Middle East Corp', revenue: 320000, orders: 18, growth: -5.2 },
    { name: language === 'ar' ? 'شركة التطوير الحديث' : 'Modern Development', revenue: 290000, orders: 15, growth: 8.7 }
  ];

  const vehiclePerformance = [
    { id: 'VEH-001', driver: language === 'ar' ? 'أحمد محمد' : 'Ahmed Mohamed', trips: 45, revenue: 285000, rating: 4.8, fuel: 2500 },
    { id: 'VEH-002', driver: language === 'ar' ? 'محمد علي' : 'Mohamed Ali', trips: 38, revenue: 245000, rating: 4.6, fuel: 2200 },
    { id: 'VEH-003', driver: language === 'ar' ? 'خالد أحمد' : 'Khaled Ahmed', trips: 42, revenue: 268000, rating: 4.7, fuel: 2350 },
    { id: 'VEH-004', driver: language === 'ar' ? 'سارة حسن' : 'Sara Hassan', trips: 35, revenue: 225000, rating: 4.9, fuel: 2100 }
  ];

  const financialSummary = {
    totalIncome: 2750000,
    totalExpenses: 1890000,
    netProfit: 860000,
    profitMargin: 31.3,
    pendingInvoices: 450000,
    overdueInvoices: 125000,
    averagePaymentTime: 18,
    cashFlow: 235000
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${language === 'ar' ? 'font-arabic' : 'font-inter'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {language === 'ar' ? 'التقارير والتحليلات' : 'Reports & Analytics'}
              </h1>
              <p className="text-gray-600">
                {language === 'ar' ? 'تحليل الأداء والإحصائيات المالية والتشغيلية' : 'Performance analysis and financial & operational statistics'}
              </p>
            </div>
            
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option value="7days">{language === 'ar' ? 'آخر 7 أيام' : 'Last 7 days'}</option>
                  <option value="30days">{language === 'ar' ? 'آخر 30 يوم' : 'Last 30 days'}</option>
                  <option value="90days">{language === 'ar' ? 'آخر 90 يوم' : 'Last 90 days'}</option>
                  <option value="year">{language === 'ar' ? 'السنة الحالية' : 'This year'}</option>
                </select>
              </div>
              
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                {language === 'ar' ? 'تصدير التقرير' : 'Export Report'}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="flex overflow-x-auto">
            {[
              { id: 'overview', label: language === 'ar' ? 'نظرة عامة' : 'Overview', icon: BarChart3 },
              { id: 'financial', label: language === 'ar' ? 'مالي' : 'Financial', icon: DollarSign },
              { id: 'operational', label: language === 'ar' ? 'تشغيلي' : 'Operational', icon: Truck },
              { id: 'customers', label: language === 'ar' ? 'العملاء' : 'Customers', icon: Users }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{language === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue'}</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(overviewStats.totalRevenue)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-500" />
                </div>
                <div className={`flex items-center gap-1 mt-2 ${getGrowthColor(overviewStats.revenueGrowth)}`}>
                  {getGrowthIcon(overviewStats.revenueGrowth)}
                  <span className="text-sm font-medium">{overviewStats.revenueGrowth}%</span>
                  <span className="text-xs text-gray-500">{language === 'ar' ? 'من الشهر السابق' : 'from last month'}</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{language === 'ar' ? 'إجمالي الطلبات' : 'Total Orders'}</p>
                    <p className="text-2xl font-bold text-gray-900">{overviewStats.totalOrders}</p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-500" />
                </div>
                <div className={`flex items-center gap-1 mt-2 ${getGrowthColor(overviewStats.ordersGrowth)}`}>
                  {getGrowthIcon(overviewStats.ordersGrowth)}
                  <span className="text-sm font-medium">{overviewStats.ordersGrowth}%</span>
                  <span className="text-xs text-gray-500">{language === 'ar' ? 'من الشهر السابق' : 'from last month'}</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{language === 'ar' ? 'المركبات النشطة' : 'Active Vehicles'}</p>
                    <p className="text-2xl font-bold text-gray-900">{overviewStats.activeVehicles}</p>
                  </div>
                  <Truck className="w-8 h-8 text-purple-500" />
                </div>
                <div className={`flex items-center gap-1 mt-2 ${getGrowthColor(overviewStats.vehiclesGrowth)}`}>
                  {getGrowthIcon(overviewStats.vehiclesGrowth)}
                  <span className="text-sm font-medium">{overviewStats.vehiclesGrowth}%</span>
                  <span className="text-xs text-gray-500">{language === 'ar' ? 'من الشهر السابق' : 'from last month'}</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{language === 'ar' ? 'رضا العملاء' : 'Customer Satisfaction'}</p>
                    <p className="text-2xl font-bold text-gray-900">{overviewStats.customerSatisfaction}/5</p>
                  </div>
                  <Target className="w-8 h-8 text-yellow-500" />
                </div>
                <div className={`flex items-center gap-1 mt-2 ${getGrowthColor(overviewStats.satisfactionGrowth)}`}>
                  {getGrowthIcon(overviewStats.satisfactionGrowth)}
                  <span className="text-sm font-medium">{overviewStats.satisfactionGrowth}%</span>
                  <span className="text-xs text-gray-500">{language === 'ar' ? 'من الشهر السابق' : 'from last month'}</span>
                </div>
              </div>
            </div>

            {/* Monthly Revenue Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {language === 'ar' ? 'الإيرادات الشهرية' : 'Monthly Revenue'}
                </h3>
                <div className="flex items-center gap-2">
                  <LineChart className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">{language === 'ar' ? 'آخر 6 أشهر' : 'Last 6 months'}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {monthlyRevenue.map((month, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center gap-4">
                      <div className="w-16 text-sm font-medium text-gray-700">{month.month}</div>
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(month.revenue / 1200000) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{formatCurrency(month.revenue)}</p>
                      <p className="text-xs text-gray-500">{month.orders} {language === 'ar' ? 'طلب' : 'orders'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Financial Tab */}
        {activeTab === 'financial' && (
          <div className="space-y-6">
            {/* Financial Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                  <h4 className="font-semibold text-gray-900">{language === 'ar' ? 'إجمالي الدخل' : 'Total Income'}</h4>
                </div>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(financialSummary.totalIncome)}</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingDown className="w-6 h-6 text-red-500" />
                  <h4 className="font-semibold text-gray-900">{language === 'ar' ? 'إجمالي المصروفات' : 'Total Expenses'}</h4>
                </div>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(financialSummary.totalExpenses)}</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center gap-3 mb-3">
                  <DollarSign className="w-6 h-6 text-blue-500" />
                  <h4 className="font-semibold text-gray-900">{language === 'ar' ? 'صافي الربح' : 'Net Profit'}</h4>
                </div>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(financialSummary.netProfit)}</p>
                <p className="text-sm text-gray-500">{financialSummary.profitMargin}% {language === 'ar' ? 'هامش ربح' : 'margin'}</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-6 h-6 text-yellow-500" />
                  <h4 className="font-semibold text-gray-900">{language === 'ar' ? 'التدفق النقدي' : 'Cash Flow'}</h4>
                </div>
                <p className="text-2xl font-bold text-yellow-600">{formatCurrency(financialSummary.cashFlow)}</p>
              </div>
            </div>

            {/* Outstanding Invoices */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h4 className="font-semibold text-gray-900 mb-4">{language === 'ar' ? 'الفواتير المعلقة' : 'Pending Invoices'}</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-gray-700">{language === 'ar' ? 'معلقة' : 'Pending'}</span>
                    </div>
                    <span className="font-semibold text-yellow-600">{formatCurrency(financialSummary.pendingInvoices)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-gray-700">{language === 'ar' ? 'متأخرة' : 'Overdue'}</span>
                    </div>
                    <span className="font-semibold text-red-600">{formatCurrency(financialSummary.overdueInvoices)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h4 className="font-semibold text-gray-900 mb-4">{language === 'ar' ? 'إحصائيات الدفع' : 'Payment Statistics'}</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">{language === 'ar' ? 'متوسط وقت الدفع' : 'Avg Payment Time'}</span>
                      <span className="font-semibold text-gray-900">{financialSummary.averagePaymentTime} {language === 'ar' ? 'يوم' : 'days'}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Operational Tab */}
        {activeTab === 'operational' && (
          <div className="space-y-6">
            {/* Vehicle Performance */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">{language === 'ar' ? 'أداء المركبات' : 'Vehicle Performance'}</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {vehiclePerformance.map((vehicle, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Truck className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{vehicle.id}</h4>
                          <p className="text-sm text-gray-600">{vehicle.driver}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{vehicle.trips}</p>
                          <p className="text-xs text-gray-500">{language === 'ar' ? 'رحلة' : 'Trips'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{formatCurrency(vehicle.revenue)}</p>
                          <p className="text-xs text-gray-500">{language === 'ar' ? 'إيراد' : 'Revenue'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{vehicle.rating}/5</p>
                          <p className="text-xs text-gray-500">{language === 'ar' ? 'تقييم' : 'Rating'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{vehicle.fuel}L</p>
                          <p className="text-xs text-gray-500">{language === 'ar' ? 'وقود' : 'Fuel'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            {/* Top Customers */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">{language === 'ar' ? 'أفضل العملاء' : 'Top Customers'}</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {topCustomers.map((customer, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <Users className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{customer.name}</h4>
                          <p className="text-sm text-gray-600">{customer.orders} {language === 'ar' ? 'طلب' : 'orders'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{formatCurrency(customer.revenue)}</p>
                        <div className={`flex items-center gap-1 justify-end ${getGrowthColor(customer.growth)}`}>
                          {getGrowthIcon(customer.growth)}
                          <span className="text-sm font-medium">{Math.abs(customer.growth)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}