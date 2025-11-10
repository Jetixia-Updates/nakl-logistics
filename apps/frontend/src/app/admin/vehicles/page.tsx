'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Truck,
  MapPin,
  Fuel,
  Calendar,
  Phone,
  User,
  Search,
  Plus,
  Filter,
  Star,
  Award,
  Clock,
  CheckCircle,
  Package,
  Hammer,
  Construction,
  ShoppingCart,
  Container,
  Boxes,
  Building2,
  DollarSign,
  Wrench,
  X,
  Droplet,
} from 'lucide-react';

export default function VehiclesPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [ownershipFilter, setOwnershipFilter] = useState('all');
  const [customVehicles, setCustomVehicles] = useState<any[]>([]);
  const [showFuelModal, setShowFuelModal] = useState(false);
  const [showPartsModal, setShowPartsModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [inventory, setInventory] = useState<any[]>([]);

  // Vehicle Types Categories
  const vehicleTypes = {
    'jumbo': { 
      ar: 'چامبو', 
      en: 'Jumbo',
      icon: Truck 
    },
    'trailers': { 
      ar: 'تريلات', 
      en: 'Trailers',
      icon: Container 
    },
    'spreading-tractors': { 
      ar: 'جرارات فرش', 
      en: 'Spreading Tractors',
      icon: Construction 
    },
    'counter-tractors': { 
      ar: 'جرارات كونتر', 
      en: 'Counter Tractors',
      icon: Construction 
    },
    'sweeper': { 
      ar: 'كساحة', 
      en: 'Sweeper',
      icon: Package 
    },
    'jumbo-small-cooler': { 
      ar: 'چامبو براد صغير', 
      en: 'Jumbo Small Cooler',
      icon: Boxes 
    },
    'jumbo-large-cooler': { 
      ar: 'چامبو براد كبير', 
      en: 'Jumbo Large Cooler',
      icon: Building2 
    },
  };

  // Load custom vehicles and inventory from localStorage
  useEffect(() => {
    const savedVehicles = JSON.parse(localStorage.getItem('vehicles') || '[]');
    const savedInventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    setCustomVehicles(savedVehicles);
    setInventory(savedInventory);
  }, []);

  const defaultVehicles: any[] = [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'in-transit':
        return 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'offline':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      available: language === 'ar' ? 'متاح' : 'Available',
      'in-transit': language === 'ar' ? 'في الطريق' : 'In Transit',
      maintenance: language === 'ar' ? 'صيانة' : 'Maintenance',
      offline: language === 'ar' ? 'غير متاح' : 'Offline',
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getFuelColor = (fuel: number) => {
    if (fuel >= 70) return 'text-green-600';
    if (fuel >= 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getVehicleIcon = (category: string) => {
    return vehicleTypes[category as keyof typeof vehicleTypes]?.icon || Truck;
  };

  // Merge default vehicles with custom vehicles from localStorage
  const vehicles = [...defaultVehicles, ...customVehicles];

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (vehicle.make && vehicle.make.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (vehicle.model && vehicle.model.toLowerCase().includes(searchQuery.toLowerCase())) ||
      vehicle.driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (vehicle.id && vehicle.id.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    const matchesType = typeFilter === 'all' || vehicle.category === typeFilter;
    const matchesOwnership = ownershipFilter === 'all' || vehicle.ownership === ownershipFilter;
    return matchesSearch && matchesStatus && matchesType && matchesOwnership;
  });

  const stats = {
    total: vehicles.length,
    available: vehicles.filter(v => v.status === 'available').length,
    inTransit: vehicles.filter(v => v.status === 'in-transit').length,
    maintenance: vehicles.filter(v => v.status === 'maintenance').length,
    rental: vehicles.filter(v => v.ownership === 'rental').length,
    totalRevenue: vehicles.reduce((sum, v) => sum + v.earnings, 0),
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${language === 'ar' ? 'font-arabic' : 'font-inter'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'ar' ? 'إدارة الأسطول - إيجار من الغير' : 'Fleet Management - External Rental'}
          </h1>
          <p className="text-gray-600">
            {language === 'ar'
              ? 'إدارة شاملة لجميع المركبات والمعدات الثقيلة المؤجرة من الغير'
              : 'Comprehensive management of all externally rented vehicles and heavy equipment'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-xs text-gray-600">
                  {language === 'ar' ? 'إجمالي الأسطول' : 'Total Fleet'}
                </p>
              </div>
              <Truck className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.available}</p>
                <p className="text-xs text-gray-600">{language === 'ar' ? 'متاحة' : 'Available'}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-600">{stats.inTransit}</p>
                <p className="text-xs text-gray-600">
                  {language === 'ar' ? 'في العمل' : 'Active'}
                </p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-yellow-600">{stats.maintenance}</p>
                <p className="text-xs text-gray-600">
                  {language === 'ar' ? 'صيانة' : 'Maintenance'}
                </p>
              </div>
              <Award className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-purple-600">{stats.rental}</p>
                <p className="text-xs text-gray-600">
                  {language === 'ar' ? 'إيجار' : 'Rental'}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-lg shadow-sm border border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-bold text-white">
                  {(stats.totalRevenue / 1000).toFixed(0)}K
                </p>
                <p className="text-xs text-blue-100">
                  {language === 'ar' ? 'إجمالي الأرباح' : 'Total Revenue'}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-100" />
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-col gap-4">
            {/* Search and Main Actions */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search
                  className={`absolute ${language === 'ar' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5`}
                />
                <input
                  type="text"
                  placeholder={language === 'ar' ? 'البحث في الأسطول...' : 'Search fleet...'}
                  className={`w-full ${language === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => router.push('/admin/vehicles/new')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  {language === 'ar' ? 'إضافة مركبة/معدة' : 'Add Vehicle/Equipment'}
                </button>
              </div>
            </div>

            {/* Advanced Filters */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">
                  {language === 'ar' ? 'تصفية:' : 'Filters:'}
                </span>
              </div>
              
              {/* Type Filter */}
              <select
                aria-label={language === 'ar' ? 'تصفية حسب النوع' : 'Filter by type'}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">{language === 'ar' ? 'جميع الأنواع' : 'All Types'}</option>
                <option value="jumbo">{language === 'ar' ? 'چامبو' : 'Jumbo'}</option>
                <option value="trailers">{language === 'ar' ? 'تريلات' : 'Trailers'}</option>
                <option value="spreading-tractors">{language === 'ar' ? 'جرارات فرش' : 'Spreading Tractors'}</option>
                <option value="counter-tractors">{language === 'ar' ? 'جرارات كونتر' : 'Counter Tractors'}</option>
                <option value="sweeper">{language === 'ar' ? 'كساحة' : 'Sweeper'}</option>
                <option value="jumbo-small-cooler">{language === 'ar' ? 'چامبو براد صغير' : 'Small Cooler Jumbo'}</option>
                <option value="jumbo-large-cooler">{language === 'ar' ? 'چامبو براد كبير' : 'Large Cooler Jumbo'}</option>
              </select>

              {/* Status Filter */}
              <select
                aria-label={language === 'ar' ? 'تصفية حسب الحالة' : 'Filter by status'}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">{language === 'ar' ? 'جميع الحالات' : 'All Status'}</option>
                <option value="available">{language === 'ar' ? 'متاح' : 'Available'}</option>
                <option value="in-transit">{language === 'ar' ? 'في العمل' : 'Active'}</option>
                <option value="maintenance">{language === 'ar' ? 'صيانة' : 'Maintenance'}</option>
              </select>

              {/* Ownership Filter */}
              <select
                aria-label={language === 'ar' ? 'تصفية حسب الملكية' : 'Filter by ownership'}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50 border-blue-300"
                value={ownershipFilter}
                onChange={(e) => setOwnershipFilter(e.target.value)}
              >
                <option value="all">{language === 'ar' ? 'جميع الملكيات' : 'All Ownership'}</option>
                <option value="rental">{language === 'ar' ? 'إيجار من الغير' : 'External Rental'}</option>
                <option value="owned">{language === 'ar' ? 'ملك خاص' : 'Owned'}</option>
              </select>

              {/* Results Count */}
              <div className="flex items-center gap-2 mr-auto bg-gray-100 px-3 py-1.5 rounded-lg">
                <span className="text-sm text-gray-600">
                  {language === 'ar' ? 'النتائج:' : 'Results:'} 
                  <span className="font-bold text-gray-900 ml-1">{filteredVehicles.length}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => {
            const VehicleIcon = getVehicleIcon(vehicle.category);
            return (
              <div
                key={vehicle.id}
                className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  {/* Header with Icon */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <VehicleIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {vehicle.make} {vehicle.model}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {vehicle.plateNumber} • {vehicle.year}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(vehicle.status)}`}
                    >
                      {getStatusText(vehicle.status)}
                    </span>
                  </div>

                  {/* Rental Badge */}
                  <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-900">
                          {language === 'ar' ? 'إيجار من الغير' : 'External Rental'}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-purple-900">
                          {vehicle.rentalRate.toLocaleString()}
                        </p>
                        <p className="text-xs text-purple-700">
                          {language === 'ar' ? 'ج.م/' : 'EGP/'}{vehicle.rentalPeriod}
                        </p>
                      </div>
                    </div>
                  </div>

                {/* Vehicle Info */}
                <div className="space-y-3 mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {language === 'ar' ? 'النوع:' : 'Type:'}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{vehicle.type}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {language === 'ar' ? 'الحمولة/السعة:' : 'Capacity:'}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{vehicle.capacity}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {language === 'ar' ? 'ساعات العمل:' : 'Working Hours:'}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {vehicle.mileage ? vehicle.mileage.toLocaleString() : '0'} {language === 'ar' ? 'ساعة' : 'hrs'}
                    </span>
                  </div>
                </div>

                {/* Fuel Level */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Fuel className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {language === 'ar' ? 'مستوى الوقود' : 'Fuel Level'}
                      </span>
                    </div>
                    <span className={`text-sm font-medium ${getFuelColor(vehicle.fuel || 0)}`}>
                      {vehicle.fuel || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        vehicle.fuel >= 70
                          ? 'bg-green-500'
                          : vehicle.fuel >= 30
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                      }`}
                      style={{ width: `${vehicle.fuel || 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* Owner Info */}
                <div className="border-t pt-4 mb-4">
                  <div className="flex items-start gap-3 mb-3">
                    <Building2 className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">
                        {language === 'ar' ? 'المالك:' : 'Owner:'}
                      </p>
                      <span className="text-sm font-medium text-gray-900">
                        {vehicle.owner.name}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-600">{vehicle.owner.phone}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Driver Info */}
                  <div className="flex items-start gap-3 pt-3 border-t">
                    <User className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {vehicle.driver.name}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-600">{vehicle.driver.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-600">{vehicle.driver.phone}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {language === 'ar' ? 'رخصة:' : 'License:'} {vehicle.driver.license}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{vehicle.currentLocation}</span>
                </div>

                {/* Service & Documents */}
                <div className="space-y-2 mb-4 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">
                      {language === 'ar' ? 'الصيانة القادمة:' : 'Next Service:'}
                    </span>
                    <span className="text-gray-900">{vehicle.nextService || (language === 'ar' ? 'غير محدد' : 'N/A')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">
                      {language === 'ar' ? 'التأمين:' : 'Insurance:'}
                    </span>
                    <span className="text-gray-900">{vehicle.insurance || (language === 'ar' ? 'غير محدد' : 'N/A')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">
                      {language === 'ar' ? 'الترخيص:' : 'License:'}
                    </span>
                    <span className="text-gray-900">{vehicle.license || (language === 'ar' ? 'غير محدد' : 'N/A')}</span>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="p-2 bg-green-50 rounded border border-green-200">
                    <p className="text-xs text-green-700 mb-1">
                      {language === 'ar' ? 'الإيرادات الشهرية' : 'Monthly Revenue'}
                    </p>
                    <p className="text-sm font-bold text-green-900">
                      {vehicle.earnings ? vehicle.earnings.toLocaleString() : '0'} {language === 'ar' ? 'ج.م' : 'EGP'}
                    </p>
                  </div>
                  <div className="p-2 bg-blue-50 rounded border border-blue-200">
                    <p className="text-xs text-blue-700 mb-1">
                      {language === 'ar' ? 'معدل الاستخدام' : 'Utilization'}
                    </p>
                    <p className="text-sm font-bold text-blue-900">
                      {Math.floor(Math.random() * 30 + 60)}%
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 pt-4 border-t mb-2">
                  <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    {language === 'ar' ? 'تفاصيل' : 'Details'}
                  </button>
                  <button className="px-3 py-2 bg-purple-50 text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium">
                    {language === 'ar' ? 'تجديد' : 'Renew'}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => {
                      setSelectedVehicle(vehicle);
                      setShowFuelModal(true);
                    }}
                    className="px-3 py-2 bg-yellow-50 text-yellow-700 border border-yellow-300 rounded-lg hover:bg-yellow-100 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                  >
                    <Droplet className="w-4 h-4" />
                    {language === 'ar' ? 'وقود' : 'Fuel'}
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedVehicle(vehicle);
                      setShowPartsModal(true);
                    }}
                    className="px-3 py-2 bg-green-50 text-green-700 border border-green-300 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                  >
                    <Wrench className="w-4 h-4" />
                    {language === 'ar' ? 'قطع' : 'Parts'}
                  </button>
                </div>
              </div>
            </div>
          );
          })}
        </div>
      </div>

      {/* Fuel Modal */}
      {showFuelModal && selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {language === 'ar' ? 'صرف وقود' : 'Issue Fuel'}
              </h3>
              <button onClick={() => { setShowFuelModal(false); setSelectedVehicle(null); }} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900 mb-1">
                {selectedVehicle.make} {selectedVehicle.model}
              </p>
              <p className="text-sm text-gray-600">
                {selectedVehicle.plateNumber} • {language === 'ar' ? 'الوقود الحالي:' : 'Current Fuel:'} {selectedVehicle.fuel || 0}%
              </p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const fuelType = formData.get('fuelType') as string;
              const quantity = Number(formData.get('quantity'));
              const pricePerUnit = Number(formData.get('pricePerUnit'));
              
              // Find fuel in inventory
              const fuelItem = inventory.find(i => i.category === 'Fuel' && i.name.toLowerCase().includes(fuelType.toLowerCase()));
              
              if (!fuelItem) {
                alert(language === 'ar' ? 'نوع الوقود غير متوفر في المخزون' : 'Fuel type not available in inventory');
                return;
              }
              
              if (fuelItem.quantity < quantity) {
                alert(language === 'ar' ? 'كمية غير كافية في المخزون' : 'Insufficient fuel in inventory');
                return;
              }
              
              // Update inventory
              const updatedInventory = inventory.map(i => {
                if (i.id === fuelItem.id) {
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
              const movements = JSON.parse(localStorage.getItem('warehouseMovements') || '[]');
              const newMovement = {
                id: movements.length + 1,
                date: new Date().toISOString().split('T')[0],
                time: new Date().toLocaleTimeString('en-US', { hour12: false }),
                type: 'outbound' as const,
                item: fuelItem.name,
                quantity: quantity,
                unit: fuelItem.unit,
                from: 'Fuel Storage',
                to: `${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.plateNumber})`,
                reference: `FUEL-${selectedVehicle.plateNumber}`,
                operator: 'Current User',
                notes: formData.get('notes') as string
              };
              movements.push(newMovement);
              localStorage.setItem('warehouseMovements', JSON.stringify(movements));

              // Create journal entry
              const journalEntries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
              const totalCost = quantity * pricePerUnit;
              const newEntry = {
                id: `JE-${String(journalEntries.length + 1).padStart(4, '0')}`,
                date: new Date().toISOString().split('T')[0],
                reference: `FUEL-${selectedVehicle.plateNumber}`,
                description: `${language === 'ar' ? 'صرف وقود للمركبة' : 'Fuel issued to vehicle'} ${selectedVehicle.plateNumber} - ${quantity} ${fuelItem.unit}`,
                type: 'expense',
                entries: [
                  {
                    account: language === 'ar' ? 'مصروفات الوقود' : 'Fuel Expenses',
                    accountCode: '5140',
                    debit: totalCost,
                    credit: 0
                  },
                  {
                    account: language === 'ar' ? 'المخزون - وقود' : 'Inventory - Fuel',
                    accountCode: '1160',
                    debit: 0,
                    credit: totalCost
                  }
                ],
                totalDebit: totalCost,
                totalCredit: totalCost,
                status: 'posted',
                createdBy: 'Current User',
                approvedBy: 'Auto-posted'
              };
              journalEntries.push(newEntry);
              localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
              
              alert(language === 'ar' ? 'تم صرف الوقود بنجاح' : 'Fuel issued successfully');
              setShowFuelModal(false);
              setSelectedVehicle(null);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'نوع الوقود' : 'Fuel Type'} *
                  </label>
                  <select name="fuelType" required className="w-full px-3 py-2 border rounded-lg">
                    <option value="">{language === 'ar' ? 'اختر نوع الوقود' : 'Select Fuel Type'}</option>
                    {inventory.filter(item => item.category === 'Fuel' && item.quantity > 0).map(item => (
                      <option key={item.id} value={item.name}>
                        {item.name} - {language === 'ar' ? 'متوفر' : 'Available'}: {item.quantity} {item.unit}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'الكمية (لتر)' : 'Quantity (Liters)'} *
                  </label>
                  <input type="number" name="quantity" required min="1" step="0.01" className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'السعر لكل لتر (جنيه)' : 'Price per Liter (EGP)'} *
                  </label>
                  <input type="number" name="pricePerUnit" required min="0" step="0.01" className="w-full px-3 py-2 border rounded-lg" defaultValue="2.33" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'ملاحظات' : 'Notes'}
                  </label>
                  <textarea name="notes" rows={2} className="w-full px-3 py-2 border rounded-lg"></textarea>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => { setShowFuelModal(false); setSelectedVehicle(null); }} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button type="submit" className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
                  {language === 'ar' ? 'صرف' : 'Issue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Parts Modal */}
      {showPartsModal && selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {language === 'ar' ? 'صرف قطع غيار' : 'Issue Spare Parts'}
              </h3>
              <button onClick={() => { setShowPartsModal(false); setSelectedVehicle(null); }} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900 mb-1">
                {selectedVehicle.make} {selectedVehicle.model}
              </p>
              <p className="text-sm text-gray-600">
                {selectedVehicle.plateNumber} • {selectedVehicle.type}
              </p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const itemId = Number(formData.get('item'));
              const quantity = Number(formData.get('quantity'));
              
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
              const movements = JSON.parse(localStorage.getItem('warehouseMovements') || '[]');
              const newMovement = {
                id: movements.length + 1,
                date: new Date().toISOString().split('T')[0],
                time: new Date().toLocaleTimeString('en-US', { hour12: false }),
                type: 'outbound' as const,
                item: item?.name || '',
                quantity: quantity,
                unit: item?.unit || 'pcs',
                from: 'Spare Parts Warehouse',
                to: `${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.plateNumber})`,
                reference: `MAINT-${selectedVehicle.plateNumber}`,
                operator: 'Current User',
                notes: formData.get('notes') as string
              };
              movements.push(newMovement);
              localStorage.setItem('warehouseMovements', JSON.stringify(movements));

              // Create journal entry
              const journalEntries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
              const totalCost = (item?.value || 0) * quantity;
              const newEntry = {
                id: `JE-${String(journalEntries.length + 1).padStart(4, '0')}`,
                date: new Date().toISOString().split('T')[0],
                reference: `MAINT-${selectedVehicle.plateNumber}`,
                description: `${language === 'ar' ? 'صرف قطع غيار للمركبة' : 'Parts issued to vehicle'} ${selectedVehicle.plateNumber} - ${item?.name}`,
                type: 'expense',
                entries: [
                  {
                    account: language === 'ar' ? 'مصروفات الصيانة' : 'Maintenance Expenses',
                    accountCode: '5130',
                    debit: totalCost,
                    credit: 0
                  },
                  {
                    account: language === 'ar' ? 'المخزون - قطع غيار' : 'Inventory - Spare Parts',
                    accountCode: '1150',
                    debit: 0,
                    credit: totalCost
                  }
                ],
                totalDebit: totalCost,
                totalCredit: totalCost,
                status: 'posted',
                createdBy: 'Current User',
                approvedBy: 'Auto-posted'
              };
              journalEntries.push(newEntry);
              localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
              
              alert(language === 'ar' ? 'تم صرف قطع الغيار بنجاح' : 'Parts issued successfully');
              setShowPartsModal(false);
              setSelectedVehicle(null);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'قطعة الغيار' : 'Spare Part'} *
                  </label>
                  <select name="item" required className="w-full px-3 py-2 border rounded-lg">
                    <option value="">{language === 'ar' ? 'اختر قطعة الغيار' : 'Select Spare Part'}</option>
                    {inventory.filter(item => item.category === 'Spare Parts' && item.quantity > 0).map(item => (
                      <option key={item.id} value={item.id}>
                        {item.name} ({item.sku}) - {language === 'ar' ? 'متوفر' : 'Available'}: {item.quantity} {item.unit} - {item.value} {language === 'ar' ? 'ريال' : 'SAR'}
                      </option>
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
                    {language === 'ar' ? 'ملاحظات' : 'Notes'}
                  </label>
                  <textarea name="notes" rows={3} className="w-full px-3 py-2 border rounded-lg" placeholder={language === 'ar' ? 'سبب الصرف أو تفاصيل الصيانة' : 'Reason or maintenance details'}></textarea>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => { setShowPartsModal(false); setSelectedVehicle(null); }} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  {language === 'ar' ? 'صرف' : 'Issue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
