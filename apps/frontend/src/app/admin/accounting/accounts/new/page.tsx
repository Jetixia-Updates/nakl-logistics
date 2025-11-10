'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, AlertCircle } from 'lucide-react';

export default function NewAccountPage() {
  const { language } = useLanguage();
  const router = useRouter();

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: 'asset',
    parentId: '',
    openingBalance: 0,
    description: '',
  });

  const [accounts, setAccounts] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = () => {
    const savedAccounts = JSON.parse(localStorage.getItem('chartOfAccounts') || '[]');
    setAccounts(savedAccounts);
  };

  const accountTypes = [
    { value: 'asset', label: language === 'ar' ? 'أصول' : 'Asset', color: 'text-green-700' },
    { value: 'liability', label: language === 'ar' ? 'التزامات' : 'Liability', color: 'text-red-700' },
    { value: 'equity', label: language === 'ar' ? 'حقوق ملكية' : 'Equity', color: 'text-purple-700' },
    { value: 'revenue', label: language === 'ar' ? 'إيرادات' : 'Revenue', color: 'text-blue-700' },
    { value: 'expense', label: language === 'ar' ? 'مصروفات' : 'Expense', color: 'text-orange-700' },
  ];

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.code || !formData.name) {
      setError(language === 'ar' ? 'الرجاء إدخال رمز واسم الحساب' : 'Please enter account code and name');
      return;
    }

    // Check if code already exists
    const flatAccounts = flattenAccounts(accounts);
    if (flatAccounts.some((acc) => acc.code === formData.code)) {
      setError(language === 'ar' ? 'رمز الحساب موجود بالفعل' : 'Account code already exists');
      return;
    }

    const newAccount = {
      id: `acc_${Date.now()}`,
      code: formData.code,
      name: formData.name,
      type: formData.type,
      balance: formData.openingBalance,
      description: formData.description,
      children: [],
    };

    let updatedAccounts = [...accounts];

    if (formData.parentId) {
      // Add as child to parent account
      const addToParent = (accountList: any[]): any[] => {
        return accountList.map((account) => {
          if (account.id === formData.parentId) {
            return {
              ...account,
              children: [...(account.children || []), newAccount],
            };
          }
          if (account.children) {
            return {
              ...account,
              children: addToParent(account.children),
            };
          }
          return account;
        });
      };
      updatedAccounts = addToParent(updatedAccounts);
    } else {
      // Add as root account
      updatedAccounts.push(newAccount);
    }

    localStorage.setItem('chartOfAccounts', JSON.stringify(updatedAccounts));

    // Create opening balance journal entry if needed
    if (formData.openingBalance !== 0) {
      const journalEntries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
      const openingEntry = {
        id: `entry_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        reference: `OB-${formData.code}`,
        description: `${language === 'ar' ? 'رصيد افتتاحي - ' : 'Opening Balance - '}${formData.name}`,
        relatedTo: 'general',
        lines: [
          {
            account: newAccount.id,
            type: formData.openingBalance > 0 ? 'debit' : 'credit',
            amount: Math.abs(formData.openingBalance),
          },
          {
            account: 'equity_opening', // حساب الأرصدة الافتتاحية
            type: formData.openingBalance > 0 ? 'credit' : 'debit',
            amount: Math.abs(formData.openingBalance),
          },
        ],
      };
      journalEntries.push(openingEntry);
      localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
    }

    setSuccess(true);
    setTimeout(() => {
      router.push('/admin/accounting');
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'openingBalance' ? parseFloat(value) || 0 : value,
    }));
  };

  const flatAccounts = flattenAccounts(accounts);

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

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'ar' ? 'إضافة حساب جديد' : 'Add New Account'}
          </h1>
          <p className="text-gray-600">
            {language === 'ar'
              ? 'أضف حساب جديد إلى شجرة الحسابات'
              : 'Add a new account to the chart of accounts'}
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="font-medium">
                {language === 'ar' ? 'تم إضافة الحساب بنجاح!' : 'Account added successfully!'}
              </span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 space-y-6">
            {/* Account Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'نوع الحساب' : 'Account Type'}
                <span className="text-red-500 mr-1">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {accountTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Parent Account */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الحساب الرئيسي (اختياري)' : 'Parent Account (Optional)'}
              </label>
              <select
                name="parentId"
                value={formData.parentId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">
                  {language === 'ar' ? 'حساب رئيسي (مستوى أول)' : 'Root Account (Level 1)'}
                </option>
                {flatAccounts
                  .filter((acc) => acc.type === formData.type)
                  .map((account) => (
                    <option key={account.id} value={account.id}>
                      {'  '.repeat(account.level)}
                      {account.code} - {account.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Account Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'رمز الحساب' : 'Account Code'}
                  <span className="text-red-500 mr-1">*</span>
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  required
                  placeholder={language === 'ar' ? 'مثال: 1010' : 'Example: 1010'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Account Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'اسم الحساب' : 'Account Name'}
                  <span className="text-red-500 mr-1">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder={language === 'ar' ? 'مثال: النقدية بالصندوق' : 'Example: Cash in Hand'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Opening Balance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الرصيد الافتتاحي (اختياري)' : 'Opening Balance (Optional)'}
              </label>
              <input
                type="number"
                name="openingBalance"
                value={formData.openingBalance}
                onChange={handleChange}
                step="0.01"
                placeholder="0.00"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-1 text-sm text-gray-500">
                {language === 'ar'
                  ? 'أدخل رقم موجب للمدين، ورقم سالب للدائن'
                  : 'Enter positive number for debit, negative for credit'}
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الوصف (اختياري)' : 'Description (Optional)'}
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder={
                  language === 'ar'
                    ? 'أضف ملاحظات أو وصف للحساب...'
                    : 'Add notes or description for the account...'
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push('/admin/accounting')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={success}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {language === 'ar' ? 'حفظ الحساب' : 'Save Account'}
            </button>
          </div>
        </form>

        {/* Help Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            {language === 'ar' ? 'نصائح إضافة الحسابات:' : 'Account Creation Tips:'}
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              {language === 'ar'
                ? 'استخدم نظام ترقيم واضح للحسابات (مثال: 1000 للأصول، 2000 للالتزامات)'
                : 'Use a clear numbering system for accounts (e.g., 1000 for assets, 2000 for liabilities)'}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              {language === 'ar'
                ? 'يمكنك إنشاء حسابات فرعية بتحديد حساب رئيسي'
                : 'You can create sub-accounts by selecting a parent account'}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              {language === 'ar'
                ? 'الرصيد الافتتاحي سيتم تسجيله تلقائياً كقيد دفتري'
                : 'Opening balance will be automatically recorded as a journal entry'}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              {language === 'ar'
                ? 'تأكد من اختيار النوع الصحيح للحساب لضمان ظهوره في التقارير المناسبة'
                : 'Make sure to select the correct account type to ensure it appears in the right reports'}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
