'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  Download,
  Filter,
  Search,
  Eye,
  BookOpen,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ChevronDown,
  ChevronRight,
  FileText,
  Printer,
} from 'lucide-react';

interface Transaction {
  date: string;
  reference: string;
  description: string;
  type: 'debit' | 'credit';
  amount: number;
  balance: number;
}

interface AccountWithTransactions {
  id: string;
  code: string;
  name: string;
  type: string;
  level: number;
  transactions: Transaction[];
  totalDebit: number;
  totalCredit: number;
  balance: number;
  openingBalance: number;
  closingBalance: number;
}

export default function GeneralLedgerPage() {
  const { language } = useLanguage();
  const router = useRouter();

  const [accounts, setAccounts] = useState<any[]>([]);
  const [journalEntries, setJournalEntries] = useState<any[]>([]);
  const [accountsWithTransactions, setAccountsWithTransactions] = useState<AccountWithTransactions[]>([]);
  const [expandedAccounts, setExpandedAccounts] = useState<Set<string>>(new Set());
  
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [accountTypeFilter, setAccountTypeFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showOnlyWithTransactions, setShowOnlyWithTransactions] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (accounts.length > 0 || journalEntries.length > 0) {
      calculateAccountTransactions();
    }
  }, [accounts, journalEntries, dateFilter, startDate, endDate, accountTypeFilter]);

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

  const calculateAccountTransactions = () => {
    const flatAccounts = flattenAccounts(accounts);
    
    const processedAccounts = flatAccounts.map((account) => {
      const transactions: Transaction[] = [];
      let runningBalance = account.balance || 0;
      const openingBalance = account.balance || 0;

      // Sort journal entries by date
      const sortedEntries = [...journalEntries].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      sortedEntries.forEach((entry: any) => {
        if (!filterByDate(entry.date)) return;

        entry.lines?.forEach((line: any) => {
          if (line.account === account.id) {
            const amount = line.amount || 0;
            
            // Update running balance based on account type
            if (line.type === 'debit') {
              if (['asset', 'expense'].includes(account.type)) {
                runningBalance += amount;
              } else {
                runningBalance -= amount;
              }
            } else {
              if (['asset', 'expense'].includes(account.type)) {
                runningBalance -= amount;
              } else {
                runningBalance += amount;
              }
            }

            transactions.push({
              date: entry.date,
              reference: entry.reference,
              description: entry.description,
              type: line.type,
              amount,
              balance: runningBalance,
            });
          }
        });
      });

      const totalDebit = transactions
        .filter((t) => t.type === 'debit')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const totalCredit = transactions
        .filter((t) => t.type === 'credit')
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        ...account,
        transactions,
        totalDebit,
        totalCredit,
        balance: runningBalance - openingBalance,
        openingBalance,
        closingBalance: runningBalance,
      };
    });

    // Apply filters
    let filtered = processedAccounts;
    
    if (showOnlyWithTransactions) {
      filtered = filtered.filter((acc) => acc.transactions.length > 0);
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

    setAccountsWithTransactions(filtered);
  };

  const toggleAccountExpansion = (accountId: string) => {
    const newExpanded = new Set(expandedAccounts);
    if (newExpanded.has(accountId)) {
      newExpanded.delete(accountId);
    } else {
      newExpanded.add(accountId);
    }
    setExpandedAccounts(newExpanded);
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
      asset: { ar: 'أصول', en: 'Asset' },
      liability: { ar: 'التزامات', en: 'Liability' },
      equity: { ar: 'حقوق ملكية', en: 'Equity' },
      revenue: { ar: 'إيرادات', en: 'Revenue' },
      expense: { ar: 'مصروفات', en: 'Expense' },
    };
    return language === 'ar' ? labels[type]?.ar : labels[type]?.en;
  };

  const exportToCSV = () => {
    let csv = language === 'ar' 
      ? 'رمز الحساب,اسم الحساب,التاريخ,المرجع,الوصف,مدين,دائن,الرصيد\n'
      : 'Account Code,Account Name,Date,Reference,Description,Debit,Credit,Balance\n';

    accountsWithTransactions.forEach((account) => {
      account.transactions.forEach((txn) => {
        csv += `${account.code},"${account.name}",${txn.date},${txn.reference},"${txn.description}",${
          txn.type === 'debit' ? txn.amount : ''
        },${txn.type === 'credit' ? txn.amount : ''},${txn.balance}\n`;
      });
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `general-ledger-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    window.print();
  };

  const calculateGrandTotals = () => {
    return accountsWithTransactions.reduce(
      (acc, account) => ({
        totalDebit: acc.totalDebit + account.totalDebit,
        totalCredit: acc.totalCredit + account.totalCredit,
        netMovement: acc.netMovement + (account.totalDebit - account.totalCredit),
      }),
      { totalDebit: 0, totalCredit: 0, netMovement: 0 }
    );
  };

  const grandTotals = calculateGrandTotals();

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
                {language === 'ar' ? 'دفتر الأستاذ العام' : 'General Ledger'}
              </h1>
              <p className="text-gray-600">
                {language === 'ar'
                  ? 'عرض شامل لجميع الحسابات والحركات المالية'
                  : 'Comprehensive view of all accounts and financial transactions'}
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

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">
                {language === 'ar' ? 'عدد الحسابات' : 'Total Accounts'}
              </p>
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{accountsWithTransactions.length}</p>
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
            <p className="text-2xl font-bold text-green-600">{formatCurrency(grandTotals.totalDebit)}</p>
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
            <p className="text-2xl font-bold text-red-600">{formatCurrency(grandTotals.totalCredit)}</p>
            <p className="text-xs text-gray-500 mt-1">
              {language === 'ar' ? 'جميع الحركات' : 'all transactions'}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">
                {language === 'ar' ? 'صافي الحركة' : 'Net Movement'}
              </p>
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <p className={`text-2xl font-bold ${grandTotals.netMovement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(Math.abs(grandTotals.netMovement))}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {language === 'ar' ? 'الفرق الصافي' : 'net difference'}
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
                checked={showOnlyWithTransactions}
                onChange={(e) => setShowOnlyWithTransactions(e.target.checked)}
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
        </div>

        {/* Accounts Ledger */}
        {accountsWithTransactions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {language === 'ar' ? 'لا توجد حركات مالية' : 'No Financial Transactions'}
            </h3>
            <p className="text-gray-500">
              {language === 'ar'
                ? 'لا توجد حركات مالية في الفترة المحددة'
                : 'No financial transactions found for the selected period'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {accountsWithTransactions.map((account) => (
              <div key={account.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                {/* Account Header */}
                <div
                  className={`p-6 border-b cursor-pointer hover:bg-opacity-80 transition-colors ${getAccountTypeColor(
                    account.type
                  )}`}
                  onClick={() => toggleAccountExpansion(account.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <button className="text-gray-700 hover:text-gray-900">
                        {expandedAccounts.has(account.id) ? (
                          <ChevronDown className="w-5 h-5" />
                        ) : (
                          <ChevronRight className="w-5 h-5" />
                        )}
                      </button>
                      
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-white rounded-md text-sm font-bold border-2">
                          {account.code}
                        </span>
                        <div>
                          <h3 className="text-lg font-bold">{account.name}</h3>
                          <p className="text-xs opacity-75">{getAccountTypeLabel(account.type)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-xs text-gray-600 mb-1">
                          {language === 'ar' ? 'الرصيد الافتتاحي' : 'Opening Balance'}
                        </p>
                        <p className="text-sm font-bold">{formatCurrency(account.openingBalance)}</p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-xs text-gray-600 mb-1">
                          {language === 'ar' ? 'مدين' : 'Debit'}
                        </p>
                        <p className="text-lg font-bold text-green-600">
                          {formatCurrency(account.totalDebit)}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-gray-600 mb-1">
                          {language === 'ar' ? 'دائن' : 'Credit'}
                        </p>
                        <p className="text-lg font-bold text-red-600">
                          {formatCurrency(account.totalCredit)}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-gray-600 mb-1">
                          {language === 'ar' ? 'الرصيد الختامي' : 'Closing Balance'}
                        </p>
                        <p className="text-lg font-bold text-blue-600">
                          {formatCurrency(account.closingBalance)}
                        </p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/admin/accounting/account/${account.id}`);
                        }}
                        className="p-2 hover:bg-white rounded-lg transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Transactions Table */}
                {expandedAccounts.has(account.id) && (
                  <div className="p-6 bg-gray-50">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-100 border-b-2 border-gray-300">
                          <tr>
                            <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase">
                              {language === 'ar' ? 'التاريخ' : 'Date'}
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase">
                              {language === 'ar' ? 'المرجع' : 'Reference'}
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase">
                              {language === 'ar' ? 'الوصف' : 'Description'}
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase bg-green-50">
                              {language === 'ar' ? 'مدين' : 'Debit'}
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase bg-red-50">
                              {language === 'ar' ? 'دائن' : 'Credit'}
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase bg-blue-50">
                              {language === 'ar' ? 'الرصيد' : 'Balance'}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {/* Opening Balance Row */}
                          <tr className="bg-gray-50 font-semibold">
                            <td colSpan={3} className="px-4 py-3 text-sm text-gray-900">
                              {language === 'ar' ? 'الرصيد الافتتاحي' : 'Opening Balance'}
                            </td>
                            <td className="px-4 py-3 text-sm"></td>
                            <td className="px-4 py-3 text-sm"></td>
                            <td className="px-4 py-3 text-sm font-bold text-gray-900">
                              {formatCurrency(account.openingBalance)}
                            </td>
                          </tr>

                          {account.transactions.map((txn: Transaction, idx: number) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                                {new Date(txn.date).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">{txn.reference}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{txn.description}</td>
                              <td className="px-4 py-3 text-sm font-medium text-green-600 bg-green-50">
                                {txn.type === 'debit' ? formatCurrency(txn.amount) : '-'}
                              </td>
                              <td className="px-4 py-3 text-sm font-medium text-red-600 bg-red-50">
                                {txn.type === 'credit' ? formatCurrency(txn.amount) : '-'}
                              </td>
                              <td className="px-4 py-3 text-sm font-bold text-gray-900 bg-blue-50">
                                {formatCurrency(txn.balance)}
                              </td>
                            </tr>
                          ))}

                          {/* Closing Balance Row */}
                          <tr className="bg-blue-100 border-t-2 border-blue-300 font-bold">
                            <td colSpan={3} className="px-4 py-3 text-sm text-gray-900">
                              {language === 'ar' ? 'الرصيد الختامي' : 'Closing Balance'}
                            </td>
                            <td className="px-4 py-3 text-sm text-green-600">
                              {formatCurrency(account.totalDebit)}
                            </td>
                            <td className="px-4 py-3 text-sm text-red-600">
                              {formatCurrency(account.totalCredit)}
                            </td>
                            <td className="px-4 py-3 text-sm text-blue-900">
                              {formatCurrency(account.closingBalance)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Grand Total Summary */}
        {accountsWithTransactions.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-6 text-center">
              {language === 'ar' ? 'الإجمالي العام' : 'Grand Total'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-sm opacity-90 mb-2">
                  {language === 'ar' ? 'إجمالي المدين' : 'Total Debits'}
                </p>
                <p className="text-3xl font-bold">{formatCurrency(grandTotals.totalDebit)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm opacity-90 mb-2">
                  {language === 'ar' ? 'إجمالي الدائن' : 'Total Credits'}
                </p>
                <p className="text-3xl font-bold">{formatCurrency(grandTotals.totalCredit)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm opacity-90 mb-2">
                  {language === 'ar' ? 'صافي الحركة' : 'Net Movement'}
                </p>
                <p className="text-3xl font-bold">{formatCurrency(Math.abs(grandTotals.netMovement))}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
