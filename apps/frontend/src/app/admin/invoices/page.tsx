'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  Calendar,
  User,
  Building2,
  TrendingUp,
  X
} from 'lucide-react';

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  tax: number;
  totalAmount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  notes: string;
  createdAt: string;
}

export default function InvoicesPage() {
  const { language } = useLanguage();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('invoices') || '[]');
    setInvoices(saved);
  }, []);

  const stats = {
    total: invoices.length,
    draft: invoices.filter(i => i.status === 'draft').length,
    sent: invoices.filter(i => i.status === 'sent').length,
    paid: invoices.filter(i => i.status === 'paid').length,
    overdue: invoices.filter(i => i.status === 'overdue').length,
    totalAmount: invoices.reduce((sum, i) => sum + i.totalAmount, 0),
    paidAmount: invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.totalAmount, 0),
    pendingAmount: invoices.filter(i => i.status === 'sent' || i.status === 'overdue').reduce((sum, i) => sum + i.totalAmount, 0)
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <FileText className="w-4 h-4" />;
      case 'sent':
        return <Send className="w-4 h-4" />;
      case 'paid':
        return <CheckCircle className="w-4 h-4" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4" />;
      case 'cancelled':
        return <X className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      draft: language === 'ar' ? 'مسودة' : 'Draft',
      sent: language === 'ar' ? 'مرسلة' : 'Sent',
      paid: language === 'ar' ? 'مدفوعة' : 'Paid',
      overdue: language === 'ar' ? 'متأخرة' : 'Overdue',
      cancelled: language === 'ar' ? 'ملغاة' : 'Cancelled'
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

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowDetailsModal(true);
  };

  const handleStatusChange = (invoiceId: string, newStatus: Invoice['status']) => {
    const updatedInvoices = invoices.map(inv =>
      inv.id === invoiceId ? { ...inv, status: newStatus } : inv
    );
    setInvoices(updatedInvoices);
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    // Placeholder for download functionality
    console.log('Downloading invoice:', invoice.invoiceNumber);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {language === 'ar' ? 'الفواتير' : 'Invoices'}
              </h1>
              <p className="text-gray-600">
                {language === 'ar' ? 'إدارة الفواتير والمدفوعات' : 'Manage invoices and payments'}
              </p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-xl">
            <Plus className="w-5 h-5" />
            {language === 'ar' ? 'فاتورة جديدة' : 'New Invoice'}
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">
                  {language === 'ar' ? 'إجمالي الفواتير' : 'Total Invoices'}
                </p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">
                  {language === 'ar' ? 'المدفوعة' : 'Paid'}
                </p>
                <p className="text-3xl font-bold text-gray-900">{stats.paid}</p>
                <p className="text-sm text-green-600 font-medium mt-1">
                  {formatCurrency(stats.paidAmount)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">
                  {language === 'ar' ? 'المعلقة' : 'Pending'}
                </p>
                <p className="text-3xl font-bold text-gray-900">{stats.sent}</p>
                <p className="text-sm text-blue-600 font-medium mt-1">
                  {formatCurrency(stats.pendingAmount)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">
                  {language === 'ar' ? 'المتأخرة' : 'Overdue'}
                </p>
                <p className="text-3xl font-bold text-gray-900">{stats.overdue}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={language === 'ar' ? 'بحث برقم الفاتورة أو اسم العميل...' : 'Search by invoice number or customer...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">{language === 'ar' ? 'جميع الحالات' : 'All Status'}</option>
                <option value="draft">{language === 'ar' ? 'مسودة' : 'Draft'}</option>
                <option value="sent">{language === 'ar' ? 'مرسلة' : 'Sent'}</option>
                <option value="paid">{language === 'ar' ? 'مدفوعة' : 'Paid'}</option>
                <option value="overdue">{language === 'ar' ? 'متأخرة' : 'Overdue'}</option>
                <option value="cancelled">{language === 'ar' ? 'ملغاة' : 'Cancelled'}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">
                {language === 'ar' ? 'لا توجد فواتير' : 'No invoices found'}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                {language === 'ar' ? 'ابدأ بإنشاء فاتورة جديدة' : 'Start by creating a new invoice'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-purple-50 to-purple-100 border-b border-purple-200">
                  <tr>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                      {language === 'ar' ? 'رقم الفاتورة' : 'Invoice #'}
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                      {language === 'ar' ? 'العميل' : 'Customer'}
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                      {language === 'ar' ? 'تاريخ الإصدار' : 'Issue Date'}
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                      {language === 'ar' ? 'تاريخ الاستحقاق' : 'Due Date'}
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                      {language === 'ar' ? 'المبلغ' : 'Amount'}
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                      {language === 'ar' ? 'الحالة' : 'Status'}
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                      {language === 'ar' ? 'الإجراءات' : 'Actions'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-purple-600" />
                          <span className="font-medium text-gray-900">{invoice.invoiceNumber}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">{invoice.customerName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{invoice.issueDate}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{invoice.dueDate}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(invoice.totalAmount)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invoice.status)}`}>
                          {getStatusIcon(invoice.status)}
                          {getStatusText(invoice.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewInvoice(invoice)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title={language === 'ar' ? 'عرض' : 'View'}
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDownloadInvoice(invoice)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title={language === 'ar' ? 'تحميل' : 'Download'}
                          >
                            <Download className="w-5 h-5" />
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

        {/* Details Modal */}
        {showDetailsModal && selectedInvoice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8" />
                    <div>
                      <h2 className="text-2xl font-bold">{selectedInvoice.invoiceNumber}</h2>
                      <p className="text-purple-100">{language === 'ar' ? 'تفاصيل الفاتورة' : 'Invoice Details'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Customer & Dates Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">
                      {language === 'ar' ? 'العميل' : 'Customer'}
                    </label>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Building2 className="w-5 h-5 text-gray-400" />
                      <span className="font-medium">{selectedInvoice.customerName}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">
                      {language === 'ar' ? 'الحالة' : 'Status'}
                    </label>
                    <span className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium ${getStatusColor(selectedInvoice.status)}`}>
                      {getStatusIcon(selectedInvoice.status)}
                      {getStatusText(selectedInvoice.status)}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">
                      {language === 'ar' ? 'تاريخ الإصدار' : 'Issue Date'}
                    </label>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span>{selectedInvoice.issueDate}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">
                      {language === 'ar' ? 'تاريخ الاستحقاق' : 'Due Date'}
                    </label>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span>{selectedInvoice.dueDate}</span>
                    </div>
                  </div>
                </div>

                {/* Items */}
                {selectedInvoice.items && selectedInvoice.items.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900">
                      {language === 'ar' ? 'البنود' : 'Items'}
                    </h3>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">
                              {language === 'ar' ? 'الوصف' : 'Description'}
                            </th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">
                              {language === 'ar' ? 'الكمية' : 'Quantity'}
                            </th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">
                              {language === 'ar' ? 'سعر الوحدة' : 'Unit Price'}
                            </th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">
                              {language === 'ar' ? 'المجموع' : 'Total'}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {selectedInvoice.items.map((item, index) => (
                            <tr key={index}>
                              <td className="px-4 py-3 text-gray-900">{item.description}</td>
                              <td className="px-4 py-3 text-gray-600">{item.quantity}</td>
                              <td className="px-4 py-3 text-gray-600">{formatCurrency(item.unitPrice)}</td>
                              <td className="px-4 py-3 font-medium text-gray-900">{formatCurrency(item.total)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Totals */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>{language === 'ar' ? 'المبلغ الأساسي' : 'Subtotal'}</span>
                    <span className="font-medium">{formatCurrency(selectedInvoice.amount)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>{language === 'ar' ? 'الضريبة' : 'Tax'}</span>
                    <span className="font-medium">{formatCurrency(selectedInvoice.tax)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                    <span>{language === 'ar' ? 'الإجمالي' : 'Total'}</span>
                    <span className="text-purple-600">{formatCurrency(selectedInvoice.totalAmount)}</span>
                  </div>
                </div>

                {/* Notes */}
                {selectedInvoice.notes && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">
                      {language === 'ar' ? 'ملاحظات' : 'Notes'}
                    </label>
                    <p className="p-3 bg-gray-50 rounded-lg text-gray-700">{selectedInvoice.notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => handleDownloadInvoice(selectedInvoice)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    {language === 'ar' ? 'تحميل PDF' : 'Download PDF'}
                  </button>
                  {selectedInvoice.status === 'sent' && (
                    <button
                      onClick={() => {
                        handleStatusChange(selectedInvoice.id, 'paid');
                        setShowDetailsModal(false);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <CheckCircle className="w-5 h-5" />
                      {language === 'ar' ? 'تأكيد الدفع' : 'Mark as Paid'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
