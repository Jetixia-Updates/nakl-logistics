import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'إدارة نقل - لوحة التحكم الإدارية',
  description: 'لوحة تحكم إدارية آمنة لنظام إدارة النقل واللوجستيات',
  robots: 'noindex, nofollow', // Prevent search engine indexing
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-layout">
      {children}
    </div>
  );
}