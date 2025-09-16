import { CompanySidebar } from "../../../components/company-sidebar"

export default function CompanyDashboardPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-lumina-teal text-white px-4 py-3 text-sm">Welcome! You have 0 accumulated points.</div>

      {/* Main Content */}
      <div className="px-4 py-8">
        <h2 className="text-2xl font-bold text-black mb-8">Partner companies</h2>

        {/* Empty state - companies will be listed here */}
        <div className="text-center text-gray-500 mt-16">
          <p>Welcome to your company dashboard!</p>
          <p className="mt-2">Use the menu to access all features.</p>
        </div>
      </div>

      <CompanySidebar />
    </div>
  )
}
