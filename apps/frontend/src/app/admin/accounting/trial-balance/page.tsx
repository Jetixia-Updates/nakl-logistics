'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  Download,
  Filter,
  Search,
  Calculator,
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  Printer,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Eye,
  BarChart3,
} from 'lucide-react';

interface TrialBalanceAccount {
  id: string;
  code: string;
  name: string;
  type: string;
  level: number;
  totalDebit: number;
  totalCredit: number;
  debitBalance: number;
  creditBalance: number;
  openingBalance: number;
  closingBalance: number;
}

export default function TrialBalancePage() {
  const { language } = useLanguage();
  const router = useRouter();

  const [accounts, setAccounts] = useState<any[]>([]);
  const [journalEntries, setJournalEntries] = useState<any[]>([]);
  const [trialBalanceData, setTrialBalanceData] = useState<TrialBalanceAccount[]>([]);
  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set(['asset', 'liability', 'equity', 'revenue', 'expense']));
  
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [accountTypeFilter, setAccountTypeFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showOnlyWithBalances, setShowOnlyWithBalances] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (accounts.length > 0 || journalEntries.length > 0) {
      calculateTrialBalance();
    }
  }, [accounts, journalEntries, dateFilter, startDate, endDate, accountTypeFilter, searchQuery, showOnlyWithBalances]);

  const loadData = () => {
    const savedAccounts = JSON.parse(localStorage.getItem('chartOfAccounts') || '[]');
    const savedJournalEntries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
    
    setAccounts(savedAccounts);
    setJournalEntries(savedJournalEntries);
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

  const filterByDate = (date: string): boolean => {
    if (!startDate && !endDate && dateFilter === 'all') return true;
    
    const txnDate = new Date(date);
    const now = new Date();
    
    if (startDate && endDate) {
      return txnDate >= new Date(startDate) && txnDate <= new Date(endDate);
    }
    
    switch (dateFilter) {
      case 'today':
        return txnDate.toDateString() === now.toDateString();
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return txnDate >= weekAgo;
      case 'month':
        return txnDate.getMonth() === now.getMonth() && txnDate.getFullYear() === now.getFullYear();
      case 'quarter':
        const quarter = Math.floor(now.getMonth() / 3);
        const txnQuarter = Math.floor(txnDate.getMonth() / 3);
        return txnQuarter === quarter && txnDate.getFullYear() === now.getFullYear();
      case 'year':
        return txnDate.getFullYear() === now.getFullYear();
      default:
        return true;
    }
  };

  const calculateTrialBalance = () => {
    const flatAccounts = flattenAccounts(accounts);
    
    const processedAccounts = flatAccounts.map((account) => {
      let totalDebit = 0;
      let totalCredit = 0;
      const openingBalance = account.balance || 0;

      journalEntries.forEach((entry: any) => {
        if (!filterByDate(entry.date)) return;

        entry.lines?.forEach((line: any) => {
          if (line.account === account.id) {
            if (line.type === 'debit') {
              totalDebit += line.amount || 0;
            } else {
              totalCredit += line.amount || 0;
            }
          }
        });
      });

      // Calculate net balance based on account type
      let netBalance = 0;
      if (['asset', 'expense'].includes(account.type)) {
        netBalance = openingBalance + totalDebit - totalCredit;
      } else {
        netBalance = openingBalance + totalCredit - totalDebit;
      }

      return {
        ...account,
        totalDebit,
        totalCredit,
        debitBalance: netBalance > 0 ? netBalance : 0,
        creditBalance: netBalance < 0 ? Math.abs(netBalance) : 0,
        openingBalance,
        closingBalance: netBalance,
      };
    });

    // Apply filters
    let filtered = processedAccounts;
    
    if (showOnlyWithBalances) {
      filtered = filtered.filter((acc) => acc.totalDebit > 0 || acc.totalCredit > 0 || acc.openingBalance !== 0);
    }
    
    if (accountTypeFilter !== 'all') {
      filtered = filtered.filter((acc) => acc.type === accountTypeFilter);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(
        (acc) =>
          acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          acc.code.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setTrialBalanceData(filtered);
  };

  const toggleTypeExpansion = (type: string) => {
    const newExpanded = new Set(expandedTypes);
    if (newExpanded.has(type)) {
      newExpanded.delete(type);
    } else {
      newExpanded.add(type);
    }
    setExpandedTypes(newExpanded);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'asset':
        return 'bg-green-50 text-green-700 border-green-300';
      case 'liability':
        return 'bg-red-50 text-red-700 border-red-300';
      case 'equity':
        return 'bg-purple-50 text-purple-700 border-purple-300';
      case 'revenue':
        return 'bg-blue-50 text-blue-700 border-blue-300';
      case 'expense':
        return 'bg-orange-50 text-orange-700 border-orange-300';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-300';
    }
  };

  const getAccountTypeLabel = (type: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
      asset: { ar: 'الأصول', en: 'Assets' },
      liability: { ar: 'الالتزامات', en: 'Liabilities' },
      equity: { ar: 'حقوق الملكية', en: 'Equity' },
      revenue: { ar: 'الإيرادات', en: 'Revenue' },
      expense: { ar: 'المصروفات', en: 'Expenses' },
    };
    return language === 'ar' ? labels[type]?.ar : labels[type]?.en;
  };

  const calculateTotals = () => {
    return trialBalanceData.reduce(
      (acc, account) => ({
        totalDebit: acc.totalDebit + account.totalDebit,
        totalCredit: acc.totalCredit + account.totalCredit,
        debitBalance: acc.debitBalance + account.debitBalance,
        creditBalance: acc.creditBalance + account.creditBalance,
      }),
      { totalDebit: 0, totalCredit: 0, debitBalance: 0, creditBalance: 0 }
    );
  };

  const calculateTypeSubtotals = (type: string) => {
    const typeAccounts = trialBalanceData.filter((acc) => acc.type === type);
    return typeAccounts.reduce(
      (acc, account) => ({
        totalDebit: acc.totalDebit + account.totalDebit,
        totalCredit: acc.totalCredit + account.totalCredit,
        debitBalance: acc.debitBalance + account.debitBalance,
        creditBalance: acc.creditBalance + account.creditBalance,
      }),
      { totalDebit: 0, totalCredit: 0, debitBalance: 0, creditBalance: 0 }
    );
  };

  const totals = calculateTotals();
  const isBalanced = Math.abs(totals.debitBalance - totals.creditBalance) < 0.01;

  const groupedByType = {
    asset: trialBalanceData.filter((acc) => acc.type === 'asset'),
    liability: trialBalanceData.filter((acc) => acc.type === 'liability'),
    equity: trialBalanceData.filter((acc) => acc.type === 'equity'),
    revenue: trialBalanceData.filter((acc) => acc.type === 'revenue'),
    expense: trialBalanceData.filter((acc) => acc.type === 'expense'),
  };

  const exportToCSV = () => {
    let csv = language === 'ar' 
      ? 'رمز الحساب,اسم الحساب,النوع,إجمالي مدين,إجمالي دائن,رصيد مدين,رصيد دائن\n'
      : 'Account Code,Account Name,Type,Total Debit,Total Credit,Debit Balance,Credit Balance\n';

    trialBalanceData.forEach((account) => {
      csv += `${account.code},"${account.name}",${getAccountTypeLabel(account.type)},${account.totalDebit},${account.totalCredit},${account.debitBalance},${account.creditBalance}\n`;
    });

    csv += `\n${language === 'ar' ? 'الإجمالي' : 'Total'},,,${totals.totalDebit},${totals.totalCredit},${totals.debitBalance},${totals.creditBalance}\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `trial-balance-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    window.print();
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${language === 'ar' ? 'font-arabic' : 'font-inter'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/admin/accounting')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {language === 'ar' ? 'رجوع إلى الحسابات' : 'Back to Accounting'}
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {language === 'ar' ? 'ميزان المراجعة' : 'Trial Balance'}
              </h1>
              <p className="text-gray-600">
                {language === 'ar'
                  ? 'تقرير شامل لأرصدة جميع الحسابات والتحقق من توازن الدفاتر'
                  : 'Comprehensive report of all account balances and verification of book balance'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                {language === 'ar' ? 'تصدير CSV' : 'Export CSV'}
              </button>
              <button
                onClick={exportToPDF}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Printer className="w-4 h-4" />
                {language === 'ar' ? 'طباعة' : 'Print'}
              </button>
            </div>
          </div>
        </div>

        {/* Balance Status Alert */}
        <div
          className={`mb-8 rounded-xl p-8 border-2 shadow-lg ${
            isBalanced
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-500'
              : 'bg-gradient-to-r from-red-50 to-orange-50 border-red-500'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {isBalanced ? (
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                  <AlertCircle className="w-8 h-8 text-white" />
                </div>
              )}
              <div>
                <h3 className={`text-2xl font-bold ${isBalanced ? 'text-green-900' : 'text-red-900'}`}>
                  {language === 'ar'
                    ? isBalanced
                      ? 'الميزان متوازن ✓'
                      : 'الميزان غير متوازن ✗'
                    : isBalanced
                    ? 'Trial Balance is Balanced ✓'
                    : 'Trial Balance is Not Balanced ✗'}
                </h3>
                <p className={`text-lg mt-1 ${isBalanced ? 'text-green-700' : 'text-red-700'}`}>
                  {language === 'ar'
                    ? `الفرق: ${formatCurrency(Math.abs(totals.debitBalance - totals.creditBalance))}`
                    : `Difference: ${formatCurrency(Math.abs(totals.debitBalance - totals.creditBalance))}`}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">
                {language === 'ar' ? 'تاريخ الميزان' : 'Balance Date'}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {new Date().toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">
                {language === 'ar' ? 'عدد الحسابات' : 'Total Accounts'}
              </p>
              <Calculator className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{trialBalanceData.length}</p>
            <p className="text-xs text-gray-500 mt-1">
              {language === 'ar' ? 'حساب نشط' : 'active accounts'}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">
                {language === 'ar' ? 'إجمالي المدين' : 'Total Debits'}
              </p>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totals.totalDebit)}</p>
            <p className="text-xs text-gray-500 mt-1">
              {language === 'ar' ? 'جميع الحركات' : 'all transactions'}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">
                {language === 'ar' ? 'إجمالي الدائن' : 'Total Credits'}
              </p>
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(totals.totalCredit)}</p>
            <p className="text-xs text-gray-500 mt-1">
              {language === 'ar' ? 'جميع الحركات' : 'all transactions'}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">
                {language === 'ar' ? 'حالة التوازن' : 'Balance Status'}
              </p>
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <p className={`text-2xl font-bold ${isBalanced ? 'text-green-600' : 'text-red-600'}`}>
              {isBalanced ? '✓' : '✗'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {language === 'ar' ? (isBalanced ? 'متوازن' : 'غير متوازن') : (isBalanced ? 'Balanced' : 'Unbalanced')}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={language === 'ar' ? 'البحث في الحسابات...' : 'Search accounts...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={accountTypeFilter}
              onChange={(e) => setAccountTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">{language === 'ar' ? 'جميع الأنواع' : 'All Types'}</option>
              <option value="asset">{language === 'ar' ? 'أصول' : 'Assets'}</option>
              <option value="liability">{language === 'ar' ? 'التزامات' : 'Liabilities'}</option>
              <option value="equity">{language === 'ar' ? 'حقوق ملكية' : 'Equity'}</option>
              <option value="revenue">{language === 'ar' ? 'إيرادات' : 'Revenue'}</option>
              <option value="expense">{language === 'ar' ? 'مصروفات' : 'Expenses'}</option>
            </select>

            <select
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                if (e.target.value !== 'custom') {
                  setStartDate('');
                  setEndDate('');
                }
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">{language === 'ar' ? 'كل الفترات' : 'All Periods'}</option>
              <option value="today">{language === 'ar' ? 'اليوم' : 'Today'}</option>
              <option value="week">{language === 'ar' ? 'هذا الأسبوع' : 'This Week'}</option>
              <option value="month">{language === 'ar' ? 'هذا الشهر' : 'This Month'}</option>
              <option value="quarter">{language === 'ar' ? 'هذا الربع' : 'This Quarter'}</option>
              <option value="year">{language === 'ar' ? 'هذا العام' : 'This Year'}</option>
              <option value="custom">{language === 'ar' ? 'فترة مخصصة' : 'Custom Period'}</option>
            </select>

            <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={showOnlyWithBalances}
                onChange={(e) => setShowOnlyWithBalances(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                {language === 'ar' ? 'فقط الحسابات النشطة' : 'Only Active Accounts'}
              </span>
            </label>
          </div>

          {dateFilter === 'custom' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'من تاريخ' : 'From Date'}
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'إلى تاريخ' : 'To Date'}
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              {showDetails
                ? language === 'ar'
                  ? 'إخفاء التفاصيل'
                  : 'Hide Details'
                : language === 'ar'
                ? 'عرض التفاصيل'
                : 'Show Details'}
            </button>
          </div>
        </div>

        {/* Trial Balance Table */}
        {trialBalanceData.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <Calculator className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {language === 'ar' ? 'لا توجد بيانات' : 'No Data Available'}
            </h3>
            <p className="text-gray-500">
              {language === 'ar'
                ? 'لا توجد بيانات لعرض ميزان المراجعة'
                : 'No data available to display trial balance'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200">
            <div className="p-8 border-b-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <h3 className="text-2xl font-bold text-center mb-2">
                {language === 'ar' ? 'ميزان المراجعة' : 'Trial Balance'}
              </h3>
              <p className="text-center text-sm opacity-90">
                {language === 'ar'
                  ? `كما في ${new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}`
                  : `As of ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b-2 border-gray-300">
                  <tr>
                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase">
                      {language === 'ar' ? 'رمز الحساب' : 'Account Code'}
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase">
                      {language === 'ar' ? 'اسم الحساب' : 'Account Name'}
                    </th>
                    {showDetails && (
                      <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase bg-gray-50">
                        {language === 'ar' ? 'النوع' : 'Type'}
                      </th>
                    )}
                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase bg-green-50">
                      {language === 'ar' ? 'إجمالي مدين' : 'Total Debit'}
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase bg-red-50">
                      {language === 'ar' ? 'إجمالي دائن' : 'Total Credit'}
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase bg-blue-50">
                      {language === 'ar' ? 'رصيد مدين' : 'Debit Balance'}
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase bg-purple-50">
                      {language === 'ar' ? 'رصيد دائن' : 'Credit Balance'}
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase">
                      {language === 'ar' ? 'إجراءات' : 'Actions'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {Object.entries(groupedByType).map(([type, accounts]) => {
                    if (accounts.length === 0) return null;
                    const subtotals = calculateTypeSubtotals(type);
                    
                    return (
                      <React.Fragment key={type}>
                        {/* Type Header */}
                        <tr
                          className={`cursor-pointer ${getAccountTypeColor(type)} border-t-2 border-b-2`}
                          onClick={() => toggleTypeExpansion(type)}
                        >
                          <td colSpan={showDetails ? 8 : 7} className="px-6 py-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {expandedTypes.has(type) ? (
                                  <ChevronDown className="w-5 h-5" />
                                ) : (
                                  <ChevronRight className="w-5 h-5" />
                                )}
                                <span className="text-lg font-bold">{getAccountTypeLabel(type)}</span>
                                <span className="text-sm opacity-75">({accounts.length} {language === 'ar' ? 'حساب' : 'accounts'})</span>
                              </div>
                              <div className="flex items-center gap-6 text-sm font-semibold">
                                <span className="text-green-700">{formatCurrency(subtotals.totalDebit)}</span>
                                <span className="text-red-700">{formatCurrency(subtotals.totalCredit)}</span>
                                <span className="text-blue-700">{formatCurrency(subtotals.debitBalance)}</span>
                                <span className="text-purple-700">{formatCurrency(subtotals.creditBalance)}</span>
                              </div>
                            </div>
                          </td>
                        </tr>

                        {/* Type Accounts */}
                        {expandedTypes.has(type) &&
                          accounts.map((account) => (
                            <tr key={account.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                <span className="px-2 py-1 bg-gray-100 rounded">{account.code}</span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900" style={{ paddingRight: `${account.level * 20 + 24}px` }}>
                                {account.name}
                              </td>
                              {showDetails && (
                                <td className="px-6 py-4 text-sm text-gray-600 bg-gray-50">
                                  {getAccountTypeLabel(account.type)}
                                </td>
                              )}
                              <td className="px-6 py-4 text-sm font-medium text-green-600 bg-green-50">
                                {account.totalDebit > 0 ? formatCurrency(account.totalDebit) : '-'}
                              </td>
                              <td className="px-6 py-4 text-sm font-medium text-red-600 bg-red-50">
                                {account.totalCredit > 0 ? formatCurrency(account.totalCredit) : '-'}
                              </td>
                              <td className="px-6 py-4 text-sm font-medium text-blue-600 bg-blue-50">
                                {account.debitBalance > 0 ? formatCurrency(account.debitBalance) : '-'}
                              </td>
                              <td className="px-6 py-4 text-sm font-medium text-purple-600 bg-purple-50">
                                {account.creditBalance > 0 ? formatCurrency(account.creditBalance) : '-'}
                              </td>
                              <td className="px-6 py-4 text-center">
                                <button
                                  onClick={() => router.push(`/admin/accounting/account/${account.id}`)}
                                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                  <Eye className="w-4 h-4 text-gray-600" />
                                </button>
                              </td>
                            </tr>
                          ))}
                      </React.Fragment>
                    );
                  })}
                </tbody>
                <tfoot className="bg-gray-900 text-white border-t-4 border-gray-900">
                  <tr>
                    <td colSpan={showDetails ? 3 : 2} className="px-6 py-5 text-lg font-bold text-right">
                      {language === 'ar' ? 'الإجمالي العام' : 'Grand Total'}
                    </td>
                    <td className="px-6 py-5 text-lg font-bold bg-green-600">
                      {formatCurrency(totals.totalDebit)}
                    </td>
                    <td className="px-6 py-5 text-lg font-bold bg-red-600">
                      {formatCurrency(totals.totalCredit)}
                    </td>
                    <td className="px-6 py-5 text-lg font-bold bg-blue-600">
                      {formatCurrency(totals.debitBalance)}
                    </td>
                    <td className="px-6 py-5 text-lg font-bold bg-purple-600">
                      {formatCurrency(totals.creditBalance)}
                    </td>
                    <td className="px-6 py-5"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* Financial Summary */}
        {trialBalanceData.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-8 text-white">
              <h4 className="text-lg font-semibold mb-4 opacity-90">
                {language === 'ar' ? 'الميزانية العمومية' : 'Balance Sheet Summary'}
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>{language === 'ar' ? 'الأصول' : 'Assets'}:</span>
                  <span className="text-xl font-bold">
                    {formatCurrency(calculateTypeSubtotals('asset').debitBalance)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{language === 'ar' ? 'الالتزامات' : 'Liabilities'}:</span>
                  <span className="text-xl font-bold">
                    {formatCurrency(calculateTypeSubtotals('liability').creditBalance)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{language === 'ar' ? 'حقوق الملكية' : 'Equity'}:</span>
                  <span className="text-xl font-bold">
                    {formatCurrency(calculateTypeSubtotals('equity').creditBalance)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-8 text-white">
              <h4 className="text-lg font-semibold mb-4 opacity-90">
                {language === 'ar' ? 'قائمة الدخل' : 'Income Statement Summary'}
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>{language === 'ar' ? 'الإيرادات' : 'Revenue'}:</span>
                  <span className="text-xl font-bold">
                    {formatCurrency(calculateTypeSubtotals('revenue').creditBalance)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{language === 'ar' ? 'المصروفات' : 'Expenses'}:</span>
                  <span className="text-xl font-bold">
                    {formatCurrency(calculateTypeSubtotals('expense').debitBalance)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-white border-opacity-30">
                  <span className="font-bold">{language === 'ar' ? 'صافي الربح/الخسارة' : 'Net Profit/Loss'}:</span>
                  <span className="text-2xl font-bold">
                    {formatCurrency(
                      calculateTypeSubtotals('revenue').creditBalance -
                        calculateTypeSubtotals('expense').debitBalance
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
