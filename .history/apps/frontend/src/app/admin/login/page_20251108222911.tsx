'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Shield, Lock, User, ArrowRight, AlertTriangle } from 'lucide-react';

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    twoFactorCode: '',
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [blocked, setBlocked] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (blocked) {
      alert('تم حظر الحساب مؤقتاً بسبب المحاولات المتعددة');
      return;
    }

    setLoading(true);

    // TODO: Implement admin login logic with enhanced security
    console.log('Admin login attempt:', {
      username: formData.username,
      hasPassword: !!formData.password,
      twoFactorCode: formData.twoFactorCode,
      rememberMe: formData.rememberMe,
    });

    // Simulate authentication
    setTimeout(() => {
      const isValid = formData.username === 'admin' && formData.password === 'admin123';
      
      if (isValid && !showTwoFactor) {
        setShowTwoFactor(true);
        setLoading(false);
        return;
      }
      
      if (isValid && showTwoFactor && formData.twoFactorCode === '123456') {
        setLoading(false);
        alert('تم تسجيل دخول المدير بنجاح!');
        // Redirect to admin dashboard
        window.location.href = '/admin/dashboard';
      } else {
        setAttempts(prev => prev + 1);
        if (attempts >= 2) {
          setBlocked(true);
          setTimeout(() => setBlocked(false), 300000); // 5 minutes
        }
        setLoading(false);
        alert('بيانات غير صحيحة');
      }
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 flex items-center justify-center px-4 py-8"
      dir="rtl"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMzIzMjMiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
      
      <div className="max-w-md w-full relative z-10">
        {/* Security Warning */}
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3 text-red-300">
            <AlertTriangle size={20} />
            <div>
              <p className="font-medium">منطقة محظورة</p>
              <p className="text-sm opacity-80">مخصصة للإدارة فقط - جميع المحاولات مسجلة</p>
            </div>
          </div>
        </div>

        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-br from-red-600 to-red-800 text-white w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-2xl">
            <Shield size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">لوحة تحكم الإدارة</h1>
          <p className="text-gray-400">تسجيل دخول آمن للمديرين المعتمدين</p>
        </div>

        {/* Login Form */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                اسم المستخدم الإداري
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors text-white placeholder-gray-400 pl-12"
                  placeholder="أدخل اسم المستخدم"
                  required
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                كلمة المرور الإدارية
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors text-white placeholder-gray-400 pl-12"
                  placeholder="أدخل كلمة المرور"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Two Factor Authentication */}
            {showTwoFactor && (
              <div>
                <label htmlFor="twoFactorCode" className="block text-sm font-medium text-gray-300 mb-2">
                  رمز التحقق الثنائي (2FA)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="twoFactorCode"
                    name="twoFactorCode"
                    value={formData.twoFactorCode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors text-white placeholder-gray-400 pl-12"
                    placeholder="أدخل رمز التحقق من 6 أرقام"
                    maxLength={6}
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  تم إرسال رمز التحقق إلى تطبيق المصادقة المسجل
                </p>
              </div>
            )}

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 text-red-600 bg-gray-900 border-gray-600 rounded focus:ring-red-500"
                />
                <span className="mr-2 text-sm text-gray-300">تذكر جلسة الإدارة</span>
              </label>
              
              {attempts > 0 && (
                <span className="text-xs text-orange-400">
                  محاولات خاطئة: {attempts}/3
                </span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || blocked}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-lg font-medium hover:from-red-700 hover:to-red-800 focus:ring-4 focus:ring-red-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  جاري التحقق من الهوية...
                </>
              ) : blocked ? (
                <>
                  <Lock size={20} />
                  محظور مؤقتاً
                </>
              ) : (
                <>
                  <Shield size={20} />
                  دخول آمن للإدارة
                </>
              )}
            </button>
          </form>

          {/* Security Info */}
          <div className="mt-6 p-4 bg-gray-900/30 rounded-lg border border-gray-700/30">
            <h4 className="text-sm font-medium text-gray-300 mb-2">معلومات الأمان:</h4>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• جميع محاولات الدخول مسجلة ومراقبة</li>
              <li>• يتطلب التحقق الثنائي (2FA) للأمان المعزز</li>
              <li>• يتم حظر الحساب بعد 3 محاولات خاطئة</li>
              <li>• جلسات الإدارة محدودة المدة ومشفرة</li>
            </ul>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors"
          >
            <ArrowRight size={16} />
            العودة للموقع الرئيسي
          </Link>
        </div>

        {/* Test Credentials */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
            <p className="text-yellow-300 text-xs font-medium mb-2">بيانات التجربة (للتطوير فقط):</p>
            <p className="text-yellow-200 text-xs">اسم المستخدم: admin</p>
            <p className="text-yellow-200 text-xs">كلمة المرور: admin123</p>
            <p className="text-yellow-200 text-xs">رمز 2FA: 123456</p>
          </div>
        )}
      </div>
    </div>
  );
}