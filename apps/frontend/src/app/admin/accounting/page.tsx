'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  FileText,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calculator,
  PieChart,
  BarChart3,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Building2,
  Truck,
  Users,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

export default function AccountingPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('month');
  const [journalEntries, setJournalEntries] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);

  // Load data from localStorage
  useEffect(() => {
    const savedJournalEntries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
    const savedAccounts = JSON.parse(localStorage.getItem('chartOfAccounts') || '[]');
    
    setJournalEntries(savedJournalEntries);
    
    // Initialize default chart of accounts if empty
    if (savedAccounts.length === 0) {
      const defaultAccounts = getDefaultChartOfAccounts();
      setAccounts(defaultAccounts);
      localStorage.setItem('chartOfAccounts', JSON.stringify(defaultAccounts));
    } else {
      setAccounts(savedAccounts);
    }
  }, []);

  const getDefaultChartOfAccounts = () => {
    return [
      // الأصول - Assets
      {
        id: '1',
        code: '1000',
        name: language === 'ar' ? 'الأصول' : 'Assets',
        type: 'asset',
        parent: null,
        balance: 0,
        children: [
          {
            id: '1-1',
            code: '1100',
            name: language === 'ar' ? 'الأصول المتداولة' : 'Current Assets',
            type: 'asset',
            parent: '1',
            balance: 0,
            children: [
              {
                id: '1-1-1',
                code: '1110',
                name: language === 'ar' ? 'النقدية بالصندوق' : 'Cash on Hand',
                type: 'asset',
                parent: '1-1',
                balance: 0,
              },
              {
                id: '1-1-2',
                code: '1120',
                name: language === 'ar' ? 'البنوك' : 'Banks',
                type: 'asset',
                parent: '1-1',
                balance: 0,
              },
              {
                id: '1-1-3',
                code: '1130',
                name: language === 'ar' ? 'العملاء والمدينون' : 'Accounts Receivable',
                type: 'asset',
                parent: '1-1',
                balance: 0,
              },
              {
                id: '1-1-4',
                code: '1140',
                name: language === 'ar' ? 'المخزون' : 'Inventory',
                type: 'asset',
                parent: '1-1',
                balance: 0,
                children: [
                  {
                    id: '1-1-4-1',
                    code: '1150',
                    name: language === 'ar' ? 'المخزون - قطع غيار' : 'Inventory - Spare Parts',
                    type: 'asset',
                    parent: '1-1-4',
                    balance: 0,
                  },
                  {
                    id: '1-1-4-2',
                    code: '1160',
                    name: language === 'ar' ? 'المخزون - وقود' : 'Inventory - Fuel',
                    type: 'asset',
                    parent: '1-1-4',
                    balance: 0,
                  },
                  {
                    id: '1-1-4-3',
                    code: '1170',
                    name: language === 'ar' ? 'المخزون - إطارات' : 'Inventory - Tires',
                    type: 'asset',
                    parent: '1-1-4',
                    balance: 0,
                  },
                  {
                    id: '1-1-4-4',
                    code: '1180',
                    name: language === 'ar' ? 'المخزون - زيوت ومواد تشحيم' : 'Inventory - Lubricants',
                    type: 'asset',
                    parent: '1-1-4',
                    balance: 0,
                  },
                  {
                    id: '1-1-4-5',
                    code: '1190',
                    name: language === 'ar' ? 'المخزون - أدوات' : 'Inventory - Tools',
                    type: 'asset',
                    parent: '1-1-4',
                    balance: 0,
                  },
                ],
              },
            ],
          },
          {
            id: '1-2',
            code: '1200',
            name: language === 'ar' ? 'الأصول الثابتة' : 'Fixed Assets',
            type: 'asset',
            parent: '1',
            balance: 0,
            children: [
              {
                id: '1-2-1',
                code: '1210',
                name: language === 'ar' ? 'المركبات' : 'Vehicles',
                type: 'asset',
                parent: '1-2',
                balance: 0,
              },
              {
                id: '1-2-2',
                code: '1220',
                name: language === 'ar' ? 'المباني' : 'Buildings',
                type: 'asset',
                parent: '1-2',
                balance: 0,
              },
              {
                id: '1-2-3',
                code: '1230',
                name: language === 'ar' ? 'المعدات' : 'Equipment',
                type: 'asset',
                parent: '1-2',
                balance: 0,
              },
              {
                id: '1-2-4',
                code: '1240',
                name: language === 'ar' ? 'مجمع الإهلاك' : 'Accumulated Depreciation',
                type: 'asset',
                parent: '1-2',
                balance: 0,
              },
            ],
          },
        ],
      },
      // الخصوم - Liabilities
      {
        id: '2',
        code: '2000',
        name: language === 'ar' ? 'الخصوم' : 'Liabilities',
        type: 'liability',
        parent: null,
        balance: 0,
        children: [
          {
            id: '2-1',
            code: '2100',
            name: language === 'ar' ? 'الخصوم المتداولة' : 'Current Liabilities',
            type: 'liability',
            parent: '2',
            balance: 0,
            children: [
              {
                id: '2-1-1',
                code: '2110',
                name: language === 'ar' ? 'الموردون والدائنون' : 'Accounts Payable',
                type: 'liability',
                parent: '2-1',
                balance: 0,
              },
              {
                id: '2-1-2',
                code: '2120',
                name: language === 'ar' ? 'المصروفات المستحقة' : 'Accrued Expenses',
                type: 'liability',
                parent: '2-1',
                balance: 0,
              },
              {
                id: '2-1-3',
                code: '2130',
                name: language === 'ar' ? 'قروض قصيرة الأجل' : 'Short-term Loans',
                type: 'liability',
                parent: '2-1',
                balance: 0,
              },
            ],
          },
          {
            id: '2-2',
            code: '2200',
            name: language === 'ar' ? 'الخصوم طويلة الأجل' : 'Long-term Liabilities',
            type: 'liability',
            parent: '2',
            balance: 0,
            children: [
              {
                id: '2-2-1',
                code: '2210',
                name: language === 'ar' ? 'قروض طويلة الأجل' : 'Long-term Loans',
                type: 'liability',
                parent: '2-2',
                balance: 0,
              },
            ],
          },
        ],
      },
      // حقوق الملكية - Equity
      {
        id: '3',
        code: '3000',
        name: language === 'ar' ? 'حقوق الملكية' : 'Equity',
        type: 'equity',
        parent: null,
        balance: 0,
        children: [
          {
            id: '3-1',
            code: '3100',
            name: language === 'ar' ? 'رأس المال' : 'Capital',
            type: 'equity',
            parent: '3',
            balance: 0,
          },
          {
            id: '3-2',
            code: '3200',
            name: language === 'ar' ? 'الأرباح المحتجزة' : 'Retained Earnings',
            type: 'equity',
            parent: '3',
            balance: 0,
          },
        ],
      },
      // الإيرادات - Revenue
      {
        id: '4',
        code: '4000',
        name: language === 'ar' ? 'الإيرادات' : 'Revenue',
        type: 'revenue',
        parent: null,
        balance: 0,
        children: [
          {
            id: '4-1',
            code: '4100',
            name: language === 'ar' ? 'إيرادات خدمات النقل' : 'Transport Services Revenue',
            type: 'revenue',
            parent: '4',
            balance: 0,
          },
          {
            id: '4-2',
            code: '4200',
            name: language === 'ar' ? 'إيرادات تأجير المركبات' : 'Vehicle Rental Revenue',
            type: 'revenue',
            parent: '4',
            balance: 0,
          },
          {
            id: '4-3',
            code: '4300',
            name: language === 'ar' ? 'إيرادات أخرى' : 'Other Revenue',
            type: 'revenue',
            parent: '4',
            balance: 0,
          },
        ],
      },
      // المصروفات - Expenses
      {
        id: '5',
        code: '5000',
        name: language === 'ar' ? 'المصروفات' : 'Expenses',
        type: 'expense',
        parent: null,
        balance: 0,
        children: [
          {
            id: '5-1',
            code: '5100',
            name: language === 'ar' ? 'مصروفات التشغيل' : 'Operating Expenses',
            type: 'expense',
            parent: '5',
            balance: 0,
            children: [
              {
                id: '5-1-1',
                code: '5110',
                name: language === 'ar' ? 'مصروفات النقل' : 'Transport Expenses',
                type: 'expense',
                parent: '5-1',
                balance: 0,
              },
              {
                id: '5-1-2',
                code: '5120',
                name: language === 'ar' ? 'مصروفات التأمين' : 'Insurance Expenses',
                type: 'expense',
                parent: '5-1',
                balance: 0,
              },
              {
                id: '5-1-3',
                code: '5130',
                name: language === 'ar' ? 'مصروفات الصيانة' : 'Maintenance Expenses',
                type: 'expense',
                parent: '5-1',
                balance: 0,
              },
              {
                id: '5-1-4',
                code: '5140',
                name: language === 'ar' ? 'مصروفات الوقود' : 'Fuel Expenses',
                type: 'expense',
                parent: '5-1',
                balance: 0,
              },
              {
                id: '5-1-5',
                code: '5150',
                name: language === 'ar' ? 'تكلفة قطع الغيار' : 'Parts Cost',
                type: 'expense',
                parent: '5-1',
                balance: 0,
              },
            ],
          },
          {
            id: '5-2',
            code: '5200',
            name: language === 'ar' ? 'مصروفات إدارية' : 'Administrative Expenses',
            type: 'expense',
            parent: '5',
            balance: 0,
            children: [
              {
                id: '5-2-1',
                code: '5210',
                name: language === 'ar' ? 'رواتب الموظفين' : 'Staff Salaries',
                type: 'expense',
                parent: '5-2',
                balance: 0,
              },
              {
                id: '5-2-2',
                code: '5220',
                name: language === 'ar' ? 'إيجار المكاتب' : 'Office Rent',
                type: 'expense',
                parent: '5-2',
                balance: 0,
              },
              {
                id: '5-2-3',
                code: '5230',
                name: language === 'ar' ? 'مصروفات مكتبية' : 'Office Supplies',
                type: 'expense',
                parent: '5-2',
                balance: 0,
              },
            ],
          },
          {
            id: '5-3',
            code: '5300',
            name: language === 'ar' ? 'رواتب السائقين' : 'Drivers Salaries',
            type: 'expense',
            parent: '5',
            balance: 0,
          },
          {
            id: '5-4',
            code: '5400',
            name: language === 'ar' ? 'إيجار المركبات' : 'Vehicle Rental Expenses',
            type: 'expense',
            parent: '5',
            balance: 0,
          },
          {
            id: '5-5',
            code: '5500',
            name: language === 'ar' ? 'مصروفات إدارية' : 'Administrative Expenses',
            type: 'expense',
            parent: '5',
            balance: 0,
          },
          {
            id: '5-6',
            code: '5600',
            name: language === 'ar' ? 'مصروفات التأمين' : 'Insurance Expenses',
            type: 'expense',
            parent: '5',
            balance: 0,
          },
        ],
      },
    ];
  };

  const calculateFinancialSummary = () => {
    const vehicles = JSON.parse(localStorage.getItem('vehicles') || '[]');
    const vendors = JSON.parse(localStorage.getItem('vendors') || '[]');
    
    let totalRevenue = 0;
    let totalExpenses = 0;
    
    // Calculate revenue from vehicles
    vehicles.forEach((vehicle: any) => {
      if (vehicle.earnings) {
        totalRevenue += vehicle.earnings;
      }
    });
    
    // Calculate expenses from journal entries
    journalEntries.forEach((entry: any) => {
      entry.lines?.forEach((line: any) => {
        if (line.type === 'debit' && line.account?.code?.startsWith('5')) {
          totalExpenses += line.amount || 0;
        }
      });
    });
    
    return {
      totalRevenue,
      totalExpenses,
      netProfit: totalRevenue - totalExpenses,
      totalVehicles: vehicles.length,
      totalVendors: vendors.length,
      profitMargin: totalRevenue > 0 ? ((totalRevenue - totalExpenses) / totalRevenue * 100).toFixed(1) : 0,
    };
  };

  const summary = calculateFinancialSummary();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'asset':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'liability':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'equity':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'revenue':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'expense':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const flattenAccounts = (accountList: any[], level = 0): any[] => {
    let result: any[] = [];
    accountList.forEach((account) => {
      result.push({ ...account, level });
      if (account.children && account.children.length > 0) {
        result = result.concat(flattenAccounts(account.children, level + 1));
      }
    });
    return result;
  };

  const downloadCSV = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateLedgerCSV = () => {
    const flatAccounts = flattenAccounts(accounts);
    let csv = 'Account Code,Account Name,Date,Reference,Description,Debit,Credit,Balance\n';
    
    flatAccounts.forEach((account) => {
      let balance = 0;
      journalEntries.forEach((entry: any) => {
        entry.lines?.forEach((line: any) => {
          if (line.account === account.id) {
            const amount = line.amount || 0;
            if (line.type === 'debit') {
              balance += amount;
            } else {
              balance -= amount;
            }
            csv += `${account.code},${account.name},${entry.date},${entry.reference},"${entry.description}",${line.type === 'debit' ? amount : ''},${line.type === 'credit' ? amount : ''},${balance}\n`;
          }
        });
      });
    });
    
    return csv;
  };

  const generateTrialBalanceCSV = () => {
    const flatAccounts = flattenAccounts(accounts);
    let csv = 'Account Code,Account Name,Total Debit,Total Credit,Debit Balance,Credit Balance\n';
    
    flatAccounts.forEach((account) => {
      let totalDebit = 0;
      let totalCredit = 0;
      
      journalEntries.forEach((entry: any) => {
        entry.lines?.forEach((line: any) => {
          if (line.account === account.id) {
            if (line.type === 'debit') {
              totalDebit += line.amount;
            } else {
              totalCredit += line.amount;
            }
          }
        });
      });
      
      if (totalDebit > 0 || totalCredit > 0) {
        const balance = totalDebit - totalCredit;
        csv += `${account.code},${account.name},${totalDebit},${totalCredit},${balance > 0 ? balance : 0},${balance < 0 ? Math.abs(balance) : 0}\n`;
      }
    });
    
    return csv;
  };

  const generateReportCSV = (reportId: string) => {
    // Placeholder for report-specific CSV generation
    return `Report: ${reportId}\nGenerated: ${new Date().toISOString()}\n`;
  };

  const renderAccountTree = (accountList: any[], level = 0) => {
    return accountList.map((account) => (
      <div key={account.id} className={`${level > 0 ? 'mr-6' : ''}`}>
        <div className={`flex items-center justify-between p-4 rounded-lg border mb-2 hover:shadow-md transition-shadow ${getAccountTypeColor(account.type)}`}>
          <div className="flex items-center gap-3 flex-1">
            <span className="px-3 py-1 bg-white rounded-md text-sm font-medium border">
              {account.code}
            </span>
            <span className={`${level === 0 ? 'font-bold text-lg' : 'font-medium'}`}>
              {account.name}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-bold">{formatCurrency(account.balance)}</span>
            <button
              onClick={() => router.push(`/admin/accounting/account/${account.id}`)}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
        {account.children && renderAccountTree(account.children, level + 1)}
      </div>
    ));
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${language === 'ar' ? 'font-arabic' : 'font-inter'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'ar' ? 'نظام الحسابات' : 'Accounting System'}
          </h1>
          <p className="text-gray-600">
            {language === 'ar'
              ? 'نظام محاسبي شامل ومتكامل لإدارة جميع العمليات المالية'
              : 'Comprehensive accounting system for managing all financial operations'}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="flex overflow-x-auto">
            {[
              { id: 'dashboard', label: language === 'ar' ? 'لوحة التحكم' : 'Dashboard', icon: PieChart },
              { id: 'journal', label: language === 'ar' ? 'قيد اليومية' : 'Journal Entries', icon: BookOpen },
              { id: 'accounts', label: language === 'ar' ? 'شجرة الحسابات' : 'Chart of Accounts', icon: FileText },
              { id: 'ledger', label: language === 'ar' ? 'الأستاذ العام' : 'General Ledger', icon: BookOpen },
              { id: 'trial', label: language === 'ar' ? 'ميزان المراجعة' : 'Trial Balance', icon: Calculator },
              { id: 'reports', label: language === 'ar' ? 'التقارير المالية' : 'Financial Reports', icon: BarChart3 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            {/* Financial Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {language === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue'}
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(summary.totalRevenue)}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="flex items-center text-sm">
                  <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-green-600 font-medium">+12.5%</span>
                  <span className="text-gray-500 mr-2">
                    {language === 'ar' ? 'من الشهر الماضي' : 'from last month'}
                  </span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {language === 'ar' ? 'إجمالي المصروفات' : 'Total Expenses'}
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                      {formatCurrency(summary.totalExpenses)}
                    </p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-lg">
                    <TrendingDown className="w-6 h-6 text-red-600" />
                  </div>
                </div>
                <div className="flex items-center text-sm">
                  <ArrowUpRight className="w-4 h-4 text-red-600 mr-1" />
                  <span className="text-red-600 font-medium">+8.3%</span>
                  <span className="text-gray-500 mr-2">
                    {language === 'ar' ? 'من الشهر الماضي' : 'from last month'}
                  </span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {language === 'ar' ? 'صافي الربح' : 'Net Profit'}
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(summary.netProfit)}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-blue-600 font-medium">{summary.profitMargin}%</span>
                  <span className="text-gray-500 mr-2">
                    {language === 'ar' ? 'هامش الربح' : 'profit margin'}
                  </span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {language === 'ar' ? 'المركبات النشطة' : 'Active Vehicles'}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {summary.totalVehicles}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Truck className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-gray-600">
                    {summary.totalVendors} {language === 'ar' ? 'مورد' : 'vendors'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <button
                onClick={() => router.push('/admin/accounting/journal/new')}
                className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow text-right"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Plus className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {language === 'ar' ? 'قيد يومية جديد' : 'New Journal Entry'}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  {language === 'ar'
                    ? 'إضافة قيد محاسبي جديد للعمليات المالية'
                    : 'Add new accounting entry for financial operations'}
                </p>
              </button>

              <button
                onClick={() => setActiveTab('accounts')}
                className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow text-right"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {language === 'ar' ? 'شجرة الحسابات' : 'Chart of Accounts'}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  {language === 'ar'
                    ? 'عرض وإدارة دليل الحسابات الكامل'
                    : 'View and manage complete accounts guide'}
                </p>
              </button>

              <button
                onClick={() => setActiveTab('reports')}
                className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow text-right"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {language === 'ar' ? 'التقارير المالية' : 'Financial Reports'}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  {language === 'ar'
                    ? 'إنشاء وعرض التقارير المالية التفصيلية'
                    : 'Generate and view detailed financial reports'}
                </p>
              </button>
            </div>

            {/* Recent Journal Entries */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">
                  {language === 'ar' ? 'آخر القيود اليومية' : 'Recent Journal Entries'}
                </h3>
              </div>
              <div className="p-6">
                {journalEntries.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">
                      {language === 'ar'
                        ? 'لا توجد قيود محاسبية حتى الآن'
                        : 'No accounting entries yet'}
                    </p>
                    <button
                      onClick={() => router.push('/admin/accounting/journal/new')}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {language === 'ar' ? 'إضافة قيد جديد' : 'Add New Entry'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {journalEntries.slice(0, 5).map((entry, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{entry.description}</p>
                          <p className="text-sm text-gray-500">{entry.date}</p>
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-gray-900">
                            {formatCurrency(entry.totalAmount || 0)}
                          </p>
                          <p className="text-sm text-gray-500">{entry.reference}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Journal Entries Tab */}
        {activeTab === 'journal' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search
                    className={`absolute ${language === 'ar' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5`}
                  />
                  <input
                    type="text"
                    placeholder={language === 'ar' ? 'البحث...' : 'Search...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full ${language === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                </div>
              </div>
              <button
                onClick={() => router.push('/admin/accounting/journal/new')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                {language === 'ar' ? 'قيد جديد' : 'New Entry'}
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border">
              {journalEntries.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {language === 'ar' ? 'لا توجد قيود محاسبية' : 'No journal entries'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          {language === 'ar' ? 'التاريخ' : 'Date'}
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          {language === 'ar' ? 'المرجع' : 'Reference'}
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          {language === 'ar' ? 'الوصف' : 'Description'}
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          {language === 'ar' ? 'المبلغ' : 'Amount'}
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          {language === 'ar' ? 'الإجراءات' : 'Actions'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {journalEntries.map((entry, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {entry.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {entry.reference}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{entry.description}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatCurrency(entry.totalAmount || 0)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex items-center gap-2">
                              <button className="p-1 hover:bg-gray-100 rounded">
                                <Eye className="w-4 h-4 text-gray-600" />
                              </button>
                              <button className="p-1 hover:bg-gray-100 rounded">
                                <Edit className="w-4 h-4 text-gray-600" />
                              </button>
                              <button className="p-1 hover:bg-gray-100 rounded">
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chart of Accounts Tab */}
        {activeTab === 'accounts' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {language === 'ar' ? 'شجرة الحسابات' : 'Chart of Accounts'}
              </h2>
              <button
                onClick={() => router.push('/admin/accounting/accounts/new')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                {language === 'ar' ? 'حساب جديد' : 'New Account'}
              </button>
            </div>

            <div className="space-y-4">{renderAccountTree(accounts)}</div>
          </div>
        )}

        {/* General Ledger Tab */}
        {activeTab === 'ledger' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {language === 'ar' ? 'الأستاذ العام' : 'General Ledger'}
              </h2>
              <button
                onClick={() => router.push('/admin/accounting/ledger')}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
              >
                <Eye className="w-5 h-5" />
                {language === 'ar' ? 'عرض دفتر الأستاذ الكامل' : 'View Full General Ledger'}
              </button>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200 p-8 text-center">
              <BookOpen className="w-20 h-20 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {language === 'ar' ? 'دفتر الأستاذ العام الشامل' : 'Comprehensive General Ledger'}
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                {language === 'ar'
                  ? 'عرض تفصيلي لجميع الحسابات مع الرصيد الافتتاحي والختامي، جميع الحركات المالية، وإمكانيات البحث والتصفية المتقدمة'
                  : 'Detailed view of all accounts with opening and closing balances, all financial transactions, and advanced search and filtering capabilities'}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 max-w-3xl mx-auto">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-3xl mb-2">📊</div>
                  <p className="text-sm font-semibold text-gray-900">
                    {language === 'ar' ? 'جميع الحسابات' : 'All Accounts'}
                  </p>
                  <p className="text-xs text-gray-600">
                    {language === 'ar' ? 'مع الأرصدة والحركات' : 'With balances & transactions'}
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-3xl mb-2">🔍</div>
                  <p className="text-sm font-semibold text-gray-900">
                    {language === 'ar' ? 'بحث وتصفية متقدم' : 'Advanced Search & Filter'}
                  </p>
                  <p className="text-xs text-gray-600">
                    {language === 'ar' ? 'حسب النوع والفترة' : 'By type and period'}
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-3xl mb-2">📥</div>
                  <p className="text-sm font-semibold text-gray-900">
                    {language === 'ar' ? 'تصدير وطباعة' : 'Export & Print'}
                  </p>
                  <p className="text-xs text-gray-600">
                    {language === 'ar' ? 'CSV و PDF' : 'CSV & PDF'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => router.push('/admin/accounting/ledger')}
                className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold shadow-lg hover:shadow-xl"
              >
                {language === 'ar' ? 'افتح دفتر الأستاذ العام' : 'Open General Ledger'}
              </button>
            </div>
          </div>
        )}

        {/* Trial Balance Tab */}
        {activeTab === 'trial' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {language === 'ar' ? 'ميزان المراجعة' : 'Trial Balance'}
              </h2>
              <button
                onClick={() => router.push('/admin/accounting/trial-balance')}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
              >
                <Eye className="w-5 h-5" />
                {language === 'ar' ? 'عرض ميزان المراجعة الكامل' : 'View Full Trial Balance'}
              </button>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200 p-8 text-center">
              <Calculator className="w-20 h-20 text-purple-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {language === 'ar' ? 'ميزان المراجعة الشامل' : 'Comprehensive Trial Balance'}
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                {language === 'ar'
                  ? 'تقرير تفصيلي لجميع الحسابات مع الأرصدة المدينة والدائنة، التحقق التلقائي من التوازن، وإمكانيات البحث والتصفية المتقدمة'
                  : 'Detailed report of all accounts with debit and credit balances, automatic balance verification, and advanced search and filtering capabilities'}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 max-w-4xl mx-auto">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-3xl mb-2">✓</div>
                  <p className="text-sm font-semibold text-gray-900">
                    {language === 'ar' ? 'التحقق من التوازن' : 'Balance Verification'}
                  </p>
                  <p className="text-xs text-gray-600">
                    {language === 'ar' ? 'تلقائياً' : 'Automatic'}
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-3xl mb-2">📊</div>
                  <p className="text-sm font-semibold text-gray-900">
                    {language === 'ar' ? 'تجميع حسب النوع' : 'Grouped by Type'}
                  </p>
                  <p className="text-xs text-gray-600">
                    {language === 'ar' ? '5 أنواع رئيسية' : '5 main types'}
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-3xl mb-2">🔍</div>
                  <p className="text-sm font-semibold text-gray-900">
                    {language === 'ar' ? 'بحث وتصفية' : 'Search & Filter'}
                  </p>
                  <p className="text-xs text-gray-600">
                    {language === 'ar' ? 'متقدم' : 'Advanced'}
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-3xl mb-2">📥</div>
                  <p className="text-sm font-semibold text-gray-900">
                    {language === 'ar' ? 'تصدير وطباعة' : 'Export & Print'}
                  </p>
                  <p className="text-xs text-gray-600">
                    {language === 'ar' ? 'CSV و PDF' : 'CSV & PDF'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => router.push('/admin/accounting/trial-balance')}
                className="px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-lg font-semibold shadow-lg hover:shadow-xl"
              >
                {language === 'ar' ? 'افتح ميزان المراجعة' : 'Open Trial Balance'}
              </button>
            </div>
          </div>
        )}

        {/* Financial Reports Tab */}
        {activeTab === 'reports' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {language === 'ar' ? 'التقارير المالية' : 'Financial Reports'}
              </h2>
              <div className="flex items-center gap-3">
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="month">{language === 'ar' ? 'هذا الشهر' : 'This Month'}</option>
                  <option value="quarter">{language === 'ar' ? 'هذا الربع' : 'This Quarter'}</option>
                  <option value="year">{language === 'ar' ? 'هذا العام' : 'This Year'}</option>
                  <option value="custom">{language === 'ar' ? 'فترة مخصصة' : 'Custom Period'}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  id: 'income-statement',
                  title: language === 'ar' ? 'قائمة الدخل' : 'Income Statement',
                  description: language === 'ar' ? 'الإيرادات والمصروفات' : 'Revenue and expenses',
                  icon: FileText,
                  colorClass: 'blue',
                  route: '/admin/accounting/reports/income-statement',
                },
                {
                  id: 'balance-sheet',
                  title: language === 'ar' ? 'الميزانية العمومية' : 'Balance Sheet',
                  description: language === 'ar' ? 'الأصول والخصوم' : 'Assets and liabilities',
                  icon: Calculator,
                  colorClass: 'green',
                  route: '/admin/accounting/reports/balance-sheet',
                },
                {
                  id: 'cash-flow',
                  title: language === 'ar' ? 'قائمة التدفق النقدي' : 'Cash Flow Statement',
                  description: language === 'ar' ? 'التدفقات النقدية' : 'Cash flows',
                  icon: TrendingUp,
                  colorClass: 'purple',
                  route: '/admin/accounting/reports/cash-flow',
                },
                {
                  id: 'profit-loss',
                  title: language === 'ar' ? 'تقرير الأرباح والخسائر' : 'P&L Report',
                  description: language === 'ar' ? 'تحليل الربحية' : 'Profitability analysis',
                  icon: PieChart,
                  colorClass: 'orange',
                  route: '/admin/accounting/reports/profit-loss',
                },
                {
                  id: 'vehicles',
                  title: language === 'ar' ? 'تقرير المركبات' : 'Vehicles Report',
                  description: language === 'ar' ? 'أداء المركبات المالي' : 'Vehicle financial performance',
                  icon: Truck,
                  colorClass: 'red',
                  route: '/admin/accounting/reports/vehicles',
                },
                {
                  id: 'vendors',
                  title: language === 'ar' ? 'تقرير الموردين' : 'Vendors Report',
                  description: language === 'ar' ? 'أرصدة الموردين' : 'Vendor balances',
                  icon: Users,
                  colorClass: 'indigo',
                  route: '/admin/accounting/reports/vendors',
                },
              ].map((report) => (
                <div
                  key={report.id}
                  className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-lg transition-all"
                >
                  <div className={`p-3 bg-${report.colorClass}-100 rounded-lg inline-block mb-4`}>
                    <report.icon className={`w-6 h-6 text-${report.colorClass}-600`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{report.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{report.description}</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => router.push(report.route)}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-${report.colorClass}-600 text-white rounded-lg hover:bg-${report.colorClass}-700 transition-colors`}
                    >
                      <Eye className="w-4 h-4" />
                      {language === 'ar' ? 'عرض' : 'View'}
                    </button>
                    <button
                      onClick={() => {
                        const csv = generateReportCSV(report.id);
                        downloadCSV(csv, `${report.id}-${new Date().toISOString().split('T')[0]}.csv`);
                      }}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Download className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Statistics */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-md">
                <h4 className="text-sm font-medium mb-2 opacity-90">
                  {language === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue'}
                </h4>
                <p className="text-3xl font-bold">{formatCurrency(summary.totalRevenue)}</p>
                <p className="text-sm mt-2 opacity-75">
                  {language === 'ar' ? 'للفترة المحددة' : 'For selected period'}
                </p>
              </div>

              <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-lg shadow-md">
                <h4 className="text-sm font-medium mb-2 opacity-90">
                  {language === 'ar' ? 'إجمالي المصروفات' : 'Total Expenses'}
                </h4>
                <p className="text-3xl font-bold">{formatCurrency(summary.totalExpenses)}</p>
                <p className="text-sm mt-2 opacity-75">
                  {language === 'ar' ? 'للفترة المحددة' : 'For selected period'}
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-md">
                <h4 className="text-sm font-medium mb-2 opacity-90">
                  {language === 'ar' ? 'صافي الربح' : 'Net Profit'}
                </h4>
                <p className="text-3xl font-bold">{formatCurrency(summary.netProfit)}</p>
                <p className="text-sm mt-2 opacity-75">
                  {language === 'ar' ? `هامش ${summary.profitMargin}%` : `${summary.profitMargin}% margin`}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
