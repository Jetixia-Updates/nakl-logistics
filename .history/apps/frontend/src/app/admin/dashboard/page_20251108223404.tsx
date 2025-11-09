'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield,
  Users,
  Truck,
  Package,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
} from 'lucide-react';

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mock data - replace with real API calls
  const stats = {
    totalUsers: 1247,
    activeShipments: 89,
    totalRevenue: 2450000,
    pendingOrders: 23,
    alerts: 5,
  };

  const recentActivities = [
    { id: 1, action: 'تسجيل مستخدم جديد', user: 'أحمد محمد', time: '5 دقائق' },
    { id: 2, action: 'إنشاء شحنة جديدة', user: 'شركة الأمل', time: '12 دقيقة' },
    { id: 3, action: 'دفع فاتورة', user: 'مؤسسة النور', time: '25 دقيقة' },
    { id: 4, action: 'تحديث معلومات المركبة', user: 'خالد أحمد', time: '1 ساعة' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100" dir="rtl">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out z-30 lg:relative lg:transform-none lg:flex-shrink-0 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 bg-gray-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-red-500" />
            <span className="text-white font-bold text-lg">إدارة نقل</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-400 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="mt-8 px-4 flex-1">
            <div className="space-y-2">
            <SidebarLink
              href="/admin/dashboard"
              icon={<TrendingUp size={20} />}
              text="لوحة التحكم"
              active
            />
            <SidebarLink href="/admin/users" icon={<Users size={20} />} text="إدارة المستخدمين" />
            <SidebarLink
              href="/admin/shipments"
              icon={<Package size={20} />}
              text="إدارة الشحنات"
            />
            <SidebarLink href="/admin/vehicles" icon={<Truck size={20} />} text="إدارة المركبات" />
            <SidebarLink
              href="/admin/finance"
              icon={<DollarSign size={20} />}
              text="الإدارة المالية"
            />
            <SidebarLink
              href="/admin/reports"
              icon={<TrendingUp size={20} />}
              text="التقارير والإحصائيات"
            />
            <SidebarLink
              href="/admin/settings"
              icon={<Settings size={20} />}
              text="إعدادات النظام"
            />
          </div>

            <div className="mt-8 pt-8 border-t border-gray-700">
              <SidebarLink href="/admin/login" icon={<LogOut size={20} />} text="تسجيل الخروج" />
            </div>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-gray-500 hover:text-gray-700 lg:hidden"
                aria-label="فتح القائمة الجانبية"
              >
                <Menu size={20} />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">لوحة تحكم الإدارة</h1>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="بحث..."
                  className="pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Notifications */}
              <button 
                className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                aria-label={`الإشعارات - ${stats.alerts} إشعارات جديدة`}
              >
                <Bell size={20} />
                {stats.alerts > 0 && (
                  <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                )}
              </button>

              {/* Admin profile */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <Shield size={16} className="text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">المدير العام</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="إجمالي المستخدمين"
              value={stats.totalUsers.toLocaleString()}
              icon={<Users size={24} />}
              color="blue"
              change="+12% من الشهر الماضي"
            />
            <StatCard
              title="الشحنات النشطة"
              value={stats.activeShipments}
              icon={<Package size={24} />}
              color="green"
              change="+8 شحنات جديدة اليوم"
            />
            <StatCard
              title="إجمالي الإيرادات"
              value={`${(stats.totalRevenue / 1000).toFixed(0)}k ج.م`}
              icon={<DollarSign size={24} />}
              color="purple"
              change="+23% من الشهر الماضي"
            />
            <StatCard
              title="الطلبات المعلقة"
              value={stats.pendingOrders}
              icon={<AlertTriangle size={24} />}
              color="orange"
              change="يتطلب مراجعة فورية"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent activities */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">النشاطات الأخيرة</h3>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">بواسطة {activity.user}</p>
                    </div>
                    <span className="text-xs text-gray-400">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">إجراءات سريعة</h3>
              <div className="grid grid-cols-2 gap-4">
                <QuickAction
                  href="/admin/users/new"
                  icon={<Users size={20} />}
                  title="إضافة مستخدم"
                  description="إنشاء حساب جديد"
                />
                <QuickAction
                  href="/admin/shipments/new"
                  icon={<Package size={20} />}
                  title="شحنة جديدة"
                  description="إنشاء شحنة جديدة"
                />
                <QuickAction
                  href="/admin/vehicles/new"
                  icon={<Truck size={20} />}
                  title="تسجيل مركبة"
                  description="إضافة مركبة جديدة"
                />
                <QuickAction
                  href="/admin/reports"
                  icon={<TrendingUp size={20} />}
                  title="إنشاء تقرير"
                  description="تقارير مخصصة"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Helper components
function SidebarLink({
  href,
  icon,
  text,
  active = false,
}: {
  href: string;
  icon: React.ReactNode;
  text: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        active ? 'bg-red-500 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
      }`}
    >
      {icon}
      <span className="font-medium">{text}</span>
    </Link>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
  change,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  change: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  }[color];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses} text-white`}>{icon}</div>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-xs text-gray-500 mt-1">{change}</p>
      </div>
    </div>
  );
}

function QuickAction({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors group"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="text-red-500 group-hover:text-red-600">{icon}</div>
        <h4 className="font-medium text-gray-900">{title}</h4>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </Link>
  );
}
