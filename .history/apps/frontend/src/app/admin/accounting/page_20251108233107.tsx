'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calculator,
  FileText,
  CreditCard,
  PieChart,
  BarChart3,
  Download,
  Calendar,
  Search,
  Filter,
} from 'lucide-react';

export default function AccountingPage() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('month');

  // Sample financial data
  const financialData = {
    overview: {
      totalRevenue: 850000,
      totalExpenses: 620000,
      netProfit: 230000,
      pendingInvoices: 125000,
      monthlyGrowth: 12.5,
    },
    transactions: [
      {
        id: 'TXN-001',
        date: '2024-11-08',
        type: 'income',
        category: language === 'ar' ? 'إيرادات النقل' : 'Transport Revenue',
        description:
          language === 'ar' ? 'شحنة إلى الإسكندرية - TRK001' : 'Shipment to Alexandria - TRK001',
        amount: 25000,
        client: language === 'ar' ? 'شركة النصر للتجارة' : 'Al-Nasr Trading Company',
      },
      {
        id: 'TXN-002',
        date: '2024-11-07',
        type: 'expense',
        category: language === 'ar' ? 'وقود المركبات' : 'Vehicle Fuel',
        description:
          language === 'ar' ? 'تزويد بالوقود - مركبة T-001' : 'Fuel refill - Vehicle T-001',
        amount: -3500,
        client: language === 'ar' ? 'محطة الوقود الحديثة' : 'Modern Gas Station',
      },
      {
        id: 'TXN-003',
        date: '2024-11-06',
        type: 'income',
        category: language === 'ar' ? 'خدمات التخليص الجمركي' : 'Customs Clearance Services',
        description:
          language === 'ar' ? 'تخليص جمركي - ميناء السويس' : 'Customs clearance - Suez Port',
        amount: 15000,
        client: language === 'ar' ? 'المجموعة المتحدة للاستيراد' : 'United Import Group',
      },
      {
        id: 'TXN-004',
        date: '2024-11-05',
        type: 'expense',
        category: language === 'ar' ? 'صيانة المركبات' : 'Vehicle Maintenance',
        description:
          language === 'ar' ? 'صيانة دورية - مركبة T-003' : 'Routine maintenance - Vehicle T-003',
        amount: -8000,
        client: language === 'ar' ? 'ورشة الصيانة المتخصصة' : 'Specialized Maintenance Workshop',
      },
    ],
    accounts: [
      {
        id: '1000',
        name: language === 'ar' ? 'الأصول المتداولة' : 'Current Assets',
        type: 'asset',
        balance: 450000,
        children: [
          {
            id: '1100',
            name: language === 'ar' ? 'النقدية والبنوك' : 'Cash and Banks',
            balance: 250000,
          },
          {
            id: '1200',
            name: language === 'ar' ? 'العملاء والمدينون' : 'Accounts Receivable',
            balance: 125000,
          },
          { id: '1300', name: language === 'ar' ? 'المخزون' : 'Inventory', balance: 75000 },
        ],
      },
      {
        id: '2000',
        name: language === 'ar' ? 'الخصوم المتداولة' : 'Current Liabilities',
        type: 'liability',
        balance: 180000,
        children: [
          {
            id: '2100',
            name: language === 'ar' ? 'الموردون والدائنون' : 'Accounts Payable',
            balance: 95000,
          },
          {
            id: '2200',
            name: language === 'ar' ? 'المصروفات المستحقة' : 'Accrued Expenses',
            balance: 45000,
          },
          {
            id: '2300',
            name: language === 'ar' ? 'قروض قصيرة الأجل' : 'Short-term Loans',
            balance: 40000,
          },
        ],
      },
      {
        id: '4000',
        name: language === 'ar' ? 'الإيرادات' : 'Revenue',
        type: 'revenue',
        balance: 850000,
        children: [
          {
            id: '4100',
            name: language === 'ar' ? 'إيرادات النقل' : 'Transport Revenue',
            balance: 620000,
          },
          {
            id: '4200',
            name: language === 'ar' ? 'إيرادات التخليص الجمركي' : 'Customs Clearance Revenue',
            balance: 180000,
          },
          {
            id: '4300',
            name: language === 'ar' ? 'إيرادات التخزين' : 'Storage Revenue',
            balance: 50000,
          },
        ],
      },
      {
        id: '5000',
        name: language === 'ar' ? 'المصروفات' : 'Expenses',
        type: 'expense',
        balance: 620000,
        children: [
          {
            id: '5100',
            name: language === 'ar' ? 'مصروفات الوقود' : 'Fuel Expenses',
            balance: 250000,
          },
          {
            id: '5200',
            name: language === 'ar' ? 'مصروفات الصيانة' : 'Maintenance Expenses',
            balance: 180000,
          },
          {
            id: '5300',
            name: language === 'ar' ? 'رواتب الموظفين' : 'Staff Salaries',
            balance: 120000,
          },
          {
            id: '5400',
            name: language === 'ar' ? 'مصروفات إدارية' : 'Administrative Expenses',
            balance: 70000,
          },
        ],
      },
    ],
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'asset':
        return 'text-green-600 bg-green-50';
      case 'liability':
        return 'text-red-600 bg-red-50';
      case 'revenue':
        return 'text-blue-600 bg-blue-50';
      case 'expense':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${language === 'ar' ? 'font-arabic' : 'font-inter'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'ar' ? 'النظام المحاسبي' : 'Accounting System'}
          </h1>
          <p className="text-gray-600">
            {language === 'ar'
              ? 'إدارة الحسابات والتقارير المالية ومراقبة التدفق النقدي'
              : 'Manage accounts, financial reports, and cash flow monitoring'}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {language === 'ar' ? 'نظرة عامة' : 'Overview'}
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 ${
                activeTab === 'transactions'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {language === 'ar' ? 'المعاملات' : 'Transactions'}
            </button>
            <button
              onClick={() => setActiveTab('accounts')}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 ${
                activeTab === 'accounts'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {language === 'ar' ? 'شجرة الحسابات' : 'Chart of Accounts'}
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 ${
                activeTab === 'reports'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {language === 'ar' ? 'التقارير' : 'Reports'}
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <TrendingUp className="w-8 h-8 text-green-500" />
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">
                        {language === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue'}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(financialData.overview.totalRevenue)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-green-600">+{financialData.overview.monthlyGrowth}%</span>
                  <span className="text-gray-500 ml-2">
                    {language === 'ar' ? 'من الشهر الماضي' : 'from last month'}
                  </span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <TrendingDown className="w-8 h-8 text-red-500" />
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">
                        {language === 'ar' ? 'إجمالي المصروفات' : 'Total Expenses'}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(financialData.overview.totalExpenses)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-red-600">+8.2%</span>
                  <span className="text-gray-500 ml-2">
                    {language === 'ar' ? 'من الشهر الماضي' : 'from last month'}
                  </span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Calculator className="w-8 h-8 text-blue-500" />
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">
                        {language === 'ar' ? 'صافي الربح' : 'Net Profit'}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(financialData.overview.netProfit)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-blue-600">27.1%</span>
                  <span className="text-gray-500 ml-2">
                    {language === 'ar' ? 'هامش الربح' : 'profit margin'}
                  </span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <CreditCard className="w-8 h-8 text-orange-500" />
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">
                        {language === 'ar' ? 'فواتير معلقة' : 'Pending Invoices'}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(financialData.overview.pendingInvoices)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-orange-600">12</span>
                  <span className="text-gray-500 ml-2">
                    {language === 'ar' ? 'فاتورة' : 'invoices'}
                  </span>
                </div>
              </div>
            </div>

            {/* Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {language === 'ar' ? 'الإيرادات الشهرية' : 'Monthly Revenue'}
                  </h3>
                  <BarChart3 className="w-5 h-5 text-gray-400" />
                </div>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <p className="text-gray-500">
                    {language === 'ar' ? 'مخطط الإيرادات الشهرية' : 'Monthly Revenue Chart'}
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {language === 'ar' ? 'توزيع المصروفات' : 'Expense Distribution'}
                  </h3>
                  <PieChart className="w-5 h-5 text-gray-400" />
                </div>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <p className="text-gray-500">
                    {language === 'ar' ? 'مخطط توزيع المصروفات' : 'Expense Distribution Chart'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div>
            {/* Filters */}
            <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex flex-col md:flex-row gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search
                      className={`absolute ${language === 'ar' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5`}
                    />
                    <input
                      type="text"
                      placeholder={
                        language === 'ar' ? 'البحث في المعاملات...' : 'Search transactions...'
                      }
                      className={`w-full ${language === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <select 
                      aria-label={language === 'ar' ? 'تصفية حسب النوع' : 'Filter by type'}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">
                        {language === 'ar' ? 'جميع الأنواع' : 'All Types'}
                      </option>
                      <option value="income">{language === 'ar' ? 'إيرادات' : 'Income'}</option>
                      <option value="expense">{language === 'ar' ? 'مصروفات' : 'Expenses'}</option>
                    </select>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Download className="w-4 h-4" />
                  {language === 'ar' ? 'تصدير' : 'Export'}
                </button>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th
                        className={`${language === 'ar' ? 'text-right' : 'text-left'} px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider`}
                      >
                        {language === 'ar' ? 'التاريخ' : 'Date'}
                      </th>
                      <th
                        className={`${language === 'ar' ? 'text-right' : 'text-left'} px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider`}
                      >
                        {language === 'ar' ? 'الوصف' : 'Description'}
                      </th>
                      <th
                        className={`${language === 'ar' ? 'text-right' : 'text-left'} px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider`}
                      >
                        {language === 'ar' ? 'الفئة' : 'Category'}
                      </th>
                      <th
                        className={`${language === 'ar' ? 'text-right' : 'text-left'} px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider`}
                      >
                        {language === 'ar' ? 'العميل/المورد' : 'Client/Vendor'}
                      </th>
                      <th
                        className={`${language === 'ar' ? 'text-right' : 'text-left'} px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider`}
                      >
                        {language === 'ar' ? 'المبلغ' : 'Amount'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {financialData.transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.date}
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {transaction.description}
                            </div>
                            <div className="text-sm text-gray-500">{transaction.id}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              transaction.type === 'income'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {transaction.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{transaction.client}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <span
                            className={transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}
                          >
                            {transaction.amount > 0 ? '+' : ''}
                            {formatCurrency(transaction.amount)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Chart of Accounts Tab */}
        {activeTab === 'accounts' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {language === 'ar' ? 'شجرة الحسابات' : 'Chart of Accounts'}
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {financialData.accounts.map((account) => (
                  <div key={account.id} className="border rounded-lg">
                    <div className="p-4 bg-gray-50 border-b">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getAccountTypeColor(account.type)}`}
                          >
                            {account.id}
                          </span>
                          <h4 className="font-semibold text-gray-900">{account.name}</h4>
                        </div>
                        <span className="font-bold text-gray-900">
                          {formatCurrency(account.balance)}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="space-y-2">
                        {account.children?.map((child) => (
                          <div
                            key={child.id}
                            className="flex items-center justify-between py-2 px-4 hover:bg-gray-50 rounded"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-gray-500">{child.id}</span>
                              <span className="text-sm text-gray-700">{child.name}</span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {formatCurrency(child.balance)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center mb-4">
                  <FileText className="w-8 h-8 text-blue-500" />
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900">
                      {language === 'ar' ? 'قائمة الدخل' : 'Income Statement'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {language === 'ar' ? 'الإيرادات والمصروفات' : 'Revenue and expenses'}
                    </p>
                  </div>
                </div>
                <button className="w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                  {language === 'ar' ? 'إنشاء التقرير' : 'Generate Report'}
                </button>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center mb-4">
                  <BarChart3 className="w-8 h-8 text-green-500" />
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900">
                      {language === 'ar' ? 'الميزانية العمومية' : 'Balance Sheet'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {language === 'ar' ? 'الأصول والخصوم' : 'Assets and liabilities'}
                    </p>
                  </div>
                </div>
                <button className="w-full px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                  {language === 'ar' ? 'إنشاء التقرير' : 'Generate Report'}
                </button>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center mb-4">
                  <TrendingUp className="w-8 h-8 text-purple-500" />
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900">
                      {language === 'ar' ? 'قائمة التدفق النقدي' : 'Cash Flow Statement'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {language === 'ar' ? 'التدفقات النقدية' : 'Cash flows'}
                    </p>
                  </div>
                </div>
                <button className="w-full px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors">
                  {language === 'ar' ? 'إنشاء التقرير' : 'Generate Report'}
                </button>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center mb-4">
                  <Calculator className="w-8 h-8 text-orange-500" />
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900">
                      {language === 'ar' ? 'تقرير الأرباح والخسائر' : 'Profit & Loss Report'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {language === 'ar' ? 'تحليل الأرباح' : 'Profit analysis'}
                    </p>
                  </div>
                </div>
                <button className="w-full px-4 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors">
                  {language === 'ar' ? 'إنشاء التقرير' : 'Generate Report'}
                </button>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center mb-4">
                  <CreditCard className="w-8 h-8 text-red-500" />
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900">
                      {language === 'ar' ? 'تقرير العملاء' : 'Customer Report'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {language === 'ar' ? 'أرصدة العملاء' : 'Customer balances'}
                    </p>
                  </div>
                </div>
                <button className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                  {language === 'ar' ? 'إنشاء التقرير' : 'Generate Report'}
                </button>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center mb-4">
                  <PieChart className="w-8 h-8 text-indigo-500" />
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900">
                      {language === 'ar' ? 'تقرير الموردين' : 'Vendor Report'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {language === 'ar' ? 'أرصدة الموردين' : 'Vendor balances'}
                    </p>
                  </div>
                </div>
                <button className="w-full px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors">
                  {language === 'ar' ? 'إنشاء التقرير' : 'Generate Report'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
