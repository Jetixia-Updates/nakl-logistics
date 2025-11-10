'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  ArrowLeft,
  Building,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  FileText,
  DollarSign,
  Calendar,
  Package,
  Plus,
  X,
  Truck,
  Star,
} from 'lucide-react';

export default function NewVendorPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('basic');

  const [vendorData, setVendorData] = useState({
    // Basic Information
    type: 'company',
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    alternatePhone: '',
    
    // Address Information
    address: '',
    city: '',
    district: '',
    postalCode: '',
    country: language === 'ar' ? 'مصر' : 'Egypt',
    
    // Business Information
    taxId: '',
    commercialRegister: '',
    industry: 'transport',
    establishedYear: '',
    companySize: '',
    
    // Financial Information
    bankName: '',
    bankAccount: '',
    iban: '',
    paymentTerms: '30',
    currency: 'EGP',
    
    // Services & Capabilities
    services: [] as string[],
    vehiclesCount: '',
    vehicleTypes: [] as string[],
    serviceAreas: [] as string[],
    
    // Rating & Performance
    initialRating: '4.0',
    
    // Notes
    notes: '',
    status: 'active',
  });

  const availableServices = [
    { ar: 'نقل بري', en: 'Land Transport' },
  ];

  const vehicleTypesOptions = [
    { ar: 'چامبو', en: 'Jumbo' },
    { ar: 'تريلات', en: 'Trailers' },
    { ar: 'جرارات فرش', en: 'Spreading Tractors' },
    { ar: 'جرارات كونتر', en: 'Counter Tractors' },
    { ar: 'كساحة', en: 'Sweeper' },
    { ar: 'چامبو براد صغير', en: 'Small Cooler Jumbo' },
    { ar: 'چامبو براد كبير', en: 'Large Cooler Jumbo' },
  ];

  const serviceAreasOptions = [
    { ar: 'القاهرة الكبرى', en: 'Greater Cairo' },
    { ar: 'الإسكندرية', en: 'Alexandria' },
    { ar: 'الجيزة', en: 'Giza' },
    { ar: 'القليوبية', en: 'Qalyubia' },
    { ar: 'الدلتا', en: 'Delta Region' },
    { ar: 'الصعيد', en: 'Upper Egypt' },
    { ar: 'البحر الأحمر', en: 'Red Sea' },
    { ar: 'سيناء', en: 'Sinai' },
  ];

  const handleInputChange = (field: string, value: any) => {
    setVendorData(prev => ({ ...prev, [field]: value }));
  };

  const addService = (service: string) => {
    if (!vendorData.services.includes(service)) {
      setVendorData(prev => ({
        ...prev,
        services: [...prev.services, service]
      }));
    }
  };

  const removeService = (index: number) => {
    setVendorData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const toggleVehicleType = (type: string) => {
    setVendorData(prev => ({
      ...prev,
      vehicleTypes: prev.vehicleTypes.includes(type)
        ? prev.vehicleTypes.filter(t => t !== type)
        : [...prev.vehicleTypes, type]
    }));
  };

  const toggleServiceArea = (area: string) => {
    setVendorData(prev => ({
      ...prev,
      serviceAreas: prev.serviceAreas.includes(area)
        ? prev.serviceAreas.filter(a => a !== area)
        : [...prev.serviceAreas, area]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Vendor Data:', vendorData);
    alert(language === 'ar' ? 'تم إضافة المورد بنجاح!' : 'Vendor added successfully!');
    router.push('/admin/vendors');
  };

  const tabs = [
    { id: 'basic', label: language === 'ar' ? 'المعلومات الأساسية' : 'Basic Information', icon: User },
    { id: 'address', label: language === 'ar' ? 'معلومات العنوان' : 'Address Information', icon: MapPin },
    { id: 'business', label: language === 'ar' ? 'المعلومات التجارية' : 'Business Information', icon: Building },
    { id: 'financial', label: language === 'ar' ? 'المعلومات المالية' : 'Financial Information', icon: DollarSign },
    { id: 'capabilities', label: language === 'ar' ? 'الخدمات والقدرات' : 'Services & Capabilities', icon: Truck },
  ];

  return (
    <div className={`min-h-screen bg-gray-50 ${language === 'ar' ? 'font-arabic' : 'font-inter'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/admin/vendors')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{language === 'ar' ? 'العودة للموردين' : 'Back to Vendors'}</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'ar' ? 'إضافة مورد جديد' : 'Add New Vendor'}
          </h1>
          <p className="text-gray-600">
            {language === 'ar'
              ? 'أدخل جميع البيانات المطلوبة لإضافة مورد أو شركة نقل جديدة'
              : 'Enter all required information to add a new vendor or transport company'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow-sm border">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex gap-4 px-6 overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 py-4 px-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* Basic Information Tab */}
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    {language === 'ar' ? 'المعلومات الأساسية' : 'Basic Information'}
                  </h2>

                  {/* Vendor Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'نوع المورد *' : 'Vendor Type *'}
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => handleInputChange('type', 'company')}
                        className={`flex items-center justify-center gap-2 p-4 border-2 rounded-lg transition-colors ${
                          vendorData.type === 'company'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <Building className="w-5 h-5" />
                        <span className="font-medium">{language === 'ar' ? 'شركة' : 'Company'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInputChange('type', 'individual')}
                        className={`flex items-center justify-center gap-2 p-4 border-2 rounded-lg transition-colors ${
                          vendorData.type === 'individual'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <User className="w-5 h-5" />
                        <span className="font-medium">{language === 'ar' ? 'فرد' : 'Individual'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {vendorData.type === 'company'
                          ? language === 'ar' ? 'اسم الشركة *' : 'Company Name *'
                          : language === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={vendorData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={language === 'ar' ? 'أدخل الاسم' : 'Enter name'}
                      />
                    </div>

                    {/* Contact Person */}
                    {vendorData.type === 'company' && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'ar' ? 'اسم المسؤول *' : 'Contact Person *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={vendorData.contactPerson}
                          onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={language === 'ar' ? 'اسم المسؤول عن التواصل' : 'Contact person name'}
                        />
                      </div>
                    )}

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'رقم الهاتف *' : 'Phone Number *'}
                      </label>
                      <input
                        type="tel"
                        required
                        value={vendorData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+20 123 456 7890"
                      />
                    </div>

                    {/* Alternate Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'هاتف بديل' : 'Alternate Phone'}
                      </label>
                      <input
                        type="tel"
                        value={vendorData.alternatePhone}
                        onChange={(e) => handleInputChange('alternatePhone', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+20 123 456 7890"
                      />
                    </div>

                    {/* Email */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'البريد الإلكتروني *' : 'Email Address *'}
                      </label>
                      <input
                        type="email"
                        required
                        value={vendorData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="example@company.com"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Address Information Tab */}
              {activeTab === 'address' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    {language === 'ar' ? 'معلومات العنوان' : 'Address Information'}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Address */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'العنوان *' : 'Address *'}
                      </label>
                      <textarea
                        required
                        value={vendorData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={language === 'ar' ? 'العنوان التفصيلي' : 'Detailed address'}
                      />
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'المدينة *' : 'City *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={vendorData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={language === 'ar' ? 'القاهرة' : 'Cairo'}
                      />
                    </div>

                    {/* District */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'الحي/المنطقة' : 'District/Area'}
                      </label>
                      <input
                        type="text"
                        value={vendorData.district}
                        onChange={(e) => handleInputChange('district', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={language === 'ar' ? 'مدينة نصر' : 'Nasr City'}
                      />
                    </div>

                    {/* Postal Code */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'الرمز البريدي' : 'Postal Code'}
                      </label>
                      <input
                        type="text"
                        value={vendorData.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="11371"
                      />
                    </div>

                    {/* Country */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'الدولة *' : 'Country *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={vendorData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Business Information Tab */}
              {activeTab === 'business' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    {language === 'ar' ? 'المعلومات التجارية' : 'Business Information'}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tax ID */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'الرقم الضريبي' : 'Tax ID'}
                      </label>
                      <input
                        type="text"
                        value={vendorData.taxId}
                        onChange={(e) => handleInputChange('taxId', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="123-456-789"
                      />
                    </div>

                    {/* Commercial Register */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'السجل التجاري' : 'Commercial Register'}
                      </label>
                      <input
                        type="text"
                        value={vendorData.commercialRegister}
                        onChange={(e) => handleInputChange('commercialRegister', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="CR-123456"
                      />
                    </div>

                    {/* Industry */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'نوع النشاط' : 'Business Type'}
                      </label>
                      <select
                        value={vendorData.industry}
                        onChange={(e) => handleInputChange('industry', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="transport">{language === 'ar' ? 'نقل وشحن' : 'Transport & Logistics'}</option>
                        <option value="equipment">{language === 'ar' ? 'معدات ثقيلة' : 'Heavy Equipment'}</option>
                        <option value="storage">{language === 'ar' ? 'تخزين' : 'Storage & Warehousing'}</option>
                        <option value="delivery">{language === 'ar' ? 'توصيل سريع' : 'Express Delivery'}</option>
                        <option value="other">{language === 'ar' ? 'أخرى' : 'Other'}</option>
                      </select>
                    </div>

                    {/* Established Year */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'سنة التأسيس' : 'Established Year'}
                      </label>
                      <input
                        type="number"
                        min="1900"
                        max={new Date().getFullYear()}
                        value={vendorData.establishedYear}
                        onChange={(e) => handleInputChange('establishedYear', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="2020"
                      />
                    </div>

                    {/* Company Size */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'حجم الشركة' : 'Company Size'}
                      </label>
                      <select
                        value={vendorData.companySize}
                        onChange={(e) => handleInputChange('companySize', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">{language === 'ar' ? 'اختر الحجم' : 'Select Size'}</option>
                        <option value="small">{language === 'ar' ? 'صغيرة (1-10)' : 'Small (1-10)'}</option>
                        <option value="medium">{language === 'ar' ? 'متوسطة (11-50)' : 'Medium (11-50)'}</option>
                        <option value="large">{language === 'ar' ? 'كبيرة (51+)' : 'Large (51+)'}</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Financial Information Tab */}
              {activeTab === 'financial' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    {language === 'ar' ? 'المعلومات المالية' : 'Financial Information'}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Bank Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'اسم البنك' : 'Bank Name'}
                      </label>
                      <input
                        type="text"
                        value={vendorData.bankName}
                        onChange={(e) => handleInputChange('bankName', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={language === 'ar' ? 'بنك مصر' : 'Bank of Egypt'}
                      />
                    </div>

                    {/* Bank Account */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'رقم الحساب البنكي' : 'Bank Account Number'}
                      </label>
                      <input
                        type="text"
                        value={vendorData.bankAccount}
                        onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="1234567890"
                      />
                    </div>

                    {/* IBAN */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'رقم الآيبان (IBAN)' : 'IBAN Number'}
                      </label>
                      <input
                        type="text"
                        value={vendorData.iban}
                        onChange={(e) => handleInputChange('iban', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="EG380019000500000000263180002"
                      />
                    </div>

                    {/* Payment Terms */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'شروط الدفع (أيام)' : 'Payment Terms (days)'}
                      </label>
                      <select
                        value={vendorData.paymentTerms}
                        onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="0">{language === 'ar' ? 'فوري' : 'Immediate'}</option>
                        <option value="7">7 {language === 'ar' ? 'أيام' : 'days'}</option>
                        <option value="15">15 {language === 'ar' ? 'يوم' : 'days'}</option>
                        <option value="30">30 {language === 'ar' ? 'يوم' : 'days'}</option>
                        <option value="45">45 {language === 'ar' ? 'يوم' : 'days'}</option>
                        <option value="60">60 {language === 'ar' ? 'يوم' : 'days'}</option>
                      </select>
                    </div>

                    {/* Currency */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'العملة' : 'Currency'}
                      </label>
                      <select
                        value={vendorData.currency}
                        onChange={(e) => handleInputChange('currency', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="EGP">{language === 'ar' ? 'جنيه مصري (EGP)' : 'Egyptian Pound (EGP)'}</option>
                        <option value="USD">{language === 'ar' ? 'دولار أمريكي (USD)' : 'US Dollar (USD)'}</option>
                        <option value="EUR">{language === 'ar' ? 'يورو (EUR)' : 'Euro (EUR)'}</option>
                        <option value="EGP">{language === 'ar' ? 'جنيه مصري (EGP)' : 'Egyptian Pound (EGP)'}</option>
                        <option value="SAR">{language === 'ar' ? 'ريال سعودي (SAR)' : 'Saudi Riyal (SAR)'}</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Services & Capabilities Tab */}
              {activeTab === 'capabilities' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    {language === 'ar' ? 'الخدمات والقدرات' : 'Services & Capabilities'}
                  </h2>

                  {/* Available Services */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      {language === 'ar' ? 'اختر الخدمات المتاحة' : 'Select Available Services'}
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {availableServices.map((service) => (
                        <button
                          key={service.en}
                          type="button"
                          onClick={() => addService(language === 'ar' ? service.ar : service.en)}
                          className={`p-3 border-2 rounded-lg text-sm font-medium transition-colors ${
                            vendorData.services.includes(language === 'ar' ? service.ar : service.en)
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {language === 'ar' ? service.ar : service.en}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selected Services */}
                  {vendorData.services.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        {language === 'ar' ? 'الخدمات المختارة' : 'Selected Services'}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {vendorData.services.map((service: string, index: number) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                          >
                            {service}
                            <button
                              type="button"
                              onClick={() => removeService(index)}
                              className="hover:bg-blue-200 rounded-full p-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Vehicles Count */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'عدد المركبات' : 'Number of Vehicles'}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={vendorData.vehiclesCount}
                        onChange={(e) => handleInputChange('vehiclesCount', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="25"
                      />
                    </div>

                    {/* Initial Rating */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'التقييم الأولي' : 'Initial Rating'}
                      </label>
                      <select
                        value={vendorData.initialRating}
                        onChange={(e) => handleInputChange('initialRating', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="5.0">⭐⭐⭐⭐⭐ 5.0</option>
                        <option value="4.5">⭐⭐⭐⭐ 4.5</option>
                        <option value="4.0">⭐⭐⭐⭐ 4.0</option>
                        <option value="3.5">⭐⭐⭐ 3.5</option>
                        <option value="3.0">⭐⭐⭐ 3.0</option>
                      </select>
                    </div>
                  </div>

                  {/* Vehicle Types */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      {language === 'ar' ? 'أنواع المركبات المتاحة' : 'Available Vehicle Types'}
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {vehicleTypesOptions.map((type) => (
                        <button
                          key={type.en}
                          type="button"
                          onClick={() => toggleVehicleType(language === 'ar' ? type.ar : type.en)}
                          className={`p-3 border-2 rounded-lg text-sm font-medium transition-colors ${
                            vendorData.vehicleTypes.includes(language === 'ar' ? type.ar : type.en)
                              ? 'border-green-500 bg-green-50 text-green-700'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {language === 'ar' ? type.ar : type.en}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Service Areas */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      {language === 'ar' ? 'مناطق الخدمة' : 'Service Areas'}
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {serviceAreasOptions.map((area) => (
                        <button
                          key={area.en}
                          type="button"
                          onClick={() => toggleServiceArea(language === 'ar' ? area.ar : area.en)}
                          className={`p-3 border-2 rounded-lg text-sm font-medium transition-colors ${
                            vendorData.serviceAreas.includes(language === 'ar' ? area.ar : area.en)
                              ? 'border-purple-500 bg-purple-50 text-purple-700'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {language === 'ar' ? area.ar : area.en}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'ملاحظات إضافية' : 'Additional Notes'}
                    </label>
                    <textarea
                      value={vendorData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={language === 'ar' ? 'أي ملاحظات أو تفاصيل إضافية...' : 'Any additional notes or details...'}
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'الحالة' : 'Status'}
                    </label>
                    <select
                      value={vendorData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="active">{language === 'ar' ? 'نشط' : 'Active'}</option>
                      <option value="pending">{language === 'ar' ? 'قيد المراجعة' : 'Pending'}</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-6 flex gap-4 justify-end">
            <button
              type="button"
              onClick={() => router.push('/admin/vendors')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {language === 'ar' ? 'إضافة المورد' : 'Add Vendor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
