import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="site-container">
        {/* Header */}
        <div className="bg-lumina-teal text-white px-4 py-3 text-sm rounded-lg">
          Welcome! You have 0 accumulated points.
          <div className="flex items-center justify-end mt-2 gap-2">
            <Link href="/company/register">
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-white text-white hover:bg-white hover:text-lumina-teal text-xs px-3 py-1"
              >
                Create account
              </Button>
            </Link>
            <Link href="/company/login">
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-white text-white hover:bg-white hover:text-lumina-teal text-xs px-3 py-1"
              >
                Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 py-8">
          <h2 className="text-2xl font-bold text-black mb-8">
            Partner companies
          </h2>

          {/* Empty state - companies will be listed here */}
          <div className="text-center text-gray-500 mt-16">
            <p>No partner companies available at the moment.</p>
          </div>
        </div>
      </div>

      {/* Navigation to user selection */}
      <div className="fixed bottom-4 right-4 lg:hidden">
        <Link href="/user-selection">
          <Button className="bg-lumina-teal hover:bg-lumina-teal/90 text-white rounded-full w-12 h-12">
            →
          </Button>
        </Link>
      </div>
    </div>
  );
}
