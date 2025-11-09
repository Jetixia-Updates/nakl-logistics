'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  FileText, 
  Package, 
  CreditCard, 
  Calendar, 
  User,
  Building2,
  MapPin,
  Truck,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Download,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  DollarSign
} from 'lucide-react';

export default function InvoicesPage() {
  const { language, translations } = useLanguage();
  const [activeTab, setActiveTab] = useState('invoices');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Sample data
  const invoices = [
    {
      id: 'INV-2024-001',
      number: 'INV-2024-001',
      customer: {
        id: 'CUS-001',
        name: language === 'ar' ? 'شركة النصر للتجارة' : 'Al-Nasr Trading Company',
        contactPerson: language === 'ar' ? 'أحمد محمد علي' : 'Ahmed Mohamed Ali'
      },
      workOrder: 'WO-2024-045',
      issueDate: '2024-11-08',
      dueDate: '2024-12-08',
      status: 'pending',
      amount: 125000,
      tax: 18750,
      total: 143750,
      paidAmount: 0,
      remainingAmount: 143750,
      services: [
        { name: language === 'ar' ? 'نقل بري من القاهرة للإسكندرية' : 'Land transport Cairo to Alexandria', quantity: 1, rate: 100000, amount: 100000 },
        { name: language === 'ar' ? 'تأمين البضائع' : 'Cargo insurance', quantity: 1, rate: 15000, amount: 15000 },
        { name: language === 'ar' ? 'رسوم إضافية' : 'Additional fees', quantity: 1, rate: 10000, amount: 10000 }
      ],
      paymentMethod: 'bank_transfer',
      notes: language === 'ar' ? 'دفع خلال 30 يوم من تاريخ الفاتورة' : 'Payment within 30 days of invoice date'
    },
    {
      id: 'INV-2024-002',
      number: 'INV-2024-002',
      customer: {
        id: 'CUS-002',
        name: language === 'ar' ? 'المجموعة المتحدة للاستيراد' : 'United Import Group',
        contactPerson: language === 'ar' ? 'فاطمة أحمد حسن' : 'Fatma Ahmed Hassan'
      },
      workOrder: 'WO-2024-046',
      issueDate: '2024-11-07',
      dueDate: '2024-11-22',
      status: 'paid',
      amount: 85000,
      tax: 12750,
      total: 97750,
      paidAmount: 97750,
      remainingAmount: 0,
      services: [
        { name: language === 'ar' ? 'نقل بحري من الإسكندرية لدمياط' : 'Sea transport Alexandria to Damietta', quantity: 1, rate: 70000, amount: 70000 },
        { name: language === 'ar' ? 'تخليص جمركي' : 'Customs clearance', quantity: 1, rate: 15000, amount: 15000 }
      ],
      paymentMethod: 'cash',
      notes: language === 'ar' ? 'تم الدفع نقداً' : 'Paid in cash'
    },
    {
      id: 'INV-2024-003',
      number: 'INV-2024-003',
      customer: {
        id: 'CUS-003',
        name: language === 'ar' ? 'مؤسسة الشرق الأوسط' : 'Middle East Corporation',
        contactPerson: language === 'ar' ? 'خالد محمود سليم' : 'Khaled Mahmoud Salim'
      },
      workOrder: 'WO-2024-047',
      issueDate: '2024-11-06',
      dueDate: '2024-11-13',
      status: 'overdue',
      amount: 220000,
      tax: 33000,
      total: 253000,
      paidAmount: 150000,
      remainingAmount: 103000,
      services: [
        { name: language === 'ar' ? 'نقل خاص للمعدات الثقيلة' : 'Special transport for heavy equipment', quantity: 2, rate: 100000, amount: 200000 },
        { name: language === 'ar' ? 'خدمات إضافية' : 'Additional services', quantity: 1, rate: 20000, amount: 20000 }
      ],
      paymentMethod: 'bank_transfer',
      notes: language === 'ar' ? 'دفع جزئي - المتبقي مستحق' : 'Partial payment - remaining overdue'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      'draft': language === 'ar' ? 'مسودة' : 'Draft',
      'pending': language === 'ar' ? 'معلقة' : 'Pending',
      'paid': language === 'ar' ? 'مدفوعة' : 'Paid',
      'overdue': language === 'ar' ? 'متأخرة' : 'Overdue',
      'cancelled': language === 'ar' ? 'ملغية' : 'Cancelled'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <FileText className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'paid': return <CheckCircle className="w-4 h-4" />;
      case 'overdue': return <AlertCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const calculateStats = () => {
    const totalAmount = invoices.reduce((sum, inv) => sum + inv.total, 0);
    const paidAmount = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
    const pendingAmount = invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.remainingAmount, 0);
    const overdueAmount = invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.remainingAmount, 0);

    return { totalAmount, paidAmount, pendingAmount, overdueAmount };
  };

  const stats = calculateStats();

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.workOrder.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className={`min-h-screen bg-gray-50 ${language === 'ar' ? 'font-arabic' : 'font-inter'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'ar' ? 'إدارة الفواتير' : 'Invoice Management'}
          </h1>
          <p className="text-gray-600">
            {language === 'ar' ? 'إدارة الفواتير ومتابعة المدفوعات' : 'Manage invoices and track payments'}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-blue-500" />
              <div className={`${language === 'ar' ? 'mr-4' : 'ml-4'}`}>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalAmount)}</p>
                <p className="text-sm text-gray-600">{language === 'ar' ? 'إجمالي الفواتير' : 'Total Invoices'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div className={`${language === 'ar' ? 'mr-4' : 'ml-4'}`}>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.paidAmount)}</p>
                <p className="text-sm text-gray-600">{language === 'ar' ? 'المبلغ المدفوع' : 'Amount Paid'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-500" />
              <div className={`${language === 'ar' ? 'mr-4' : 'ml-4'}`}>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.pendingAmount)}</p>
                <p className="text-sm text-gray-600">{language === 'ar' ? 'المبلغ المعلق' : 'Pending Amount'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <AlertCircle className="w-8 h-8 text-red-500" />
              <div className={`${language === 'ar' ? 'mr-4' : 'ml-4'}`}>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.overdueAmount)}</p>
                <p className="text-sm text-gray-600">{language === 'ar' ? 'المبلغ المتأخر' : 'Overdue Amount'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className={`absolute ${language === 'ar' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5`} />
                <input
                  type="text"
                  placeholder={language === 'ar' ? 'البحث في الفواتير...' : 'Search invoices...'}
                  className={`w-full ${language === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">{language === 'ar' ? 'جميع الحالات' : 'All Status'}</option>
                  <option value="draft">{language === 'ar' ? 'مسودة' : 'Draft'}</option>
                  <option value="pending">{language === 'ar' ? 'معلقة' : 'Pending'}</option>
                  <option value="paid">{language === 'ar' ? 'مدفوعة' : 'Paid'}</option>
                  <option value="overdue">{language === 'ar' ? 'متأخرة' : 'Overdue'}</option>
                </select>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              {language === 'ar' ? 'فاتورة جديدة' : 'New Invoice'}
            </button>
          </div>
        </div>

        {/* Invoices List */}
        <div className="space-y-4">
          {filteredInvoices.map((invoice) => (
            <div key={invoice.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                  <div className="flex items-start gap-4 mb-4 md:mb-0">
                    <div className={`p-3 rounded-lg ${getStatusColor(invoice.status)} bg-opacity-20`}>
                      {getStatusIcon(invoice.status)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{invoice.number}</h3>
                      <p className="text-sm text-gray-600">{language === 'ar' ? 'أمر العمل:' : 'Work Order:'} {invoice.workOrder}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                          {getStatusIcon(invoice.status)}
                          {getStatusText(invoice.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(invoice.total)}</p>
                    <p className="text-sm text-gray-600">{language === 'ar' ? 'إجمالي الفاتورة' : 'Total Amount'}</p>
                    {invoice.remainingAmount > 0 && (
                      <p className="text-sm text-red-600 mt-1">
                        {language === 'ar' ? 'المتبقي:' : 'Remaining:'} {formatCurrency(invoice.remainingAmount)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Customer & Dates */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">{language === 'ar' ? 'العميل' : 'Customer'}</p>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{invoice.customer.name}</p>
                        <p className="text-xs text-gray-600">{invoice.customer.contactPerson}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">{language === 'ar' ? 'تاريخ الإصدار' : 'Issue Date'}</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{invoice.issueDate}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">{language === 'ar' ? 'تاريخ الاستحقاق' : 'Due Date'}</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className={`text-sm ${invoice.status === 'overdue' ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                        {invoice.dueDate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Services */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-700 mb-3">{language === 'ar' ? 'الخدمات' : 'Services'}</p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-2">
                      {invoice.services.map((service, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{service.name}</p>
                            <p className="text-xs text-gray-600">
                              {language === 'ar' ? 'الكمية:' : 'Qty:'} {service.quantity} × {formatCurrency(service.rate)}
                            </p>
                          </div>
                          <p className="text-sm font-medium text-gray-900">{formatCurrency(service.amount)}</p>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-gray-300 pt-3 mt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{language === 'ar' ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                        <span className="text-gray-900">{formatCurrency(invoice.amount)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{language === 'ar' ? 'الضريبة (15%):' : 'Tax (15%):'}</span>
                        <span className="text-gray-900">{formatCurrency(invoice.tax)}</span>
                      </div>
                      <div className="flex justify-between text-base font-semibold border-t border-gray-300 pt-2">
                        <span className="text-gray-900">{language === 'ar' ? 'الإجمالي:' : 'Total:'}</span>
                        <span className="text-gray-900">{formatCurrency(invoice.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                {invoice.paidAmount > 0 && (
                  <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-green-800">{language === 'ar' ? 'المبلغ المدفوع' : 'Amount Paid'}</p>
                        <p className="text-xs text-green-600">{language === 'ar' ? 'طريقة الدفع:' : 'Payment Method:'} {invoice.paymentMethod}</p>
                      </div>
                      <p className="text-lg font-bold text-green-800">{formatCurrency(invoice.paidAmount)}</p>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {invoice.notes && (
                  <div className="mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-2">{language === 'ar' ? 'ملاحظات' : 'Notes'}</p>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{invoice.notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                    <Eye className="w-4 h-4" />
                    {language === 'ar' ? 'عرض' : 'View'}
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium">
                    <Edit className="w-4 h-4" />
                    {language === 'ar' ? 'تعديل' : 'Edit'}
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium">
                    <Download className="w-4 h-4" />
                    {language === 'ar' ? 'تحميل PDF' : 'Download PDF'}
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium">
                    <Send className="w-4 h-4" />
                    {language === 'ar' ? 'إرسال' : 'Send'}
                  </button>
                  {invoice.status === 'pending' && (
                    <button className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors text-sm font-medium">
                      <CreditCard className="w-4 h-4" />
                      {language === 'ar' ? 'تسجيل دفعة' : 'Record Payment'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredInvoices.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {language === 'ar' ? 'لا توجد فواتير' : 'No invoices found'}
            </h3>
            <p className="text-gray-600">
              {language === 'ar' ? 'لم يتم العثور على فواتير تطابق البحث' : 'No invoices match your search criteria'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}