'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Package,
  Warehouse,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
  Plus,
  BarChart3,
  PackageX,
  ArrowUpDown,
  MapPin,
  Calendar,
  User,
  Truck,
} from 'lucide-react';

export default function WarehousePage() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Sample warehouse data
  const warehouseData = {
    overview: {
      totalItems: 2856,
      totalValue: 4250000,
      lowStock: 23,
      outOfStock: 8,
      warehouses: 3,
    },
    inventory: [
      {
        id: 'ITM-001',
        name: language === 'ar' ? 'مواد بناء - أسمنت' : 'Construction Materials - Cement',
        category: language === 'ar' ? 'مواد البناء' : 'Construction',
        sku: 'CMT-50KG',
        quantity: 250,
        minStock: 100,
        maxStock: 500,
        unit: language === 'ar' ? 'شيكارة' : 'bags',
        location: language === 'ar' ? 'المستودع الرئيسي - A1-15' : 'Main Warehouse - A1-15',
        value: 125000,
        supplier: language === 'ar' ? 'شركة الأسمنت المصرية' : 'Egyptian Cement Company',
        lastUpdated: '2024-11-08',
        status: 'in-stock',
      },
      {
        id: 'ITM-002',
        name: language === 'ar' ? 'معدات إلكترونية - هواتف' : 'Electronic Equipment - Phones',
        category: language === 'ar' ? 'إلكترونيات' : 'Electronics',
        sku: 'PHN-SM-A54',
        quantity: 85,
        minStock: 50,
        maxStock: 200,
        unit: language === 'ar' ? 'قطعة' : 'pieces',
        location:
          language === 'ar' ? 'مستودع الإلكترونيات - B2-08' : 'Electronics Warehouse - B2-08',
        value: 340000,
        supplier: language === 'ar' ? 'موزع التكنولوجيا المتقدمة' : 'Advanced Tech Distributor',
        lastUpdated: '2024-11-07',
        status: 'in-stock',
      },
      {
        id: 'ITM-003',
        name: language === 'ar' ? 'قطع غيار السيارات - فرامل' : 'Auto Parts - Brake Pads',
        category: language === 'ar' ? 'قطع غيار' : 'Auto Parts',
        sku: 'BRK-HD-350',
        quantity: 15,
        minStock: 25,
        maxStock: 100,
        unit: language === 'ar' ? 'طقم' : 'sets',
        location: language === 'ar' ? 'مستودع قطع الغيار - C1-03' : 'Auto Parts Warehouse - C1-03',
        value: 37500,
        supplier: language === 'ar' ? 'شركة قطع غيار الشرق الأوسط' : 'Middle East Auto Parts',
        lastUpdated: '2024-11-06',
        status: 'low-stock',
      },
      {
        id: 'ITM-004',
        name:
          language === 'ar' ? 'مواد كيميائية - منظفات صناعية' : 'Chemicals - Industrial Cleaners',
        category: language === 'ar' ? 'كيماويات' : 'Chemicals',
        sku: 'CLN-IND-20L',
        quantity: 0,
        minStock: 20,
        maxStock: 80,
        unit: language === 'ar' ? 'عبوة' : 'containers',
        location: language === 'ar' ? 'مستودع المواد الخطرة - D1-01' : 'Hazmat Warehouse - D1-01',
        value: 0,
        supplier: language === 'ar' ? 'الشركة الكيميائية الحديثة' : 'Modern Chemical Company',
        lastUpdated: '2024-11-05',
        status: 'out-of-stock',
      },
    ],
    movements: [
      {
        id: 'MOV-001',
        type: 'inbound',
        item: language === 'ar' ? 'مواد بناء - أسمنت' : 'Construction Materials - Cement',
        quantity: 100,
        unit: language === 'ar' ? 'شيكارة' : 'bags',
        from: language === 'ar' ? 'شركة الأسمنت المصرية' : 'Egyptian Cement Company',
        to: language === 'ar' ? 'المستودع الرئيسي' : 'Main Warehouse',
        date: '2024-11-08 14:30',
        operator: language === 'ar' ? 'أحمد محمد' : 'Ahmed Mohamed',
        reference: 'PO-2024-001',
      },
      {
        id: 'MOV-002',
        type: 'outbound',
        item: language === 'ar' ? 'معدات إلكترونية - هواتف' : 'Electronic Equipment - Phones',
        quantity: 25,
        unit: language === 'ar' ? 'قطعة' : 'pieces',
        from: language === 'ar' ? 'مستودع الإلكترونيات' : 'Electronics Warehouse',
        to: language === 'ar' ? 'عميل - شركة التكنولوجيا' : 'Client - Tech Company',
        date: '2024-11-07 11:15',
        operator: language === 'ar' ? 'فاطمة أحمد' : 'Fatma Ahmed',
        reference: 'SO-2024-005',
      },
      {
        id: 'MOV-003',
        type: 'transfer',
        item: language === 'ar' ? 'قطع غيار السيارات - فرامل' : 'Auto Parts - Brake Pads',
        quantity: 10,
        unit: language === 'ar' ? 'طقم' : 'sets',
        from: language === 'ar' ? 'مستودع قطع الغيار' : 'Auto Parts Warehouse',
        to: language === 'ar' ? 'المستودع الفرعي' : 'Branch Warehouse',
        date: '2024-11-06 09:45',
        operator: language === 'ar' ? 'محمود علي' : 'Mahmoud Ali',
        reference: 'TR-2024-012',
      },
    ],
    warehouses: [
      {
        id: 'WH-001',
        name: language === 'ar' ? 'المستودع الرئيسي' : 'Main Warehouse',
        location: language === 'ar' ? 'القاهرة - مدينة نصر' : 'Cairo - Nasr City',
        capacity: 5000,
        occupied: 3200,
        manager: language === 'ar' ? 'خالد حسن' : 'Khaled Hassan',
        phone: '+201234567890',
        status: 'active',
        categories: [
          language === 'ar' ? 'مواد بناء' : 'Construction',
          language === 'ar' ? 'إلكترونيات' : 'Electronics',
        ],
      },
      {
        id: 'WH-002',
        name: language === 'ar' ? 'مستودع المواد الخطرة' : 'Hazmat Warehouse',
        location: language === 'ar' ? 'العاشر من رمضان' : '10th of Ramadan City',
        capacity: 1000,
        occupied: 450,
        manager: language === 'ar' ? 'سارة محمود' : 'Sara Mahmoud',
        phone: '+201987654321',
        status: 'active',
        categories: [
          language === 'ar' ? 'كيماويات' : 'Chemicals',
          language === 'ar' ? 'مواد خطرة' : 'Hazardous Materials',
        ],
      },
      {
        id: 'WH-003',
        name: language === 'ar' ? 'المستودع الفرعي' : 'Branch Warehouse',
        location: language === 'ar' ? 'الإسكندرية - برج العرب' : 'Alexandria - Borg El Arab',
        capacity: 2000,
        occupied: 1100,
        manager: language === 'ar' ? 'عمر يوسف' : 'Omar Youssef',
        phone: '+201555666777',
        status: 'active',
        categories: [
          language === 'ar' ? 'قطع غيار' : 'Auto Parts',
          language === 'ar' ? 'مواد بناء' : 'Construction',
        ],
      },
    ],
  };

  const getStockStatus = (quantity: number, minStock: number) => {
    if (quantity === 0) return { status: 'out-of-stock', color: 'bg-red-100 text-red-800' };
    if (quantity <= minStock)
      return { status: 'low-stock', color: 'bg-yellow-100 text-yellow-800' };
    return { status: 'in-stock', color: 'bg-green-100 text-green-800' };
  };

  const getStockStatusText = (status: string) => {
    const statusMap = {
      'in-stock': language === 'ar' ? 'متوفر' : 'In Stock',
      'low-stock': language === 'ar' ? 'مخزون منخفض' : 'Low Stock',
      'out-of-stock': language === 'ar' ? 'نفد المخزون' : 'Out of Stock',
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getMovementTypeColor = (type: string) => {
    switch (type) {
      case 'inbound':
        return 'bg-green-100 text-green-800';
      case 'outbound':
        return 'bg-red-100 text-red-800';
      case 'transfer':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMovementTypeText = (type: string) => {
    const typeMap = {
      inbound: language === 'ar' ? 'استلام' : 'Inbound',
      outbound: language === 'ar' ? 'تسليم' : 'Outbound',
      transfer: language === 'ar' ? 'نقل' : 'Transfer',
    };
    return typeMap[type as keyof typeof typeMap] || type;
  };

  const filteredInventory = warehouseData.inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${language === 'ar' ? 'font-arabic' : 'font-inter'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'ar' ? 'إدارة المستودعات' : 'Warehouse Management'}
          </h1>
          <p className="text-gray-600">
            {language === 'ar'
              ? 'إدارة المخزون وحركات البضائع ومراقبة المستودعات'
              : 'Manage inventory, goods movements, and warehouse monitoring'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-blue-500 mb-2" />
              <div className={`${language === 'ar' ? 'mr-4' : 'ml-4'}`}>
                <p className="text-2xl font-bold text-gray-900">
                  {warehouseData.overview.totalItems}
                </p>
                <p className="text-sm text-gray-600">
                  {language === 'ar' ? 'إجمالي الأصناف' : 'Total Items'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-green-500 mb-2" />
              <div className={`${language === 'ar' ? 'mr-4' : 'ml-4'}`}>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(warehouseData.overview.totalValue)}
                </p>
                <p className="text-sm text-gray-600">
                  {language === 'ar' ? 'قيمة المخزون' : 'Stock Value'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 text-yellow-500 mb-2" />
              <div className={`${language === 'ar' ? 'mr-4' : 'ml-4'}`}>
                <p className="text-2xl font-bold text-gray-900">
                  {warehouseData.overview.lowStock}
                </p>
                <p className="text-sm text-gray-600">
                  {language === 'ar' ? 'مخزون منخفض' : 'Low Stock'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <PackageX className="w-8 h-8 text-red-500 mb-2" />
              <div className={`${language === 'ar' ? 'mr-4' : 'ml-4'}`}>
                <p className="text-2xl font-bold text-gray-900">
                  {warehouseData.overview.outOfStock}
                </p>
                <p className="text-sm text-gray-600">
                  {language === 'ar' ? 'نفد المخزون' : 'Out of Stock'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Warehouse className="w-8 h-8 text-purple-500 mb-2" />
              <div className={`${language === 'ar' ? 'mr-4' : 'ml-4'}`}>
                <p className="text-2xl font-bold text-gray-900">
                  {warehouseData.overview.warehouses}
                </p>
                <p className="text-sm text-gray-600">
                  {language === 'ar' ? 'المستودعات' : 'Warehouses'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 ${
                activeTab === 'inventory'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {language === 'ar' ? 'المخزون' : 'Inventory'}
            </button>
            <button
              onClick={() => setActiveTab('movements')}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 ${
                activeTab === 'movements'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {language === 'ar' ? 'حركات المخزون' : 'Stock Movements'}
            </button>
            <button
              onClick={() => setActiveTab('warehouses')}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 ${
                activeTab === 'warehouses'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {language === 'ar' ? 'المستودعات' : 'Warehouses'}
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 ${
                activeTab === 'reports'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {language === 'ar' ? 'التقارير' : 'Reports'}
            </button>
          </div>
        </div>

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div>
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
                      placeholder={
                        language === 'ar' ? 'البحث في المخزون...' : 'Search inventory...'
                      }
                      className={`w-full ${language === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <select
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                      <option value="all">
                        {language === 'ar' ? 'جميع الفئات' : 'All Categories'}
                      </option>
                      <option value={language === 'ar' ? 'مواد البناء' : 'Construction'}>
                        {language === 'ar' ? 'مواد البناء' : 'Construction'}
                      </option>
                      <option value={language === 'ar' ? 'إلكترونيات' : 'Electronics'}>
                        {language === 'ar' ? 'إلكترونيات' : 'Electronics'}
                      </option>
                      <option value={language === 'ar' ? 'قطع غيار' : 'Auto Parts'}>
                        {language === 'ar' ? 'قطع غيار' : 'Auto Parts'}
                      </option>
                      <option value={language === 'ar' ? 'كيماويات' : 'Chemicals'}>
                        {language === 'ar' ? 'كيماويات' : 'Chemicals'}
                      </option>
                    </select>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  {language === 'ar' ? 'إضافة صنف' : 'Add Item'}
                </button>
              </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th
                        className={`${language === 'ar' ? 'text-right' : 'text-left'} px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider`}
                      >
                        {language === 'ar' ? 'الصنف' : 'Item'}
                      </th>
                      <th
                        className={`${language === 'ar' ? 'text-right' : 'text-left'} px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider`}
                      >
                        {language === 'ar' ? 'الكمية' : 'Quantity'}
                      </th>
                      <th
                        className={`${language === 'ar' ? 'text-right' : 'text-left'} px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider`}
                      >
                        {language === 'ar' ? 'الموقع' : 'Location'}
                      </th>
                      <th
                        className={`${language === 'ar' ? 'text-right' : 'text-left'} px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider`}
                      >
                        {language === 'ar' ? 'القيمة' : 'Value'}
                      </th>
                      <th
                        className={`${language === 'ar' ? 'text-right' : 'text-left'} px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider`}
                      >
                        {language === 'ar' ? 'الحالة' : 'Status'}
                      </th>
                      <th
                        className={`${language === 'ar' ? 'text-right' : 'text-left'} px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider`}
                      >
                        {language === 'ar' ? 'آخر تحديث' : 'Last Updated'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredInventory.map((item) => {
                      const stockStatus = getStockStatus(item.quantity, item.minStock);
                      return (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{item.name}</div>
                              <div className="text-sm text-gray-500">
                                {item.sku} • {item.category}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {item.quantity} {item.unit}
                              </div>
                              <div className="text-sm text-gray-500">
                                {language === 'ar' ? 'حد أدنى:' : 'Min:'} {item.minStock} •{' '}
                                {language === 'ar' ? 'حد أقصى:' : 'Max:'} {item.maxStock}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{item.location}</td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {formatCurrency(item.value)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockStatus.color}`}
                            >
                              {getStockStatusText(stockStatus.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.lastUpdated}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Stock Movements Tab */}
        {activeTab === 'movements' && (
          <div>
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">
                  {language === 'ar' ? 'حركات المخزون' : 'Stock Movements'}
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th
                        className={`${language === 'ar' ? 'text-right' : 'text-left'} px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider`}
                      >
                        {language === 'ar' ? 'النوع' : 'Type'}
                      </th>
                      <th
                        className={`${language === 'ar' ? 'text-right' : 'text-left'} px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider`}
                      >
                        {language === 'ar' ? 'الصنف' : 'Item'}
                      </th>
                      <th
                        className={`${language === 'ar' ? 'text-right' : 'text-left'} px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider`}
                      >
                        {language === 'ar' ? 'الكمية' : 'Quantity'}
                      </th>
                      <th
                        className={`${language === 'ar' ? 'text-right' : 'text-left'} px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider`}
                      >
                        {language === 'ar' ? 'من/إلى' : 'From/To'}
                      </th>
                      <th
                        className={`${language === 'ar' ? 'text-right' : 'text-left'} px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider`}
                      >
                        {language === 'ar' ? 'التاريخ' : 'Date'}
                      </th>
                      <th
                        className={`${language === 'ar' ? 'text-right' : 'text-left'} px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider`}
                      >
                        {language === 'ar' ? 'المشغل' : 'Operator'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {warehouseData.movements.map((movement) => (
                      <tr key={movement.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMovementTypeColor(movement.type)}`}
                          >
                            {getMovementTypeText(movement.type)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{movement.item}</div>
                            <div className="text-sm text-gray-500">{movement.reference}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {movement.quantity} {movement.unit}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            <div>
                              {language === 'ar' ? 'من:' : 'From:'} {movement.from}
                            </div>
                            <div>
                              {language === 'ar' ? 'إلى:' : 'To:'} {movement.to}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {movement.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {movement.operator}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Warehouses Tab */}
        {activeTab === 'warehouses' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {warehouseData.warehouses.map((warehouse) => (
              <div
                key={warehouse.id}
                className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{warehouse.name}</h3>
                      <p className="text-sm text-gray-500">{warehouse.id}</p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {language === 'ar' ? 'نشط' : 'Active'}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{warehouse.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{warehouse.manager}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{warehouse.phone}</span>
                    </div>
                  </div>

                  {/* Capacity */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">
                        {language === 'ar' ? 'السعة المستخدمة' : 'Capacity Used'}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {warehouse.occupied}/{warehouse.capacity} {language === 'ar' ? 'م³' : 'm³'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(warehouse.occupied / warehouse.capacity) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {Math.round((warehouse.occupied / warehouse.capacity) * 100)}%{' '}
                      {language === 'ar' ? 'مستخدم' : 'utilized'}
                    </p>
                  </div>

                  {/* Categories */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">
                      {language === 'ar' ? 'الفئات المخزنة:' : 'Stored Categories:'}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {warehouse.categories.map((category, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button className="w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                    {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center mb-4">
                <BarChart3 className="w-8 h-8 text-blue-500" />
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">
                    {language === 'ar' ? 'تقرير المخزون' : 'Inventory Report'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {language === 'ar' ? 'حالة المخزون الحالي' : 'Current inventory status'}
                  </p>
                </div>
              </div>
              <button className="w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                {language === 'ar' ? 'إنشاء التقرير' : 'Generate Report'}
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center mb-4">
                <ArrowUpDown className="w-8 h-8 text-green-500" />
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">
                    {language === 'ar' ? 'تقرير الحركات' : 'Movement Report'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {language === 'ar' ? 'حركات الدخول والخروج' : 'In/out movements'}
                  </p>
                </div>
              </div>
              <button className="w-full px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                {language === 'ar' ? 'إنشاء التقرير' : 'Generate Report'}
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-8 h-8 text-yellow-500" />
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">
                    {language === 'ar' ? 'تقرير النواقص' : 'Stock Alert Report'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {language === 'ar' ? 'الأصناف المنخفضة والنافدة' : 'Low and out of stock items'}
                  </p>
                </div>
              </div>
              <button className="w-full px-4 py-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors">
                {language === 'ar' ? 'إنشاء التقرير' : 'Generate Report'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
