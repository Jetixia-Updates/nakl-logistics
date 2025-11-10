'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import {
  Save,
  Plus,
  Trash2,
  Calculator,
  ArrowLeft,
  Calendar,
  FileText,
  AlertCircle,
  Truck,
  Users,
  Building2,
} from 'lucide-react';

export default function NewJournalEntryPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    reference: `JE-${Date.now()}`,
    description: '',
    relatedTo: 'general', // general, vehicle, vendor, customer
    relatedId: '',
    lines: [
      { account: '', accountCode: '', accountName: '', type: 'debit', amount: 0 },
      { account: '', accountCode: '', accountName: '', type: 'credit', amount: 0 },
    ],
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    // Load accounts
    const savedAccounts = JSON.parse(localStorage.getItem('chartOfAccounts') || '[]');
    const flatAccounts = flattenAccounts(savedAccounts);
    setAccounts(flatAccounts);

    // Load vehicles, vendors, customers
    setVehicles(JSON.parse(localStorage.getItem('vehicles') || '[]'));
    setVendors(JSON.parse(localStorage.getItem('vendors') || '[]'));
    setCustomers(JSON.parse(localStorage.getItem('customers') || '[]'));
  }, []);

  const flattenAccounts = (accountList: any[], result: any[] = []) => {
    accountList.forEach((account) => {
      result.push(account);
      if (account.children) {
        flattenAccounts(account.children, result);
      }
    });
    return result;
  };

  const addLine = () => {
    setFormData({
      ...formData,
      lines: [
        ...formData.lines,
        { account: '', accountCode: '', accountName: '', type: 'debit', amount: 0 },
      ],
    });
  };

  const removeLine = (index: number) => {
    if (formData.lines.length > 2) {
      const newLines = formData.lines.filter((_, i) => i !== index);
      setFormData({ ...formData, lines: newLines });
    }
  };

  const updateLine = (index: number, field: string, value: any) => {
    const newLines = [...formData.lines];
    
    if (field === 'account') {
      const selectedAccount = accounts.find((acc) => acc.id === value);
      if (selectedAccount) {
        newLines[index] = {
          ...newLines[index],
          account: value,
          accountCode: selectedAccount.code,
          accountName: selectedAccount.name,
        };
      }
    } else {
      newLines[index] = { ...newLines[index], [field]: value };
    }
    
    setFormData({ ...formData, lines: newLines });
  };

  const calculateTotals = () => {
    let debitTotal = 0;
    let creditTotal = 0;

    formData.lines.forEach((line) => {
      if (line.type === 'debit') {
        debitTotal += Number(line.amount) || 0;
      } else {
        creditTotal += Number(line.amount) || 0;
      }
    });

    return { debitTotal, creditTotal, difference: debitTotal - creditTotal };
  };

  const totals = calculateTotals();

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.description.trim()) {
      newErrors.description = language === 'ar' ? 'الوصف مطلوب' : 'Description is required';
    }

    if (formData.lines.some((line) => !line.account)) {
      newErrors.lines = language === 'ar' ? 'يجب اختيار حساب لكل سطر' : 'Account must be selected for each line';
    }

    if (formData.lines.some((line) => !line.amount || line.amount <= 0)) {
      newErrors.amount = language === 'ar' ? 'المبلغ يجب أن يكون أكبر من صفر' : 'Amount must be greater than zero';
    }

    if (Math.abs(totals.difference) > 0.01) {
      newErrors.balance = language === 'ar' ? 'القيد غير متوازن' : 'Entry is not balanced';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Save journal entry
    const savedEntries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
    const newEntry = {
      ...formData,
      id: `JE-${Date.now()}`,
      totalAmount: totals.debitTotal,
      createdAt: new Date().toISOString(),
    };

    savedEntries.push(newEntry);
    localStorage.setItem('journalEntries', JSON.stringify(savedEntries));

    // Update account balances
    updateAccountBalances(newEntry);

    // Redirect back to accounting page
    router.push('/admin/accounting');
  };

  const updateAccountBalances = (entry: any) => {
    const savedAccounts = JSON.parse(localStorage.getItem('chartOfAccounts') || '[]');
    
    entry.lines.forEach((line: any) => {
      const account = accounts.find((acc) => acc.id === line.account);
      if (account) {
        updateAccountBalance(savedAccounts, account.id, line.amount, line.type);
      }
    });

    localStorage.setItem('chartOfAccounts', JSON.stringify(savedAccounts));
  };

  const updateAccountBalance = (accountList: any[], accountId: string, amount: number, type: string) => {
    for (let account of accountList) {
      if (account.id === accountId) {
        // Update balance based on account type and transaction type
        if (type === 'debit') {
          if (account.type === 'asset' || account.type === 'expense') {
            account.balance += amount;
          } else {
            account.balance -= amount;
          }
        } else {
          if (account.type === 'liability' || account.type === 'equity' || account.type === 'revenue') {
            account.balance += amount;
          } else {
            account.balance -= amount;
          }
        }
        return true;
      }
      if (account.children) {
        if (updateAccountBalance(account.children, accountId, amount, type)) {
          return true;
        }
      }
    }
    return false;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const quickTemplates = [
    {
      id: 'vehicle_rental',
      name: language === 'ar' ? 'إيجار مركبة' : 'Vehicle Rental',
      icon: Truck,
      lines: [
        { account: '', type: 'debit', amount: 0, description: language === 'ar' ? 'مصروف إيجار مركبة' : 'Vehicle rental expense' },
        { account: '', type: 'credit', amount: 0, description: language === 'ar' ? 'نقدية/بنك' : 'Cash/Bank' },
      ],
    },
    {
      id: 'service_revenue',
      name: language === 'ar' ? 'إيراد خدمة نقل' : 'Transport Service Revenue',
      icon: FileText,
      lines: [
        { account: '', type: 'debit', amount: 0, description: language === 'ar' ? 'نقدية/عميل' : 'Cash/Customer' },
        { account: '', type: 'credit', amount: 0, description: language === 'ar' ? 'إيرادات النقل' : 'Transport revenue' },
      ],
    },
    {
      id: 'fuel_expense',
      name: language === 'ar' ? 'مصروف وقود' : 'Fuel Expense',
      icon: Truck,
      lines: [
        { account: '', type: 'debit', amount: 0, description: language === 'ar' ? 'مصروف الوقود' : 'Fuel expense' },
        { account: '', type: 'credit', amount: 0, description: language === 'ar' ? 'نقدية' : 'Cash' },
      ],
    },
  ];

  return (
    <div className={`min-h-screen bg-gray-50 ${language === 'ar' ? 'font-arabic' : 'font-inter'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            {language === 'ar' ? 'رجوع' : 'Back'}
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'ar' ? 'قيد يومية جديد' : 'New Journal Entry'}
          </h1>
          <p className="text-gray-600">
            {language === 'ar'
              ? 'إضافة قيد محاسبي جديد للعمليات المالية'
              : 'Add new accounting entry for financial operations'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Entry Details */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {language === 'ar' ? 'تفاصيل القيد' : 'Entry Details'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'التاريخ' : 'Date'}
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'رقم المرجع' : 'Reference Number'}
                    </label>
                    <input
                      type="text"
                      value={formData.reference}
                      onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'الوصف' : 'Description'}
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={language === 'ar' ? 'وصف العملية المالية...' : 'Financial operation description...'}
                      required
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'مرتبط بـ' : 'Related To'}
                    </label>
                    <select
                      value={formData.relatedTo}
                      onChange={(e) => setFormData({ ...formData, relatedTo: e.target.value, relatedId: '' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="general">{language === 'ar' ? 'عام' : 'General'}</option>
                      <option value="vehicle">{language === 'ar' ? 'مركبة' : 'Vehicle'}</option>
                      <option value="vendor">{language === 'ar' ? 'مورد' : 'Vendor'}</option>
                      <option value="customer">{language === 'ar' ? 'عميل' : 'Customer'}</option>
                    </select>
                  </div>

                  {formData.relatedTo !== 'general' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'اختر' : 'Select'}{' '}
                        {formData.relatedTo === 'vehicle'
                          ? language === 'ar' ? 'المركبة' : 'Vehicle'
                          : formData.relatedTo === 'vendor'
                          ? language === 'ar' ? 'المورد' : 'Vendor'
                          : language === 'ar' ? 'العميل' : 'Customer'}
                      </label>
                      <select
                        value={formData.relatedId}
                        onChange={(e) => setFormData({ ...formData, relatedId: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">
                          {language === 'ar' ? 'اختر...' : 'Select...'}
                        </option>
                        {formData.relatedTo === 'vehicle' &&
                          vehicles.map((vehicle) => (
                            <option key={vehicle.id} value={vehicle.id}>
                              {vehicle.plateNumber} - {vehicle.type}
                            </option>
                          ))}
                        {formData.relatedTo === 'vendor' &&
                          vendors.map((vendor) => (
                            <option key={vendor.id} value={vendor.id}>
                              {vendor.name}
                            </option>
                          ))}
                        {formData.relatedTo === 'customer' &&
                          customers.map((customer) => (
                            <option key={customer.id} value={customer.id}>
                              {customer.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Journal Lines */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {language === 'ar' ? 'سطور القيد' : 'Journal Lines'}
                  </h2>
                  <button
                    type="button"
                    onClick={addLine}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    {language === 'ar' ? 'إضافة سطر' : 'Add Line'}
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.lines.map((line, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-12 gap-3 items-start p-4 border rounded-lg bg-gray-50"
                    >
                      <div className="col-span-5">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          {language === 'ar' ? 'الحساب' : 'Account'}
                        </label>
                        <select
                          value={line.account}
                          onChange={(e) => updateLine(index, 'account', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        >
                          <option value="">
                            {language === 'ar' ? 'اختر الحساب...' : 'Select account...'}
                          </option>
                          {accounts.map((account) => (
                            <option key={account.id} value={account.id}>
                              {account.code} - {account.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          {language === 'ar' ? 'النوع' : 'Type'}
                        </label>
                        <select
                          value={line.type}
                          onChange={(e) => updateLine(index, 'type', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="debit">{language === 'ar' ? 'مدين' : 'Debit'}</option>
                          <option value="credit">{language === 'ar' ? 'دائن' : 'Credit'}</option>
                        </select>
                      </div>

                      <div className="col-span-4">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          {language === 'ar' ? 'المبلغ' : 'Amount'}
                        </label>
                        <input
                          type="number"
                          value={line.amount || ''}
                          onChange={(e) => updateLine(index, 'amount', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>

                      <div className="col-span-1 flex items-end">
                        {formData.lines.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeLine(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {errors.lines && (
                  <div className="flex items-center gap-2 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <p className="text-red-600 text-sm">{errors.lines}</p>
                  </div>
                )}

                {errors.amount && (
                  <div className="flex items-center gap-2 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <p className="text-red-600 text-sm">{errors.amount}</p>
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">
                      {language === 'ar' ? 'إجمالي المدين' : 'Total Debit'}
                    </p>
                    <p className="text-xl font-bold text-green-600">
                      {formatCurrency(totals.debitTotal)}
                    </p>
                  </div>

                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">
                      {language === 'ar' ? 'إجمالي الدائن' : 'Total Credit'}
                    </p>
                    <p className="text-xl font-bold text-blue-600">
                      {formatCurrency(totals.creditTotal)}
                    </p>
                  </div>

                  <div
                    className={`text-center p-4 rounded-lg ${
                      Math.abs(totals.difference) < 0.01
                        ? 'bg-green-50'
                        : 'bg-red-50'
                    }`}
                  >
                    <p className="text-sm text-gray-600 mb-1">
                      {language === 'ar' ? 'الفرق' : 'Difference'}
                    </p>
                    <p
                      className={`text-xl font-bold ${
                        Math.abs(totals.difference) < 0.01
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {formatCurrency(totals.difference)}
                    </p>
                  </div>
                </div>

                {errors.balance && (
                  <div className="flex items-center gap-2 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <p className="text-red-600 text-sm">{errors.balance}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {language === 'ar' ? 'حفظ القيد' : 'Save Entry'}
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar - Quick Templates */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {language === 'ar' ? 'قوالب سريعة' : 'Quick Templates'}
              </h3>
              <div className="space-y-3">
                {quickTemplates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => {
                      // Apply template logic here
                    }}
                    className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors text-right"
                  >
                    <template.icon className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">{template.name}</span>
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  {language === 'ar' ? 'نصائح' : 'Tips'}
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <Calculator className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                    <span>
                      {language === 'ar'
                        ? 'يجب أن يكون إجمالي المدين = إجمالي الدائن'
                        : 'Total debit must equal total credit'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FileText className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                    <span>
                      {language === 'ar'
                        ? 'اربط القيد بالمركبة أو المورد لتتبع أفضل'
                        : 'Link entry to vehicle or vendor for better tracking'}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
