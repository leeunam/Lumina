import { CompanySidebar } from '../../../components/company-sidebar';

export default function CompanyDashboardPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-lumina-teal text-white px-4 py-3 text-sm">
        Welcome! You have 0 accumulated points.
      </div>

      <div className="site-container">
        <div className="layout-grid">
          {/* Sidebar column (desktop) */}
          <aside className="hidden lg:block">
            <CompanySidebar />
          </aside>

          {/* Main column */}
          <main>
            <div className="px-0 py-8 lg:px-6">
              <h2 className="text-2xl font-bold text-black mb-8">
                Partner companies
              </h2>

              {/* Empty state - companies will be listed here */}
              <div className="text-center text-gray-500 mt-16">
                <p>Welcome to your company dashboard!</p>
                <p className="mt-2">Use the menu to access all features.</p>
              </div>
            </div>
          </main>

          {/* Right column (optional on desktop) */}
          <aside className="hidden lg:block">
            {/* placeholder for right column (announcements, tips) */}
            <div className="p-4 bg-gray-50 rounded-md">Announcements</div>
          </aside>
        </div>
      </div>
    </div>
  );
}
