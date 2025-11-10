'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Truck, 
  MapPin, 
  Clock, 
  Package, 
  Wrench, 
  User, 
  Calendar, 
  CheckCircle, 
  AlertCircle,
  XCircle,
  Plus,
  Search,
  Filter,
  FileText,
  TrendingUp,
  Navigation,
  Eye,
  Edit,
  Trash2,
  PlayCircle,
  DollarSign,
  ArrowRight,
  X
} from 'lucide-react';

interface WorkOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  vehicleId: string;
  vehiclePlate: string;
  origin: string;
  destination: string;
  distance: number;
  cargoType: string;
  cargoWeight: number;
  estimatedCost: number;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  driverId: string;
  driverName: string;
  scheduledDate: string;
  completedDate?: string;
  notes: string;
  createdAt: string;
}

interface Vehicle {
  id: string;
  plate: string;
  type: string;
  model: string;
  capacity: number;
  currentStatus: string;
  driverId: string;
  driverName: string;
  lastMaintenance: string;
  mileage: number;
  fuelLevel: number;
}

interface InventoryItem {
  id: string;
  name: string;
  nameAr: string;
  sku: string;
  category: string;
  quantity: number;
  unitCost: number;
  reorderLevel: number;
  warehouseId: string;
  accountCode?: string;
}

