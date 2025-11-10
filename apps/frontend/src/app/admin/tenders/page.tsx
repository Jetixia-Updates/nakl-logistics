'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import api from '@/lib/api';
import {
  FileText,
  Calendar,
  DollarSign,
  Users,
  Clock,
  Search,
  Plus,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
} from 'lucide-react';

interface Tender {
  id: string;
  tenderNumber: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  status: string;
  type: string;
  estimatedValue: number;
  currency: string;
  submissionDeadline: string | null;
  publishDate: string | null;
  createdAt: string;
  _count?: {
    bids: number;
    documentPurchases: number;
  };
}

interface Stats {
  totalTenders: number;
  activeTenders: number;
  completedTenders: number;
  totalBids: number;
  totalValue: number;
}

const mockTenders: Tender[] = [];

export default function TendersPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const stats: Stats = {
    totalTenders: 0,
    activeTenders: 0,
    completedTenders: 0,
    totalBids: 0,
    totalValue: 0,
  };
  
  const loading = false;
  const error = '';

  const handleViewTender = (id: string) => {
    router.push(`/admin/tenders/${id}`);
  };

  const handleCreateTender = () => {
    router.push('/admin/tenders/new');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      active: language === 'ar' ? 'نشط' : 'Active',
      pending: language === 'ar' ? 'معلق' : 'Pending',
      closed: language === 'ar' ? 'مغلق' : 'Closed',
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const filteredTenders = mockTenders.filter((tender) => {
    const matchesSearch =
      tender.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tender.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tender.tenderNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tender.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${language === 'ar' ? 'font-arabic' : 'font-inter'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="text-sm text-yellow-800">
                {language === 'ar' ? 'تحذير: ' : 'Warning: '}
                {error}
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                {language === 'ar' 
                  ? 'يتم عرض بيانات تجريبية. يرجى التأكد من تشغيل الخادم وتسجيل الدخول.'
                  : 'Showing mock data. Please ensure the server is running and you are logged in.'}
              </p>
            </div>
          </div>
        )}
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'ar' ? 'إدارة المناقصات' : 'Tender Management'}
          </h1>
          <p className="text-gray-600">
            {language === 'ar'
              ? 'إدارة المناقصات والعطاءات وتتبع العروض المقدمة'
              : 'Manage tenders, bids, and track submitted proposals'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-blue-500 mb-2" />
              <div className={`${language === 'ar' ? 'mr-4' : 'ml-4'}`}>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTenders}</p>
                <p className="text-sm text-gray-600">
                  {language === 'ar' ? 'إجمالي المناقصات' : 'Total Tenders'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-green-500 mb-2" />
              <div className={`${language === 'ar' ? 'mr-4' : 'ml-4'}`}>
                <p className="text-2xl font-bold text-gray-900">{stats.activeTenders}</p>
                <p className="text-sm text-gray-600">{language === 'ar' ? 'نشطة' : 'Active'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-orange-500 mb-2" />
              <div className={`${language === 'ar' ? 'mr-4' : 'ml-4'}`}>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBids}</p>
                <p className="text-sm text-gray-600">
                  {language === 'ar' ? 'إجمالي العروض' : 'Total Bids'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-purple-500 mb-2" />
              <div className={`${language === 'ar' ? 'mr-4' : 'ml-4'}`}>
                <p className="text-2xl font-bold text-gray-900">
                  {(stats.totalValue / 1000000).toFixed(1)}M
                </p>
                <p className="text-sm text-gray-600">
                  {language === 'ar' ? 'القيمة الإجمالية (ج.م)' : 'Total Value (EGP)'}
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
                  placeholder={language === 'ar' ? 'البحث عن المناقصات...' : 'Search tenders...'}
                  className={`w-full ${language === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  aria-label={language === 'ar' ? 'تصفية حسب الحالة' : 'Filter by status'}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">{language === 'ar' ? 'جميع الحالات' : 'All Status'}</option>
                  <option value="active">{language === 'ar' ? 'نشط' : 'Active'}</option>
                  <option value="pending">{language === 'ar' ? 'معلق' : 'Pending'}</option>
                  <option value="closed">{language === 'ar' ? 'مغلق' : 'Closed'}</option>
                </select>
              </div>
            </div>

              {/* Actions */}
            <div className="flex gap-2">
              <button 
                onClick={handleCreateTender}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                {language === 'ar' ? 'إضافة مناقصة' : 'Add Tender'}
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
                {language === 'ar' ? 'تصدير' : 'Export'}
              </button>
            </div>
          </div>
        </div>

        {/* Tenders List */}
        <div className="bg-white rounded-lg shadow-sm border">
          {filteredTenders.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {language === 'ar' ? 'لا توجد مناقصات' : 'No tenders found'}
              </h3>
              <p className="text-gray-500 mb-6">
                {language === 'ar' 
                  ? 'ابدأ بإضافة مناقصة جديدة للنظام'
                  : 'Start by adding a new tender to the system'}
              </p>
              <button 
                onClick={handleCreateTender}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                {language === 'ar' ? 'إضافة مناقصة' : 'Add Tender'}
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th
                      className={`${language === 'ar' ? 'text-right' : 'text-left'} px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider`}
                    >
                      {language === 'ar' ? 'رقم المناقصة' : 'Tender ID'}
                    </th>
                    <th
                      className={`${language === 'ar' ? 'text-right' : 'text-left'} px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider`}
                    >
                      {language === 'ar' ? 'العنوان' : 'Title'}
                    </th>
                    <th
                      className={`${language === 'ar' ? 'text-right' : 'text-left'} px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider`}
                    >
                      {language === 'ar' ? 'القيمة' : 'Value'}
                    </th>
                    <th
                      className={`${language === 'ar' ? 'text-right' : 'text-left'} px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider`}
                    >
                      {language === 'ar' ? 'الموعد النهائي' : 'Deadline'}
                    </th>
                    <th
                      className={`${language === 'ar' ? 'text-right' : 'text-left'} px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider`}
                    >
                      {language === 'ar' ? 'العروض' : 'Bids'}
                    </th>
                    <th
                      className={`${language === 'ar' ? 'text-right' : 'text-left'} px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider`}
                    >
                      {language === 'ar' ? 'الحالة' : 'Status'}
                    </th>
                    <th
                      className={`${language === 'ar' ? 'text-right' : 'text-left'} px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider`}
                    >
                      {language === 'ar' ? 'الإجراءات' : 'Actions'}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTenders.map((tender) => (
                  <tr key={tender.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {tender.tenderNumber}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {language === 'ar' ? tender.titleAr : tender.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {language === 'ar' 
                            ? tender.descriptionAr?.substring(0, 100) 
                            : tender.description?.substring(0, 100)}
                          {(language === 'ar' ? tender.descriptionAr : tender.description)?.length > 100 && '...'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tender.estimatedValue?.toLocaleString()} {tender.currency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tender.submissionDeadline 
                        ? new Date(tender.submissionDeadline).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {tender._count?.bids || 0} {language === 'ar' ? 'عرض' : 'bids'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(tender.status)}`}
                      >
                        {getStatusText(tender.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewTender(tender.id)}
                          className="text-blue-600 hover:text-blue-900"
                          aria-label={language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                          title={language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {tender.status === 'COMPLETED' && (
                          <button
                            onClick={() => {
                              localStorage.setItem('createAwardLetterFrom', JSON.stringify({
                                tenderNumber: tender.tenderNumber,
                                tenderTitle: language === 'ar' ? tender.titleAr : tender.title,
                                estimatedValue: tender.estimatedValue
                              }));
                              router.push('/admin/award-letters');
                            }}
                            className="text-amber-600 hover:text-amber-900"
                            aria-label={language === 'ar' ? 'إنشاء أمر إسناد' : 'Create Award Letter'}
                            title={language === 'ar' ? 'إنشاء أمر إسناد' : 'Create Award Letter'}
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => alert(language === 'ar' ? 'قريباً' : 'Coming soon')}
                          className="text-green-600 hover:text-green-900"
                          aria-label={language === 'ar' ? 'تحرير' : 'Edit'}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(language === 'ar' ? 'هل تريد حذف هذه المناقصة؟' : 'Delete this tender?')) {
                              alert(language === 'ar' ? 'قريباً' : 'Coming soon');
                            }
                          }}
                          className="text-red-600 hover:text-red-900"
                          aria-label={language === 'ar' ? 'حذف' : 'Delete'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
