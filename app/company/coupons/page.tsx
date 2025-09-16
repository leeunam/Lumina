'use client';

import { useState } from 'react';
import { MobileHeader } from '@/components/mobile-header';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface PointsEntry {
  id: string;
  points: number;
  expiresIn: string;
  type: 'issued' | 'returned';
}

const mockPointsData: PointsEntry[] = [
  { id: '1', points: 10, expiresIn: '3 days', type: 'issued' },
  { id: '2', points: 50, expiresIn: '5 days', type: 'issued' },
  { id: '3', points: 200, expiresIn: '1 month', type: 'issued' },
  { id: '4', points: 10000, expiresIn: '2 months', type: 'issued' },
];

export default function CouponsPage() {
  const [activeTab, setActiveTab] = useState<'recent' | 'all'>('recent');
  const router = useRouter();

  const pointsIssued = 1200;
  const pointsReturned = 100;

  return (
    <div className="min-h-screen bg-white">
      <MobileHeader title="Points" showBack onBack={() => router.back()} />

      <div className="site-container">
        <div className="px-6 py-6 lg:max-w-3xl lg:mx-auto">
          {/* Points Summary */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <span className="font-medium">Points issued:</span>
              <span className="bg-lumina-teal text-white px-3 py-1 rounded-full text-sm font-semibold">
                {pointsIssued}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="font-medium">Points returned:</span>
              <span className="bg-lumina-teal text-white px-3 py-1 rounded-full text-sm font-semibold">
                {pointsReturned}
              </span>
            </div>
          </div>

          <p className="text-gray-500 text-center mb-8">
            Know where your points are!
            <br />
            Lumina helps you
          </p>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <Button
              onClick={() => setActiveTab('recent')}
              className={`flex-1 ${
                activeTab === 'recent'
                  ? 'bg-lumina-yellow text-black hover:bg-lumina-yellow/90'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Recent
            </Button>
            <Button
              onClick={() => setActiveTab('all')}
              className={`flex-1 ${
                activeTab === 'all'
                  ? 'bg-lumina-yellow text-black hover:bg-lumina-yellow/90'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </Button>
          </div>

          {/* Points List */}
          <div className="space-y-3">
            {mockPointsData.map((entry) => (
              <div
                key={entry.id}
                className="bg-gray-50 rounded-lg p-4 flex items-center gap-4"
              >
                <div className="w-10 h-10 bg-lumina-yellow rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-black"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-lg">{entry.points} points</p>
                  <p className="text-gray-500 text-sm">
                    Expires in {entry.expiresIn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
