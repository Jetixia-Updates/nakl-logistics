'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  TrendingUp,
  TrendingDown,
  FileText,
  Download,
  Filter,
  Search,
  Edit,
  Trash2,
  Plus,
  Eye,
  BarChart3,
  DollarSign,
} from 'lucide-react';

export default function AccountDetailPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const params = useParams();
  const accountId = params.id;

  const [account, setAccount] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    loadAccountData();
    loadTransactions();
  }, [accountId]);

  const loadAccountData = () => {
    const savedAccounts = JSON.parse(localStorage.getItem('chartOfAccounts') || '[]');
    const foundAccount = findAccountById(savedAccounts, accountId as string);
    setAccount(foundAccount);
  };

  const loadTransactions = () => {
    const journalEntries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
    const accountTransactions: any[] = [];

    journalEntries.forEach((entry: any) => {
      entry.lines?.forEach((line: any) => {
        if (line.account === accountId) {
          accountTransactions.push({
            date: entry.date,
            reference: entry.reference,
            description: entry.description,
            type: line.type,
            amount: line.amount,
            balance: 0, // سيتم حسابه لاحقاً
          });
        }
      });
    });

    // Sort by date and calculate running balance
    accountTransactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    let runningBalance = 0;
    accountTransactions.forEach((txn) => {
      if (txn.type === 'debit') {
        runningBalance += txn.amount;
      } else {
        runningBalance -= txn.amount;
      }
      txn.balance = runningBalance;
    });

    setTransactions(accountTransactions);
  };

  const findAccountById = (accountList: any[], id: string): any => {
    for (const account of accountList) {
      if (account.id === id) {
        return account;
      }
      if (account.children) {
        const found = findAccountById(account.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch =
      txn.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.reference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || txn.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const calculateSummary = () => {
    let totalDebit = 0;
    let totalCredit = 0;

    filteredTransactions.forEach((txn) => {
      if (txn.type === 'debit') {
        totalDebit += txn.amount;
      } else {
        totalCredit += txn.amount;
      }
    });

    return {
      totalDebit,
      totalCredit,
      balance: totalDebit - totalCredit,
      transactionCount: filteredTransactions.length,
    };
  };

  const summary = calculateSummary();

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

  const exportToCSV = () => {
    const headers = ['التاريخ', 'المرجع', 'الوصف', 'مدين', 'دائن', 'الرصيد'];
    const rows = filteredTransactions.map((txn) => [
      txn.date,
      txn.reference,
      txn.description,
      txn.type === 'debit' ? txn.amount : '',
      txn.type === 'credit' ? txn.amount : '',
      txn.balance,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `account-${account?.code}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (!account) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">
            {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

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
            {language === 'ar' ? 'رجوع إلى الحسابات' : 'Back to Accounts'}
          </button>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={`px-4 py-1 rounded-full text-sm font-medium border ${getAccountTypeColor(
                    account.type
                  )}`}
                >
                  {account.code}
                </span>
                <h1 className="text-3xl font-bold text-gray-900">{account.name}</h1>
              </div>
              <p className="text-gray-600">
                {language === 'ar'
                  ? 'دفتر الأستاذ وجميع الحركات المالية'
                  : 'General ledger and all financial transactions'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                {language === 'ar' ? 'تصدير' : 'Export'}
              </button>
              <button
                onClick={() => router.push(`/admin/accounting/account/${accountId}/edit`)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-4 h-4" />
                {language === 'ar' ? 'تعديل الحساب' : 'Edit Account'}
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">
                {language === 'ar' ? 'الرصيد الحالي' : 'Current Balance'}
              </p>
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.balance)}</p>
            <p className="text-xs text-gray-500 mt-1">
              {language === 'ar' ? 'صافي الحركات' : 'Net transactions'}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">
                {language === 'ar' ? 'إجمالي المدين' : 'Total Debit'}
              </p>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(summary.totalDebit)}</p>
            <p className="text-xs text-gray-500 mt-1">
              {language === 'ar' ? 'جميع الحركات المدينة' : 'All debit transactions'}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">
                {language === 'ar' ? 'إجمالي الدائن' : 'Total Credit'}
              </p>
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(summary.totalCredit)}</p>
            <p className="text-xs text-gray-500 mt-1">
              {language === 'ar' ? 'جميع الحركات الدائنة' : 'All credit transactions'}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">
                {language === 'ar' ? 'عدد الحركات' : 'Transactions'}
              </p>
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{summary.transactionCount}</p>
            <p className="text-xs text-gray-500 mt-1">
              {language === 'ar' ? 'حركة مالية' : 'financial transactions'}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={language === 'ar' ? 'البحث...' : 'Search...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">{language === 'ar' ? 'جميع الأنواع' : 'All Types'}</option>
              <option value="debit">{language === 'ar' ? 'مدين' : 'Debit'}</option>
              <option value="credit">{language === 'ar' ? 'دائن' : 'Credit'}</option>
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">{language === 'ar' ? 'كل الفترات' : 'All Periods'}</option>
              <option value="today">{language === 'ar' ? 'اليوم' : 'Today'}</option>
              <option value="week">{language === 'ar' ? 'هذا الأسبوع' : 'This Week'}</option>
              <option value="month">{language === 'ar' ? 'هذا الشهر' : 'This Month'}</option>
              <option value="year">{language === 'ar' ? 'هذا العام' : 'This Year'}</option>
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              {language === 'ar' ? 'جميع الحركات المالية' : 'All Transactions'}
            </h2>
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {language === 'ar' ? 'لا توجد حركات مالية' : 'No transactions found'}
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
                      {language === 'ar' ? 'مدين' : 'Debit'}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      {language === 'ar' ? 'دائن' : 'Credit'}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      {language === 'ar' ? 'الرصيد' : 'Balance'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTransactions.map((txn, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {txn.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {txn.reference}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{txn.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        {txn.type === 'debit' ? formatCurrency(txn.amount) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                        {txn.type === 'credit' ? formatCurrency(txn.amount) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        {formatCurrency(txn.balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 border-t-2">
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                      {language === 'ar' ? 'الإجمالي' : 'Total'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                      {formatCurrency(summary.totalDebit)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">
                      {formatCurrency(summary.totalCredit)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">
                      {formatCurrency(summary.balance)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => router.push('/admin/accounting/journal/new')}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {language === 'ar' ? 'إضافة قيد جديد' : 'Add New Entry'}
          </button>

          <button
            onClick={() => router.push(`/admin/accounting/reports/account/${accountId}`)}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            {language === 'ar' ? 'التقارير التفصيلية' : 'Detailed Reports'}
          </button>
        </div>
      </div>
    </div>
  );
}
