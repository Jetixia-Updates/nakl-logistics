'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  Truck,
} from 'lucide-react';

export default function VendorsPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filter, setFilter] = useState('all');

  const vendors: any[] = [];

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.contactPerson.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || vendor.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return language === 'ar' ? 'نشط' : 'Active';
      case 'pending':
        return language === 'ar' ? 'قيد المراجعة' : 'Pending';
      case 'suspended':
        return language === 'ar' ? 'معلق' : 'Suspended';
      default:
        return status;
    }
  };

  // Statistics
  const stats = {
    total: vendors.length,
    active: vendors.filter((v) => v.status === 'active').length,
    totalValue: vendors.reduce((sum, v) => sum + v.totalValue, 0),
    totalVehicles: vendors.reduce((sum, v) => sum + v.vehiclesCount, 0),
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${language === 'ar' ? 'font-arabic' : 'font-inter'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'ar' ? 'إدارة الموردين' : 'Vendors Management'}
          </h1>
          <p className="text-gray-600">
            {language === 'ar'
              ? 'إدارة بيانات الموردين وشركات النقل'
              : 'Manage vendors and transport companies information'}
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {language === 'ar' ? 'إجمالي الموردين' : 'Total Vendors'}
                </p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Building className="w-10 h-10 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {language === 'ar' ? 'موردين نشطين' : 'Active Vendors'}
                </p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <Users className="w-10 h-10 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {language === 'ar' ? 'قيمة العقود' : 'Contracts Value'}
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {(stats.totalValue / 1000000).toFixed(1)}M
                </p>
              </div>
              <CreditCard className="w-10 h-10 text-purple-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {language === 'ar' ? 'إجمالي المركبات' : 'Total Vehicles'}
                </p>
                <p className="text-2xl font-bold text-orange-600">{stats.totalVehicles}</p>
              </div>
              <Truck className="w-10 h-10 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1 w-full md:w-auto flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className={`absolute ${language === 'ar' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5`} />
                <input
                  type="text"
                  placeholder={language === 'ar' ? 'البحث عن مورد...' : 'Search vendors...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full ${language === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">{language === 'ar' ? 'جميع الحالات' : 'All Status'}</option>
                  <option value="active">{language === 'ar' ? 'نشط' : 'Active'}</option>
                  <option value="pending">{language === 'ar' ? 'قيد المراجعة' : 'Pending'}</option>
                  <option value="suspended">{language === 'ar' ? 'معلق' : 'Suspended'}</option>
                </select>
              </div>
            </div>
            <button 
              onClick={() => router.push('/admin/vendors/new')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {language === 'ar' ? 'إضافة مورد' : 'Add Vendor'}
            </button>
          </div>
        </div>

        {/* Vendors Grid */}
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
                    <p className="text-sm text-gray-500">{vendor.id}</p>
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
                    <span className="text-gray-700 truncate">{vendor.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{vendor.address}</span>
                  </div>
                </div>

                {/* Services */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {vendor.services.map((service: string, idx: number) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      {language === 'ar' ? 'العقود' : 'Contracts'}
                    </p>
                    <p className="text-sm font-semibold text-gray-900">{vendor.totalContracts}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      {language === 'ar' ? 'المركبات' : 'Vehicles'}
                    </p>
                    <p className="text-sm font-semibold text-gray-900">{vendor.vehiclesCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      {language === 'ar' ? 'التقييم' : 'Rating'}
                    </p>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold text-gray-900">{vendor.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                    <Eye className="w-4 h-4" />
                    {language === 'ar' ? 'عرض' : 'View'}
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                    <Edit className="w-4 h-4" />
                    {language === 'ar' ? 'تعديل' : 'Edit'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredVendors.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {language === 'ar' ? 'لا توجد موردين' : 'No Vendors Found'}
            </h3>
            <p className="text-gray-600 mb-6">
              {language === 'ar'
                ? 'لم يتم العثور على موردين مطابقين لمعايير البحث'
                : 'No vendors match your search criteria'}
            </p>
            <button 
              onClick={() => router.push('/admin/vendors/new')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {language === 'ar' ? 'إضافة مورد جديد' : 'Add New Vendor'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
