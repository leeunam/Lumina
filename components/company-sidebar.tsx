'use client';

import type React from 'react';

import { useState } from 'react';
import {
  User,
  CreditCard,
  Ticket,
  Shield,
  QrCode,
  HelpCircle,
  ChevronUp,
} from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const sidebarItems: SidebarItem[] = [
  {
    icon: <User className="w-5 h-5" />,
    label: 'My profile',
    href: '/company/profile',
  },
  {
    icon: <CreditCard className="w-5 h-5" />,
    label: 'Bring money',
    href: '/company/bring-money',
  },
  {
    icon: <Ticket className="w-5 h-5" />,
    label: 'Coupons issued',
    href: '/company/coupons',
  },
  {
    icon: <Shield className="w-5 h-5" />,
    label: "My NFT's",
    href: '/company/nfts',
  },
  {
    icon: <QrCode className="w-5 h-5" />,
    label: 'Generate QRcode',
    href: '/company/qrcode',
  },
];

export function CompanySidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Sidebar Toggle Button (hidden on desktop) */}
      <div className="fixed top-4 right-4 z-50 lg:hidden">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="ghost"
          size="sm"
          className="bg-white shadow-md hover:bg-gray-50"
        >
          <ChevronUp
            className={`w-5 h-5 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </Button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg z-50 transition-transform duration-300 ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        } lg:translate-y-0 lg:relative lg:inset-auto lg:top-0 lg:left-0 lg:right-auto lg:bottom-auto lg:rounded-none lg:shadow-none lg:w-64`}
      >
        <div className="p-6 lg:sticky lg:top-6">
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />

          <div className="space-y-4">
            {sidebarItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="font-medium text-gray-900">
                      {item.label}
                    </span>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link href="/help" onClick={() => setIsOpen(false)}>
              <div className="flex items-center gap-3 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                <HelpCircle className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">Help center</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
