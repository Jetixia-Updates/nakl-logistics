'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  ClipboardCheck,
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
  X,
  Truck,
  PlayCircle,
  MapPin,
  Package
} from 'lucide-react';

interface Assignment {
  id: string;
  assignmentNumber: string;
  awardLetterId: string;
  awardLetterNumber: string;
  tenderNumber: string;
  tenderTitle: string;
  companyId: string;
  companyName: string;
  contractAmount: number;
  projectDuration: number; // days
  startDate: string;
  expectedEndDate: string;
  actualEndDate?: string;
  status: 'draft' | 'issued' | 'in-progress' | 'completed' | 'on-hold' | 'cancelled';
  paymentTerms: string;
  paymentSchedule: {
    milestone: string;
    percentage: number;
    amount: number;
    dueDate: string;
    status: 'pending' | 'paid';
  }[];
  workDetails: string;
  specialConditions: string;
  issuedBy: string;
  approvedBy: string;
  projectManager: string;
  siteLocation: string;
  requiredResources: {
    vehicles: number;
    drivers: number;
    equipment: string[];
  };
  notes: string;
  attachments: string[];
  createdAt: string;
}

export default function AssignmentsPage() {
  const { language } = useLanguage();
  
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  const [newAssignment, setNewAssignment] = useState({
    awardLetterNumber: '',
    tenderNumber: '',
    tenderTitle: '',
    companyName: '',
    contractAmount: 0,
    projectDuration: 180,
    startDate: '',
    paymentTerms: '',
    workDetails: '',
    specialConditions: '',
    issuedBy: '',
    approvedBy: '',
    projectManager: '',
    siteLocation: '',
    requiredVehicles: 0,
    requiredDrivers: 0,
    notes: ''
  });

  useEffect(() => {
    // Check if creating from award letter
    if (typeof window !== 'undefined') {
      const createFrom = localStorage.getItem('createAssignmentFrom');
      if (createFrom) {
        const awardData = JSON.parse(createFrom);
        setNewAssignment(prev => ({
          ...prev,
          awardLetterNumber: awardData.awardLetterNumber,
          tenderNumber: awardData.tenderNumber,
          tenderTitle: awardData.tenderTitle,
          companyName: awardData.companyName,
          contractAmount: awardData.contractAmount
        }));
        setShowCreateModal(true);
        localStorage.removeItem('createAssignmentFrom');
      }
    }

    const saved = JSON.parse(localStorage.getItem('assignments') || '[]');
    setAssignments(saved);
  }, []);

  const stats = {
    total: assignments.length,
    inProgress: assignments.filter(a => a.status === 'in-progress').length,
    completed: assignments.filter(a => a.status === 'completed').length,
    totalValue: assignments.reduce((sum, a) => sum + a.contractAmount, 0)
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = 
      assignment.assignmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.tenderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.tenderTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateAssignment = () => {
    const endDate = new Date(newAssignment.startDate);
    endDate.setDate(endDate.getDate() + newAssignment.projectDuration);

    const assignment: Assignment = {
      id: Date.now().toString(),
      assignmentNumber: `ASG-${new Date().getFullYear()}-${String(assignments.length + 1).padStart(3, '0')}`,
      awardLetterId: `AWD${Date.now()}`,
      awardLetterNumber: newAssignment.awardLetterNumber,
      tenderNumber: newAssignment.tenderNumber,
      tenderTitle: newAssignment.tenderTitle,
      companyId: `C${Date.now()}`,
      companyName: newAssignment.companyName,
      contractAmount: newAssignment.contractAmount,
      projectDuration: newAssignment.projectDuration,
      startDate: newAssignment.startDate,
      expectedEndDate: endDate.toISOString().split('T')[0],
      status: 'draft',
      paymentTerms: newAssignment.paymentTerms,
      paymentSchedule: [],
      workDetails: newAssignment.workDetails,
      specialConditions: newAssignment.specialConditions,
      issuedBy: newAssignment.issuedBy,
      approvedBy: newAssignment.approvedBy,
      projectManager: newAssignment.projectManager,
      siteLocation: newAssignment.siteLocation,
      requiredResources: {
        vehicles: newAssignment.requiredVehicles,
        drivers: newAssignment.requiredDrivers,
        equipment: []
      },
      notes: newAssignment.notes,
      attachments: [],
      createdAt: new Date().toISOString()
    };

    const updated = [...assignments, assignment];
    setAssignments(updated);
    localStorage.setItem('assignments', JSON.stringify(updated));
    
    setShowCreateModal(false);
    setNewAssignment({
      awardLetterNumber: '',
      tenderNumber: '',
      tenderTitle: '',
      companyName: '',
      contractAmount: 0,
      projectDuration: 180,
      startDate: '',
      paymentTerms: '',
      workDetails: '',
      specialConditions: '',
      issuedBy: '',
      approvedBy: '',
      projectManager: '',
      siteLocation: '',
      requiredVehicles: 0,
      requiredDrivers: 0,
      notes: ''
    });
    
    alert(language === 'ar' ? 'تم إنشاء أمر التكليف بنجاح' : 'Assignment created successfully');
  };

  const handleStatusChange = (assignmentId: string, newStatus: Assignment['status']) => {
    const updated = assignments.map(assignment => {
      if (assignment.id === assignmentId) {
        return {
          ...assignment,
          status: newStatus,
          actualEndDate: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : assignment.actualEndDate
        };
      }
      return assignment;
    });
    setAssignments(updated);
    localStorage.setItem('assignments', JSON.stringify(updated));
  };

  const handleDelete = (assignmentId: string) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا الأمر؟' : 'Are you sure you want to delete this assignment?')) {
      const updated = assignments.filter(assignment => assignment.id !== assignmentId);
      setAssignments(updated);
      localStorage.setItem('assignments', JSON.stringify(updated));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'issued': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Edit className="w-4 h-4" />;
      case 'issued': return <Send className="w-4 h-4" />;
      case 'in-progress': return <PlayCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'on-hold': return <Clock className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${language === 'ar' ? 'font-arabic' : 'font-inter'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
            {language === 'ar' ? 'أوامر التكليف' : 'Work Assignment Orders'}
          </h1>
          <p className="text-gray-600">
            {language === 'ar' ? 'إدارة أوامر التكليف وبدء تنفيذ المشاريع' : 'Manage work assignments and project commencement'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">
                  {language === 'ar' ? 'إجمالي الأوامر' : 'Total Assignments'}
                </p>
                <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-lg">
                <ClipboardCheck className="w-8 h-8 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">
                  {language === 'ar' ? 'قيد التنفيذ' : 'In Progress'}
                </p>
                <p className="text-3xl font-bold text-gray-800">{stats.inProgress}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <PlayCircle className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">
                  {language === 'ar' ? 'مكتملة' : 'Completed'}
                </p>
                <p className="text-3xl font-bold text-gray-800">{stats.completed}</p>
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">{language === 'ar' ? 'كل الحالات' : 'All Status'}</option>
                <option value="draft">{language === 'ar' ? 'مسودة' : 'Draft'}</option>
                <option value="issued">{language === 'ar' ? 'صادرة' : 'Issued'}</option>
                <option value="in-progress">{language === 'ar' ? 'قيد التنفيذ' : 'In Progress'}</option>
                <option value="completed">{language === 'ar' ? 'مكتملة' : 'Completed'}</option>
                <option value="on-hold">{language === 'ar' ? 'معلقة' : 'On Hold'}</option>
                <option value="cancelled">{language === 'ar' ? 'ملغاة' : 'Cancelled'}</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all shadow-md"
            >
              <Plus className="w-5 h-5" />
              {language === 'ar' ? 'أمر تكليف جديد' : 'New Assignment'}
            </button>
          </div>
        </div>

        {/* Assignments Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAssignments.map(assignment => (
            <div key={assignment.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <ClipboardCheck className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">{assignment.assignmentNumber}</h3>
                      <p className="text-indigo-100 text-sm">{assignment.tenderNumber}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(assignment.status)}`}>
                    {getStatusIcon(assignment.status)}
                    {language === 'ar' ?
                      (assignment.status === 'draft' ? 'مسودة' :
                       assignment.status === 'issued' ? 'صادرة' :
                       assignment.status === 'in-progress' ? 'قيد التنفيذ' :
                       assignment.status === 'completed' ? 'مكتملة' :
                       assignment.status === 'on-hold' ? 'معلقة' : 'ملغاة') :
                      assignment.status.replace('-', ' ').toUpperCase()
                    }
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h4 className="font-bold text-gray-800 mb-4">{assignment.tenderTitle}</h4>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-700">{assignment.companyName}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-700">
                      {assignment.contractAmount.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <span className="text-sm text-gray-700">
                      {assignment.startDate} → {assignment.expectedEndDate}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-600" />
                    <span className="text-sm text-gray-700">
                      {assignment.projectDuration} {language === 'ar' ? 'يوم' : 'days'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-red-600" />
                    <span className="text-sm text-gray-700">{assignment.siteLocation}</span>
                  </div>
                </div>

                <div className="bg-indigo-50 p-3 rounded-lg mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck className="w-5 h-5 text-indigo-600" />
                      <span className="text-sm text-gray-700">
                        {assignment.requiredResources.vehicles} {language === 'ar' ? 'مركبات' : 'vehicles'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-indigo-600" />
                      <span className="text-sm text-gray-700">
                        {assignment.requiredResources.drivers} {language === 'ar' ? 'سائقين' : 'drivers'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setSelectedAssignment(assignment);
                      setShowDetailsModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    {language === 'ar' ? 'التفاصيل' : 'Details'}
                  </button>

                  {assignment.status === 'draft' && (
                    <button
                      onClick={() => handleStatusChange(assignment.id, 'issued')}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <Send className="w-4 h-4" />
                      {language === 'ar' ? 'إصدار' : 'Issue'}
                    </button>
                  )}

                  {assignment.status === 'issued' && (
                    <button
                      onClick={() => handleStatusChange(assignment.id, 'in-progress')}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                    >
                      <PlayCircle className="w-4 h-4" />
                      {language === 'ar' ? 'بدء العمل' : 'Start'}
                    </button>
                  )}

                  {assignment.status === 'in-progress' && (
                    <button
                      onClick={() => handleStatusChange(assignment.id, 'completed')}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {language === 'ar' ? 'إكمال' : 'Complete'}
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(assignment.id)}
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
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 sticky top-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white">
                    {language === 'ar' ? 'أمر تكليف جديد' : 'New Assignment'}
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
                      {language === 'ar' ? 'رقم أمر الإسناد' : 'Award Letter Number'}
                    </label>
                    <input
                      type="text"
                      value={newAssignment.awardLetterNumber}
                      onChange={(e) => setNewAssignment({...newAssignment, awardLetterNumber: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'رقم المناقصة' : 'Tender Number'}
                    </label>
                    <input
                      type="text"
                      value={newAssignment.tenderNumber}
                      onChange={(e) => setNewAssignment({...newAssignment, tenderNumber: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'عنوان المناقصة' : 'Tender Title'}
                    </label>
                    <input
                      type="text"
                      value={newAssignment.tenderTitle}
                      onChange={(e) => setNewAssignment({...newAssignment, tenderTitle: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'اسم الشركة' : 'Company Name'}
                    </label>
                    <input
                      type="text"
                      value={newAssignment.companyName}
                      onChange={(e) => setNewAssignment({...newAssignment, companyName: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'قيمة العقد' : 'Contract Amount'}
                    </label>
                    <input
                      type="number"
                      value={newAssignment.contractAmount}
                      onChange={(e) => setNewAssignment({...newAssignment, contractAmount: parseFloat(e.target.value)})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'مدة المشروع (أيام)' : 'Project Duration (days)'}
                    </label>
                    <input
                      type="number"
                      value={newAssignment.projectDuration}
                      onChange={(e) => setNewAssignment({...newAssignment, projectDuration: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'تاريخ البدء' : 'Start Date'}
                    </label>
                    <input
                      type="date"
                      value={newAssignment.startDate}
                      onChange={(e) => setNewAssignment({...newAssignment, startDate: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'موقع العمل' : 'Site Location'}
                    </label>
                    <input
                      type="text"
                      value={newAssignment.siteLocation}
                      onChange={(e) => setNewAssignment({...newAssignment, siteLocation: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'عدد المركبات المطلوبة' : 'Required Vehicles'}
                    </label>
                    <input
                      type="number"
                      value={newAssignment.requiredVehicles}
                      onChange={(e) => setNewAssignment({...newAssignment, requiredVehicles: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'عدد السائقين المطلوبين' : 'Required Drivers'}
                    </label>
                    <input
                      type="number"
                      value={newAssignment.requiredDrivers}
                      onChange={(e) => setNewAssignment({...newAssignment, requiredDrivers: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'شروط الدفع' : 'Payment Terms'}
                    </label>
                    <input
                      type="text"
                      value={newAssignment.paymentTerms}
                      onChange={(e) => setNewAssignment({...newAssignment, paymentTerms: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'تفاصيل العمل' : 'Work Details'}
                    </label>
                    <textarea
                      value={newAssignment.workDetails}
                      onChange={(e) => setNewAssignment({...newAssignment, workDetails: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'الشروط الخاصة' : 'Special Conditions'}
                    </label>
                    <textarea
                      value={newAssignment.specialConditions}
                      onChange={(e) => setNewAssignment({...newAssignment, specialConditions: e.target.value})}
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'صدر بواسطة' : 'Issued By'}
                    </label>
                    <input
                      type="text"
                      value={newAssignment.issuedBy}
                      onChange={(e) => setNewAssignment({...newAssignment, issuedBy: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'معتمد من' : 'Approved By'}
                    </label>
                    <input
                      type="text"
                      value={newAssignment.approvedBy}
                      onChange={(e) => setNewAssignment({...newAssignment, approvedBy: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'مدير المشروع' : 'Project Manager'}
                    </label>
                    <input
                      type="text"
                      value={newAssignment.projectManager}
                      onChange={(e) => setNewAssignment({...newAssignment, projectManager: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'ملاحظات' : 'Notes'}
                    </label>
                    <textarea
                      value={newAssignment.notes}
                      onChange={(e) => setNewAssignment({...newAssignment, notes: e.target.value})}
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleCreateAssignment}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all font-medium"
                  >
                    {language === 'ar' ? 'إنشاء أمر التكليف' : 'Create Assignment'}
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
        {showDetailsModal && selectedAssignment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 sticky top-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white">
                    {language === 'ar' ? 'تفاصيل أمر التكليف' : 'Assignment Details'}
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
                      {language === 'ar' ? 'رقم الأمر' : 'Assignment Number'}
                    </label>
                    <p className="font-medium text-gray-800">{selectedAssignment.assignmentNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">
                      {language === 'ar' ? 'رقم أمر الإسناد' : 'Award Letter'}
                    </label>
                    <p className="font-medium text-gray-800">{selectedAssignment.awardLetterNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">
                      {language === 'ar' ? 'رقم المناقصة' : 'Tender Number'}
                    </label>
                    <p className="font-medium text-gray-800">{selectedAssignment.tenderNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">
                      {language === 'ar' ? 'قيمة العقد' : 'Contract Amount'}
                    </label>
                    <p className="font-medium text-gray-800">
                      {selectedAssignment.contractAmount.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-bold text-gray-800 mb-4">
                    {language === 'ar' ? 'تفاصيل المشروع' : 'Project Details'}
                  </h4>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg mb-4">{selectedAssignment.tenderTitle}</p>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedAssignment.workDetails}</p>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-bold text-gray-800 mb-4">
                    {language === 'ar' ? 'الجدول الزمني' : 'Timeline'}
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">
                        {language === 'ar' ? 'تاريخ البدء' : 'Start Date'}
                      </label>
                      <p className="font-medium text-gray-800">{selectedAssignment.startDate}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">
                        {language === 'ar' ? 'تاريخ الانتهاء المتوقع' : 'Expected End Date'}
                      </label>
                      <p className="font-medium text-gray-800">{selectedAssignment.expectedEndDate}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">
                        {language === 'ar' ? 'المدة' : 'Duration'}
                      </label>
                      <p className="font-medium text-gray-800">
                        {selectedAssignment.projectDuration} {language === 'ar' ? 'يوم' : 'days'}
                      </p>
                    </div>
                  </div>
                </div>

                {selectedAssignment.paymentSchedule.length > 0 && (
                  <div className="border-t pt-6">
                    <h4 className="font-bold text-gray-800 mb-4">
                      {language === 'ar' ? 'جدول الدفعات' : 'Payment Schedule'}
                    </h4>
                    <div className="space-y-2">
                      {selectedAssignment.paymentSchedule.map((payment, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-800">{payment.milestone}</p>
                            <p className="text-sm text-gray-600">{payment.dueDate}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-800">
                              {payment.amount.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
                            </p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              payment.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {payment.status === 'paid' ? (language === 'ar' ? 'مدفوعة' : 'Paid') : (language === 'ar' ? 'معلقة' : 'Pending')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t pt-6">
                  <h4 className="font-bold text-gray-800 mb-4">
                    {language === 'ar' ? 'الموارد المطلوبة' : 'Required Resources'}
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 p-3 bg-indigo-50 rounded-lg">
                      <Truck className="w-6 h-6 text-indigo-600" />
                      <div>
                        <p className="text-sm text-gray-600">{language === 'ar' ? 'المركبات' : 'Vehicles'}</p>
                        <p className="font-bold text-gray-800">{selectedAssignment.requiredResources.vehicles}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                      <User className="w-6 h-6 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">{language === 'ar' ? 'السائقين' : 'Drivers'}</p>
                        <p className="font-bold text-gray-800">{selectedAssignment.requiredResources.drivers}</p>
                      </div>
                    </div>
                  </div>
                </div>

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
