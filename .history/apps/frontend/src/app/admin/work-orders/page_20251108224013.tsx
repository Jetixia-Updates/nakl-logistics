'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Truck, 
  MapPin, 
  Clock, 
  Package,
  CheckCircle,
  AlertCircle,
  Search,
  Plus,
  Filter,
  Calendar,
  User,
  Phone
} from 'lucide-react';

export default function WorkOrdersPage() {
  const { language, translations } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const workOrders = [
    {
      id: 'WO-001',
      title: language === 'ar' ? 'شحنة بضائع إلى الإسكندرية' : 'Cargo Shipment to Alexandria',
      customer: language === 'ar' ? 'شركة النصر للتجارة' : 'Al-Nasr Trading Company',
      status: 'in-progress',
      priority: 'high',
      assignedDriver: language === 'ar' ? 'أحمد محمد' : 'Ahmed Mohamed',
      vehicle: 'T-001 - Mercedes Actros',
      origin: language === 'ar' ? 'القاهرة - مدينة نصر' : 'Cairo - Nasr City',
      destination: language === 'ar' ? 'الإسكندرية - الميناء' : 'Alexandria - Port',
      scheduledDate: '2024-11-08',
      estimatedDelivery: '2024-11-09',
      cargo: language === 'ar' ? 'مواد بناء - 25 طن' : 'Construction Materials - 25 tons',
      customerPhone: '+201234567890'
    },
    {
      id: 'WO-002',
      title: language === 'ar' ? 'تخليص جمركي - ميناء السويس' : 'Customs Clearance - Suez Port',
      customer: language === 'ar' ? 'المجموعة المتحدة للاستيراد' : 'United Import Group',
      status: 'pending',
      priority: 'medium',
      assignedDriver: language === 'ar' ? 'محمود علي' : 'Mahmoud Ali',
      vehicle: 'T-002 - Volvo FH',
      origin: language === 'ar' ? 'ميناء السويس' : 'Suez Port',
      destination: language === 'ar' ? 'القاهرة - التجمع الخامس' : 'Cairo - New Cairo',
      scheduledDate: '2024-11-09',
      estimatedDelivery: '2024-11-10',
      cargo: language === 'ar' ? 'معدات إلكترونية - 15 طن' : 'Electronic Equipment - 15 tons',
      customerPhone: '+201987654321'
    },
    {
      id: 'WO-003',
      title: language === 'ar' ? 'نقل مواد كيميائية خطرة' : 'Hazardous Chemical Transport',
      customer: language === 'ar' ? 'الشركة المصرية للكيماويات' : 'Egyptian Chemical Company',
      status: 'completed',
      priority: 'high',
      assignedDriver: language === 'ar' ? 'خالد حسن' : 'Khaled Hassan',
      vehicle: 'T-003 - Scania R450',
      origin: language === 'ar' ? 'مدينة العاشر من رمضان' : '10th of Ramadan City',
      destination: language === 'ar' ? 'الإسكندرية - برج العرب' : 'Alexandria - Borg El Arab',
      scheduledDate: '2024-11-05',
      estimatedDelivery: '2024-11-06',
      cargo: language === 'ar' ? 'مواد كيميائية - 20 طن' : 'Chemical Materials - 20 tons',
      customerPhone: '+201555444333'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      'in-progress': language === 'ar' ? 'قيد التنفيذ' : 'In Progress',
      'pending': language === 'ar' ? 'معلق' : 'Pending',
      'completed': language === 'ar' ? 'مكتمل' : 'Completed',
      'cancelled': language === 'ar' ? 'ملغي' : 'Cancelled'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getPriorityText = (priority: string) => {
    const priorityMap = {
      'high': language === 'ar' ? 'عالية' : 'High',
      'medium': language === 'ar' ? 'متوسطة' : 'Medium',
      'low': language === 'ar' ? 'منخفضة' : 'Low'
    };
    return priorityMap[priority as keyof typeof priorityMap] || priority;
  };

  const filteredWorkOrders = workOrders.filter(order => {
    const matchesSearch = order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className={`min-h-screen bg-gray-50 ${language === 'ar' ? 'font-arabic' : 'font-inter'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'ar' ? 'أوامر العمل' : 'Work Orders'}
          </h1>
          <p className="text-gray-600">
            {language === 'ar' ? 'إدارة أوامر العمل وتتبع حالة الشحنات والعمليات' : 'Manage work orders and track shipment and operation status'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-blue-500 mb-2" />
              <div className={`${language === 'ar' ? 'mr-4' : 'ml-4'}`}>
                <p className="text-2xl font-bold text-gray-900">42</p>
                <p className="text-sm text-gray-600">{language === 'ar' ? 'إجمالي الأوامر' : 'Total Orders'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-orange-500 mb-2" />
              <div className={`${language === 'ar' ? 'mr-4' : 'ml-4'}`}>
                <p className="text-2xl font-bold text-gray-900">15</p>
                <p className="text-sm text-gray-600">{language === 'ar' ? 'قيد التنفيذ' : 'In Progress'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
              <div className={`${language === 'ar' ? 'mr-4' : 'ml-4'}`}>
                <p className="text-2xl font-bold text-gray-900">25</p>
                <p className="text-sm text-gray-600">{language === 'ar' ? 'مكتملة' : 'Completed'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
              <div className={`${language === 'ar' ? 'mr-4' : 'ml-4'}`}>
                <p className="text-2xl font-bold text-gray-900">2</p>
                <p className="text-sm text-gray-600">{language === 'ar' ? 'متأخرة' : 'Overdue'}</p>
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
                <Search className={`absolute ${language === 'ar' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5`} />
                <input
                  type="text"
                  placeholder={language === 'ar' ? 'البحث عن الأوامر...' : 'Search orders...'}
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
                  <option value="pending">{language === 'ar' ? 'معلق' : 'Pending'}</option>
                  <option value="in-progress">{language === 'ar' ? 'قيد التنفيذ' : 'In Progress'}</option>
                  <option value="completed">{language === 'ar' ? 'مكتمل' : 'Completed'}</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4" />
                {language === 'ar' ? 'إضافة أمر عمل' : 'Add Work Order'}
              </button>
            </div>
          </div>
        </div>

        {/* Work Orders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{order.title}</h3>
                    <p className="text-sm text-gray-500">{order.id}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(order.priority)}`}>
                      {getPriorityText(order.priority)}
                    </span>
                  </div>
                </div>

                {/* Customer */}
                <div className="flex items-center mb-3">
                  <User className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-700">{order.customer}</span>
                </div>

                {/* Phone */}
                <div className="flex items-center mb-3">
                  <Phone className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-700">{order.customerPhone}</span>
                </div>

                {/* Route */}
                <div className="flex items-start mb-3">
                  <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-700 font-medium">{language === 'ar' ? 'من:' : 'From:'} {order.origin}</p>
                    <p className="text-sm text-gray-700">{language === 'ar' ? 'إلى:' : 'To:'} {order.destination}</p>
                  </div>
                </div>

                {/* Cargo */}
                <div className="flex items-center mb-3">
                  <Package className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-700">{order.cargo}</span>
                </div>

                {/* Vehicle & Driver */}
                <div className="flex items-center mb-3">
                  <Truck className="w-4 h-4 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-700 font-medium">{order.vehicle}</p>
                    <p className="text-sm text-gray-500">{language === 'ar' ? 'السائق:' : 'Driver:'} {order.assignedDriver}</p>
                  </div>
                </div>

                {/* Dates */}
                <div className="flex items-center mb-4">
                  <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-700">{language === 'ar' ? 'موعد البدء:' : 'Start Date:'} {order.scheduledDate}</p>
                    <p className="text-sm text-gray-500">{language === 'ar' ? 'التسليم المتوقع:' : 'Expected Delivery:'} {order.estimatedDelivery}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <button className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                    {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                  </button>
                  <button className="flex-1 px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium">
                    {language === 'ar' ? 'تتبع' : 'Track'}
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