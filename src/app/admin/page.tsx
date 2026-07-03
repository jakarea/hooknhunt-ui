'use client';

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Admin Dashboard
      </h1>
      <div className="bg-white dark:bg-[#2a2a2a] dark:bg-[#322020] rounded-lg shadow-md p-6">
        <p className="text-gray-600 dark:text-gray-200">
          Welcome to the Hook & Hunt admin panel. Use the sidebar to navigate to different sections.
        </p>
      </div>
    </div>
  );
}
