'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  ArrowLeft,
  Truck,
  Package,
  Construction,
  Container,
  Boxes,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  Hammer,
  ShoppingCart,
  Save,
  X,
  Upload,
  Plus,
  Trash2,
  Briefcase,
  CheckCircle,
  Search,
  Star,
} from 'lucide-react';

export default function NewVehiclePage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('basic');

  // Basic Information
  const [vehicleData, setVehicleData] = useState({
    // Basic Info
    category: 'jumbo',
    plateNumber: '',
    color: '',
    
    // Specifications
    capacity: '',
    capacityUnit: 'ton',
    fuelType: 'diesel',
    transmission: 'manual',
    enginePower: '',
    dimensions: {
      length: '',
      width: '',
      height: '',
    },
    
    // Ownership & Rental
    ownership: 'rental',
    selectedVendor: '',
    ownerName: '',
    ownerCompany: '',
    ownerPhone: '',
    ownerEmail: '',
    ownerAddress: '',
    ownerNationalId: '',
    ownerTaxId: '',
    
    // Rental Terms
    rentalRate: '',
    rentalPeriod: 'daily',
    contractStartDate: '',
    contractEndDate: '',
    contractNumber: '',
    securityDeposit: '',
    
    // Driver/Operator Information
    driverName: '',
    driverPhone: '',
    driverLicense: '',
    driverLicenseExpiry: '',
    driverNationalId: '',
    
    // Location & Status
    currentLocation: '',
    parkingLocation: '',
    status: 'available',
    
    // Work Order Assignment
    assignedWorkOrder: '',
    workOrderStartDate: '',
    workOrderEndDate: '',
    workOrderNotes: '',
    
    // Invoice Information
    invoiceNumber: '',
    invoiceDate: '',
    dueDate: '',
    paymentMethod: 'bank_transfer',
    paymentTerms: '30',
    
    // Additional Info
    features: [] as string[],
    notes: '',
  });

  const [newFeature, setNewFeature] = useState('');
  const [workOrderSearch, setWorkOrderSearch] = useState('');

  // Mock Vendors Data
  const availableVendors = [
    {
      id: 'VEN-001',
      name: language === 'ar' ? 'شركة النقل السريع' : 'Fast Transport Co.',
      contactPerson: language === 'ar' ? 'محمد أحمد' : 'Mohamed Ahmed',
      phone: '+20 100 123 4567',
      email: 'info@fasttransport.eg',
      address: language === 'ar' ? '25 شارع الجيش، مدينة نصر، القاهرة' : '25 El Geish St, Nasr City, Cairo',
      paymentTerms: '30',
      services: [language === 'ar' ? 'نقل بري' : 'Land Transport'],
      vehicleTypes: [language === 'ar' ? 'چامبو' : 'Jumbo', language === 'ar' ? 'تريلات' : 'Trailers'],
      rating: 4.5,
    },
    {
      id: 'VEN-002',
      name: language === 'ar' ? 'شركة المعدات الثقيلة' : 'Heavy Equipment Co.',
      contactPerson: language === 'ar' ? 'أحمد علي' : 'Ahmed Ali',
      phone: '+20 101 234 5678',
      email: 'contact@heavyequip.eg',
      address: language === 'ar' ? '15 طريق السويس، العبور' : '15 Suez Rd, Obour City',
      paymentTerms: '45',
      services: [language === 'ar' ? 'نقل بري' : 'Land Transport'],
      vehicleTypes: [language === 'ar' ? 'جرارات فرش' : 'Spreading Tractors', language === 'ar' ? 'كساحة' : 'Sweeper'],
      rating: 4.8,
    },
    {
      id: 'VEN-003',
      name: language === 'ar' ? 'شركة النقل المبرد' : 'Cold Transport Co.',
      contactPerson: language === 'ar' ? 'خالد محمود' : 'Khaled Mahmoud',
      phone: '+20 122 345 6789',
      email: 'info@coldtransport.eg',
      address: language === 'ar' ? '10 شارع الصناعة، السادس من أكتوبر' : '10 Industry St, 6th of October',
      paymentTerms: '15',
      services: [language === 'ar' ? 'نقل بري' : 'Land Transport'],
      vehicleTypes: [language === 'ar' ? 'چامبو براد صغير' : 'Small Cooler Jumbo', language === 'ar' ? 'چامبو براد كبير' : 'Large Cooler Jumbo'],
      rating: 4.2,
    },
    {
      id: 'VEN-004',
      name: language === 'ar' ? 'مؤسسة الجرارات المتطورة' : 'Advanced Tractors Est.',
      contactPerson: language === 'ar' ? 'عمر حسن' : 'Omar Hassan',
      phone: '+20 111 222 3333',
      email: 'support@advtractors.eg',
      address: language === 'ar' ? '5 المنطقة الصناعية، الشيخ زايد' : '5 Industrial Zone, Sheikh Zayed',
      paymentTerms: '60',
      services: [language === 'ar' ? 'نقل بري' : 'Land Transport'],
      vehicleTypes: [language === 'ar' ? 'جرارات كونتر' : 'Counter Tractors', language === 'ar' ? 'جرارات فرش' : 'Spreading Tractors'],
      rating: 4.7,
    },
  ];

  // Mock Work Orders Data
  const availableWorkOrders = [
    {
      id: 'WO-2025-001',
      title: language === 'ar' ? 'نقل مواد بناء - مشروع برج النيل' : 'Construction Materials Transport - Nile Tower Project',
      client: language === 'ar' ? 'شركة المقاولون العرب' : 'Arab Contractors',
      location: language === 'ar' ? 'القاهرة الجديدة' : 'New Cairo',
      startDate: '2025-11-15',
      endDate: '2025-12-15',
      status: 'pending',
      vehicleType: 'heavy-trucks',
      budget: 150000,
    },
    {
      id: 'WO-2025-002',
      title: language === 'ar' ? 'أعمال حفر - مشروع الطريق الدائري' : 'Excavation Work - Ring Road Project',
      client: language === 'ar' ? 'هيئة الطرق والكباري' : 'Roads and Bridges Authority',
      location: language === 'ar' ? '6 أكتوبر' : '6th October',
      startDate: '2025-11-20',
      endDate: '2026-01-20',
      status: 'pending',
      vehicleType: 'excavators',
      budget: 280000,
    },
    {
      id: 'WO-2025-003',
      title: language === 'ar' ? 'صب خرسانة - مجمع سكني' : 'Concrete Pouring - Residential Complex',
      client: language === 'ar' ? 'شركة التعمير والإسكان' : 'Development & Housing Co.',
      location: language === 'ar' ? 'الشيخ زايد' : 'Sheikh Zayed',
      startDate: '2025-11-18',
      endDate: '2025-12-18',
      status: 'pending',
      vehicleType: 'mixers',
      budget: 95000,
    },
    {
      id: 'WO-2025-004',
      title: language === 'ar' ? 'نقل معدات ثقيلة - ميناء الإسكندرية' : 'Heavy Equipment Transport - Alexandria Port',
      client: language === 'ar' ? 'شركة الموانئ المصرية' : 'Egyptian Ports Company',
      location: language === 'ar' ? 'الإسكندرية' : 'Alexandria',
      startDate: '2025-11-12',
      endDate: '2025-11-25',
      status: 'pending',
      vehicleType: 'trailers',
      budget: 120000,
    },
    {
      id: 'WO-2025-005',
      title: language === 'ar' ? 'رفع مواد - برج إداري' : 'Material Lifting - Administrative Tower',
      client: language === 'ar' ? 'مجموعة طلعت مصطفى' : 'Talaat Moustafa Group',
      location: language === 'ar' ? 'العاصمة الإدارية' : 'New Capital',
      startDate: '2025-11-25',
      endDate: '2026-02-25',
      status: 'pending',
      vehicleType: 'cranes',
      budget: 450000,
    },
    {
      id: 'WO-2025-006',
      title: language === 'ar' ? 'توصيل بضائع - سلسلة متاجر' : 'Goods Delivery - Retail Chain',
      client: language === 'ar' ? 'كارفور مصر' : 'Carrefour Egypt',
      location: language === 'ar' ? 'القاهرة والجيزة' : 'Cairo & Giza',
      startDate: '2025-11-10',
      endDate: '2026-11-10',
      status: 'active',
      vehicleType: 'vans',
      budget: 180000,
    },
    {
      id: 'WO-2025-007',
      title: language === 'ar' ? 'تسوية أرض - مشروع زراعي' : 'Land Leveling - Agricultural Project',
      client: language === 'ar' ? 'شركة الوادي للاستصلاح' : 'Valley Reclamation Co.',
      location: language === 'ar' ? 'الفيوم' : 'Fayoum',
      startDate: '2025-11-22',
      endDate: '2025-12-30',
      status: 'pending',
      vehicleType: 'bulldozers',
      budget: 210000,
    },
    {
      id: 'WO-2025-008',
      title: language === 'ar' ? 'نقل مواد غذائية - مصنع' : 'Food Materials Transport - Factory',
      client: language === 'ar' ? 'شركة جهينة للصناعات الغذائية' : 'Juhayna Food Industries',
      location: language === 'ar' ? 'العبور' : 'Obour City',
      startDate: '2025-11-14',
      endDate: '2026-05-14',
      status: 'pending',
      vehicleType: 'medium-trucks',
      budget: 165000,
    },
  ];

  const vehicleCategories = {
    'jumbo': { ar: 'چامبو', en: 'Jumbo', icon: Truck },
    'trailers': { ar: 'تريلات', en: 'Trailers', icon: Container },
    'spreading-tractors': { ar: 'جرارات فرش', en: 'Spreading Tractors', icon: Construction },
    'counter-tractors': { ar: 'جرارات كونتر', en: 'Counter Tractors', icon: Construction },
    'sweeper': { ar: 'كساحة', en: 'Sweeper', icon: Package },
    'jumbo-small-cooler': { ar: 'چامبو براد صغير', en: 'Jumbo Small Cooler', icon: Boxes },
    'jumbo-large-cooler': { ar: 'چامبو براد كبير', en: 'Jumbo Large Cooler', icon: Building2 },
  };

  const handleInputChange = (field: string, value: any) => {
    setVehicleData(prev => ({ ...prev, [field]: value }));
  };

  const handleDimensionChange = (dim: string, value: string) => {
    setVehicleData(prev => ({
      ...prev,
      dimensions: { ...prev.dimensions, [dim]: value }
    }));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setVehicleData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setVehicleData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleVendorSelect = (vendorId: string) => {
    const vendor = availableVendors.find(v => v.id === vendorId);
    if (vendor) {
      // Generate invoice number
      const invoiceNum = `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}`;
      const today = new Date().toISOString().split('T')[0];
      
      // Calculate due date based on payment terms
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + parseInt(vendor.paymentTerms));
      const dueDateStr = dueDate.toISOString().split('T')[0];
      
      setVehicleData(prev => ({
        ...prev,
        selectedVendor: vendorId,
        ownerName: vendor.contactPerson,
        ownerCompany: vendor.name,
        ownerPhone: vendor.phone,
        ownerEmail: vendor.email,
        ownerAddress: vendor.address,
        paymentTerms: vendor.paymentTerms,
        invoiceNumber: invoiceNum,
        invoiceDate: today,
        dueDate: dueDateStr,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate unique vehicle ID
    const vehicleId = `V-${String(Math.floor(Math.random() * 9999) + 1).padStart(3, '0')}`;
    
    // Prepare vehicle object
    const newVehicle = {
      id: vehicleId,
      plateNumber: vehicleData.plateNumber,
      category: vehicleData.category,
      type: language === 'ar' 
        ? vehicleCategories[vehicleData.category as keyof typeof vehicleCategories].ar 
        : vehicleCategories[vehicleData.category as keyof typeof vehicleCategories].en,
      capacity: `${vehicleData.capacity} ${vehicleData.capacityUnit === 'ton' ? (language === 'ar' ? 'طن' : 'ton') : vehicleData.capacityUnit}`,
      ownership: vehicleData.ownership,
      status: vehicleData.status,
      rentalRate: parseFloat(vehicleData.rentalRate) || 0,
      rentalPeriod: vehicleData.rentalPeriod === 'daily' 
        ? (language === 'ar' ? 'يومي' : 'Daily')
        : vehicleData.rentalPeriod === 'weekly'
        ? (language === 'ar' ? 'أسبوعي' : 'Weekly')
        : vehicleData.rentalPeriod === 'monthly'
        ? (language === 'ar' ? 'شهري' : 'Monthly')
        : (language === 'ar' ? 'سنوي' : 'Yearly'),
      driver: {
        name: vehicleData.driverName || (language === 'ar' ? 'غير محدد' : 'Not Assigned'),
        phone: vehicleData.driverPhone || '',
        license: vehicleData.driverLicense || '',
        rating: 0,
      },
      owner: {
        name: vehicleData.ownerCompany || vehicleData.ownerName,
        phone: vehicleData.ownerPhone,
        type: vehicleData.ownership === 'rental' ? 'external' : 'company',
      },
      currentLocation: vehicleData.currentLocation || (language === 'ar' ? 'غير محدد' : 'Not Specified'),
      lastService: new Date().toISOString().split('T')[0],
      fuelType: vehicleData.fuelType,
      color: vehicleData.color,
      contractStartDate: vehicleData.contractStartDate,
      contractEndDate: vehicleData.contractEndDate,
      features: vehicleData.features,
      nextService: null,
      insurance: null,
      license: null,
      fuel: 100,
      mileage: 0,
      earnings: 0,
      invoice: vehicleData.ownership === 'rental' && vehicleData.selectedVendor ? {
        invoiceNumber: vehicleData.invoiceNumber,
        invoiceDate: vehicleData.invoiceDate,
        dueDate: vehicleData.dueDate,
        paymentMethod: vehicleData.paymentMethod,
        paymentTerms: vehicleData.paymentTerms,
        amount: vehicleData.rentalRate,
        period: vehicleData.rentalPeriod,
      } : null,
    };
    
    // Get existing vehicles from localStorage
    const existingVehicles = JSON.parse(localStorage.getItem('vehicles') || '[]');
    
    // Add new vehicle
    existingVehicles.push(newVehicle);
    
    // Save to localStorage
    localStorage.setItem('vehicles', JSON.stringify(existingVehicles));
    
    console.log('Vehicle Data:', vehicleData);
    console.log('Saved Vehicle:', newVehicle);
    
    alert(language === 'ar' 
      ? `تم إضافة المركبة بنجاح!\nرقم المركبة: ${vehicleId}\n${vehicleData.invoiceNumber ? `رقم الفاتورة: ${vehicleData.invoiceNumber}\nتاريخ الاستحقاق: ${vehicleData.dueDate}` : ''}` 
      : `Vehicle added successfully!\nVehicle ID: ${vehicleId}\n${vehicleData.invoiceNumber ? `Invoice Number: ${vehicleData.invoiceNumber}\nDue Date: ${vehicleData.dueDate}` : ''}`
    );
    router.push('/admin/vehicles');
  };

  const filteredWorkOrders = availableWorkOrders.filter(wo => 
    wo.id.toLowerCase().includes(workOrderSearch.toLowerCase()) ||
    wo.title.toLowerCase().includes(workOrderSearch.toLowerCase()) ||
    wo.client.toLowerCase().includes(workOrderSearch.toLowerCase()) ||
    wo.location.toLowerCase().includes(workOrderSearch.toLowerCase())
  );

  const selectedWorkOrder = availableWorkOrders.find(wo => wo.id === vehicleData.assignedWorkOrder);

  const tabs = [
    { id: 'basic', label: language === 'ar' ? 'المعلومات الأساسية' : 'Basic Information', icon: Truck },
    { id: 'specs', label: language === 'ar' ? 'المواصفات التقنية' : 'Technical Specs', icon: FileText },
    { id: 'owner', label: language === 'ar' ? 'بيانات المالك' : 'Owner Information', icon: User },
    { id: 'rental', label: language === 'ar' ? 'شروط الإيجار' : 'Rental Terms', icon: DollarSign },
    { id: 'driver', label: language === 'ar' ? 'بيانات السائق/المشغل' : 'Driver/Operator', icon: User },
    { id: 'workorder', label: language === 'ar' ? 'ربط بأمر عمل' : 'Link to Work Order', icon: Briefcase },
    { id: 'location', label: language === 'ar' ? 'الموقع والحالة' : 'Location & Status', icon: MapPin },
  ];

  return (
    <div className={`min-h-screen bg-gray-50 ${language === 'ar' ? 'font-arabic' : 'font-inter'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/admin/vehicles')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{language === 'ar' ? 'العودة للأسطول' : 'Back to Fleet'}</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'ar' ? 'إضافة مركبة/معدة جديدة' : 'Add New Vehicle/Equipment'}
          </h1>
          <p className="text-gray-600">
            {language === 'ar'
              ? 'أدخل جميع البيانات المطلوبة لإضافة المركبة أو المعدة للأسطول'
              : 'Enter all required information to add vehicle or equipment to the fleet'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Tabs Navigation */}
          <div className="bg-white rounded-lg shadow-sm border mb-6 overflow-x-auto">
            <div className="flex gap-1 p-2 min-w-max">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            {/* Basic Information Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  {language === 'ar' ? 'المعلومات الأساسية' : 'Basic Information'}
                </h2>

                {/* Vehicle Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {language === 'ar' ? 'نوع المركبة/المعدة *' : 'Vehicle/Equipment Type *'}
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {Object.entries(vehicleCategories).map(([key, cat]) => {
                      const Icon = cat.icon;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => handleInputChange('category', key)}
                          className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                            vehicleData.category === key
                              ? 'border-blue-600 bg-blue-50 text-blue-900'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Icon className="w-6 h-6" />
                          <span className="text-xs font-medium text-center">
                            {language === 'ar' ? cat.ar : cat.en}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Plate Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'رقم اللوحة *' : 'Plate Number *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={vehicleData.plateNumber}
                      onChange={(e) => handleInputChange('plateNumber', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={language === 'ar' ? 'ق أ ح 1234' : 'ABC 1234'}
                    />
                  </div>

                  {/* Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'اللون' : 'Color'}
                    </label>
                    <input
                      type="text"
                      value={vehicleData.color}
                      onChange={(e) => handleInputChange('color', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={language === 'ar' ? 'أبيض، أزرق، أصفر' : 'White, Blue, Yellow'}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Technical Specifications Tab */}
            {activeTab === 'specs' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  {language === 'ar' ? 'المواصفات التقنية' : 'Technical Specifications'}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Capacity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'الحمولة/السعة *' : 'Capacity *'}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={vehicleData.capacity}
                        onChange={(e) => handleInputChange('capacity', e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="25"
                      />
                      <select
                        value={vehicleData.capacityUnit}
                        onChange={(e) => handleInputChange('capacityUnit', e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="ton">{language === 'ar' ? 'طن' : 'Ton'}</option>
                        <option value="cubic_meter">{language === 'ar' ? 'متر مكعب' : 'Cubic Meter'}</option>
                        <option value="pallets">{language === 'ar' ? 'منصات' : 'Pallets'}</option>
                      </select>
                    </div>
                  </div>

                  {/* Fuel Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'نوع الوقود *' : 'Fuel Type *'}
                    </label>
                    <select
                      required
                      value={vehicleData.fuelType}
                      onChange={(e) => handleInputChange('fuelType', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="diesel">{language === 'ar' ? 'ديزل' : 'Diesel'}</option>
                      <option value="petrol">{language === 'ar' ? 'بنزين' : 'Petrol'}</option>
                      <option value="electric">{language === 'ar' ? 'كهربائي' : 'Electric'}</option>
                      <option value="hybrid">{language === 'ar' ? 'هجين' : 'Hybrid'}</option>
                      <option value="cng">{language === 'ar' ? 'غاز طبيعي' : 'CNG'}</option>
                    </select>
                  </div>

                  {/* Transmission */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'ناقل الحركة' : 'Transmission'}
                    </label>
                    <select
                      value={vehicleData.transmission}
                      onChange={(e) => handleInputChange('transmission', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="manual">{language === 'ar' ? 'يدوي' : 'Manual'}</option>
                      <option value="automatic">{language === 'ar' ? 'أوتوماتيك' : 'Automatic'}</option>
                      <option value="semi-automatic">{language === 'ar' ? 'نصف أوتوماتيك' : 'Semi-Automatic'}</option>
                    </select>
                  </div>

                  {/* Engine Power */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'قوة المحرك (حصان)' : 'Engine Power (HP)'}
                    </label>
                    <input
                      type="number"
                      value={vehicleData.enginePower}
                      onChange={(e) => handleInputChange('enginePower', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="450"
                    />
                  </div>
                </div>

                {/* Dimensions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {language === 'ar' ? 'الأبعاد (متر)' : 'Dimensions (meters)'}
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <input
                        type="text"
                        value={vehicleData.dimensions.length}
                        onChange={(e) => handleDimensionChange('length', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={language === 'ar' ? 'الطول' : 'Length'}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={vehicleData.dimensions.width}
                        onChange={(e) => handleDimensionChange('width', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={language === 'ar' ? 'العرض' : 'Width'}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={vehicleData.dimensions.height}
                        onChange={(e) => handleDimensionChange('height', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={language === 'ar' ? 'الارتفاع' : 'Height'}
                      />
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'المميزات والمعدات' : 'Features & Equipment'}
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={language === 'ar' ? 'أضف ميزة...' : 'Add feature...'}
                    />
                    <button
                      type="button"
                      onClick={addFeature}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {vehicleData.features.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="hover:text-blue-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Owner Information Tab */}
            {activeTab === 'owner' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  {language === 'ar' ? 'بيانات المالك' : 'Owner Information'}
                </h2>

                {/* Ownership Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {language === 'ar' ? 'نوع الملكية *' : 'Ownership Type *'}
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => handleInputChange('ownership', 'owned')}
                      className={`flex items-center justify-center gap-2 p-4 border-2 rounded-lg transition-colors ${
                        vehicleData.ownership === 'owned'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <Building2 className="w-5 h-5" />
                      <span className="font-medium">{language === 'ar' ? 'ملك' : 'Owned'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange('ownership', 'rental')}
                      className={`flex items-center justify-center gap-2 p-4 border-2 rounded-lg transition-colors ${
                        vehicleData.ownership === 'rental'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <DollarSign className="w-5 h-5" />
                      <span className="font-medium">{language === 'ar' ? 'إيجار' : 'Rental'}</span>
                    </button>
                  </div>
                </div>

                {/* Vendor Selection (for Rental) */}
                {vehicleData.ownership === 'rental' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      {language === 'ar' ? 'اختر المورد *' : 'Select Vendor *'}
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      {availableVendors.map((vendor) => (
                        <button
                          key={vendor.id}
                          type="button"
                          onClick={() => handleVendorSelect(vendor.id)}
                          className={`flex items-center justify-between p-4 border-2 rounded-lg transition-all text-left ${
                            vehicleData.selectedVendor === vendor.id
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Building2 className="w-5 h-5 text-gray-600" />
                              <div>
                                <h3 className="font-bold text-gray-900">{vendor.name}</h3>
                                <p className="text-sm text-gray-600">{vendor.id}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                <span>{vendor.contactPerson}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Phone className="w-4 h-4" />
                                <span>{vendor.phone}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{language === 'ar' ? 'شروط الدفع:' : 'Payment Terms:'} {vendor.paymentTerms} {language === 'ar' ? 'يوم' : 'days'}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span>{vendor.rating}</span>
                              </div>
                            </div>
                          </div>
                          {vehicleData.selectedVendor === vendor.id && (
                            <CheckCircle className="w-6 h-6 text-green-500" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Owner Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'اسم المالك *' : 'Owner Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={vehicleData.ownerName}
                      onChange={(e) => handleInputChange('ownerName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                      placeholder={language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                      readOnly={vehicleData.ownership === 'rental' && !!vehicleData.selectedVendor}
                    />
                  </div>

                  {/* Owner Company */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'اسم الشركة *' : 'Company Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={vehicleData.ownerCompany}
                      onChange={(e) => handleInputChange('ownerCompany', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                      placeholder={language === 'ar' ? 'اسم الشركة' : 'Company Name'}
                      readOnly={vehicleData.ownership === 'rental' && !!vehicleData.selectedVendor}
                    />
                  </div>

                  {/* Owner Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'رقم الهاتف *' : 'Phone Number *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={vehicleData.ownerPhone}
                      onChange={(e) => handleInputChange('ownerPhone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                      placeholder="+20 123 456 7890"
                      readOnly={vehicleData.ownership === 'rental' && !!vehicleData.selectedVendor}
                    />
                  </div>

                  {/* Owner Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                    </label>
                    <input
                      type="email"
                      value={vehicleData.ownerEmail}
                      onChange={(e) => handleInputChange('ownerEmail', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                      placeholder="email@example.com"
                      readOnly={vehicleData.ownership === 'rental' && !!vehicleData.selectedVendor}
                    />
                  </div>

                  {/* National ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'رقم البطاقة/الهوية' : 'National ID'}
                    </label>
                    <input
                      type="text"
                      value={vehicleData.ownerNationalId}
                      onChange={(e) => handleInputChange('ownerNationalId', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="29012345678901"
                    />
                  </div>

                  {/* Tax ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'الرقم الضريبي' : 'Tax ID'}
                    </label>
                    <input
                      type="text"
                      value={vehicleData.ownerTaxId}
                      onChange={(e) => handleInputChange('ownerTaxId', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="123-456-789"
                    />
                  </div>
                </div>

                {/* Owner Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'العنوان الكامل' : 'Full Address'}
                  </label>
                  <textarea
                    value={vehicleData.ownerAddress}
                    onChange={(e) => handleInputChange('ownerAddress', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                    placeholder={language === 'ar' ? 'العنوان الكامل للمالك' : 'Owner full address'}
                    readOnly={vehicleData.ownership === 'rental' && !!vehicleData.selectedVendor}
                  />
                </div>

                {/* Invoice Information (Auto-generated for Rental) */}
                {vehicleData.ownership === 'rental' && vehicleData.selectedVendor && (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mt-6">
                    <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      {language === 'ar' ? 'معلومات الفاتورة (تم الإنشاء تلقائياً)' : 'Invoice Information (Auto-generated)'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-blue-900 mb-1">
                          {language === 'ar' ? 'رقم الفاتورة' : 'Invoice Number'}
                        </label>
                        <p className="text-blue-800 font-mono bg-white px-3 py-2 rounded border border-blue-200">
                          {vehicleData.invoiceNumber}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-900 mb-1">
                          {language === 'ar' ? 'تاريخ الإصدار' : 'Invoice Date'}
                        </label>
                        <p className="text-blue-800 font-mono bg-white px-3 py-2 rounded border border-blue-200">
                          {vehicleData.invoiceDate}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-900 mb-1">
                          {language === 'ar' ? 'تاريخ الاستحقاق' : 'Due Date'}
                        </label>
                        <p className="text-blue-800 font-mono bg-white px-3 py-2 rounded border border-blue-200">
                          {vehicleData.dueDate}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-900 mb-1">
                          {language === 'ar' ? 'شروط الدفع' : 'Payment Terms'}
                        </label>
                        <p className="text-blue-800 font-mono bg-white px-3 py-2 rounded border border-blue-200">
                          {vehicleData.paymentTerms} {language === 'ar' ? 'يوم' : 'days'}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-blue-900 mb-1">
                          {language === 'ar' ? 'طريقة الدفع' : 'Payment Method'}
                        </label>
                        <select
                          value={vehicleData.paymentMethod}
                          onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                          className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                          <option value="bank_transfer">{language === 'ar' ? 'تحويل بنكي' : 'Bank Transfer'}</option>
                          <option value="cash">{language === 'ar' ? 'نقدي' : 'Cash'}</option>
                          <option value="check">{language === 'ar' ? 'شيك' : 'Check'}</option>
                          <option value="credit_card">{language === 'ar' ? 'بطاقة ائتمان' : 'Credit Card'}</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
                      <p className="text-sm text-green-800 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        {language === 'ar' 
                          ? 'سيتم إنشاء الفاتورة تلقائياً عند حفظ المركبة' 
                          : 'Invoice will be created automatically when vehicle is saved'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Rental Terms Tab */}
            {activeTab === 'rental' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  {language === 'ar' ? 'شروط الإيجار' : 'Rental Terms'}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Rental Rate */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'قيمة الإيجار *' : 'Rental Rate *'}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        required
                        value={vehicleData.rentalRate}
                        onChange={(e) => handleInputChange('rentalRate', e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="3500"
                      />
                      <select
                        value={vehicleData.rentalPeriod}
                        onChange={(e) => handleInputChange('rentalPeriod', e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="daily">{language === 'ar' ? 'يومي' : 'Daily'}</option>
                        <option value="weekly">{language === 'ar' ? 'أسبوعي' : 'Weekly'}</option>
                        <option value="monthly">{language === 'ar' ? 'شهري' : 'Monthly'}</option>
                        <option value="yearly">{language === 'ar' ? 'سنوي' : 'Yearly'}</option>
                      </select>
                    </div>
                  </div>

                  {/* Contract Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'رقم العقد' : 'Contract Number'}
                    </label>
                    <input
                      type="text"
                      value={vehicleData.contractNumber}
                      onChange={(e) => handleInputChange('contractNumber', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="CNT-2025-001"
                    />
                  </div>

                  {/* Contract Start Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'تاريخ بداية العقد *' : 'Contract Start Date *'}
                    </label>
                    <input
                      type="date"
                      required
                      value={vehicleData.contractStartDate}
                      onChange={(e) => handleInputChange('contractStartDate', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Contract End Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'تاريخ نهاية العقد *' : 'Contract End Date *'}
                    </label>
                    <input
                      type="date"
                      required
                      value={vehicleData.contractEndDate}
                      onChange={(e) => handleInputChange('contractEndDate', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Security Deposit */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'التأمين النقدي' : 'Security Deposit'}
                    </label>
                    <input
                      type="number"
                      value={vehicleData.securityDeposit}
                      onChange={(e) => handleInputChange('securityDeposit', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="10000"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Driver/Operator Tab */}
            {activeTab === 'driver' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  {language === 'ar' ? 'بيانات السائق/المشغل' : 'Driver/Operator Information'}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Driver Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'اسم السائق/المشغل *' : 'Driver/Operator Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={vehicleData.driverName}
                      onChange={(e) => handleInputChange('driverName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                    />
                  </div>

                  {/* Driver Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'رقم الهاتف *' : 'Phone Number *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={vehicleData.driverPhone}
                      onChange={(e) => handleInputChange('driverPhone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+20 123 456 7890"
                    />
                  </div>

                  {/* Driver License */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'رقم الرخصة *' : 'License Number *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={vehicleData.driverLicense}
                      onChange={(e) => handleInputChange('driverLicense', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="DL123456"
                    />
                  </div>

                  {/* License Expiry */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'تاريخ انتهاء الرخصة *' : 'License Expiry Date *'}
                    </label>
                    <input
                      type="date"
                      required
                      value={vehicleData.driverLicenseExpiry}
                      onChange={(e) => handleInputChange('driverLicenseExpiry', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* National ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'رقم البطاقة/الهوية' : 'National ID'}
                    </label>
                    <input
                      type="text"
                      value={vehicleData.driverNationalId}
                      onChange={(e) => handleInputChange('driverNationalId', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="29012345678901"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Work Order Assignment Tab */}
            {activeTab === 'workorder' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  {language === 'ar' ? 'ربط المركبة بأمر عمل' : 'Link Vehicle to Work Order'}
                </h2>

                {/* Search Work Orders */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'البحث في أوامر العمل' : 'Search Work Orders'}
                  </label>
                  <div className="relative">
                    <Search className={`absolute ${language === 'ar' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5`} />
                    <input
                      type="text"
                      value={workOrderSearch}
                      onChange={(e) => setWorkOrderSearch(e.target.value)}
                      className={`w-full ${language === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder={language === 'ar' ? 'ابحث برقم الأمر، العنوان، العميل، أو الموقع...' : 'Search by order number, title, client, or location...'}
                    />
                  </div>
                </div>

                {/* Selected Work Order Display */}
                {selectedWorkOrder && (
                  <div className="p-4 bg-green-50 border-2 border-green-500 rounded-lg mb-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <h3 className="font-bold text-green-900">
                          {language === 'ar' ? 'أمر العمل المختار' : 'Selected Work Order'}
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleInputChange('assignedWorkOrder', '')}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">{language === 'ar' ? 'رقم الأمر:' : 'Order Number:'}</p>
                        <p className="font-semibold text-gray-900">{selectedWorkOrder.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{language === 'ar' ? 'العميل:' : 'Client:'}</p>
                        <p className="font-semibold text-gray-900">{selectedWorkOrder.client}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-gray-600">{language === 'ar' ? 'العنوان:' : 'Title:'}</p>
                        <p className="font-semibold text-gray-900">{selectedWorkOrder.title}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{language === 'ar' ? 'الموقع:' : 'Location:'}</p>
                        <p className="font-semibold text-gray-900">{selectedWorkOrder.location}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{language === 'ar' ? 'الميزانية:' : 'Budget:'}</p>
                        <p className="font-semibold text-gray-900">{selectedWorkOrder.budget.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{language === 'ar' ? 'تاريخ البداية:' : 'Start Date:'}</p>
                        <p className="font-semibold text-gray-900">{selectedWorkOrder.startDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{language === 'ar' ? 'تاريخ النهاية:' : 'End Date:'}</p>
                        <p className="font-semibold text-gray-900">{selectedWorkOrder.endDate}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Work Orders List */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    {language === 'ar' ? 'أوامر العمل المتاحة' : 'Available Work Orders'} ({filteredWorkOrders.length})
                  </h3>
                  <div className="max-h-96 overflow-y-auto space-y-3">
                    {filteredWorkOrders.map((workOrder) => (
                      <div
                        key={workOrder.id}
                        onClick={() => handleInputChange('assignedWorkOrder', workOrder.id)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          vehicleData.assignedWorkOrder === workOrder.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                                {workOrder.id}
                              </span>
                              <span className={`px-2 py-1 text-xs font-semibold rounded ${
                                workOrder.status === 'active' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {workOrder.status === 'active' 
                                  ? (language === 'ar' ? 'نشط' : 'Active')
                                  : (language === 'ar' ? 'معلق' : 'Pending')
                                }
                              </span>
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">{workOrder.title}</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-gray-600">{language === 'ar' ? 'العميل:' : 'Client:'} </span>
                                <span className="text-gray-900">{workOrder.client}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">{language === 'ar' ? 'الموقع:' : 'Location:'} </span>
                                <span className="text-gray-900">{workOrder.location}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">{language === 'ar' ? 'من:' : 'From:'} </span>
                                <span className="text-gray-900">{workOrder.startDate}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">{language === 'ar' ? 'إلى:' : 'To:'} </span>
                                <span className="text-gray-900">{workOrder.endDate}</span>
                              </div>
                            </div>
                            <div className="mt-2">
                              <span className="text-sm font-semibold text-blue-900">
                                {language === 'ar' ? 'الميزانية:' : 'Budget:'} {workOrder.budget.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
                              </span>
                            </div>
                          </div>
                          {vehicleData.assignedWorkOrder === workOrder.id && (
                            <CheckCircle className="w-6 h-6 text-blue-600" />
                          )}
                        </div>
                      </div>
                    ))}
                    {filteredWorkOrders.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        {language === 'ar' ? 'لا توجد أوامر عمل متطابقة' : 'No matching work orders found'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Work Order Assignment Details */}
                {vehicleData.assignedWorkOrder && (
                  <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      {language === 'ar' ? 'تفاصيل التعيين' : 'Assignment Details'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'ar' ? 'تاريخ بداية الاستخدام' : 'Usage Start Date'}
                        </label>
                        <input
                          type="date"
                          value={vehicleData.workOrderStartDate}
                          onChange={(e) => handleInputChange('workOrderStartDate', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'ar' ? 'تاريخ نهاية الاستخدام' : 'Usage End Date'}
                        </label>
                        <input
                          type="date"
                          value={vehicleData.workOrderEndDate}
                          onChange={(e) => handleInputChange('workOrderEndDate', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'ar' ? 'ملاحظات الاستخدام' : 'Usage Notes'}
                        </label>
                        <textarea
                          value={vehicleData.workOrderNotes}
                          onChange={(e) => handleInputChange('workOrderNotes', e.target.value)}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={language === 'ar' ? 'أي ملاحظات خاصة بهذا الأمر...' : 'Any notes specific to this order...'}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Location & Status Tab */}
            {activeTab === 'location' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  {language === 'ar' ? 'الموقع والحالة' : 'Location & Status'}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Current Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'الموقع الحالي' : 'Current Location'}
                    </label>
                    <input
                      type="text"
                      value={vehicleData.currentLocation}
                      onChange={(e) => handleInputChange('currentLocation', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={language === 'ar' ? 'القاهرة - مدينة نصر' : 'Cairo - Nasr City'}
                    />
                  </div>

                  {/* Parking Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'موقع الانتظار' : 'Parking Location'}
                    </label>
                    <input
                      type="text"
                      value={vehicleData.parkingLocation}
                      onChange={(e) => handleInputChange('parkingLocation', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={language === 'ar' ? 'موقف الشركة الرئيسي' : 'Main Company Parking'}
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'الحالة *' : 'Status *'}
                    </label>
                    <select
                      required
                      value={vehicleData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="available">{language === 'ar' ? 'متاح' : 'Available'}</option>
                      <option value="in-transit">{language === 'ar' ? 'في العمل' : 'Active'}</option>
                      <option value="maintenance">{language === 'ar' ? 'صيانة' : 'Maintenance'}</option>
                      <option value="offline">{language === 'ar' ? 'غير متاح' : 'Offline'}</option>
                    </select>
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'ملاحظات إضافية' : 'Additional Notes'}
                  </label>
                  <textarea
                    value={vehicleData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={language === 'ar' ? 'أي ملاحظات أو معلومات إضافية...' : 'Any additional notes or information...'}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={() => router.push('/admin/vehicles')}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="w-5 h-5" />
              <span>{language === 'ar' ? 'إلغاء' : 'Cancel'}</span>
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-5 h-5" />
              <span>{language === 'ar' ? 'حفظ المركبة/المعدة' : 'Save Vehicle/Equipment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
