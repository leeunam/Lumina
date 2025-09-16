'use client';

import { MobileHeader } from '@/components/mobile-header';
import { useRouter } from 'next/navigation';

interface NFTLevel {
  level: number;
  title: string;
  description: string;
  color: string;
  achieved: boolean;
}

const nftLevels: NFTLevel[] = [
  {
    level: 6,
    title: 'Level 6',
    description: 'Accumulate 1000 carbon credits',
    color: 'bg-gray-400',
    achieved: false,
  },
  {
    level: 5,
    title: 'Level 5',
    description: "Congratulations! You've accumulated 500 credits!",
    color: 'bg-lumina-teal',
    achieved: true,
  },
  {
    level: 4,
    title: 'Level 4',
    description: "Congratulations! You've accumulated 100 credits!",
    color: 'bg-green-500',
    achieved: true,
  },
];

export default function NFTsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      <MobileHeader
        title="My NFT's"
        showBack
        showDropdown
        onBack={() => router.back()}
      />

      <div className="site-container">
        <div className="px-6 py-6 lg:max-w-3xl lg:mx-auto">
          {/* Main NFT Card */}
          <div className="bg-green-600 rounded-xl p-8 text-center text-white mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">oBOTICARIO</h2>
          </div>

          {/* NFT Levels */}
          <div className="space-y-4">
            {nftLevels.map((nft) => (
              <div
                key={nft.level}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
              >
                <div
                  className={`w-16 h-16 ${nft.color} rounded-full flex items-center justify-center`}
                >
                  {nft.achieved ? (
                    <svg
                      className="w-8 h-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ) : (
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{nft.title}</h3>
                  <p className="text-gray-600 text-sm">{nft.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
