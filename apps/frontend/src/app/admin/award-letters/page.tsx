'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Award,
  FileText,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Download,
  Send,
  Building2,
  User,
  TrendingUp,
  AlertCircle,
  X
} from 'lucide-react';

interface AwardLetter {
  id: string;
  letterNumber: string;
  tenderId: string;
  tenderNumber: string;
  tenderTitle: string;
  winnerCompanyId: string;
  winnerCompanyName: string;
  awardedAmount: number;
  originalBidAmount: number;
  discount: number;
  scopeOfWork: string;
  issueDate: string;
  validityPeriod: number; // days
  expiryDate: string;
  status: 'draft' | 'issued' | 'accepted' | 'rejected' | 'expired';
  issuedBy: string;
  approvedBy: string;
  contractNumber?: string;
  contractDate?: string;
  contractDuration?: number; // months
  contractTerms?: string;
  notes: string;
  attachments: string[];
  createdAt: string;
}

export default function AwardLettersPage() {
  const { language } = useLanguage();
  
  const [awardLetters, setAwardLetters] = useState<AwardLetter[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<AwardLetter | null>(null);

  const [newLetter, setNewLetter] = useState({
    tenderNumber: '',
    tenderTitle: '',
    winnerCompanyName: '',
    awardedAmount: 0,
    originalBidAmount: 0,
    scopeOfWork: '',
    issueDate: '',
    validityPeriod: 30,
    issuedBy: '',
    approvedBy: '',
    contractNumber: '',
    contractDate: '',
    contractDuration: 12,
    contractTerms: '',
    notes: ''
  });

  useEffect(() => {
    // Check if creating from tender
    if (typeof window !== 'undefined') {
      const createFrom = localStorage.getItem('createAwardLetterFrom');
      if (createFrom) {
        const tenderData = JSON.parse(createFrom);
        setNewLetter(prev => ({
          ...prev,
          tenderNumber: tenderData.tenderNumber,
          tenderTitle: tenderData.tenderTitle,
          awardedAmount: tenderData.estimatedValue,
          originalBidAmount: tenderData.estimatedValue
        }));
        setShowCreateModal(true);
        localStorage.removeItem('createAwardLetterFrom');
      }
    }

    const saved = JSON.parse(localStorage.getItem('awardLetters') || '[]');
    setAwardLetters(saved);
  }, []);

  const stats = {
    total: awardLetters.length,
    issued: awardLetters.filter(l => l.status === 'issued').length,
    accepted: awardLetters.filter(l => l.status === 'accepted').length,
    totalValue: awardLetters.reduce((sum, l) => sum + l.awardedAmount, 0)
  };

  const filteredLetters = awardLetters.filter(letter => {
    const matchesSearch = 
      letter.letterNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      letter.tenderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      letter.tenderTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      letter.winnerCompanyName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || letter.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateLetter = () => {
    const expiryDate = new Date(newLetter.issueDate);
    expiryDate.setDate(expiryDate.getDate() + newLetter.validityPeriod);

    const letter: AwardLetter = {
      id: Date.now().toString(),
      letterNumber: `AWD-${new Date().getFullYear()}-${String(awardLetters.length + 1).padStart(3, '0')}`,
      tenderId: `T${Date.now()}`,
      tenderNumber: newLetter.tenderNumber,
      tenderTitle: newLetter.tenderTitle,
      winnerCompanyId: `C${Date.now()}`,
      winnerCompanyName: newLetter.winnerCompanyName,
      awardedAmount: newLetter.awardedAmount,
      originalBidAmount: newLetter.originalBidAmount,
      discount: newLetter.originalBidAmount - newLetter.awardedAmount,
      scopeOfWork: newLetter.scopeOfWork,
      issueDate: newLetter.issueDate,
      validityPeriod: newLetter.validityPeriod,
      expiryDate: expiryDate.toISOString().split('T')[0],
      status: 'draft',
      issuedBy: newLetter.issuedBy,
      approvedBy: newLetter.approvedBy,
      contractNumber: newLetter.contractNumber,
      contractDate: newLetter.contractDate,
      contractDuration: newLetter.contractDuration,
      contractTerms: newLetter.contractTerms,
      notes: newLetter.notes,
      attachments: [],
      createdAt: new Date().toISOString()
    };

    const updated = [...awardLetters, letter];
    setAwardLetters(updated);
    localStorage.setItem('awardLetters', JSON.stringify(updated));
    
    setShowCreateModal(false);
    setNewLetter({
      tenderNumber: '',
      tenderTitle: '',
      winnerCompanyName: '',
      awardedAmount: 0,
      originalBidAmount: 0,
      scopeOfWork: '',
      issueDate: '',
      validityPeriod: 30,
      issuedBy: '',
      approvedBy: '',
      contractNumber: '',
      contractDate: '',
      contractDuration: 12,
      contractTerms: '',
      notes: ''
    });
    
    alert(language === 'ar' ? 'تم إنشاء أمر الإسناد بنجاح' : 'Award letter created successfully');
  };

  const handleStatusChange = (letterId: string, newStatus: AwardLetter['status']) => {
    const updated = awardLetters.map(letter => 
      letter.id === letterId ? { ...letter, status: newStatus } : letter
    );
    setAwardLetters(updated);
    localStorage.setItem('awardLetters', JSON.stringify(updated));
  };

  const handleDelete = (letterId: string) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا الأمر؟' : 'Are you sure you want to delete this letter?')) {
      const updated = awardLetters.filter(letter => letter.id !== letterId);
      setAwardLetters(updated);
      localStorage.setItem('awardLetters', JSON.stringify(updated));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'issued': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Edit className="w-4 h-4" />;
      case 'issued': return <Send className="w-4 h-4" />;
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'expired': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${language === 'ar' ? 'font-arabic' : 'font-inter'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
            {language === 'ar' ? 'أوامر الإسناد' : 'Award Letters'}
          </h1>
          <p className="text-gray-600">
            {language === 'ar' ? 'إدارة أوامر إسناد المناقصات للشركات الفائزة' : 'Manage tender award letters for winning companies'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-amber-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">
                  {language === 'ar' ? 'إجمالي الأوامر' : 'Total Letters'}
                </p>
                <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <div className="bg-amber-100 p-3 rounded-lg">
                <Award className="w-8 h-8 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">
                  {language === 'ar' ? 'صادرة' : 'Issued'}
                </p>
                <p className="text-3xl font-bold text-gray-800">{stats.issued}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Send className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">
                  {language === 'ar' ? 'مقبولة' : 'Accepted'}
                </p>
                <p className="text-3xl font-bold text-gray-800">{stats.accepted}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">
                  {language === 'ar' ? 'القيمة الإجمالية' : 'Total Value'}
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {(stats.totalValue / 1000000).toFixed(1)}{language === 'ar' ? 'م' : 'M'}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={language === 'ar' ? 'بحث...' : 'Search...'}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="all">{language === 'ar' ? 'كل الحالات' : 'All Status'}</option>
                <option value="draft">{language === 'ar' ? 'مسودة' : 'Draft'}</option>
                <option value="issued">{language === 'ar' ? 'صادرة' : 'Issued'}</option>
                <option value="accepted">{language === 'ar' ? 'مقبولة' : 'Accepted'}</option>
                <option value="rejected">{language === 'ar' ? 'مرفوضة' : 'Rejected'}</option>
                <option value="expired">{language === 'ar' ? 'منتهية' : 'Expired'}</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all shadow-md"
            >
              <Plus className="w-5 h-5" />
              {language === 'ar' ? 'أمر إسناد جديد' : 'New Award Letter'}
            </button>
          </div>
        </div>

        {/* Letters Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredLetters.map(letter => (
            <div key={letter.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">{letter.letterNumber}</h3>
                      <p className="text-amber-100 text-sm">{letter.tenderNumber}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(letter.status)}`}>
                    {getStatusIcon(letter.status)}
                    {language === 'ar' ?
                      (letter.status === 'draft' ? 'مسودة' :
                       letter.status === 'issued' ? 'صادرة' :
                       letter.status === 'accepted' ? 'مقبولة' :
                       letter.status === 'rejected' ? 'مرفوضة' : 'منتهية') :
                      letter.status.toUpperCase()
                    }
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h4 className="font-bold text-gray-800 mb-4">{letter.tenderTitle}</h4>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-700">{letter.winnerCompanyName}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-700">
                      {letter.awardedAmount.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
                      {letter.discount > 0 && (
                        <span className="text-green-600 mr-2">
                          ({language === 'ar' ? 'خصم' : 'Discount'}: {letter.discount.toLocaleString()})
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <span className="text-sm text-gray-700">
                      {language === 'ar' ? 'تاريخ الإصدار:' : 'Issue Date:'} {letter.issueDate}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-600" />
                    <span className="text-sm text-gray-700">
                      {language === 'ar' ? 'صالح حتى:' : 'Valid Until:'} {letter.expiryDate}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                  <p className="text-xs text-gray-600 mb-1">{language === 'ar' ? 'نطاق العمل:' : 'Scope of Work:'}</p>
                  <p className="text-sm text-gray-700 line-clamp-2">{letter.scopeOfWork}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setSelectedLetter(letter);
                      setShowDetailsModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    {language === 'ar' ? 'التفاصيل' : 'Details'}
                  </button>

                  {letter.status === 'draft' && (
                    <button
                      onClick={() => handleStatusChange(letter.id, 'issued')}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <Send className="w-4 h-4" />
                      {language === 'ar' ? 'إصدار' : 'Issue'}
                    </button>
                  )}

                  {letter.status === 'issued' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(letter.id, 'accepted')}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        <CheckCircle className="w-4 h-4" />
                        {language === 'ar' ? 'قبول' : 'Accept'}
                      </button>
                      <button
                        onClick={() => handleStatusChange(letter.id, 'rejected')}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        <XCircle className="w-4 h-4" />
                        {language === 'ar' ? 'رفض' : 'Reject'}
                      </button>
                    </>
                  )}

                  {letter.status === 'accepted' && (
                    <button
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          localStorage.setItem('createAssignmentFrom', JSON.stringify({
                            awardLetterNumber: letter.letterNumber,
                            tenderNumber: letter.tenderNumber,
                            tenderTitle: letter.tenderTitle,
                            companyName: letter.winnerCompanyName,
                            contractAmount: letter.awardedAmount
                          }));
                          window.location.href = '/admin/assignments';
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                    >
                      <FileText className="w-4 h-4" />
                      {language === 'ar' ? 'أمر تكليف' : 'Assignment'}
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(letter.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    {language === 'ar' ? 'حذف' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-6 sticky top-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white">
                    {language === 'ar' ? 'أمر إسناد جديد' : 'New Award Letter'}
                  </h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'رقم المناقصة' : 'Tender Number'}
                    </label>
                    <input
                      type="text"
                      value={newLetter.tenderNumber}
                      onChange={(e) => setNewLetter({...newLetter, tenderNumber: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'اسم الشركة الفائزة' : 'Winner Company Name'}
                    </label>
                    <input
                      type="text"
                      value={newLetter.winnerCompanyName}
                      onChange={(e) => setNewLetter({...newLetter, winnerCompanyName: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'عنوان المناقصة' : 'Tender Title'}
                    </label>
                    <input
                      type="text"
                      value={newLetter.tenderTitle}
                      onChange={(e) => setNewLetter({...newLetter, tenderTitle: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'قيمة العرض الأصلية' : 'Original Bid Amount'}
                    </label>
                    <input
                      type="number"
                      value={newLetter.originalBidAmount}
                      onChange={(e) => setNewLetter({...newLetter, originalBidAmount: parseFloat(e.target.value)})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'القيمة المرساة' : 'Awarded Amount'}
                    </label>
                    <input
                      type="number"
                      value={newLetter.awardedAmount}
                      onChange={(e) => setNewLetter({...newLetter, awardedAmount: parseFloat(e.target.value)})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'تاريخ الإصدار' : 'Issue Date'}
                    </label>
                    <input
                      type="date"
                      value={newLetter.issueDate}
                      onChange={(e) => setNewLetter({...newLetter, issueDate: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'مدة الصلاحية (أيام)' : 'Validity Period (days)'}
                    </label>
                    <input
                      type="number"
                      value={newLetter.validityPeriod}
                      onChange={(e) => setNewLetter({...newLetter, validityPeriod: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'نطاق العمل' : 'Scope of Work'}
                    </label>
                    <textarea
                      value={newLetter.scopeOfWork}
                      onChange={(e) => setNewLetter({...newLetter, scopeOfWork: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'صدر بواسطة' : 'Issued By'}
                    </label>
                    <input
                      type="text"
                      value={newLetter.issuedBy}
                      onChange={(e) => setNewLetter({...newLetter, issuedBy: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'معتمد من' : 'Approved By'}
                    </label>
                    <input
                      type="text"
                      value={newLetter.approvedBy}
                      onChange={(e) => setNewLetter({...newLetter, approvedBy: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Contract Section */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-600" />
                    {language === 'ar' ? 'بيانات العقد' : 'Contract Information'}
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'رقم العقد' : 'Contract Number'}
                      </label>
                      <input
                        type="text"
                        value={newLetter.contractNumber}
                        onChange={(e) => setNewLetter({...newLetter, contractNumber: e.target.value})}
                        placeholder={language === 'ar' ? 'رقم العقد' : 'Contract number'}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'تاريخ العقد' : 'Contract Date'}
                      </label>
                      <input
                        type="date"
                        value={newLetter.contractDate}
                        onChange={(e) => setNewLetter({...newLetter, contractDate: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'مدة العقد (أشهر)' : 'Contract Duration (months)'}
                      </label>
                      <input
                        type="number"
                        value={newLetter.contractDuration}
                        onChange={(e) => setNewLetter({...newLetter, contractDuration: parseInt(e.target.value)})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'شروط العقد' : 'Contract Terms'}
                      </label>
                      <textarea
                        value={newLetter.contractTerms}
                        onChange={(e) => setNewLetter({...newLetter, contractTerms: e.target.value})}
                        rows={3}
                        placeholder={language === 'ar' ? 'شروط وأحكام العقد' : 'Contract terms and conditions'}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'ملاحظات' : 'Notes'}
                    </label>
                    <textarea
                      value={newLetter.notes}
                      onChange={(e) => setNewLetter({...newLetter, notes: e.target.value})}
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleCreateLetter}
                    className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all font-medium"
                  >
                    {language === 'ar' ? 'إنشاء أمر الإسناد' : 'Create Award Letter'}
                  </button>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {language === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {showDetailsModal && selectedLetter && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-6 sticky top-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white">
                    {language === 'ar' ? 'تفاصيل أمر الإسناد' : 'Award Letter Details'}
                  </h3>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">
                      {language === 'ar' ? 'رقم الأمر' : 'Letter Number'}
                    </label>
                    <p className="font-medium text-gray-800">{selectedLetter.letterNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">
                      {language === 'ar' ? 'رقم المناقصة' : 'Tender Number'}
                    </label>
                    <p className="font-medium text-gray-800">{selectedLetter.tenderNumber}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm text-gray-600 mb-1 block">
                      {language === 'ar' ? 'عنوان المناقصة' : 'Tender Title'}
                    </label>
                    <p className="font-medium text-gray-800">{selectedLetter.tenderTitle}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm text-gray-600 mb-1 block">
                      {language === 'ar' ? 'الشركة الفائزة' : 'Winner Company'}
                    </label>
                    <p className="font-medium text-gray-800">{selectedLetter.winnerCompanyName}</p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-bold text-gray-800 mb-4">
                    {language === 'ar' ? 'التفاصيل المالية' : 'Financial Details'}
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">
                        {language === 'ar' ? 'قيمة العرض الأصلية' : 'Original Bid'}
                      </label>
                      <p className="font-medium text-gray-800">
                        {selectedLetter.originalBidAmount.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">
                        {language === 'ar' ? 'القيمة المرساة' : 'Awarded Amount'}
                      </label>
                      <p className="font-medium text-gray-800">
                        {selectedLetter.awardedAmount.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">
                        {language === 'ar' ? 'الخصم' : 'Discount'}
                      </label>
                      <p className="font-medium text-green-600">
                        {selectedLetter.discount.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-bold text-gray-800 mb-4">
                    {language === 'ar' ? 'نطاق العمل' : 'Scope of Work'}
                  </h4>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedLetter.scopeOfWork}</p>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-bold text-gray-800 mb-4">
                    {language === 'ar' ? 'التواريخ' : 'Dates'}
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">
                        {language === 'ar' ? 'تاريخ الإصدار' : 'Issue Date'}
                      </label>
                      <p className="font-medium text-gray-800">{selectedLetter.issueDate}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">
                        {language === 'ar' ? 'تاريخ الانتهاء' : 'Expiry Date'}
                      </label>
                      <p className="font-medium text-gray-800">{selectedLetter.expiryDate}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">
                        {language === 'ar' ? 'مدة الصلاحية' : 'Validity Period'}
                      </label>
                      <p className="font-medium text-gray-800">
                        {selectedLetter.validityPeriod} {language === 'ar' ? 'يوم' : 'days'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contract Information */}
                {(selectedLetter.contractNumber || selectedLetter.contractDate || selectedLetter.contractDuration || selectedLetter.contractTerms) && (
                  <div className="border-t pt-6">
                    <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-amber-600" />
                      {language === 'ar' ? 'بيانات العقد' : 'Contract Information'}
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedLetter.contractNumber && (
                        <div>
                          <label className="text-sm text-gray-600 mb-1 block">
                            {language === 'ar' ? 'رقم العقد' : 'Contract Number'}
                          </label>
                          <p className="font-medium text-gray-800">{selectedLetter.contractNumber}</p>
                        </div>
                      )}
                      {selectedLetter.contractDate && (
                        <div>
                          <label className="text-sm text-gray-600 mb-1 block">
                            {language === 'ar' ? 'تاريخ العقد' : 'Contract Date'}
                          </label>
                          <p className="font-medium text-gray-800">{selectedLetter.contractDate}</p>
                        </div>
                      )}
                      {selectedLetter.contractDuration && (
                        <div>
                          <label className="text-sm text-gray-600 mb-1 block">
                            {language === 'ar' ? 'مدة العقد' : 'Contract Duration'}
                          </label>
                          <p className="font-medium text-gray-800">
                            {selectedLetter.contractDuration} {language === 'ar' ? 'شهر' : 'months'}
                          </p>
                        </div>
                      )}
                      {selectedLetter.contractTerms && (
                        <div className="col-span-2">
                          <label className="text-sm text-gray-600 mb-1 block">
                            {language === 'ar' ? 'شروط العقد' : 'Contract Terms'}
                          </label>
                          <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedLetter.contractTerms}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="border-t pt-6">
                  <h4 className="font-bold text-gray-800 mb-4">
                    {language === 'ar' ? 'المعتمدون' : 'Approvals'}
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">
                        {language === 'ar' ? 'صدر بواسطة' : 'Issued By'}
                      </label>
                      <p className="font-medium text-gray-800">{selectedLetter.issuedBy}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">
                        {language === 'ar' ? 'معتمد من' : 'Approved By'}
                      </label>
                      <p className="font-medium text-gray-800">{selectedLetter.approvedBy}</p>
                    </div>
                  </div>
                </div>

                {selectedLetter.notes && (
                  <div className="border-t pt-6">
                    <h4 className="font-bold text-gray-800 mb-2">
                      {language === 'ar' ? 'ملاحظات' : 'Notes'}
                    </h4>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedLetter.notes}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    {language === 'ar' ? 'إغلاق' : 'Close'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
