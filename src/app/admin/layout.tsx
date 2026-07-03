import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1a1a1a]">
      <AdminHeader />
      <AdminSidebar />
      <main className="ml-64 pt-16 p-6">
        {children}
      </main>
    </div>
  );
}
