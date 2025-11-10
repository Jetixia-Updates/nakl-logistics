'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  MapPin,
  Truck,
  Navigation,
  Radio,
  AlertTriangle,
  Clock,
  Fuel,
  Gauge,
  Route,
  Users,
  Activity,
  Eye,
  Settings,
  RefreshCw,
  Zap,
  Shield,
} from 'lucide-react';

export default function GPSTrackingPage() {
  const { language } = useLanguage();
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>('V-001');
  const [isLiveTracking, setIsLiveTracking] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (isLiveTracking) {
        setLastUpdate(new Date());
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isLiveTracking]);

  const vehicleData: any = {};

  const fleetStats = {
    totalVehicles: 47,
    activeVehicles: 32,
    movingVehicles: 18,
    idleVehicles: 14,
    offlineVehicles: 15,
    averageSpeed: 72,
    totalDistance: 15420,
    fuelConsumption: 2850,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'moving':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'stopped':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'idle':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'offline':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      moving: language === 'ar' ? 'في الحركة' : 'Moving',
      stopped: language === 'ar' ? 'متوقف' : 'Stopped',
      idle: language === 'ar' ? 'خامل' : 'Idle',
      offline: language === 'ar' ? 'غير متصل' : 'Offline',
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'speed':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'fuel':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'idle':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'offline':
        return 'bg-gray-50 border-gray-200 text-gray-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const selectedVehicleData = selectedVehicle
    ? vehicleData[selectedVehicle as keyof typeof vehicleData]
    : null;

  return (
    <div className={`min-h-screen bg-gray-50 ${language === 'ar' ? 'font-arabic' : 'font-inter'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {language === 'ar' ? 'تتبع الأسطول بالـ GPS' : 'Fleet GPS Tracking'}
              </h1>
              <p className="text-gray-600">
                {language === 'ar'
                  ? 'مراقبة المركبات في الوقت الفعلي وتتبع المواقع والأداء'
                  : 'Real-time vehicle monitoring, location tracking, and performance analysis'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div
                  className={`w-2 h-2 rounded-full ${isLiveTracking ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}
                ></div>
                {isLiveTracking
                  ? language === 'ar'
                    ? 'مباشر'
                    : 'Live'
                  : language === 'ar'
                    ? 'متوقف'
                    : 'Stopped'}
              </div>
              <button
                onClick={() => setIsLiveTracking(!isLiveTracking)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isLiveTracking
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {isLiveTracking
                  ? language === 'ar'
                    ? 'إيقاف التتبع'
                    : 'Stop Tracking'
                  : language === 'ar'
                    ? 'بدء التتبع'
                    : 'Start Tracking'}
              </button>
            </div>
          </div>
        </div>

        {/* Fleet Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Truck className="w-8 h-8 text-blue-500" />
              <div className={`${language === 'ar' ? 'mr-4' : 'ml-4'}`}>
                <p className="text-2xl font-bold text-gray-900">{fleetStats.totalVehicles}</p>
                <p className="text-sm text-gray-600">
                  {language === 'ar' ? 'إجمالي المركبات' : 'Total Vehicles'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Activity className="w-8 h-8 text-green-500" />
              <div className={`${language === 'ar' ? 'mr-4' : 'ml-4'}`}>
                <p className="text-2xl font-bold text-gray-900">{fleetStats.activeVehicles}</p>
                <p className="text-sm text-gray-600">
                  {language === 'ar' ? 'مركبات نشطة' : 'Active Vehicles'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Gauge className="w-8 h-8 text-orange-500" />
              <div className={`${language === 'ar' ? 'mr-4' : 'ml-4'}`}>
                <p className="text-2xl font-bold text-gray-900">{fleetStats.averageSpeed}</p>
                <p className="text-sm text-gray-600">
                  {language === 'ar' ? 'متوسط السرعة (كم/ساعة)' : 'Avg Speed (km/h)'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Route className="w-8 h-8 text-purple-500" />
              <div className={`${language === 'ar' ? 'mr-4' : 'ml-4'}`}>
                <p className="text-2xl font-bold text-gray-900">{fleetStats.totalDistance}</p>
                <p className="text-sm text-gray-600">
                  {language === 'ar' ? 'إجمالي المسافة (كم)' : 'Total Distance (km)'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Vehicle List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">
                  {language === 'ar' ? 'قائمة المركبات' : 'Vehicle List'}
                </h3>
              </div>
              <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                {Object.values(vehicleData).map((vehicle: any) => (
                  <div
                    key={vehicle.id}
                    onClick={() => setSelectedVehicle(vehicle.id)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedVehicle === vehicle.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{vehicle.plateNumber}</h4>
                        <p className="text-sm text-gray-500">
                          {vehicle.make} {vehicle.model}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(vehicle.status)}`}
                      >
                        {getStatusText(vehicle.status)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Gauge className="w-3 h-3" />
                        <span>{vehicle.speed} km/h</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Fuel className="w-3 h-3" />
                        <span>{vehicle.fuel}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Map Placeholder */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {language === 'ar' ? 'خريطة التتبع' : 'Tracking Map'}
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      aria-label={language === 'ar' ? 'تحديث الخريطة' : 'Refresh map'}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button
                      aria-label={language === 'ar' ? 'إعدادات الخريطة' : 'Map settings'}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">
                      {language === 'ar'
                        ? 'خريطة تتبع المركبات التفاعلية'
                        : 'Interactive Vehicle Tracking Map'}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      {language === 'ar'
                        ? 'سيتم دمج خرائط جوجل هنا'
                        : 'Google Maps integration here'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Details */}
            {selectedVehicleData && (
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {selectedVehicleData.plateNumber} - {selectedVehicleData.make}{' '}
                        {selectedVehicleData.model}
                      </h3>
                      <p className="text-gray-600">
                        {language === 'ar' ? 'السائق:' : 'Driver:'} {selectedVehicleData.driver}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedVehicleData.status)}`}
                    >
                      {getStatusText(selectedVehicleData.status)}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Location Info */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">
                        {language === 'ar' ? 'معلومات الموقع' : 'Location Information'}
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-600">
                              {language === 'ar' ? 'الموقع الحالي:' : 'Current Location:'}
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedVehicleData.location.address}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Navigation className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-600">
                              {language === 'ar' ? 'الوجهة:' : 'Destination:'}
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedVehicleData.destination}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-600">
                              {language === 'ar' ? 'آخر تحديث:' : 'Last Update:'}
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedVehicleData.lastUpdate}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Vehicle Status */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">
                        {language === 'ar' ? 'حالة المركبة' : 'Vehicle Status'}
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <Gauge className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                          <p className="text-xs text-gray-600">
                            {language === 'ar' ? 'السرعة' : 'Speed'}
                          </p>
                          <p className="text-lg font-bold text-gray-900">
                            {selectedVehicleData.speed}
                          </p>
                          <p className="text-xs text-gray-500">km/h</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <Fuel className="w-6 h-6 text-green-500 mx-auto mb-1" />
                          <p className="text-xs text-gray-600">
                            {language === 'ar' ? 'الوقود' : 'Fuel'}
                          </p>
                          <p className="text-lg font-bold text-gray-900">
                            {selectedVehicleData.fuel}
                          </p>
                          <p className="text-xs text-gray-500">%</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <Zap className="w-6 h-6 text-orange-500 mx-auto mb-1" />
                          <p className="text-xs text-gray-600">
                            {language === 'ar' ? 'المحرك' : 'Engine'}
                          </p>
                          <p className="text-lg font-bold text-gray-900">
                            {selectedVehicleData.engine === 'on'
                              ? language === 'ar'
                                ? 'يعمل'
                                : 'ON'
                              : language === 'ar'
                                ? 'متوقف'
                                : 'OFF'}
                          </p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <Route className="w-6 h-6 text-purple-500 mx-auto mb-1" />
                          <p className="text-xs text-gray-600">
                            {language === 'ar' ? 'التقدم' : 'Progress'}
                          </p>
                          <p className="text-lg font-bold text-gray-900">
                            {selectedVehicleData.route.progress}
                          </p>
                          <p className="text-xs text-gray-500">%</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Route Progress */}
                  {selectedVehicleData.route.distance > 0 && (
                    <div className="mt-6 pt-6 border-t">
                      <h4 className="font-medium text-gray-900 mb-3">
                        {language === 'ar' ? 'تقدم الرحلة' : 'Trip Progress'}
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {language === 'ar' ? 'المسافة الإجمالية:' : 'Total Distance:'}
                          </span>
                          <span className="font-medium">
                            {selectedVehicleData.route.distance} km
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {language === 'ar' ? 'الوقت المتوقع:' : 'Estimated Time:'}
                          </span>
                          <span className="font-medium">
                            {selectedVehicleData.route.duration}{' '}
                            {language === 'ar' ? 'دقيقة' : 'minutes'}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-blue-500 h-3 rounded-full flex items-center justify-end pr-2"
                            style={{ width: `${selectedVehicleData.route.progress}%` }}
                          >
                            <span className="text-xs font-medium text-white">
                              {selectedVehicleData.route.progress}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Alerts */}
                  {selectedVehicleData.alerts.length > 0 && (
                    <div className="mt-6 pt-6 border-t">
                      <h4 className="font-medium text-gray-900 mb-3">
                        {language === 'ar' ? 'التنبيهات' : 'Alerts'}
                      </h4>
                      <div className="space-y-2">
                        {selectedVehicleData.alerts.map((alert: any, index: number) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg border ${getAlertColor(alert.type)}`}
                          >
                            <div className="flex items-center gap-3">
                              <AlertTriangle className="w-4 h-4" />
                              <div className="flex-1">
                                <p className="text-sm font-medium">{alert.message}</p>
                                <p className="text-xs opacity-75">{alert.timestamp}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
