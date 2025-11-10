'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  FileText,
  Calendar,
  DollarSign,
  Users,
  Clock,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  ShoppingCart,
  Award,
  Briefcase,
  ArrowLeft,
  Edit,
  Eye,
  Trash2,
  Plus,
} from 'lucide-react';

interface TenderDetails {
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
  documentPrice: number;
  publishDate: string;
  documentSaleStart: string;
  documentSaleEnd: string;
  submissionDeadline: string;
  openingDate: string;
  awardDate: string;
  workStartDate: string;
  workEndDate: string;
  items: any[];
  documents: any[];
  milestones: any[];
  bids: any[];
  documentPurchases: any[];
  evaluations: any[];
}

export default function TenderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { language } = useLanguage();
  const [tender, setTender] = useState<TenderDetails | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch tender details
    // This is mock data - replace with actual API call
    setTender({
      id: id as string,
      tenderNumber: 'TND-000001',
      title: 'Cargo Transport Cairo to Alexandria',
      titleAr: 'نقل بضائع من القاهرة إلى الإسكندرية',
      description: 'Transport 500 tons of mixed cargo from Cairo to Alexandria port',
      descriptionAr: 'نقل 500 طن من البضائع المتنوعة من القاهرة إلى ميناء الإسكندرية',
      status: 'SUBMISSION_OPEN',
      type: 'PUBLIC',
      estimatedValue: 250000,
      currency: 'EGP',
      documentPrice: 500,
      publishDate: '2024-11-01',
      documentSaleStart: '2024-11-01',
      documentSaleEnd: '2024-11-20',
      submissionDeadline: '2024-11-25',
      openingDate: '2024-11-26',
      awardDate: '',
      workStartDate: '2024-12-01',
      workEndDate: '2025-01-31',
      items: [
        {
          id: '1',
          itemNumber: '1',
          description: 'Transport general cargo',
          descriptionAr: 'نقل بضائع عامة',
          quantity: 300,
          unit: 'Ton',
          unitAr: 'طن',
          estimatedPrice: 150000,
        },
        {
          id: '2',
          itemNumber: '2',
          description: 'Transport refrigerated goods',
          descriptionAr: 'نقل بضائع مبردة',
          quantity: 200,
          unit: 'Ton',
          unitAr: 'طن',
          estimatedPrice: 100000,
        },
      ],
      documents: [
        {
          id: '1',
          title: 'Technical Specifications',
          titleAr: 'المواصفات الفنية',
          type: 'TECHNICAL',
          fileName: 'tech_specs.pdf',
          fileSize: 2048,
        },
        {
          id: '2',
          title: 'Terms and Conditions',
          titleAr: 'الشروط والأحكام',
          type: 'TERMS',
          fileName: 'terms.pdf',
          fileSize: 1024,
        },
      ],
      milestones: [
        {
          id: '1',
          milestoneNumber: 1,
          title: 'Initial Setup',
          titleAr: 'الإعداد الأولي',
          percentage: 20,
          amount: 50000,
          status: 'PENDING',
        },
        {
          id: '2',
          milestoneNumber: 2,
          title: 'Phase 1 Delivery',
          titleAr: 'تسليم المرحلة الأولى',
          percentage: 40,
          amount: 100000,
          status: 'PENDING',
        },
        {
          id: '3',
          milestoneNumber: 3,
          title: 'Phase 2 Delivery',
          titleAr: 'تسليم المرحلة الثانية',
          percentage: 30,
          amount: 75000,
          status: 'PENDING',
        },
        {
          id: '4',
          milestoneNumber: 4,
          title: 'Final Completion',
          titleAr: 'الإنجاز النهائي',
          percentage: 10,
          amount: 25000,
          status: 'PENDING',
        },
      ],
      bids: [
        {
          id: '1',
          bidNumber: 'BID-000001',
          vendor: { name: 'ABC Transport', nameAr: 'شركة النقل ABC' },
          totalAmount: 230000,
          status: 'SUBMITTED',
          submittedDate: '2024-11-15',
        },
        {
          id: '2',
          bidNumber: 'BID-000002',
          vendor: { name: 'XYZ Logistics', nameAr: 'شركة لوجستيات XYZ' },
          totalAmount: 245000,
          status: 'SUBMITTED',
          submittedDate: '2024-11-16',
        },
      ],
      documentPurchases: [
        {
          id: '1',
          purchaseNumber: 'DOC-000001',
          vendor: { name: 'ABC Transport', nameAr: 'شركة النقل ABC' },
          amount: 500,
          status: 'PAID',
          purchaseDate: '2024-11-05',
        },
        {
          id: '2',
          purchaseNumber: 'DOC-000002',
          vendor: { name: 'XYZ Logistics', nameAr: 'شركة لوجستيات XYZ' },
          amount: 500,
          status: 'PAID',
          purchaseDate: '2024-11-06',
        },
      ],
      evaluations: [],
    });
    setLoading(false);
  }, [id]);

  const getStatusColor = (status: string) => {
    const colors: any = {
      DRAFT: 'bg-gray-100 text-gray-800',
      PUBLISHED: 'bg-blue-100 text-blue-800',
      SUBMISSION_OPEN: 'bg-green-100 text-green-800',
      SUBMISSION_CLOSED: 'bg-yellow-100 text-yellow-800',
      UNDER_EVALUATION: 'bg-purple-100 text-purple-800',
      AWARDED: 'bg-indigo-100 text-indigo-800',
      WORK_IN_PROGRESS: 'bg-orange-100 text-orange-800',
      COMPLETED: 'bg-emerald-100 text-emerald-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const statusMap: any = {
      DRAFT: language === 'ar' ? 'مسودة' : 'Draft',
      PUBLISHED: language === 'ar' ? 'منشورة' : 'Published',
      SUBMISSION_OPEN: language === 'ar' ? 'مفتوحة للتقديم' : 'Submission Open',
      SUBMISSION_CLOSED: language === 'ar' ? 'مغلقة للتقديم' : 'Submission Closed',
      UNDER_EVALUATION: language === 'ar' ? 'تحت التقييم' : 'Under Evaluation',
      AWARDED: language === 'ar' ? 'تم الإرساء' : 'Awarded',
      WORK_IN_PROGRESS: language === 'ar' ? 'جاري التنفيذ' : 'Work in Progress',
      COMPLETED: language === 'ar' ? 'مكتملة' : 'Completed',
      CANCELLED: language === 'ar' ? 'ملغاة' : 'Cancelled',
    };
    return statusMap[status] || status;
  };

  if (loading || !tender) {
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
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            {language === 'ar' ? 'رجوع' : 'Back'}
          </button>
          
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {language === 'ar' ? tender.titleAr : tender.title}
                </h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(tender.status)}`}>
                  {getStatusText(tender.status)}
                </span>
              </div>
              <p className="text-gray-600">{tender.tenderNumber}</p>
            </div>
            
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Edit className="w-4 h-4" />
                {language === 'ar' ? 'تحرير' : 'Edit'}
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download className="w-4 h-4" />
                {language === 'ar' ? 'تصدير' : 'Export'}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {language === 'ar' ? 'القيمة المقدرة' : 'Estimated Value'}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {tender.estimatedValue.toLocaleString()} {tender.currency}
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {language === 'ar' ? 'العروض المقدمة' : 'Submitted Bids'}
                </p>
                <p className="text-2xl font-bold text-gray-900">{tender.bids.length}</p>
              </div>
              <Users className="w-10 h-10 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {language === 'ar' ? 'شراء المستندات' : 'Document Purchases'}
                </p>
                <p className="text-2xl font-bold text-gray-900">{tender.documentPurchases.length}</p>
              </div>
              <ShoppingCart className="w-10 h-10 text-orange-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {language === 'ar' ? 'الموعد النهائي' : 'Deadline'}
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {new Date(tender.submissionDeadline).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}
                </p>
              </div>
              <Clock className="w-10 h-10 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="border-b">
            <div className="flex overflow-x-auto">
              {[
                { id: 'overview', label: language === 'ar' ? 'نظرة عامة' : 'Overview', icon: Eye },
                { id: 'items', label: language === 'ar' ? 'البنود' : 'Items', icon: FileText },
                { id: 'milestones', label: language === 'ar' ? 'المراحل' : 'Milestones', icon: TrendingUp },
                { id: 'documents', label: language === 'ar' ? 'المستندات' : 'Documents', icon: Download },
                { id: 'purchases', label: language === 'ar' ? 'شراء الكراسة' : 'Purchases', icon: ShoppingCart },
                { id: 'bids', label: language === 'ar' ? 'العروض' : 'Bids', icon: Award },
                { id: 'timeline', label: language === 'ar' ? 'الجدول الزمني' : 'Timeline', icon: Calendar },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    {language === 'ar' ? 'الوصف' : 'Description'}
                  </h3>
                  <p className="text-gray-700">
                    {language === 'ar' ? tender.descriptionAr : tender.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      {language === 'ar' ? 'معلومات مالية' : 'Financial Information'}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {language === 'ar' ? 'القيمة المقدرة:' : 'Estimated Value:'}
                        </span>
                        <span className="font-medium">
                          {tender.estimatedValue.toLocaleString()} {tender.currency}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {language === 'ar' ? 'سعر الكراسة:' : 'Document Price:'}
                        </span>
                        <span className="font-medium">
                          {tender.documentPrice.toLocaleString()} {tender.currency}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      {language === 'ar' ? 'معلومات النوع' : 'Type Information'}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {language === 'ar' ? 'نوع المناقصة:' : 'Tender Type:'}
                        </span>
                        <span className="font-medium">
                          {tender.type === 'PUBLIC'
                            ? language === 'ar'
                              ? 'عامة'
                              : 'Public'
                            : language === 'ar'
                            ? 'محدودة'
                            : 'Limited'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {language === 'ar' ? 'الحالة:' : 'Status:'}
                        </span>
                        <span className={`px-2 py-1 rounded text-sm ${getStatusColor(tender.status)}`}>
                          {getStatusText(tender.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Items Tab */}
            {activeTab === 'items' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">
                    {language === 'ar' ? 'بنود المناقصة' : 'Tender Items'}
                  </h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Plus className="w-4 h-4" />
                    {language === 'ar' ? 'إضافة بند' : 'Add Item'}
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                          {language === 'ar' ? 'رقم البند' : 'Item #'}
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                          {language === 'ar' ? 'الوصف' : 'Description'}
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                          {language === 'ar' ? 'الكمية' : 'Quantity'}
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                          {language === 'ar' ? 'السعر المقدر' : 'Estimated Price'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {tender.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3">{item.itemNumber}</td>
                          <td className="px-4 py-3">
                            {language === 'ar' ? item.descriptionAr : item.description}
                          </td>
                          <td className="px-4 py-3">
                            {item.quantity} {language === 'ar' ? item.unitAr : item.unit}
                          </td>
                          <td className="px-4 py-3">
                            {item.estimatedPrice.toLocaleString()} {tender.currency}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Milestones Tab */}
            {activeTab === 'milestones' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">
                    {language === 'ar' ? 'مراحل التنفيذ' : 'Execution Milestones'}
                  </h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Plus className="w-4 h-4" />
                    {language === 'ar' ? 'إضافة مرحلة' : 'Add Milestone'}
                  </button>
                </div>
                <div className="space-y-4">
                  {tender.milestones.map((milestone) => (
                    <div key={milestone.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                            {milestone.milestoneNumber}
                          </div>
                          <div>
                            <h4 className="font-semibold">
                              {language === 'ar' ? milestone.titleAr : milestone.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {milestone.percentage}% - {milestone.amount.toLocaleString()} {tender.currency}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            milestone.status === 'COMPLETED'
                              ? 'bg-green-100 text-green-800'
                              : milestone.status === 'IN_PROGRESS'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {milestone.status === 'PENDING'
                            ? language === 'ar'
                              ? 'معلق'
                              : 'Pending'
                            : milestone.status === 'IN_PROGRESS'
                            ? language === 'ar'
                              ? 'جاري'
                              : 'In Progress'
                            : language === 'ar'
                            ? 'مكتمل'
                            : 'Completed'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">
                    {language === 'ar' ? 'المستندات' : 'Documents'}
                  </h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Upload className="w-4 h-4" />
                    {language === 'ar' ? 'رفع مستند' : 'Upload Document'}
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tender.documents.map((doc) => (
                    <div key={doc.id} className="border rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-blue-500" />
                        <div>
                          <h4 className="font-medium">
                            {language === 'ar' ? doc.titleAr : doc.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {doc.fileName} • {(doc.fileSize / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-gray-100 rounded">
                        <Download className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Purchases Tab */}
            {activeTab === 'purchases' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  {language === 'ar' ? 'سجل شراء كراسة الشروط' : 'Document Purchase History'}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                          {language === 'ar' ? 'رقم الشراء' : 'Purchase #'}
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                          {language === 'ar' ? 'المورد' : 'Vendor'}
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                          {language === 'ar' ? 'المبلغ' : 'Amount'}
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                          {language === 'ar' ? 'التاريخ' : 'Date'}
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                          {language === 'ar' ? 'الحالة' : 'Status'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {tender.documentPurchases.map((purchase) => (
                        <tr key={purchase.id}>
                          <td className="px-4 py-3">{purchase.purchaseNumber}</td>
                          <td className="px-4 py-3">
                            {language === 'ar' ? purchase.vendor.nameAr : purchase.vendor.name}
                          </td>
                          <td className="px-4 py-3">
                            {purchase.amount.toLocaleString()} {tender.currency}
                          </td>
                          <td className="px-4 py-3">
                            {new Date(purchase.purchaseDate).toLocaleDateString(
                              language === 'ar' ? 'ar-EG' : 'en-US'
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                              {language === 'ar' ? 'مدفوعة' : 'Paid'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Bids Tab */}
            {activeTab === 'bids' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  {language === 'ar' ? 'العروض المقدمة' : 'Submitted Bids'}
                </h3>
                <div className="space-y-4">
                  {tender.bids.map((bid) => (
                    <div key={bid.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-lg">{bid.bidNumber}</h4>
                          <p className="text-gray-600">
                            {language === 'ar' ? bid.vendor.nameAr : bid.vendor.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {language === 'ar' ? 'تاريخ التقديم:' : 'Submitted:'}{' '}
                            {new Date(bid.submittedDate).toLocaleDateString(
                              language === 'ar' ? 'ar-EG' : 'en-US'
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">
                            {bid.totalAmount.toLocaleString()} {tender.currency}
                          </p>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                            {language === 'ar' ? 'مقدم' : 'Submitted'}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                          {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                        </button>
                        <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                          {language === 'ar' ? 'تقييم' : 'Evaluate'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline Tab */}
            {activeTab === 'timeline' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  {language === 'ar' ? 'الجدول الزمني' : 'Timeline'}
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-blue-600"></div>
                      <div className="w-0.5 h-full bg-gray-300"></div>
                    </div>
                    <div className="flex-1 pb-8">
                      <h4 className="font-medium">{language === 'ar' ? 'تاريخ النشر' : 'Publish Date'}</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(tender.publishDate).toLocaleDateString(
                          language === 'ar' ? 'ar-EG' : 'en-US'
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-blue-600"></div>
                      <div className="w-0.5 h-full bg-gray-300"></div>
                    </div>
                    <div className="flex-1 pb-8">
                      <h4 className="font-medium">
                        {language === 'ar' ? 'بداية بيع كراسة الشروط' : 'Document Sale Start'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {new Date(tender.documentSaleStart).toLocaleDateString(
                          language === 'ar' ? 'ar-EG' : 'en-US'
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-yellow-600"></div>
                      <div className="w-0.5 h-full bg-gray-300"></div>
                    </div>
                    <div className="flex-1 pb-8">
                      <h4 className="font-medium">
                        {language === 'ar' ? 'نهاية بيع كراسة الشروط' : 'Document Sale End'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {new Date(tender.documentSaleEnd).toLocaleDateString(
                          language === 'ar' ? 'ar-EG' : 'en-US'
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-red-600"></div>
                      <div className="w-0.5 h-full bg-gray-300"></div>
                    </div>
                    <div className="flex-1 pb-8">
                      <h4 className="font-medium">
                        {language === 'ar' ? 'الموعد النهائي للتقديم' : 'Submission Deadline'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {new Date(tender.submissionDeadline).toLocaleDateString(
                          language === 'ar' ? 'ar-EG' : 'en-US'
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-purple-600"></div>
                      <div className="w-0.5 h-full bg-gray-300"></div>
                    </div>
                    <div className="flex-1 pb-8">
                      <h4 className="font-medium">
                        {language === 'ar' ? 'تاريخ فتح المظاريف' : 'Opening Date'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {new Date(tender.openingDate).toLocaleDateString(
                          language === 'ar' ? 'ar-EG' : 'en-US'
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-green-600"></div>
                      <div className="w-0.5 h-full bg-gray-300"></div>
                    </div>
                    <div className="flex-1 pb-8">
                      <h4 className="font-medium">
                        {language === 'ar' ? 'تاريخ بداية العمل' : 'Work Start Date'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {new Date(tender.workStartDate).toLocaleDateString(
                          language === 'ar' ? 'ar-EG' : 'en-US'
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-emerald-600"></div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">
                        {language === 'ar' ? 'تاريخ انتهاء العمل' : 'Work End Date'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {new Date(tender.workEndDate).toLocaleDateString(
                          language === 'ar' ? 'ar-EG' : 'en-US'
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
