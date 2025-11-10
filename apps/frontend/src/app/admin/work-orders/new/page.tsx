'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import api from '@/lib/api';
import {
  Briefcase,
  Calendar,
  DollarSign,
  Save,
  X,
  Plus,
  Trash2,
  AlertCircle,
  User,
  Building,
  Truck,
  MapPin,
  Package,
  FileText,
} from 'lucide-react';

interface WorkOrderItem {
  id: string;
  description: string;
  descriptionAr: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  taxRate: number;
  discountRate: number;
}

interface Milestone {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  deliveryDate: string;
  percentage: number;
  status: string;
}

export default function NewWorkOrderPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    // Basic Information
    orderNumber: '',
    title: '',
    titleAr: '',
    description: '',
    descriptionAr: '',
    
    // Client & Vendor
    customerId: '',
    customerName: '',
    customerNameAr: '',
    vendorId: '',
    vendorName: '',
    vendorNameAr: '',
    
    // Tender Reference (optional)
    tenderId: '',
    tenderNumber: '',
    
    // Contract Details
    contractNumber: '',
    contractDate: '',
    contractValue: '',
    currency: 'EGP',
    
    // Dates
    startDate: '',
    endDate: '',
    expectedDeliveryDate: '',
    
    // Location
    pickupLocation: '',
    pickupLocationAr: '',
    deliveryLocation: '',
    deliveryLocationAr: '',
    
    // Financial
    bondAmount: '',
    bondPercentage: '',
    advancePayment: '',
    advancePaymentPercentage: '',
    retentionPercentage: '10',
    
    // Terms
    paymentTerms: '',
    paymentTermsAr: '',
    deliveryTerms: '',
    deliveryTermsAr: '',
    penalties: '',
    penaltiesAr: '',
    
    // Notes
    notes: '',
    notesAr: '',
    
    // Status
    status: 'DRAFT',
    priority: 'MEDIUM',
  });

  const [items, setItems] = useState<WorkOrderItem[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Items Management
  const addItem = () => {
    const newItem: WorkOrderItem = {
      id: `item-${Date.now()}`,
      description: '',
      descriptionAr: '',
      quantity: 1,
      unit: 'unit',
      unitPrice: 0,
      taxRate: 14,
      discountRate: 0,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof WorkOrderItem, value: any) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateItemTotal = (item: WorkOrderItem) => {
    const subtotal = item.quantity * item.unitPrice;
    const discount = subtotal * (item.discountRate / 100);
    const afterDiscount = subtotal - discount;
    const tax = afterDiscount * (item.taxRate / 100);
    return afterDiscount + tax;
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const discount = items.reduce((sum, item) => {
      const itemSubtotal = item.quantity * item.unitPrice;
      return sum + (itemSubtotal * (item.discountRate / 100));
    }, 0);
    const afterDiscount = subtotal - discount;
    const tax = items.reduce((sum, item) => {
      const itemSubtotal = item.quantity * item.unitPrice;
      const itemDiscount = itemSubtotal * (item.discountRate / 100);
      const itemAfterDiscount = itemSubtotal - itemDiscount;
      return sum + (itemAfterDiscount * (item.taxRate / 100));
    }, 0);
    const total = afterDiscount + tax;
    
    return { subtotal, discount, tax, total };
  };

  // Milestones Management
  const addMilestone = () => {
    const newMilestone: Milestone = {
      id: `milestone-${Date.now()}`,
      title: '',
      titleAr: '',
      description: '',
      descriptionAr: '',
      deliveryDate: '',
      percentage: 0,
      status: 'PENDING',
    };
    setMilestones([...milestones, newMilestone]);
  };

  const removeMilestone = (id: string) => {
    setMilestones(milestones.filter(milestone => milestone.id !== id));
  };

  const updateMilestone = (id: string, field: keyof Milestone, value: any) => {
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
      const totals = calculateTotals();
      
      const workOrderData = {
        ...formData,
        contractValue: parseFloat(formData.contractValue),
        bondAmount: formData.bondAmount ? parseFloat(formData.bondAmount) : undefined,
        bondPercentage: formData.bondPercentage ? parseFloat(formData.bondPercentage) : undefined,
        advancePayment: formData.advancePayment ? parseFloat(formData.advancePayment) : undefined,
        advancePaymentPercentage: formData.advancePaymentPercentage ? parseFloat(formData.advancePaymentPercentage) : undefined,
        retentionPercentage: parseFloat(formData.retentionPercentage),
        subtotal: totals.subtotal,
        taxAmount: totals.tax,
        discountAmount: totals.discount,
        total: totals.total,
        items: items.map(item => ({
          description: item.description,
          descriptionAr: item.descriptionAr,
          quantity: item.quantity,
          unit: item.unit,
          unitPrice: item.unitPrice,
          taxRate: item.taxRate,
          discountRate: item.discountRate,
          total: calculateItemTotal(item),
        })),
        milestones: milestones.map(milestone => ({
          title: milestone.title,
          titleAr: milestone.titleAr,
          description: milestone.description,
          descriptionAr: milestone.descriptionAr,
          deliveryDate: milestone.deliveryDate,
          percentage: milestone.percentage,
          status: milestone.status,
        })),
      };

      // For now, show success message without API call
      // Uncomment when authentication is ready
      // const response = await api.post('/work-orders', workOrderData);
      
      setSuccess(language === 'ar' 
        ? 'تم إنشاء أمر العمل بنجاح! (وضع تجريبي)'
        : 'Work order created successfully! (Demo mode)');
      
      setTimeout(() => {
        router.push('/admin/work-orders');
      }, 2000);

    } catch (err: any) {
      console.error('Error creating work order:', err);
      setError(err.response?.data?.error || 'Failed to create work order');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/work-orders');
  };

  const totals = calculateTotals();

  return (
    <div className={`min-h-screen bg-gray-50 ${language === 'ar' ? 'font-arabic' : 'font-inter'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Briefcase className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              {language === 'ar' ? 'إضافة أمر عمل جديد' : 'Create New Work Order'}
            </h1>
          </div>
          <p className="text-gray-600">
            {language === 'ar'
              ? 'أدخل بيانات أمر العمل الجديد وحدد البنود والمراحل'
              : 'Enter the new work order information and define items and milestones'}
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
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              {language === 'ar' ? 'المعلومات الأساسية' : 'Basic Information'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'رقم الأمر' : 'Order Number'}
                </label>
                <input
                  type="text"
                  name="orderNumber"
                  value={formData.orderNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={language === 'ar' ? 'يُنشأ تلقائياً' : 'Auto-generated'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'الحالة' : 'Status'}
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="DRAFT">{language === 'ar' ? 'مسودة' : 'Draft'}</option>
                  <option value="APPROVED">{language === 'ar' ? 'معتمد' : 'Approved'}</option>
                  <option value="IN_PROGRESS">{language === 'ar' ? 'جاري التنفيذ' : 'In Progress'}</option>
                  <option value="COMPLETED">{language === 'ar' ? 'مكتمل' : 'Completed'}</option>
                  <option value="CANCELLED">{language === 'ar' ? 'ملغي' : 'Cancelled'}</option>
                </select>
              </div>

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
                  placeholder="Work order title"
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
                  placeholder="عنوان أمر العمل"
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
                  placeholder="Work order description"
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
                  placeholder="وصف أمر العمل"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'الأولوية' : 'Priority'}
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="LOW">{language === 'ar' ? 'منخفضة' : 'Low'}</option>
                  <option value="MEDIUM">{language === 'ar' ? 'متوسطة' : 'Medium'}</option>
                  <option value="HIGH">{language === 'ar' ? 'عالية' : 'High'}</option>
                  <option value="URGENT">{language === 'ar' ? 'عاجلة' : 'Urgent'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Client & Vendor Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              {language === 'ar' ? 'معلومات العميل والمورد' : 'Client & Vendor Information'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'اسم العميل (English)' : 'Customer Name (English)'}
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Customer name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'اسم العميل (عربي)' : 'Customer Name (Arabic)'}
                </label>
                <input
                  type="text"
                  name="customerNameAr"
                  value={formData.customerNameAr}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="اسم العميل"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'اسم المورد (English)' : 'Vendor Name (English)'}
                </label>
                <input
                  type="text"
                  name="vendorName"
                  value={formData.vendorName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Vendor name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'اسم المورد (عربي)' : 'Vendor Name (Arabic)'}
                </label>
                <input
                  type="text"
                  name="vendorNameAr"
                  value={formData.vendorNameAr}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="اسم المورد"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'رقم المناقصة (اختياري)' : 'Tender Number (Optional)'}
                </label>
                <input
                  type="text"
                  name="tenderNumber"
                  value={formData.tenderNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="TND-000001"
                />
              </div>
            </div>
          </div>

          {/* Contract Details */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-600" />
              {language === 'ar' ? 'تفاصيل العقد' : 'Contract Details'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'رقم العقد' : 'Contract Number'}
                </label>
                <input
                  type="text"
                  name="contractNumber"
                  value={formData.contractNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="CNT-2024-001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'تاريخ العقد' : 'Contract Date'}
                </label>
                <input
                  type="date"
                  name="contractDate"
                  value={formData.contractDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'قيمة العقد' : 'Contract Value'}
                </label>
                <input
                  type="number"
                  name="contractValue"
                  value={formData.contractValue}
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
                  {language === 'ar' ? 'العملة' : 'Currency'}
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="EGP">EGP - {language === 'ar' ? 'جنيه مصري' : 'Egyptian Pound'}</option>
                  <option value="USD">USD - {language === 'ar' ? 'دولار أمريكي' : 'US Dollar'}</option>
                  <option value="EUR">EUR - {language === 'ar' ? 'يورو' : 'Euro'}</option>
                  <option value="SAR">SAR - {language === 'ar' ? 'ريال سعودي' : 'Saudi Riyal'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              {language === 'ar' ? 'التواريخ' : 'Dates'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'تاريخ البدء' : 'Start Date'}
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'تاريخ الانتهاء' : 'End Date'}
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'تاريخ التسليم المتوقع' : 'Expected Delivery Date'}
                </label>
                <input
                  type="date"
                  name="expectedDeliveryDate"
                  value={formData.expectedDeliveryDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              {language === 'ar' ? 'معلومات الموقع' : 'Location Information'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'موقع الاستلام (English)' : 'Pickup Location (English)'}
                </label>
                <input
                  type="text"
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Pickup address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'موقع الاستلام (عربي)' : 'Pickup Location (Arabic)'}
                </label>
                <input
                  type="text"
                  name="pickupLocationAr"
                  value={formData.pickupLocationAr}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="عنوان الاستلام"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'موقع التسليم (English)' : 'Delivery Location (English)'}
                </label>
                <input
                  type="text"
                  name="deliveryLocation"
                  value={formData.deliveryLocation}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Delivery address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'موقع التسليم (عربي)' : 'Delivery Location (Arabic)'}
                </label>
                <input
                  type="text"
                  name="deliveryLocationAr"
                  value={formData.deliveryLocationAr}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="عنوان التسليم"
                  dir="rtl"
                />
              </div>
            </div>
          </div>

          {/* Financial Details */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              {language === 'ar' ? 'التفاصيل المالية' : 'Financial Details'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  {language === 'ar' ? 'نسبة التأمين (%)' : 'Bond Percentage (%)'}
                </label>
                <input
                  type="number"
                  name="bondPercentage"
                  value={formData.bondPercentage}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'الدفعة المقدمة' : 'Advance Payment'}
                </label>
                <input
                  type="number"
                  name="advancePayment"
                  value={formData.advancePayment}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'نسبة الدفعة المقدمة (%)' : 'Advance Payment Percentage (%)'}
                </label>
                <input
                  type="number"
                  name="advancePaymentPercentage"
                  value={formData.advancePaymentPercentage}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'نسبة الاستبقاء (%)' : 'Retention Percentage (%)'}
                </label>
                <input
                  type="number"
                  name="retentionPercentage"
                  value={formData.retentionPercentage}
                  onChange={handleInputChange}
                  required
                  min="0"
                  max="100"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Work Order Items */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                {language === 'ar' ? 'بنود أمر العمل' : 'Work Order Items'}
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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="lg:col-span-2">
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

                      <div className="lg:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'ar' ? 'الكمية' : 'Quantity'}
                        </label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value))}
                          required
                          min="0"
                          step="0.01"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>

                      <div className="lg:col-span-2">
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
                          {language === 'ar' ? 'الوحدة' : 'Unit'}
                        </label>
                        <input
                          type="text"
                          value={item.unit}
                          onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          placeholder="unit, kg, m"
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

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'ar' ? 'نسبة الضريبة (%)' : 'Tax Rate (%)'}
                        </label>
                        <input
                          type="number"
                          value={item.taxRate}
                          onChange={(e) => updateItem(item.id, 'taxRate', parseFloat(e.target.value))}
                          required
                          min="0"
                          max="100"
                          step="0.01"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'ar' ? 'نسبة الخصم (%)' : 'Discount Rate (%)'}
                        </label>
                        <input
                          type="number"
                          value={item.discountRate}
                          onChange={(e) => updateItem(item.id, 'discountRate', parseFloat(e.target.value))}
                          required
                          min="0"
                          max="100"
                          step="0.01"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'ar' ? 'الإجمالي' : 'Total'}
                        </label>
                        <input
                          type="text"
                          value={calculateItemTotal(item).toFixed(2)}
                          disabled
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 font-semibold"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Totals Summary */}
                <div className="border-t-2 border-gray-300 pt-4 mt-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">
                        {language === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        {totals.subtotal.toFixed(2)} {formData.currency}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">
                        {language === 'ar' ? 'الخصم' : 'Discount'}
                      </p>
                      <p className="text-xl font-bold text-red-600">
                        -{totals.discount.toFixed(2)} {formData.currency}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">
                        {language === 'ar' ? 'الضريبة' : 'Tax'}
                      </p>
                      <p className="text-xl font-bold text-orange-600">
                        +{totals.tax.toFixed(2)} {formData.currency}
                      </p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-600 mb-1">
                        {language === 'ar' ? 'الإجمالي النهائي' : 'Grand Total'}
                      </p>
                      <p className="text-xl font-bold text-blue-600">
                        {totals.total.toFixed(2)} {formData.currency}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Milestones */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
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

                      <div>
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

                      <div>
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
                          {language === 'ar' ? 'تاريخ التسليم' : 'Delivery Date'}
                        </label>
                        <input
                          type="date"
                          value={milestone.deliveryDate}
                          onChange={(e) => updateMilestone(milestone.id, 'deliveryDate', e.target.value)}
                          required
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

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'ar' ? 'الحالة' : 'Status'}
                        </label>
                        <select
                          value={milestone.status}
                          onChange={(e) => updateMilestone(milestone.id, 'status', e.target.value)}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        >
                          <option value="PENDING">{language === 'ar' ? 'معلق' : 'Pending'}</option>
                          <option value="IN_PROGRESS">{language === 'ar' ? 'قيد التنفيذ' : 'In Progress'}</option>
                          <option value="COMPLETED">{language === 'ar' ? 'مكتمل' : 'Completed'}</option>
                          <option value="DELAYED">{language === 'ar' ? 'متأخر' : 'Delayed'}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {language === 'ar' ? 'الشروط والأحكام' : 'Terms and Conditions'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'شروط الدفع (English)' : 'Payment Terms (English)'}
                </label>
                <textarea
                  name="paymentTerms"
                  value={formData.paymentTerms}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Payment terms and conditions"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'شروط الدفع (عربي)' : 'Payment Terms (Arabic)'}
                </label>
                <textarea
                  name="paymentTermsAr"
                  value={formData.paymentTermsAr}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="شروط وأحكام الدفع"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'شروط التسليم (English)' : 'Delivery Terms (English)'}
                </label>
                <textarea
                  name="deliveryTerms"
                  value={formData.deliveryTerms}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Delivery terms and conditions"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'شروط التسليم (عربي)' : 'Delivery Terms (Arabic)'}
                </label>
                <textarea
                  name="deliveryTermsAr"
                  value={formData.deliveryTermsAr}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="شروط وأحكام التسليم"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'الغرامات والجزاءات (English)' : 'Penalties (English)'}
                </label>
                <textarea
                  name="penalties"
                  value={formData.penalties}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Penalties for delays or violations"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'الغرامات والجزاءات (عربي)' : 'Penalties (Arabic)'}
                </label>
                <textarea
                  name="penaltiesAr"
                  value={formData.penaltiesAr}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="غرامات التأخير أو المخالفات"
                  dir="rtl"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {language === 'ar' ? 'ملاحظات' : 'Notes'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'ملاحظات (English)' : 'Notes (English)'}
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Additional notes or comments"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'ملاحظات (عربي)' : 'Notes (Arabic)'}
                </label>
                <textarea
                  name="notesAr"
                  value={formData.notesAr}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ملاحظات أو تعليقات إضافية"
                  dir="rtl"
                />
              </div>
            </div>
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
                : (language === 'ar' ? 'حفظ أمر العمل' : 'Save Work Order')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
