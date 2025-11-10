'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import api from '@/lib/api';
import {
  FileText,
  Calendar,
  DollarSign,
  Save,
  X,
  Plus,
  Trash2,
  AlertCircle,
} from 'lucide-react';

interface TenderItem {
  id: string;
  description: string;
  descriptionAr: string;
  quantity: number;
  unit: string;
  unitPrice: number;
}

interface TenderMilestone {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  startDate: string;
  endDate: string;
  percentage: number;
}

export default function NewTenderPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    titleAr: '',
    description: '',
    descriptionAr: '',
    type: 'PUBLIC',
    estimatedValue: '',
    currency: 'EGP',
    submissionDeadline: '',
    publishDate: '',
    bondAmount: '',
    bondPercentage: '',
    documentPrice: '',
    technicalWeight: '70',
    financialWeight: '30',
  });

  const [items, setItems] = useState<TenderItem[]>([]);
  const [milestones, setMilestones] = useState<TenderMilestone[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addItem = () => {
    const newItem: TenderItem = {
      id: `item-${Date.now()}`,
      description: '',
      descriptionAr: '',
      quantity: 1,
      unit: 'unit',
      unitPrice: 0,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof TenderItem, value: any) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const addMilestone = () => {
    const newMilestone: TenderMilestone = {
      id: `milestone-${Date.now()}`,
      title: '',
      titleAr: '',
      description: '',
      descriptionAr: '',
      startDate: '',
      endDate: '',
      percentage: 0,
    };
    setMilestones([...milestones, newMilestone]);
  };

  const removeMilestone = (id: string) => {
    setMilestones(milestones.filter(milestone => milestone.id !== id));
  };

  const updateMilestone = (id: string, field: keyof TenderMilestone, value: any) => {
    setMilestones(milestones.map(milestone => 
      milestone.id === id ? { ...milestone, [field]: value } : milestone
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Prepare data
      const tenderData = {
        ...formData,
        estimatedValue: parseFloat(formData.estimatedValue),
        bondAmount: formData.bondAmount ? parseFloat(formData.bondAmount) : undefined,
        bondPercentage: formData.bondPercentage ? parseFloat(formData.bondPercentage) : undefined,
        documentPrice: formData.documentPrice ? parseFloat(formData.documentPrice) : undefined,
        technicalWeight: parseFloat(formData.technicalWeight),
        financialWeight: parseFloat(formData.financialWeight),
        items: items.map(item => ({
          description: item.description,
          descriptionAr: item.descriptionAr,
          quantity: item.quantity,
          unit: item.unit,
          unitPrice: item.unitPrice,
        })),
        milestones: milestones.map(milestone => ({
          title: milestone.title,
          titleAr: milestone.titleAr,
          description: milestone.description,
          descriptionAr: milestone.descriptionAr,
          startDate: milestone.startDate,
          endDate: milestone.endDate,
          percentage: milestone.percentage,
        })),
      };

      // For now, show success message without API call
      // Uncomment when authentication is ready
      // const response = await api.post('/tenders', tenderData);
      
      setSuccess(language === 'ar' 
        ? 'تم إنشاء المناقصة بنجاح! (وضع تجريبي)'
        : 'Tender created successfully! (Demo mode)');
      
      setTimeout(() => {
        router.push('/admin/tenders');
      }, 2000);

    } catch (err: any) {
      console.error('Error creating tender:', err);
      setError(err.response?.data?.error || 'Failed to create tender');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/tenders');
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${language === 'ar' ? 'font-arabic' : 'font-inter'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'ar' ? 'إضافة مناقصة جديدة' : 'Create New Tender'}
          </h1>
          <p className="text-gray-600">
            {language === 'ar'
              ? 'أدخل بيانات المناقصة الجديدة وحدد البنود والمراحل'
              : 'Enter the new tender information and define items and milestones'}
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-green-600" />
            <p className="text-sm text-green-800">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {language === 'ar' ? 'المعلومات الأساسية' : 'Basic Information'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'العنوان (English)' : 'Title (English)'}
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter tender title in English"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}
                </label>
                <input
                  type="text"
                  name="titleAr"
                  value={formData.titleAr}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="أدخل عنوان المناقصة بالعربية"
                  dir="rtl"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'الوصف (English)' : 'Description (English)'}
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter tender description in English"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)'}
                </label>
                <textarea
                  name="descriptionAr"
                  value={formData.descriptionAr}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="أدخل وصف المناقصة بالعربية"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'نوع المناقصة' : 'Tender Type'}
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="PUBLIC">{language === 'ar' ? 'عامة' : 'Public'}</option>
                  <option value="LIMITED">{language === 'ar' ? 'محدودة' : 'Limited'}</option>
                  <option value="DIRECT">{language === 'ar' ? 'مباشرة' : 'Direct'}</option>
                  <option value="FRAMEWORK">{language === 'ar' ? 'إطارية' : 'Framework'}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'القيمة التقديرية' : 'Estimated Value'}
                </label>
                <input
                  type="number"
                  name="estimatedValue"
                  value={formData.estimatedValue}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'آخر موعد للتقديم' : 'Submission Deadline'}
                </label>
                <input
                  type="date"
                  name="submissionDeadline"
                  value={formData.submissionDeadline}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'تاريخ النشر' : 'Publish Date'}
                </label>
                <input
                  type="date"
                  name="publishDate"
                  value={formData.publishDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'قيمة التأمين' : 'Bond Amount'}
                </label>
                <input
                  type="number"
                  name="bondAmount"
                  value={formData.bondAmount}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'سعر كراسة الشروط' : 'Document Price'}
                </label>
                <input
                  type="number"
                  name="documentPrice"
                  value={formData.documentPrice}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'وزن التقييم الفني (%)' : 'Technical Weight (%)'}
                </label>
                <input
                  type="number"
                  name="technicalWeight"
                  value={formData.technicalWeight}
                  onChange={handleInputChange}
                  required
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'وزن التقييم المالي (%)' : 'Financial Weight (%)'}
                </label>
                <input
                  type="number"
                  name="financialWeight"
                  value={formData.financialWeight}
                  onChange={handleInputChange}
                  required
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Tender Items */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {language === 'ar' ? 'بنود المناقصة' : 'Tender Items'}
              </h2>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                {language === 'ar' ? 'إضافة بند' : 'Add Item'}
              </button>
            </div>

            {items.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                {language === 'ar' ? 'لم يتم إضافة بنود بعد' : 'No items added yet'}
              </p>
            ) : (
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-900">
                        {language === 'ar' ? `البند ${index + 1}` : `Item ${index + 1}`}
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'ar' ? 'الوصف (English)' : 'Description (English)'}
                        </label>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          placeholder="Item description"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)'}
                        </label>
                        <input
                          type="text"
                          value={item.descriptionAr}
                          onChange={(e) => updateItem(item.id, 'descriptionAr', e.target.value)}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          placeholder="وصف البند"
                          dir="rtl"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'ar' ? 'الكمية' : 'Quantity'}
                        </label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value))}
                          required
                          min="0"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'ar' ? 'الوحدة' : 'Unit'}
                        </label>
                        <input
                          type="text"
                          value={item.unit}
                          onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          placeholder="unit, kg, m, etc."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'ar' ? 'سعر الوحدة' : 'Unit Price'}
                        </label>
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value))}
                          required
                          min="0"
                          step="0.01"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>

                      <div className="flex items-end">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {language === 'ar' ? 'الإجمالي' : 'Total'}
                          </label>
                          <input
                            type="text"
                            value={(item.quantity * item.unitPrice).toFixed(2)}
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Milestones */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {language === 'ar' ? 'مراحل التنفيذ' : 'Milestones'}
              </h2>
              <button
                type="button"
                onClick={addMilestone}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                {language === 'ar' ? 'إضافة مرحلة' : 'Add Milestone'}
              </button>
            </div>

            {milestones.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                {language === 'ar' ? 'لم يتم إضافة مراحل بعد' : 'No milestones added yet'}
              </p>
            ) : (
              <div className="space-y-4">
                {milestones.map((milestone, index) => (
                  <div key={milestone.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-900">
                        {language === 'ar' ? `المرحلة ${index + 1}` : `Milestone ${index + 1}`}
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeMilestone(milestone.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'ar' ? 'العنوان (English)' : 'Title (English)'}
                        </label>
                        <input
                          type="text"
                          value={milestone.title}
                          onChange={(e) => updateMilestone(milestone.id, 'title', e.target.value)}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}
                        </label>
                        <input
                          type="text"
                          value={milestone.titleAr}
                          onChange={(e) => updateMilestone(milestone.id, 'titleAr', e.target.value)}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          dir="rtl"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'ar' ? 'الوصف (English)' : 'Description (English)'}
                        </label>
                        <textarea
                          value={milestone.description}
                          onChange={(e) => updateMilestone(milestone.id, 'description', e.target.value)}
                          rows={2}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)'}
                        </label>
                        <textarea
                          value={milestone.descriptionAr}
                          onChange={(e) => updateMilestone(milestone.id, 'descriptionAr', e.target.value)}
                          rows={2}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          dir="rtl"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'ar' ? 'تاريخ البدء' : 'Start Date'}
                        </label>
                        <input
                          type="date"
                          value={milestone.startDate}
                          onChange={(e) => updateMilestone(milestone.id, 'startDate', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'ar' ? 'تاريخ الانتهاء' : 'End Date'}
                        </label>
                        <input
                          type="date"
                          value={milestone.endDate}
                          onChange={(e) => updateMilestone(milestone.id, 'endDate', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'ar' ? 'النسبة المئوية (%)' : 'Percentage (%)'}
                        </label>
                        <input
                          type="number"
                          value={milestone.percentage}
                          onChange={(e) => updateMilestone(milestone.id, 'percentage', parseFloat(e.target.value))}
                          required
                          min="0"
                          max="100"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <X className="w-5 h-5" />
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {loading 
                ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...') 
                : (language === 'ar' ? 'حفظ المناقصة' : 'Save Tender')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
