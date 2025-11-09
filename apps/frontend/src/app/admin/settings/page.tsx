'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Lock,
  Mail,
  Smartphone,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Check,
  X,
  Upload,
  Camera,
  AlertCircle,
  CheckCircle,
  Zap,
  Moon,
  Sun,
  Volume2,
  VolumeX,
} from 'lucide-react';

export default function SettingsPage() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: true,
    sound: true,
  });

  const tabs = [
    {
      id: 'profile',
      label: language === 'ar' ? 'الملف الشخصي' : 'Profile',
      icon: User,
    },
    {
      id: 'security',
      label: language === 'ar' ? 'الأمان' : 'Security',
      icon: Shield,
    },
    {
      id: 'notifications',
      label: language === 'ar' ? 'الإشعارات' : 'Notifications',
      icon: Bell,
    },
    {
      id: 'appearance',
      label: language === 'ar' ? 'المظهر' : 'Appearance',
      icon: Palette,
    },
    {
      id: 'system',
      label: language === 'ar' ? 'النظام' : 'System',
      icon: Settings,
    },
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 ${language === 'ar' ? 'font-arabic' : 'font-inter'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl shadow-lg">
              <Settings className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {language === 'ar' ? 'الإعدادات' : 'Settings'}
              </h1>
              <p className="text-gray-600">
                {language === 'ar' ? 'إدارة إعدادات النظام والحساب' : 'Manage system and account settings'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 sticky top-8">
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-200 scale-105'
                          : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-blue-50 hover:scale-102'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${activeTab === tab.id ? 'animate-pulse' : ''}`} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Avatar Section */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Camera className="w-6 h-6 text-purple-500" />
                    {language === 'ar' ? 'الصورة الشخصية' : 'Profile Picture'}
                  </h3>
                  <div className="flex items-center gap-6">
                    <div className="relative group">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                        {language === 'ar' ? 'م' : 'A'}
                      </div>
                      <button className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Upload className="w-6 h-6 text-white" />
                      </button>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg font-semibold">
                        <Upload className="w-4 h-4 inline mr-2" />
                        {language === 'ar' ? 'رفع صورة جديدة' : 'Upload New Photo'}
                      </button>
                      <p className="text-sm text-gray-500 mt-2">
                        {language === 'ar' ? 'JPG, PNG أو GIF (حد أقصى 5 MB)' : 'JPG, PNG or GIF (max 5MB)'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <User className="w-6 h-6 text-purple-500" />
                    {language === 'ar' ? 'المعلومات الشخصية' : 'Personal Information'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {language === 'ar' ? 'الاسم الأول' : 'First Name'}
                      </label>
                      <input
                        type="text"
                        defaultValue={language === 'ar' ? 'محمد' : 'Mohamed'}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {language === 'ar' ? 'الاسم الأخير' : 'Last Name'}
                      </label>
                      <input
                        type="text"
                        defaultValue={language === 'ar' ? 'أحمد' : 'Ahmed'}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Mail className="w-4 h-4 inline mr-1" />
                        {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                      </label>
                      <input
                        type="email"
                        defaultValue="admin@nakl.com"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Smartphone className="w-4 h-4 inline mr-1" />
                        {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                      </label>
                      <input
                        type="tel"
                        defaultValue="+20 123 456 7890"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg font-semibold flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
                    </button>
                    <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-semibold flex items-center gap-2">
                      <X className="w-4 h-4" />
                      {language === 'ar' ? 'إلغاء' : 'Cancel'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                {/* Change Password */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Lock className="w-6 h-6 text-red-500" />
                    {language === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {language === 'ar' ? 'كلمة المرور الحالية' : 'Current Password'}
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all"
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {language === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all"
                      />
                    </div>
                  </div>
                  <button className="mt-6 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-lg font-semibold">
                    {language === 'ar' ? 'تحديث كلمة المرور' : 'Update Password'}
                  </button>
                </div>

                {/* Two-Factor Authentication */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Shield className="w-6 h-6 text-green-500" />
                    {language === 'ar' ? 'المصادقة الثنائية' : 'Two-Factor Authentication'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {language === 'ar' ? 'أضف طبقة إضافية من الأمان لحسابك' : 'Add an extra layer of security to your account'}
                  </p>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border-2 border-green-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="font-semibold text-gray-900">{language === 'ar' ? 'مفعّل' : 'Enabled'}</p>
                        <p className="text-sm text-gray-600">{language === 'ar' ? 'تم التفعيل في 15 يناير 2024' : 'Enabled on Jan 15, 2024'}</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-white border-2 border-green-500 text-green-600 rounded-lg hover:bg-green-50 transition-all font-semibold">
                      {language === 'ar' ? 'إلغاء التفعيل' : 'Disable'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Bell className="w-6 h-6 text-yellow-500" />
                  {language === 'ar' ? 'تفضيلات الإشعارات' : 'Notification Preferences'}
                </h3>
                <div className="space-y-4">
                  {[
                    { key: 'email', icon: Mail, label: language === 'ar' ? 'إشعارات البريد الإلكتروني' : 'Email Notifications' },
                    { key: 'sms', icon: Smartphone, label: language === 'ar' ? 'إشعارات SMS' : 'SMS Notifications' },
                    { key: 'push', icon: Bell, label: language === 'ar' ? 'الإشعارات الفورية' : 'Push Notifications' },
                    { key: 'sound', icon: Volume2, label: language === 'ar' ? 'الأصوات' : 'Sound Effects' },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isEnabled = notifications[item.key as keyof typeof notifications];
                    return (
                      <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-gray-600" />
                          <span className="font-semibold text-gray-900">{item.label}</span>
                        </div>
                        <button
                          onClick={() => setNotifications({ ...notifications, [item.key]: !isEnabled })}
                          className={`relative w-14 h-7 rounded-full transition-all ${isEnabled ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gray-300'}`}
                        >
                          <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-lg transition-transform ${isEnabled ? 'translate-x-7' : ''}`}></div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Palette className="w-6 h-6 text-purple-500" />
                    {language === 'ar' ? 'المظهر والسمة' : 'Appearance & Theme'}
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <button
                      onClick={() => setIsDarkMode(false)}
                      className={`p-6 rounded-xl border-2 transition-all ${!isDarkMode ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <Sun className={`w-8 h-8 mx-auto mb-3 ${!isDarkMode ? 'text-blue-600' : 'text-gray-400'}`} />
                      <p className="font-semibold text-gray-900">{language === 'ar' ? 'فاتح' : 'Light'}</p>
                    </button>
                    <button
                      onClick={() => setIsDarkMode(true)}
                      className={`p-6 rounded-xl border-2 transition-all ${isDarkMode ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <Moon className={`w-8 h-8 mx-auto mb-3 ${isDarkMode ? 'text-purple-600' : 'text-gray-400'}`} />
                      <p className="font-semibold text-gray-900">{language === 'ar' ? 'داكن' : 'Dark'}</p>
                    </button>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-blue-600" />
                      <p className="text-sm text-gray-700">
                        {language === 'ar' ? 'المظهر الداكن يوفر الطاقة ويقلل إجهاد العين' : 'Dark mode saves energy and reduces eye strain'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* System Settings */}
            {activeTab === 'system' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Globe className="w-6 h-6 text-blue-500" />
                    {language === 'ar' ? 'إعدادات النظام' : 'System Settings'}
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {language === 'ar' ? 'اللغة الافتراضية' : 'Default Language'}
                      </label>
                      <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all">
                        <option value="ar">{language === 'ar' ? 'العربية' : 'Arabic'}</option>
                        <option value="en">{language === 'ar' ? 'الإنجليزية' : 'English'}</option>
                      </select>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {language === 'ar' ? 'المنطقة الزمنية' : 'Timezone'}
                      </label>
                      <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all">
                        <option value="africa/cairo">(GMT+2) {language === 'ar' ? 'القاهرة' : 'Cairo'}</option>
                        <option value="asia/dubai">(GMT+4) {language === 'ar' ? 'دبي' : 'Dubai'}</option>
                        <option value="asia/riyadh">(GMT+3) {language === 'ar' ? 'الرياض' : 'Riyadh'}</option>
                      </select>
                    </div>

                    <div className="p-4 bg-red-50 rounded-xl border-2 border-red-200">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <h4 className="font-bold text-red-900 mb-2">{language === 'ar' ? 'منطقة الخطر' : 'Danger Zone'}</h4>
                          <p className="text-sm text-red-700 mb-4">
                            {language === 'ar' ? 'حذف الحساب نهائياً. هذا الإجراء لا يمكن التراجع عنه.' : 'Permanently delete account. This action cannot be undone.'}
                          </p>
                          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-semibold">
                            {language === 'ar' ? 'حذف الحساب' : 'Delete Account'}
                          </button>
                        </div>
                      </div>
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
