'use client';

import { MobileHeader } from '@/components/mobile-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [profileData, setProfileData] = useState({
    name: 'oBoticario',
    email: 'company@oboticario.com',
    phone: '+55 11 99999-9999',
  });

  const handleSave = () => {
    // Save profile data
    router.back();
  };

  return (
    <div className="min-h-screen bg-white">
      <MobileHeader title="My profile" showBack onBack={() => router.back()} />

      <div className="site-container">
        <div className="px-6 py-8 lg:max-w-2xl lg:mx-auto">
          {/* Profile Avatar */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl">👤</span>
            </div>
            <Button variant="outline" size="sm">
              Change Photo
            </Button>
          </div>

          {/* Profile Form */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <Input
                value={profileData.name}
                onChange={(e) =>
                  setProfileData({ ...profileData, name: e.target.value })
                }
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <Input
                type="email"
                value={profileData.email}
                onChange={(e) =>
                  setProfileData({ ...profileData, email: e.target.value })
                }
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <Input
                type="tel"
                value={profileData.phone}
                onChange={(e) =>
                  setProfileData({ ...profileData, phone: e.target.value })
                }
                className="w-full"
              />
            </div>

            <Button
              onClick={handleSave}
              className="w-full bg-lumina-teal hover:bg-lumina-teal/90 text-white"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
