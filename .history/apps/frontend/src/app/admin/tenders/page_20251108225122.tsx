'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
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
} from 'lucide-react';

export default function TendersPage() {
  const { language, translations } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const tenders = [
    {
      id: 'TND-001',
      title:
        language === 'ar'
          ? 'نقل بضائع من القاهرة إلى الإسكندرية'
          : 'Cargo Transport Cairo to Alexandria',
      value: '25,000',
      currency: 'EGP',
      deadline: '2024-12-15',
      status: 'active',
      bidsCount: 12,
      description:
        language === 'ar' ? 'نقل 500 طن من البضائع المتنوعة' : 'Transport 500 tons of mixed cargo',
      createdDate: '2024-11-01',
    },
    {
      id: 'TND-002',
      title:
        language === 'ar'
          ? 'خدمات التخليص الجمركي - ميناء السخنة'
          : 'Customs Clearance Services - Sokhna Port',
      value: '15,000',
      currency: 'EGP',
      deadline: '2024-12-20',
      status: 'pending',
      bidsCount: 8,
      description:
        language === 'ar'
          ? 'تخليص جمركي لحاويات متعددة'
          : 'Customs clearance for multiple containers',
      createdDate: '2024-11-05',
    },
    {
      id: 'TND-003',
      title: language === 'ar' ? 'نقل المواد الكيميائية الخطرة' : 'Hazardous Chemical Transport',
      value: '45,000',
      currency: 'EGP',
      deadline: '2024-11-30',
      status: 'closed',
      bidsCount: 15,
      description:
        language === 'ar'
          ? 'نقل آمن للمواد الكيميائية مع التراخيص اللازمة'
          : 'Safe transport of chemicals with required licenses',
      createdDate: '2024-10-20',
    },
  ];

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

  const filteredTenders = tenders.filter((tender) => {
    const matchesSearch =
      tender.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tender.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tender.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className={`min-h-screen bg-gray-50 ${language === 'ar' ? 'font-arabic' : 'font-inter'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {translations.tenders || (language === 'ar' ? 'إدارة المناقصات' : 'Tender Management')}
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
                <p className="text-2xl font-bold text-gray-900">24</p>
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
                <p className="text-2xl font-bold text-gray-900">8</p>
                <p className="text-sm text-gray-600">{language === 'ar' ? 'نشطة' : 'Active'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-orange-500 mb-2" />
              <div className={`${language === 'ar' ? 'mr-4' : 'ml-4'}`}>
                <p className="text-2xl font-bold text-gray-900">156</p>
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
                <p className="text-2xl font-bold text-gray-900">2.5M</p>
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
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
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
                      {tender.id}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{tender.title}</div>
                        <div className="text-sm text-gray-500">{tender.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tender.value} {tender.currency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tender.deadline}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {tender.bidsCount} {language === 'ar' ? 'عرض' : 'bids'}
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
                          className="text-blue-600 hover:text-blue-900"
                          aria-label={language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900"
                          aria-label={language === 'ar' ? 'تحرير' : 'Edit'}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
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
        </div>
      </div>
    </div>
  );
}
