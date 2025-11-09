'use client';

import { useState } from 'react';
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
} from 'lucide-react';

export default function VehiclesPage() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const vehicles = [
    {
      id: 'V-001',
      plateNumber: 'ق أ ح 1234',
      make: 'Mercedes',
      model: 'Actros 2545',
      year: 2022,
      type: language === 'ar' ? 'شاحنة ثقيلة' : 'Heavy Truck',
      capacity: '25 طن',
      status: 'available',
      driver: {
        name: language === 'ar' ? 'أحمد محمد علي' : 'Ahmed Mohamed Ali',
        phone: '+201234567890',
        license: 'DL123456',
        rating: 4.8,
      },
      owner: {
        name: language === 'ar' ? 'شركة النقل المتطور' : 'Advanced Transport Company',
        phone: '+201987654321',
      },
      currentLocation: language === 'ar' ? 'القاهرة - مدينة نصر' : 'Cairo - Nasr City',
      lastService: '2024-10-15',
      nextService: '2024-12-15',
      insurance: '2025-03-20',
      license: '2025-06-30',
      fuel: 85,
      mileage: 125000,
      earnings: 45000,
    },
    {
      id: 'V-002',
      plateNumber: 'ب ن م 5678',
      make: 'Volvo',
      model: 'FH 500',
      year: 2021,
      type: language === 'ar' ? 'شاحنة متوسطة' : 'Medium Truck',
      capacity: '18 طن',
      status: 'in-transit',
      driver: {
        name: language === 'ar' ? 'محمود حسن أحمد' : 'Mahmoud Hassan Ahmed',
        phone: '+201555444333',
        license: 'DL789012',
        rating: 4.6,
      },
      owner: {
        name: language === 'ar' ? 'مؤسسة الشحن السريع' : 'Fast Shipping Corporation',
        phone: '+201777888999',
      },
      currentLocation: language === 'ar' ? 'الإسكندرية - الميناء' : 'Alexandria - Port',
      lastService: '2024-09-20',
      nextService: '2024-11-20',
      insurance: '2025-01-15',
      license: '2025-04-10',
      fuel: 62,
      mileage: 98000,
      earnings: 38000,
    },
    {
      id: 'V-003',
      plateNumber: 'س ت ع 9012',
      make: 'Scania',
      model: 'R450',
      year: 2023,
      type: language === 'ar' ? 'شاحنة خطرة' : 'Hazardous Truck',
      capacity: '20 طن',
      status: 'maintenance',
      driver: {
        name: language === 'ar' ? 'خالد عبد الرحمن' : 'Khaled Abdel Rahman',
        phone: '+201666555444',
        license: 'DL345678',
        rating: 4.9,
      },
      owner: {
        name: language === 'ar' ? 'شركة النقل الآمن' : 'Safe Transport Company',
        phone: '+201333222111',
      },
      currentLocation:
        language === 'ar' ? 'ورشة الصيانة - القاهرة' : 'Maintenance Workshop - Cairo',
      lastService: '2024-11-05',
      nextService: '2025-01-05',
      insurance: '2025-08-12',
      license: '2025-09-25',
      fuel: 0,
      mileage: 45000,
      earnings: 52000,
    },
  ];

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

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.driver.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className={`min-h-screen bg-gray-50 ${language === 'ar' ? 'font-arabic' : 'font-inter'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'ar' ? 'إدارة المركبات' : 'Vehicle Management'}
          </h1>
          <p className="text-gray-600">
            {language === 'ar'
              ? 'إدارة أسطول المركبات والسائقين ومراقبة الأداء'
              : 'Manage vehicle fleet, drivers, and monitor performance'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Truck className="w-8 h-8 text-blue-500 mb-2" />
              <div className={`${language === 'ar' ? 'mr-4' : 'ml-4'}`}>
                <p className="text-2xl font-bold text-gray-900">47</p>
                <p className="text-sm text-gray-600">
                  {language === 'ar' ? 'إجمالي المركبات' : 'Total Vehicles'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
              <div className={`${language === 'ar' ? 'mr-4' : 'ml-4'}`}>
                <p className="text-2xl font-bold text-gray-900">32</p>
                <p className="text-sm text-gray-600">{language === 'ar' ? 'متاحة' : 'Available'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-orange-500 mb-2" />
              <div className={`${language === 'ar' ? 'mr-4' : 'ml-4'}`}>
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-sm text-gray-600">
                  {language === 'ar' ? 'في الطريق' : 'In Transit'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Award className="w-8 h-8 text-purple-500 mb-2" />
              <div className={`${language === 'ar' ? 'mr-4' : 'ml-4'}`}>
                <p className="text-2xl font-bold text-gray-900">4.7</p>
                <p className="text-sm text-gray-600">
                  {language === 'ar' ? 'متوسط التقييم' : 'Average Rating'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search
                  className={`absolute ${language === 'ar' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5`}
                />
                <input
                  type="text"
                  placeholder={language === 'ar' ? 'البحث عن المركبات...' : 'Search vehicles...'}
                  className={`w-full ${language === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">{language === 'ar' ? 'جميع الحالات' : 'All Status'}</option>
                  <option value="available">{language === 'ar' ? 'متاح' : 'Available'}</option>
                  <option value="in-transit">
                    {language === 'ar' ? 'في الطريق' : 'In Transit'}
                  </option>
                  <option value="maintenance">{language === 'ar' ? 'صيانة' : 'Maintenance'}</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4" />
                {language === 'ar' ? 'إضافة مركبة' : 'Add Vehicle'}
              </button>
            </div>
          </div>
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {vehicle.make} {vehicle.model}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {vehicle.plateNumber} • {vehicle.year}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(vehicle.status)}`}
                  >
                    {getStatusText(vehicle.status)}
                  </span>
                </div>

                {/* Vehicle Info */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {language === 'ar' ? 'النوع:' : 'Type:'}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{vehicle.type}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {language === 'ar' ? 'الحمولة:' : 'Capacity:'}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{vehicle.capacity}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {language === 'ar' ? 'المسافة المقطوعة:' : 'Mileage:'}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {vehicle.mileage.toLocaleString()} {language === 'ar' ? 'كم' : 'km'}
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
                    <span className={`text-sm font-medium ${getFuelColor(vehicle.fuel)}`}>
                      {vehicle.fuel}%
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
                      style={{ width: `${vehicle.fuel}%` }}
                    ></div>
                  </div>
                </div>

                {/* Driver Info */}
                <div className="border-t pt-4 mb-4">
                  <div className="flex items-start gap-3">
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
                    <span className="text-gray-900">{vehicle.nextService}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">
                      {language === 'ar' ? 'التأمين:' : 'Insurance:'}
                    </span>
                    <span className="text-gray-900">{vehicle.insurance}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">
                      {language === 'ar' ? 'الترخيص:' : 'License:'}
                    </span>
                    <span className="text-gray-900">{vehicle.license}</span>
                  </div>
                </div>

                {/* Earnings */}
                <div className="flex items-center justify-between mb-4 p-2 bg-blue-50 rounded">
                  <span className="text-sm text-blue-800">
                    {language === 'ar' ? 'الأرباح هذا الشهر:' : 'This Month Earnings:'}
                  </span>
                  <span className="text-sm font-bold text-blue-800">
                    {vehicle.earnings.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <button className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                    {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                  </button>
                  <button className="flex-1 px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium">
                    {language === 'ar' ? 'تتبع مباشر' : 'Live Track'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
