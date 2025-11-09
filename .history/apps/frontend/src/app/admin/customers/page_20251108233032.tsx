'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Users,
  Building,
  Phone,
  Mail,
  MapPin,
  Star,
  Search,
  Plus,
  Filter,
  Edit,
  Eye,
  FileText,
  CreditCard,
  Calendar,
  Package,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';

export default function CustomersPage() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('customers');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Sample data
  const customers = [
    {
      id: 'CUS-001',
      name: language === 'ar' ? 'شركة النصر للتجارة' : 'Al-Nasr Trading Company',
      type: 'company',
      contactPerson: language === 'ar' ? 'أحمد محمد علي' : 'Ahmed Mohamed Ali',
      phone: '+201234567890',
      email: 'info@alnasr-trading.com',
      address:
        language === 'ar'
          ? 'القاهرة - مدينة نصر - شارع الطيران'
          : 'Cairo - Nasr City - Aviation Street',
      status: 'active',
      rating: 4.8,
      totalOrders: 45,
      totalValue: 1250000,
      lastOrder: '2024-11-05',
      creditLimit: 500000,
      outstandingBalance: 125000,
      paymentTerms: '30 days',
      services: [
        language === 'ar' ? 'نقل بري' : 'Land Transport',
        language === 'ar' ? 'تخليص جمركي' : 'Customs Clearance',
      ],
    },
    {
      id: 'CUS-002',
      name: language === 'ar' ? 'المجموعة المتحدة للاستيراد' : 'United Import Group',
      type: 'company',
      contactPerson: language === 'ar' ? 'فاطمة أحمد حسن' : 'Fatma Ahmed Hassan',
      phone: '+201987654321',
      email: 'contact@united-import.com',
      address:
        language === 'ar'
          ? 'الإسكندرية - الدخيلة - المنطقة الصناعية'
          : 'Alexandria - Dekheila - Industrial Zone',
      status: 'active',
      rating: 4.6,
      totalOrders: 32,
      totalValue: 850000,
      lastOrder: '2024-11-08',
      creditLimit: 300000,
      outstandingBalance: 75000,
      paymentTerms: '15 days',
      services: [
        language === 'ar' ? 'نقل بحري' : 'Sea Transport',
        language === 'ar' ? 'تخزين' : 'Storage',
      ],
    },
    {
      id: 'CUS-003',
      name: language === 'ar' ? 'مؤسسة الشرق الأوسط' : 'Middle East Corporation',
      type: 'company',
      contactPerson: language === 'ar' ? 'خالد محمود سليم' : 'Khaled Mahmoud Salim',
      phone: '+201555444333',
      email: 'info@middle-east-corp.com',
      address:
        language === 'ar'
          ? 'الجيزة - الشيخ زايد - المنطقة التجارية'
          : 'Giza - Sheikh Zayed - Commercial District',
      status: 'pending',
      rating: 4.2,
      totalOrders: 18,
      totalValue: 420000,
      lastOrder: '2024-10-28',
      creditLimit: 200000,
      outstandingBalance: 45000,
      paymentTerms: '7 days',
      services: [language === 'ar' ? 'نقل خاص' : 'Special Transport'],
    },
  ];

  const vendors = [
    {
      id: 'VEN-001',
      name: language === 'ar' ? 'شركة النقل المتطور' : 'Advanced Transport Company',
      type: 'transport',
      contactPerson: language === 'ar' ? 'محمد علي حسن' : 'Mohamed Ali Hassan',
      phone: '+201234567890',
      email: 'info@advanced-transport.com',
      address: language === 'ar' ? 'القاهرة - التجمع الخامس' : 'Cairo - New Cairo',
      status: 'active',
      rating: 4.9,
      vehicleCount: 15,
      totalContracts: 28,
      contractValue: 2100000,
      lastPayment: '2024-11-07',
      services: [
        language === 'ar' ? 'نقل ثقيل' : 'Heavy Transport',
        language === 'ar' ? 'نقل متخصص' : 'Specialized Transport',
      ],
      performance: 95,
    },
    {
      id: 'VEN-002',
      name: language === 'ar' ? 'مؤسسة الشحن السريع' : 'Fast Shipping Corporation',
      type: 'logistics',
      contactPerson: language === 'ar' ? 'سارة محمد أحمد' : 'Sara Mohamed Ahmed',
      phone: '+201987654321',
      email: 'contact@fast-shipping.com',
      address: language === 'ar' ? 'الإسكندرية - محطة مصر' : 'Alexandria - Misr Station',
      status: 'active',
      rating: 4.7,
      vehicleCount: 8,
      totalContracts: 42,
      contractValue: 1650000,
      lastPayment: '2024-11-06',
      services: [
        language === 'ar' ? 'نقل سريع' : 'Express Delivery',
        language === 'ar' ? 'تخزين' : 'Warehousing',
      ],
      performance: 88,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      active: language === 'ar' ? 'نشط' : 'Active',
      pending: language === 'ar' ? 'قيد المراجعة' : 'Pending',
      suspended: language === 'ar' ? 'معلق' : 'Suspended',
      inactive: language === 'ar' ? 'غير نشط' : 'Inactive',
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vendor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className={`min-h-screen bg-gray-50 ${language === 'ar' ? 'font-arabic' : 'font-inter'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'ar' ? 'إدارة العملاء والموردين' : 'Customer & Vendor Management'}
          </h1>
          <p className="text-gray-600">
            {language === 'ar'
              ? 'إدارة العملاء والموردين ومتابعة المعاملات التجارية'
              : 'Manage customers, vendors, and track business relationships'}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-500" />
              <div className={`${language === 'ar' ? 'mr-4' : 'ml-4'}`}>
                <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
                <p className="text-sm text-gray-600">
                  {language === 'ar' ? 'إجمالي العملاء' : 'Total Customers'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Building className="w-8 h-8 text-green-500" />
              <div className={`${language === 'ar' ? 'mr-4' : 'ml-4'}`}>
                <p className="text-2xl font-bold text-gray-900">{vendors.length}</p>
                <p className="text-sm text-gray-600">
                  {language === 'ar' ? 'إجمالي الموردين' : 'Total Vendors'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <CreditCard className="w-8 h-8 text-orange-500" />
              <div className={`${language === 'ar' ? 'mr-4' : 'ml-4'}`}>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(customers.reduce((sum, c) => sum + c.totalValue, 0))}
                </p>
                <p className="text-sm text-gray-600">
                  {language === 'ar' ? 'إجمالي مبيعات العملاء' : 'Total Customer Sales'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-purple-500" />
              <div className={`${language === 'ar' ? 'mr-4' : 'ml-4'}`}>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(vendors.reduce((sum, v) => sum + v.contractValue, 0))}
                </p>
                <p className="text-sm text-gray-600">
                  {language === 'ar' ? 'قيمة عقود الموردين' : 'Vendor Contract Value'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="flex">
            <button
              onClick={() => setActiveTab('customers')}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'customers'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {language === 'ar' ? 'العملاء' : 'Customers'}
            </button>
            <button
              onClick={() => setActiveTab('vendors')}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'vendors'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {language === 'ar' ? 'الموردون' : 'Vendors'}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search
                  className={`absolute ${language === 'ar' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5`}
                />
                <input
                  type="text"
                  placeholder={language === 'ar' ? 'البحث...' : 'Search...'}
                  className={`w-full ${language === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  aria-label={language === 'ar' ? 'تصفية حسب النوع' : 'Filter by type'}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">{language === 'ar' ? 'جميع الحالات' : 'All Status'}</option>
                  <option value="active">{language === 'ar' ? 'نشط' : 'Active'}</option>
                  <option value="pending">{language === 'ar' ? 'قيد المراجعة' : 'Pending'}</option>
                  <option value="suspended">{language === 'ar' ? 'معلق' : 'Suspended'}</option>
                </select>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              {activeTab === 'customers'
                ? language === 'ar'
                  ? 'إضافة عميل'
                  : 'Add Customer'
                : language === 'ar'
                  ? 'إضافة مورد'
                  : 'Add Vendor'}
            </button>
          </div>
        </div>

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{customer.name}</h3>
                      <p className="text-sm text-gray-500">{customer.id}</p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}
                    >
                      {getStatusText(customer.status)}
                    </span>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{customer.contactPerson}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{customer.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{customer.email}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <span className="text-gray-700">{customer.address}</span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-900">{customer.rating}</span>
                    <span className="text-sm text-gray-500">
                      ({customer.totalOrders} {language === 'ar' ? 'طلب' : 'orders'})
                    </span>
                  </div>

                  {/* Financial Info */}
                  <div className="space-y-2 mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {language === 'ar' ? 'إجمالي القيمة:' : 'Total Value:'}
                      </span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(customer.totalValue)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {language === 'ar' ? 'الرصيد المستحق:' : 'Outstanding:'}
                      </span>
                      <span className="font-medium text-red-600">
                        {formatCurrency(customer.outstandingBalance)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {language === 'ar' ? 'آخر طلب:' : 'Last Order:'}
                      </span>
                      <span className="text-gray-900">{customer.lastOrder}</span>
                    </div>
                  </div>

                  {/* Services */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">
                      {language === 'ar' ? 'الخدمات:' : 'Services:'}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {customer.services.map((service, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                      {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                    </button>
                    <button
                      className="px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                      aria-label={language === 'ar' ? 'تحرير' : 'Edit'}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Vendors Tab */}
        {activeTab === 'vendors' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredVendors.map((vendor) => (
              <div
                key={vendor.id}
                className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{vendor.name}</h3>
                      <p className="text-sm text-gray-500">
                        {vendor.id} • {vendor.type}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(vendor.status)}`}
                    >
                      {getStatusText(vendor.status)}
                    </span>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{vendor.contactPerson}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{vendor.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{vendor.email}</span>
                    </div>
                  </div>

                  {/* Performance & Rating */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-900">{vendor.rating}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">
                        {language === 'ar' ? 'الأداء:' : 'Performance:'}
                      </span>
                      <span
                        className={`ml-1 font-medium ${vendor.performance >= 90 ? 'text-green-600' : vendor.performance >= 80 ? 'text-yellow-600' : 'text-red-600'}`}
                      >
                        {vendor.performance}%
                      </span>
                    </div>
                  </div>

                  {/* Business Info */}
                  <div className="space-y-2 mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {language === 'ar' ? 'المركبات:' : 'Vehicles:'}
                      </span>
                      <span className="font-medium text-gray-900">{vendor.vehicleCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {language === 'ar' ? 'العقود:' : 'Contracts:'}
                      </span>
                      <span className="font-medium text-gray-900">{vendor.totalContracts}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {language === 'ar' ? 'قيمة العقود:' : 'Contract Value:'}
                      </span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(vendor.contractValue)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {language === 'ar' ? 'آخر دفعة:' : 'Last Payment:'}
                      </span>
                      <span className="text-gray-900">{vendor.lastPayment}</span>
                    </div>
                  </div>

                  {/* Services */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">
                      {language === 'ar' ? 'الخدمات:' : 'Services:'}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {vendor.services.map((service, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium">
                      {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                    </button>
                    <button
                      className="px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                      aria-label={language === 'ar' ? 'تحرير' : 'Edit'}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