export default function WorkOrdersPage() {
  const { language } = useLanguage();
  
  // State management
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  
  // Modal states
  const [showPartsModal, setShowPartsModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<WorkOrder | null>(null);
  const [selectedParts, setSelectedParts] = useState<{itemId: string; quantity: number}[]>([]);
  
  // Form state for new work order
  const [newOrder, setNewOrder] = useState({
    customerName: '',
    vehicleId: '',
    origin: '',
    destination: '',
    distance: 0,
    cargoType: '',
    cargoWeight: 0,
    estimatedCost: 0,
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    driverId: '',
    scheduledDate: '',
    notes: ''
  });

  // Load data from localStorage
  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('workOrders') || '[]');
    const savedVehicles = JSON.parse(localStorage.getItem('vehicles') || '[]');
    const savedInventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    
    setWorkOrders(savedOrders);
    setVehicles(savedVehicles);
    setInventory(savedInventory);
  }, []);

  // Calculate statistics
  const stats = {
    total: workOrders.length,
    inProgress: workOrders.filter(o => o.status === 'in-progress').length,
    pending: workOrders.filter(o => o.status === 'pending').length,
    completed: workOrders.filter(o => o.status === 'completed').length,
    overdue: workOrders.filter(o => 
      o.status !== 'completed' && 
      new Date(o.scheduledDate) < new Date()
    ).length
  };

  // Filter work orders
  const filteredOrders = workOrders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.destination.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || order.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Handle parts request
  const handleRequestParts = (order: WorkOrder) => {
    setSelectedOrder(order);
    setSelectedParts([]);
    setShowPartsModal(true);
  };

  const handleAddPartToRequest = (itemId: string, quantity: number) => {
    setSelectedParts(prev => {
      const existing = prev.find(p => p.itemId === itemId);
      if (existing) {
        return prev.map(p => 
          p.itemId === itemId ? { ...p, quantity } : p
        );
      }
      return [...prev, { itemId, quantity }];
    });
  };

  const handleSubmitPartsRequest = () => {
    if (!selectedOrder || selectedParts.length === 0) return;

    // Update inventory
    const updatedInventory = inventory.map(item => {
      const requested = selectedParts.find(p => p.itemId === item.id);
      if (requested) {
        return {
          ...item,
          quantity: item.quantity - requested.quantity
        };
      }
      return item;
    });
    
    localStorage.setItem('inventory', JSON.stringify(updatedInventory));
    setInventory(updatedInventory);

    // Create warehouse movement
    const movements = JSON.parse(localStorage.getItem('warehouseMovements') || '[]');
    const newMovements = selectedParts.map(part => {
      const item = inventory.find(i => i.id === part.itemId);
      return {
        id: Date.now() + Math.random(),
        date: new Date().toISOString().split('T')[0],
        type: 'issue',
        itemId: part.itemId,
        itemName: language === 'ar' ? item?.nameAr : item?.name,
        quantity: part.quantity,
        fromWarehouse: item?.warehouseId,
        toWarehouse: '',
        reference: `Work Order: ${selectedOrder.orderNumber}`,
        notes: `Parts issued for ${selectedOrder.vehiclePlate}`,
        createdAt: new Date().toISOString()
      };
    });
    
    localStorage.setItem('warehouseMovements', JSON.stringify([...movements, ...newMovements]));

    // Create journal entries
    const journalEntries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
    selectedParts.forEach(part => {
      const item = inventory.find(i => i.id === part.itemId);
      if (item) {
        const totalCost = item.unitCost * part.quantity;
        const entry = {
          id: Date.now() + Math.random(),
          date: new Date().toISOString().split('T')[0],
          description: `Parts issue for Work Order ${selectedOrder.orderNumber}`,
          reference: selectedOrder.orderNumber,
          lines: [
            {
              accountCode: '5-1-3',
              accountName: 'Maintenance Expenses',
              accountNameAr: 'مصاريف الصيانة',
              debit: totalCost,
              credit: 0
            },
            {
              accountCode: item.accountCode || '1-1-5',
              accountName: 'Inventory - Spare Parts',
              accountNameAr: 'المخزون - قطع الغيار',
              debit: 0,
              credit: totalCost
            }
          ],
          createdAt: new Date().toISOString()
        };
        journalEntries.push(entry);
      }
    });
    
    localStorage.setItem('journalEntries', JSON.stringify(journalEntries));

    alert(language === 'ar' ? 'تم طلب القطع بنجاح' : 'Parts requested successfully');
    setShowPartsModal(false);
    setSelectedOrder(null);
    setSelectedParts([]);
  };

  // Handle view details
  const handleViewDetails = (order: WorkOrder) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  // Handle create new order
  const handleCreateOrder = () => {
    const order: WorkOrder = {
      id: Date.now().toString(),
      orderNumber: `WO-${new Date().getFullYear()}-${String(workOrders.length + 1).padStart(3, '0')}`,
      customerId: `C${Date.now()}`,
      customerName: newOrder.customerName,
      vehicleId: newOrder.vehicleId,
      vehiclePlate: vehicles.find(v => v.id === newOrder.vehicleId)?.plate || '',
      origin: newOrder.origin,
      destination: newOrder.destination,
      distance: newOrder.distance,
      cargoType: newOrder.cargoType,
      cargoWeight: newOrder.cargoWeight,
      estimatedCost: newOrder.estimatedCost,
      status: 'pending',
      priority: newOrder.priority,
      driverId: newOrder.driverId,
      driverName: vehicles.find(v => v.id === newOrder.vehicleId)?.driverName || '',
      scheduledDate: newOrder.scheduledDate,
      notes: newOrder.notes,
      createdAt: new Date().toISOString()
    };

    const updated = [...workOrders, order];
    setWorkOrders(updated);
    localStorage.setItem('workOrders', JSON.stringify(updated));
    
    setShowCreateModal(false);
    setNewOrder({
      customerName: '',
      vehicleId: '',
      origin: '',
      destination: '',
      distance: 0,
      cargoType: '',
      cargoWeight: 0,
      estimatedCost: 0,
      priority: 'medium',
      driverId: '',
      scheduledDate: '',
      notes: ''
    });
    
    alert(language === 'ar' ? 'تم إنشاء أمر التشغيل بنجاح' : 'Work order created successfully');
  };

  // Handle status change
  const handleStatusChange = (orderId: string, newStatus: WorkOrder['status']) => {
    const updated = workOrders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: newStatus,
          completedDate: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : order.completedDate
        };
      }
      return order;
    });
    
    setWorkOrders(updated);
    localStorage.setItem('workOrders', JSON.stringify(updated));
  };

  // Handle delete
  const handleDelete = (orderId: string) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا الأمر؟' : 'Are you sure you want to delete this order?')) {
      const updated = workOrders.filter(order => order.id !== orderId);
      setWorkOrders(updated);
      localStorage.setItem('workOrders', JSON.stringify(updated));
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-600';
      case 'medium': return 'bg-blue-100 text-blue-600';
      case 'high': return 'bg-orange-100 text-orange-600';
      case 'urgent': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${language === 'ar' ? 'font-arabic' : 'font-inter'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {language === 'ar' ? 'أوامر التشغيل' : 'Work Orders'}
          </h1>
          <p className="text-gray-600">
            {language === 'ar' ? 'إدارة ومتابعة أوامر التشغيل والنقل' : 'Manage and track work orders and shipments'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">
                  {language === 'ar' ? 'إجمالي الأوامر' : 'Total Orders'}
                </p>
                <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileText className="w-8 h-8 text-blue-600" />
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
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">
                  {language === 'ar' ? 'قيد الانتظار' : 'Pending'}
                </p>
                <p className="text-3xl font-bold text-gray-800">{stats.pending}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="w-8 h-8 text-yellow-600" />
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

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">
                  {language === 'ar' ? 'متأخرة' : 'Overdue'}
                </p>
                <p className="text-3xl font-bold text-gray-800">{stats.overdue}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={language === 'ar' ? 'بحث عن أمر...' : 'Search for order...'}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">{language === 'ar' ? 'كل الحالات' : 'All Status'}</option>
                <option value="pending">{language === 'ar' ? 'قيد الانتظار' : 'Pending'}</option>
                <option value="in-progress">{language === 'ar' ? 'قيد التنفيذ' : 'In Progress'}</option>
                <option value="completed">{language === 'ar' ? 'مكتملة' : 'Completed'}</option>
                <option value="cancelled">{language === 'ar' ? 'ملغاة' : 'Cancelled'}</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">{language === 'ar' ? 'كل الأولويات' : 'All Priorities'}</option>
                <option value="low">{language === 'ar' ? 'منخفضة' : 'Low'}</option>
                <option value="medium">{language === 'ar' ? 'متوسطة' : 'Medium'}</option>
                <option value="high">{language === 'ar' ? 'عالية' : 'High'}</option>
                <option value="urgent">{language === 'ar' ? 'عاجلة' : 'Urgent'}</option>
              </select>
            </div>
          </div>

          {/* Create Button */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md"
            >
              <Plus className="w-5 h-5" />
              {language === 'ar' ? 'أمر تشغيل جديد' : 'New Work Order'}
            </button>
          </div>
        </div>

        {/* Work Orders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredOrders.map(order => (
            <div key={order.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <Truck className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">{order.orderNumber}</h3>
                      <p className="text-blue-100 text-sm">{order.vehiclePlate}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {language === 'ar' ? 
                        (order.status === 'pending' ? 'قيد الانتظار' :
                         order.status === 'in-progress' ? 'قيد التنفيذ' :
                         order.status === 'completed' ? 'مكتملة' : 'ملغاة') :
                        order.status.replace('-', ' ').toUpperCase()
                      }
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(order.priority)}`}>
                      {language === 'ar' ?
                        (order.priority === 'low' ? 'منخفضة' :
                         order.priority === 'medium' ? 'متوسطة' :
                         order.priority === 'high' ? 'عالية' : 'عاجلة') :
                        order.priority.toUpperCase()
                      }
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                {/* Customer */}
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700 font-medium">{order.customerName}</span>
                </div>

                {/* Route */}
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-gray-700 font-medium">{order.origin}</p>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <p className="text-gray-700 font-medium">{order.destination}</p>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {language === 'ar' ? 'المسافة:' : 'Distance:'} {order.distance} {language === 'ar' ? 'كم' : 'km'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cargo Info */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-xs text-gray-500">
                        {language === 'ar' ? 'نوع البضاعة' : 'Cargo Type'}
                      </p>
                      <p className="text-sm font-medium text-gray-700">{order.cargoType}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-500">
                        {language === 'ar' ? 'التكلفة المقدرة' : 'Est. Cost'}
                      </p>
                      <p className="text-sm font-medium text-gray-700">
                        {order.estimatedCost.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Schedule */}
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  <span className="text-sm text-gray-600">
                    {language === 'ar' ? 'موعد التنفيذ:' : 'Scheduled:'} {order.scheduledDate}
                  </span>
                </div>

                {/* Driver */}
                <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-indigo-600" />
                  <span className="text-sm text-gray-700">
                    <span className="font-medium">{language === 'ar' ? 'السائق:' : 'Driver:'}</span> {order.driverName}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleViewDetails(order)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    {language === 'ar' ? 'التفاصيل' : 'Details'}
                  </button>
                  
                  <button
                    onClick={() => handleRequestParts(order)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                  >
                    <Package className="w-4 h-4" />
                    {language === 'ar' ? 'طلب قطع' : 'Parts'}
                  </button>

                  {order.status === 'pending' && (
                    <button
                      onClick={() => handleStatusChange(order.id, 'in-progress')}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <PlayCircle className="w-4 h-4" />
                      {language === 'ar' ? 'بدء' : 'Start'}
                    </button>
                  )}

                  {order.status === 'in-progress' && (
                    <button
                      onClick={() => handleStatusChange(order.id, 'completed')}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {language === 'ar' ? 'إكمال' : 'Complete'}
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(order.id)}
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

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Truck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">
              {language === 'ar' ? 'لا توجد أوامر تشغيل' : 'No work orders found'}
            </p>
          </div>
        )}

        {/* Parts Request Modal */}
        {showPartsModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 sticky top-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {language === 'ar' ? 'طلب قطع غيار' : 'Request Parts'}
                    </h3>
                    <p className="text-purple-100">
                      {language === 'ar' ? 'أمر:' : 'Order:'} {selectedOrder.orderNumber} - {selectedOrder.vehiclePlate}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowPartsModal(false)}
                    className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid gap-4">
                  {inventory.map(item => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">
                            {language === 'ar' ? item.nameAr : item.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {language === 'ar' ? 'المخزون:' : 'Stock:'} {item.quantity} | 
                            {language === 'ar' ? ' السعر:' : ' Price:'} {item.unitCost} {language === 'ar' ? 'ج.م' : 'EGP'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            max={item.quantity}
                            placeholder="0"
                            onChange={(e) => handleAddPartToRequest(item.id, parseInt(e.target.value) || 0)}
                            className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleSubmitPartsRequest}
                    disabled={selectedParts.length === 0}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 transition-all font-medium"
                  >
                    {language === 'ar' ? 'تأكيد الطلب' : 'Confirm Request'}
                  </button>
                  <button
                    onClick={() => setShowPartsModal(false)}
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
        {showDetailsModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 sticky top-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white">
                    {language === 'ar' ? 'تفاصيل أمر التشغيل' : 'Work Order Details'}
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
                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">
                      {language === 'ar' ? 'رقم الأمر' : 'Order Number'}
                    </label>
                    <p className="font-medium text-gray-800">{selectedOrder.orderNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">
                      {language === 'ar' ? 'العميل' : 'Customer'}
                    </label>
                    <p className="font-medium text-gray-800">{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">
                      {language === 'ar' ? 'رقم اللوحة' : 'Vehicle Plate'}
                    </label>
                    <p className="font-medium text-gray-800">{selectedOrder.vehiclePlate}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">
                      {language === 'ar' ? 'السائق' : 'Driver'}
                    </label>
                    <p className="font-medium text-gray-800">{selectedOrder.driverName}</p>
                  </div>
                </div>

                {/* Route Details */}
                <div className="border-t pt-6">
                  <h4 className="font-bold text-gray-800 mb-4">
                    {language === 'ar' ? 'تفاصيل المسار' : 'Route Details'}
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">
                        {language === 'ar' ? 'من' : 'From'}
                      </label>
                      <p className="font-medium text-gray-800">{selectedOrder.origin}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">
                        {language === 'ar' ? 'إلى' : 'To'}
                      </label>
                      <p className="font-medium text-gray-800">{selectedOrder.destination}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">
                        {language === 'ar' ? 'المسافة' : 'Distance'}
                      </label>
                      <p className="font-medium text-gray-800">{selectedOrder.distance} {language === 'ar' ? 'كم' : 'km'}</p>
                    </div>
                  </div>
                </div>

                {/* Cargo Details */}
                <div className="border-t pt-6">
                  <h4 className="font-bold text-gray-800 mb-4">
                    {language === 'ar' ? 'تفاصيل البضاعة' : 'Cargo Details'}
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">
                        {language === 'ar' ? 'نوع البضاعة' : 'Cargo Type'}
                      </label>
                      <p className="font-medium text-gray-800">{selectedOrder.cargoType}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">
                        {language === 'ar' ? 'الوزن' : 'Weight'}
                      </label>
                      <p className="font-medium text-gray-800">{selectedOrder.cargoWeight} {language === 'ar' ? 'كجم' : 'kg'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">
                        {language === 'ar' ? 'التكلفة المقدرة' : 'Estimated Cost'}
                      </label>
                      <p className="font-medium text-gray-800">{selectedOrder.estimatedCost.toLocaleString()} {language === 'ar' ? 'ج.م' : 'EGP'}</p>
                    </div>
                  </div>
                </div>

                {/* Schedule */}
                <div className="border-t pt-6">
                  <h4 className="font-bold text-gray-800 mb-4">
                    {language === 'ar' ? 'الجدول الزمني' : 'Schedule'}
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">
                        {language === 'ar' ? 'تاريخ الإنشاء' : 'Created Date'}
                      </label>
                      <p className="font-medium text-gray-800">{selectedOrder.createdAt}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">
                        {language === 'ar' ? 'موعد التنفيذ' : 'Scheduled Date'}
                      </label>
                      <p className="font-medium text-gray-800">{selectedOrder.scheduledDate}</p>
                    </div>
                    {selectedOrder.completedDate && (
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">
                          {language === 'ar' ? 'تاريخ الإكمال' : 'Completed Date'}
                        </label>
                        <p className="font-medium text-gray-800">{selectedOrder.completedDate}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Notes */}
                {selectedOrder.notes && (
                  <div className="border-t pt-6">
                    <h4 className="font-bold text-gray-800 mb-2">
                      {language === 'ar' ? 'ملاحظات' : 'Notes'}
                    </h4>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedOrder.notes}</p>
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

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 sticky top-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white">
                    {language === 'ar' ? 'أمر تشغيل جديد' : 'New Work Order'}
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
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'اسم العميل' : 'Customer Name'}
                    </label>
                    <input
                      type="text"
                      value={newOrder.customerName}
                      onChange={(e) => setNewOrder({...newOrder, customerName: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'المركبة' : 'Vehicle'}
                    </label>
                    <select
                      value={newOrder.vehicleId}
                      onChange={(e) => setNewOrder({...newOrder, vehicleId: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">{language === 'ar' ? 'اختر مركبة' : 'Select vehicle'}</option>
                      {vehicles.map(v => (
                        <option key={v.id} value={v.id}>{v.plate} - {v.type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'الأولوية' : 'Priority'}
                    </label>
                    <select
                      value={newOrder.priority}
                      onChange={(e) => setNewOrder({...newOrder, priority: e.target.value as any})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">{language === 'ar' ? 'منخفضة' : 'Low'}</option>
                      <option value="medium">{language === 'ar' ? 'متوسطة' : 'Medium'}</option>
                      <option value="high">{language === 'ar' ? 'عالية' : 'High'}</option>
                      <option value="urgent">{language === 'ar' ? 'عاجلة' : 'Urgent'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'من' : 'Origin'}
                    </label>
                    <input
                      type="text"
                      value={newOrder.origin}
                      onChange={(e) => setNewOrder({...newOrder, origin: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'إلى' : 'Destination'}
                    </label>
                    <input
                      type="text"
                      value={newOrder.destination}
                      onChange={(e) => setNewOrder({...newOrder, destination: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'المسافة (كم)' : 'Distance (km)'}
                    </label>
                    <input
                      type="number"
                      value={newOrder.distance}
                      onChange={(e) => setNewOrder({...newOrder, distance: parseFloat(e.target.value)})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'نوع البضاعة' : 'Cargo Type'}
                    </label>
                    <input
                      type="text"
                      value={newOrder.cargoType}
                      onChange={(e) => setNewOrder({...newOrder, cargoType: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'الوزن (كجم)' : 'Weight (kg)'}
                    </label>
                    <input
                      type="number"
                      value={newOrder.cargoWeight}
                      onChange={(e) => setNewOrder({...newOrder, cargoWeight: parseFloat(e.target.value)})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'التكلفة المقدرة' : 'Estimated Cost'}
                    </label>
                    <input
                      type="number"
                      value={newOrder.estimatedCost}
                      onChange={(e) => setNewOrder({...newOrder, estimatedCost: parseFloat(e.target.value)})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'موعد التنفيذ' : 'Scheduled Date'}
                    </label>
                    <input
                      type="date"
                      value={newOrder.scheduledDate}
                      onChange={(e) => setNewOrder({...newOrder, scheduledDate: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'ملاحظات' : 'Notes'}
                    </label>
                    <textarea
                      value={newOrder.notes}
                      onChange={(e) => setNewOrder({...newOrder, notes: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleCreateOrder}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
                  >
                    {language === 'ar' ? 'إنشاء أمر التشغيل' : 'Create Work Order'}
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
      </div>
    </div>
  );
}
