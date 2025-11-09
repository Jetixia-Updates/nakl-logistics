'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Search,
  Package,
  MapPin,
  Truck,
  Clock,
  CheckCircle,
  AlertTriangle,
  Phone,
  Calendar,
  Navigation,
} from 'lucide-react';

export default function TrackingPage() {
  const { language, translations } = useLanguage();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Sample tracking data
  const sampleShipments = {
    TRK001: {
      id: 'TRK001',
      status: 'delivered',
      customer: language === 'ar' ? 'أحمد محمد علي' : 'Ahmed Mohamed Ali',
      phone: '+201234567890',
      origin: language === 'ar' ? 'القاهرة - مدينة نصر' : 'Cairo - Nasr City',
      destination: language === 'ar' ? 'الإسكندرية - الميناء' : 'Alexandria - Port',
      shipmentDate: '2024-11-06',
      estimatedDelivery: '2024-11-07',
      actualDelivery: '2024-11-07',
      driver: language === 'ar' ? 'محمود حسن' : 'Mahmoud Hassan',
      vehicle: 'ق أ ح 1234 - Mercedes Actros',
      cargo: language === 'ar' ? 'مواد بناء - 25 طن' : 'Construction Materials - 25 tons',
      timeline: [
        {
          status: 'picked-up',
          timestamp: '2024-11-06 08:00',
          location: language === 'ar' ? 'القاهرة - مدينة نصر' : 'Cairo - Nasr City',
          description: language === 'ar' ? 'تم استلام الشحنة' : 'Shipment picked up',
        },
        {
          status: 'in-transit',
          timestamp: '2024-11-06 10:30',
          location: language === 'ar' ? 'على الطريق الصحراوي' : 'On Desert Road',
          description: language === 'ar' ? 'في الطريق إلى الوجهة' : 'On the way to destination',
        },
        {
          status: 'arrived',
          timestamp: '2024-11-07 14:15',
          location: language === 'ar' ? 'الإسكندرية - الميناء' : 'Alexandria - Port',
          description: language === 'ar' ? 'وصل إلى منطقة التسليم' : 'Arrived at delivery area',
        },
        {
          status: 'delivered',
          timestamp: '2024-11-07 15:45',
          location: language === 'ar' ? 'الإسكندرية - الميناء' : 'Alexandria - Port',
          description: language === 'ar' ? 'تم التسليم بنجاح' : 'Successfully delivered',
        },
      ],
    },
    TRK002: {
      id: 'TRK002',
      status: 'in-transit',
      customer: language === 'ar' ? 'فاطمة أحمد' : 'Fatma Ahmed',
      phone: '+201987654321',
      origin: language === 'ar' ? 'الإسكندرية - وسط البلد' : 'Alexandria - Downtown',
      destination: language === 'ar' ? 'أسوان - كورنيش النيل' : 'Aswan - Nile Corniche',
      shipmentDate: '2024-11-08',
      estimatedDelivery: '2024-11-10',
      actualDelivery: null,
      driver: language === 'ar' ? 'خالد عبد الله' : 'Khaled Abdullah',
      vehicle: 'ب ن م 5678 - Volvo FH',
      cargo: language === 'ar' ? 'معدات إلكترونية - 15 طن' : 'Electronic Equipment - 15 tons',
      timeline: [
        {
          status: 'picked-up',
          timestamp: '2024-11-08 09:00',
          location: language === 'ar' ? 'الإسكندرية - وسط البلد' : 'Alexandria - Downtown',
          description: language === 'ar' ? 'تم استلام الشحنة' : 'Shipment picked up',
        },
        {
          status: 'in-transit',
          timestamp: '2024-11-08 12:00',
          location: language === 'ar' ? 'القاهرة - الدائري' : 'Cairo - Ring Road',
          description:
            language === 'ar' ? 'في الطريق - نقطة تفتيش القاهرة' : 'In transit - Cairo checkpoint',
        },
        {
          status: 'in-transit',
          timestamp: '2024-11-08 18:30',
          location: language === 'ar' ? 'قنا - محطة استراحة' : 'Qena - Rest Stop',
          description: language === 'ar' ? 'استراحة السائق' : 'Driver rest break',
        },
      ],
    },
  };

  const handleSearch = () => {
    setIsSearching(true);

    // Simulate API call
    setTimeout(() => {
      const result = sampleShipments[trackingNumber as keyof typeof sampleShipments];
      setTrackingResult(result || null);
      setIsSearching(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-50';
      case 'in-transit':
        return 'text-blue-600 bg-blue-50';
      case 'picked-up':
        return 'text-orange-600 bg-orange-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      delivered: language === 'ar' ? 'تم التسليم' : 'Delivered',
      'in-transit': language === 'ar' ? 'في الطريق' : 'In Transit',
      'picked-up': language === 'ar' ? 'تم الاستلام' : 'Picked Up',
      arrived: language === 'ar' ? 'وصل' : 'Arrived',
      pending: language === 'ar' ? 'قيد الانتظار' : 'Pending',
      cancelled: language === 'ar' ? 'ملغي' : 'Cancelled',
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in-transit':
        return <Truck className="w-5 h-5 text-blue-600" />;
      case 'picked-up':
        return <Package className="w-5 h-5 text-orange-600" />;
      case 'arrived':
        return <MapPin className="w-5 h-5 text-purple-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-blue-50 to-white ${language === 'ar' ? 'font-arabic' : 'font-inter'}`}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {language === 'ar' ? 'تتبع الشحنات' : 'Track Your Shipment'}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {language === 'ar'
              ? 'أدخل رقم التتبع الخاص بك للحصول على آخر المعلومات حول شحنتك'
              : 'Enter your tracking number to get the latest updates on your shipment'}
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-white p-8 rounded-2xl shadow-lg border">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="tracking" className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'رقم التتبع' : 'Tracking Number'}
                </label>
                <input
                  id="tracking"
                  type="text"
                  placeholder={
                    language === 'ar'
                      ? 'أدخل رقم التتبع (مثال: TRK001)'
                      : 'Enter tracking number (e.g., TRK001)'
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  disabled={!trackingNumber.trim() || isSearching}
                  className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 justify-center"
                >
                  {isSearching ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                  {language === 'ar' ? 'تتبع' : 'Track'}
                </button>
              </div>
            </div>
          </div>

          {/* Sample tracking numbers */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">
              {language === 'ar'
                ? 'جرب أرقام التتبع التالية:'
                : 'Try these sample tracking numbers:'}
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setTrackingNumber('TRK001')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                TRK001
              </button>
              <button
                onClick={() => setTrackingNumber('TRK002')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                TRK002
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {trackingResult === null && trackingNumber && !isSearching && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                {language === 'ar' ? 'لم يتم العثور على الشحنة' : 'Shipment Not Found'}
              </h3>
              <p className="text-red-600">
                {language === 'ar'
                  ? 'رقم التتبع غير صحيح. يرجى التحقق من الرقم والمحاولة مرة أخرى.'
                  : 'Invalid tracking number. Please check the number and try again.'}
              </p>
            </div>
          </div>
        )}

        {trackingResult && (
          <div className="max-w-4xl mx-auto">
            {/* Shipment Info */}
            <div className="bg-white rounded-2xl shadow-lg border mb-8 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">
                      {language === 'ar' ? 'معلومات الشحنة' : 'Shipment Information'}
                    </h2>
                    <p className="text-blue-100">
                      {language === 'ar' ? 'رقم التتبع:' : 'Tracking Number:'} {trackingResult.id}
                    </p>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-full ${getStatusColor(trackingResult.status)}`}
                  >
                    <div className="flex items-center gap-2">
                      {getStatusIcon(trackingResult.status)}
                      <span className="font-semibold">{getStatusText(trackingResult.status)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer Info */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">
                      {language === 'ar' ? 'معلومات العميل' : 'Customer Information'}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Package className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{trackingResult.customer}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{trackingResult.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Dates */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">
                      {language === 'ar' ? 'التواريخ المهمة' : 'Important Dates'}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                          <span className="text-sm text-gray-600">
                            {language === 'ar' ? 'تاريخ الشحن:' : 'Shipped:'}
                          </span>
                          <span className="text-gray-900 ml-2">{trackingResult.shipmentDate}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <div>
                          <span className="text-sm text-gray-600">
                            {language === 'ar' ? 'التسليم المتوقع:' : 'Expected Delivery:'}
                          </span>
                          <span className="text-gray-900 ml-2">
                            {trackingResult.estimatedDelivery}
                          </span>
                        </div>
                      </div>
                      {trackingResult.actualDelivery && (
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <div>
                            <span className="text-sm text-gray-600">
                              {language === 'ar' ? 'تم التسليم:' : 'Delivered:'}
                            </span>
                            <span className="text-gray-900 ml-2">
                              {trackingResult.actualDelivery}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Route */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">
                      {language === 'ar' ? 'المسار' : 'Route'}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-green-500" />
                        <div>
                          <span className="text-sm text-gray-600">
                            {language === 'ar' ? 'من:' : 'From:'}
                          </span>
                          <span className="text-gray-900 ml-2">{trackingResult.origin}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Navigation className="w-4 h-4 text-red-500" />
                        <div>
                          <span className="text-sm text-gray-600">
                            {language === 'ar' ? 'إلى:' : 'To:'}
                          </span>
                          <span className="text-gray-900 ml-2">{trackingResult.destination}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Transport Details */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">
                      {language === 'ar' ? 'تفاصيل النقل' : 'Transport Details'}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Truck className="w-4 h-4 text-gray-400" />
                        <div>
                          <span className="text-sm text-gray-600">
                            {language === 'ar' ? 'المركبة:' : 'Vehicle:'}
                          </span>
                          <span className="text-gray-900 ml-2">{trackingResult.vehicle}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Package className="w-4 h-4 text-gray-400" />
                        <div>
                          <span className="text-sm text-gray-600">
                            {language === 'ar' ? 'البضاعة:' : 'Cargo:'}
                          </span>
                          <span className="text-gray-900 ml-2">{trackingResult.cargo}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl shadow-lg border">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">
                  {language === 'ar' ? 'تتبع الشحنة' : 'Shipment Timeline'}
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {trackingResult.timeline.map((event: any, index: number) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          {getStatusIcon(event.status)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-gray-900">
                            {getStatusText(event.status)}
                          </h4>
                          <span className="text-sm text-gray-500">{event.timestamp}</span>
                        </div>
                        <p className="text-gray-600 mb-1">{event.description}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <MapPin className="w-3 h-3" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
