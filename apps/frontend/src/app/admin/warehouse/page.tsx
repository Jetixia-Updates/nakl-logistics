'use client';

import { useState, useEffect } from 'react';
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
  X,
} from 'lucide-react';

export default function WarehousePage() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Modal States
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showAddWarehouseModal, setShowAddWarehouseModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<any>(null);
  
  // Form States
  const [inventory, setInventory] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [movements, setMovements] = useState<any[]>([]);
  
  // Load data from localStorage
  useEffect(() => {
    const savedInventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    const savedWarehouses = JSON.parse(localStorage.getItem('warehouses') || '[]');
    const savedMovements = JSON.parse(localStorage.getItem('warehouseMovements') || '[]');
    
    setInventory(savedInventory);
    setWarehouses(savedWarehouses);
    setMovements(savedMovements);
  }, []);

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

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });
  
  // Calculate overview stats
  const warehouseOverview = {
    totalItems: inventory.reduce((sum, item) => sum + item.quantity, 0),
    totalValue: inventory.reduce((sum, item) => sum + item.value, 0),
    lowStock: inventory.filter(item => item.quantity > 0 && item.quantity <= item.minStock).length,
    outOfStock: inventory.filter(item => item.quantity === 0).length,
    warehouses: warehouses.length,
  };

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
                  {warehouseOverview.totalItems}
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
                  {formatCurrency(warehouseOverview.totalValue)}
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
                  {warehouseOverview.lowStock}
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
                  {warehouseOverview.outOfStock}
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
                  {warehouseOverview.warehouses}
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
                      aria-label={language === 'ar' ? 'تصفية حسب الفئة' : 'Filter by category'}
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
                <button 
                  onClick={() => setShowAddItemModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {language === 'ar' ? 'حركات المخزون' : 'Stock Movements'}
              </h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowReceiveModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <TrendingUp className="w-4 h-4" />
                  {language === 'ar' ? 'أمر استلام' : 'Receive Order'}
                </button>
                <button 
                  onClick={() => setShowIssueModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <TrendingDown className="w-4 h-4" />
                  {language === 'ar' ? 'إذن صرف' : 'Issue Voucher'}
                </button>
                <button 
                  onClick={() => setShowTransferModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ArrowUpDown className="w-4 h-4" />
                  {language === 'ar' ? 'نقل' : 'Transfer'}
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">
                  {language === 'ar' ? 'سجل الحركات' : 'Movement History'}
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
                    {movements.map((movement) => (
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
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {language === 'ar' ? 'المستودعات' : 'Warehouses'}
              </h2>
              <button 
                onClick={() => setShowAddWarehouseModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                {language === 'ar' ? 'إضافة مستودع' : 'Add Warehouse'}
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {warehouses.map((warehouse) => (
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

                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => {
                        setSelectedWarehouse(warehouse);
                        setShowReceiveModal(true);
                      }}
                      className="px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                    >
                      <TrendingUp className="w-4 h-4" />
                      {language === 'ar' ? 'استلام' : 'Receive'}
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedWarehouse(warehouse);
                        setShowIssueModal(true);
                      }}
                      className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                    >
                      <TrendingDown className="w-4 h-4" />
                      {language === 'ar' ? 'صرف' : 'Issue'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
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

      {/* Add Item Modal */}
      {showAddItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {language === 'ar' ? 'إضافة صنف جديد' : 'Add New Item'}
              </h3>
              <button onClick={() => setShowAddItemModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const newItem = {
                id: inventory.length + 1,
                name: formData.get('name') as string,
                category: formData.get('category') as string,
                sku: formData.get('sku') as string,
                quantity: Number(formData.get('quantity')),
                minStock: Number(formData.get('minStock')),
                maxStock: Number(formData.get('maxStock')),
                unit: formData.get('unit') as string,
                location: formData.get('location') as string,
                value: Number(formData.get('value')),
                supplier: formData.get('supplier') as string,
                status: Number(formData.get('quantity')) === 0 ? 'out-of-stock' : Number(formData.get('quantity')) < Number(formData.get('minStock')) ? 'low-stock' : 'in-stock'
              };
              const updatedInventory = [...inventory, newItem];
              setInventory(updatedInventory);
              localStorage.setItem('inventory', JSON.stringify(updatedInventory));
              setShowAddItemModal(false);
            }}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'اسم الصنف' : 'Item Name'} *
                  </label>
                  <input type="text" name="name" required className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'الفئة' : 'Category'} *
                  </label>
                  <select name="category" required className="w-full px-3 py-2 border rounded-lg">
                    <option value="Spare Parts">{language === 'ar' ? 'قطع غيار' : 'Spare Parts'}</option>
                    <option value="Fuel">{language === 'ar' ? 'وقود' : 'Fuel'}</option>
                    <option value="Tires">{language === 'ar' ? 'إطارات' : 'Tires'}</option>
                    <option value="Tools">{language === 'ar' ? 'أدوات' : 'Tools'}</option>
                    <option value="Lubricants">{language === 'ar' ? 'زيوت' : 'Lubricants'}</option>
                    <option value="Other">{language === 'ar' ? 'أخرى' : 'Other'}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'رقم الصنف (SKU)' : 'SKU'} *
                  </label>
                  <input type="text" name="sku" required className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'الكمية' : 'Quantity'} *
                  </label>
                  <input type="number" name="quantity" required min="0" className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'الحد الأدنى' : 'Min Stock'} *
                  </label>
                  <input type="number" name="minStock" required min="0" className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'الحد الأقصى' : 'Max Stock'} *
                  </label>
                  <input type="number" name="maxStock" required min="0" className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'الوحدة' : 'Unit'} *
                  </label>
                  <input type="text" name="unit" required placeholder="pcs, kg, liters..." className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'الموقع' : 'Location'} *
                  </label>
                  <input type="text" name="location" required className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'القيمة (جنيه)' : 'Value (EGP)'} *
                  </label>
                  <input type="number" name="value" required min="0" step="0.01" className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'المورد' : 'Supplier'} *
                  </label>
                  <input type="text" name="supplier" required className="w-full px-3 py-2 border rounded-lg" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowAddItemModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  {language === 'ar' ? 'إضافة' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Warehouse Modal */}
      {showAddWarehouseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {language === 'ar' ? 'إضافة مستودع جديد' : 'Add New Warehouse'}
              </h3>
              <button onClick={() => setShowAddWarehouseModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const newWarehouse = {
                id: `WH-${String(warehouses.length + 1).padStart(3, '0')}`,
                name: formData.get('name') as string,
                location: formData.get('location') as string,
                capacity: Number(formData.get('capacity')),
                occupied: 0,
                manager: formData.get('manager') as string,
                phone: formData.get('phone') as string,
                categories: (formData.get('categories') as string).split(',').map(c => c.trim())
              };
              const updatedWarehouses = [...warehouses, newWarehouse];
              setWarehouses(updatedWarehouses);
              localStorage.setItem('warehouses', JSON.stringify(updatedWarehouses));
              setShowAddWarehouseModal(false);
            }}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'اسم المستودع' : 'Warehouse Name'} *
                  </label>
                  <input type="text" name="name" required className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'الموقع' : 'Location'} *
                  </label>
                  <input type="text" name="location" required className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'السعة (م³)' : 'Capacity (m³)'} *
                  </label>
                  <input type="number" name="capacity" required min="1" className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'المدير' : 'Manager'} *
                  </label>
                  <input type="text" name="manager" required className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'الهاتف' : 'Phone'} *
                  </label>
                  <input type="tel" name="phone" required className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'الفئات (مفصولة بفاصلة)' : 'Categories (comma-separated)'} *
                  </label>
                  <input type="text" name="categories" required placeholder="Spare Parts, Fuel, Tires" className="w-full px-3 py-2 border rounded-lg" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowAddWarehouseModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  {language === 'ar' ? 'إضافة' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Receive Order Modal */}
      {showReceiveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {language === 'ar' ? 'أمر استلام' : 'Receive Order'}
              </h3>
              <button onClick={() => { setShowReceiveModal(false); setSelectedWarehouse(null); }} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const itemId = Number(formData.get('item'));
              const quantity = Number(formData.get('quantity'));
              const warehouseId = selectedWarehouse?.id || formData.get('warehouse') as string;
              
              // Update inventory
              const updatedInventory = inventory.map(item => {
                if (item.id === itemId) {
                  const newQuantity = item.quantity + quantity;
                  return {
                    ...item,
                    quantity: newQuantity,
                    status: newQuantity === 0 ? 'out-of-stock' : newQuantity < item.minStock ? 'low-stock' : 'in-stock'
                  };
                }
                return item;
              });
              setInventory(updatedInventory);
              localStorage.setItem('inventory', JSON.stringify(updatedInventory));
              
              // Create movement record
              const item = inventory.find(i => i.id === itemId);
              const warehouse = warehouses.find(w => w.id === warehouseId);
              const newMovement = {
                id: movements.length + 1,
                date: new Date().toISOString().split('T')[0],
                time: new Date().toLocaleTimeString('en-US', { hour12: false }),
                type: 'inbound' as const,
                item: item?.name || '',
                quantity: quantity,
                unit: item?.unit || 'pcs',
                from: formData.get('source') as string,
                to: warehouse?.name || '',
                reference: formData.get('reference') as string,
                operator: 'Current User',
                notes: formData.get('notes') as string
              };
              const updatedMovements = [...movements, newMovement];
              setMovements(updatedMovements);
              localStorage.setItem('warehouseMovements', JSON.stringify(updatedMovements));
              
              setShowReceiveModal(false);
              setSelectedWarehouse(null);
            }}>
              <div className="space-y-4">
                {!selectedWarehouse && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'المستودع' : 'Warehouse'} *
                    </label>
                    <select name="warehouse" required className="w-full px-3 py-2 border rounded-lg">
                      <option value="">{language === 'ar' ? 'اختر المستودع' : 'Select Warehouse'}</option>
                      {warehouses.map(w => (
                        <option key={w.id} value={w.id}>{w.name}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'الصنف' : 'Item'} *
                  </label>
                  <select name="item" required className="w-full px-3 py-2 border rounded-lg">
                    <option value="">{language === 'ar' ? 'اختر الصنف' : 'Select Item'}</option>
                    {inventory.map(item => (
                      <option key={item.id} value={item.id}>{item.name} ({item.sku})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'الكمية' : 'Quantity'} *
                  </label>
                  <input type="number" name="quantity" required min="1" className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'المصدر/المورد' : 'Source/Supplier'} *
                  </label>
                  <input type="text" name="source" required className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'رقم المرجع' : 'Reference Number'} *
                  </label>
                  <input type="text" name="reference" required className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'ملاحظات' : 'Notes'}
                  </label>
                  <textarea name="notes" rows={3} className="w-full px-3 py-2 border rounded-lg"></textarea>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => { setShowReceiveModal(false); setSelectedWarehouse(null); }} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  {language === 'ar' ? 'استلام' : 'Receive'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Issue Voucher Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {language === 'ar' ? 'إذن صرف' : 'Issue Voucher'}
              </h3>
              <button onClick={() => { setShowIssueModal(false); setSelectedWarehouse(null); }} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const itemId = Number(formData.get('item'));
              const quantity = Number(formData.get('quantity'));
              const warehouseId = selectedWarehouse?.id || formData.get('warehouse') as string;
              
              // Check if sufficient stock
              const item = inventory.find(i => i.id === itemId);
              if (item && item.quantity < quantity) {
                alert(language === 'ar' ? 'كمية غير كافية في المخزون' : 'Insufficient stock');
                return;
              }
              
              // Update inventory
              const updatedInventory = inventory.map(i => {
                if (i.id === itemId) {
                  const newQuantity = i.quantity - quantity;
                  return {
                    ...i,
                    quantity: newQuantity,
                    status: newQuantity === 0 ? 'out-of-stock' : newQuantity < i.minStock ? 'low-stock' : 'in-stock'
                  };
                }
                return i;
              });
              setInventory(updatedInventory);
              localStorage.setItem('inventory', JSON.stringify(updatedInventory));
              
              // Create movement record
              const warehouse = warehouses.find(w => w.id === warehouseId);
              const newMovement = {
                id: movements.length + 1,
                date: new Date().toISOString().split('T')[0],
                time: new Date().toLocaleTimeString('en-US', { hour12: false }),
                type: 'outbound' as const,
                item: item?.name || '',
                quantity: quantity,
                unit: item?.unit || 'pcs',
                from: warehouse?.name || '',
                to: formData.get('destination') as string,
                reference: formData.get('reference') as string,
                operator: 'Current User',
                notes: formData.get('notes') as string
              };
              const updatedMovements = [...movements, newMovement];
              setMovements(updatedMovements);
              localStorage.setItem('warehouseMovements', JSON.stringify(updatedMovements));
              
              setShowIssueModal(false);
              setSelectedWarehouse(null);
            }}>
              <div className="space-y-4">
                {!selectedWarehouse && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'المستودع' : 'Warehouse'} *
                    </label>
                    <select name="warehouse" required className="w-full px-3 py-2 border rounded-lg">
                      <option value="">{language === 'ar' ? 'اختر المستودع' : 'Select Warehouse'}</option>
                      {warehouses.map(w => (
                        <option key={w.id} value={w.id}>{w.name}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'الصنف' : 'Item'} *
                  </label>
                  <select name="item" required className="w-full px-3 py-2 border rounded-lg">
                    <option value="">{language === 'ar' ? 'اختر الصنف' : 'Select Item'}</option>
                    {inventory.filter(item => item.quantity > 0).map(item => (
                      <option key={item.id} value={item.id}>{item.name} ({item.sku}) - {language === 'ar' ? 'متوفر' : 'Available'}: {item.quantity}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'الكمية' : 'Quantity'} *
                  </label>
                  <input type="number" name="quantity" required min="1" className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'الوجهة/العميل' : 'Destination/Customer'} *
                  </label>
                  <input type="text" name="destination" required className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'رقم المرجع' : 'Reference Number'} *
                  </label>
                  <input type="text" name="reference" required className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'ملاحظات' : 'Notes'}
                  </label>
                  <textarea name="notes" rows={3} className="w-full px-3 py-2 border rounded-lg"></textarea>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => { setShowIssueModal(false); setSelectedWarehouse(null); }} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  {language === 'ar' ? 'صرف' : 'Issue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {language === 'ar' ? 'نقل بين المستودعات' : 'Transfer Between Warehouses'}
              </h3>
              <button onClick={() => setShowTransferModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const itemId = Number(formData.get('item'));
              const quantity = Number(formData.get('quantity'));
              const fromWarehouseId = formData.get('fromWarehouse') as string;
              const toWarehouseId = formData.get('toWarehouse') as string;
              
              if (fromWarehouseId === toWarehouseId) {
                alert(language === 'ar' ? 'لا يمكن النقل إلى نفس المستودع' : 'Cannot transfer to the same warehouse');
                return;
              }
              
              // Check if sufficient stock
              const item = inventory.find(i => i.id === itemId);
              if (item && item.quantity < quantity) {
                alert(language === 'ar' ? 'كمية غير كافية في المخزون' : 'Insufficient stock');
                return;
              }
              
              // Create movement record
              const fromWarehouse = warehouses.find(w => w.id === fromWarehouseId);
              const toWarehouse = warehouses.find(w => w.id === toWarehouseId);
              const newMovement = {
                id: movements.length + 1,
                date: new Date().toISOString().split('T')[0],
                time: new Date().toLocaleTimeString('en-US', { hour12: false }),
                type: 'transfer' as const,
                item: item?.name || '',
                quantity: quantity,
                unit: item?.unit || 'pcs',
                from: fromWarehouse?.name || '',
                to: toWarehouse?.name || '',
                reference: formData.get('reference') as string,
                operator: 'Current User',
                notes: formData.get('notes') as string
              };
              const updatedMovements = [...movements, newMovement];
              setMovements(updatedMovements);
              localStorage.setItem('warehouseMovements', JSON.stringify(updatedMovements));
              
              setShowTransferModal(false);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'من المستودع' : 'From Warehouse'} *
                  </label>
                  <select name="fromWarehouse" required className="w-full px-3 py-2 border rounded-lg">
                    <option value="">{language === 'ar' ? 'اختر المستودع' : 'Select Warehouse'}</option>
                    {warehouses.map(w => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'إلى المستودع' : 'To Warehouse'} *
                  </label>
                  <select name="toWarehouse" required className="w-full px-3 py-2 border rounded-lg">
                    <option value="">{language === 'ar' ? 'اختر المستودع' : 'Select Warehouse'}</option>
                    {warehouses.map(w => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'الصنف' : 'Item'} *
                  </label>
                  <select name="item" required className="w-full px-3 py-2 border rounded-lg">
                    <option value="">{language === 'ar' ? 'اختر الصنف' : 'Select Item'}</option>
                    {inventory.filter(item => item.quantity > 0).map(item => (
                      <option key={item.id} value={item.id}>{item.name} ({item.sku}) - {language === 'ar' ? 'متوفر' : 'Available'}: {item.quantity}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'الكمية' : 'Quantity'} *
                  </label>
                  <input type="number" name="quantity" required min="1" className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'رقم المرجع' : 'Reference Number'} *
                  </label>
                  <input type="text" name="reference" required className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'ملاحظات' : 'Notes'}
                  </label>
                  <textarea name="notes" rows={3} className="w-full px-3 py-2 border rounded-lg"></textarea>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowTransferModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  {language === 'ar' ? 'نقل' : 'Transfer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
