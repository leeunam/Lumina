'use client';

import { ChevronLeft, ChevronDown, Camera } from 'lucide-react';
import { Button } from './ui/button';

interface MobileHeaderProps {
  title: string;
  showBack?: boolean;
  showDropdown?: boolean;
  showCamera?: boolean;
  onBack?: () => void;
  className?: string;
}

export function MobileHeader({
  title,
  showBack = false,
  showDropdown = false,
  showCamera = false,
  onBack,
  className = '',
}: MobileHeaderProps) {
  return (
    <div
      className={`bg-lumina-teal text-white px-4 py-4 flex items-center justify-between ${className} lg:px-8 lg:py-6`}
    >
      <div className="flex items-center">
        {showBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-white hover:bg-white/20 p-1 mr-2"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
        )}
        <h1 className="text-lg font-semibold lg:text-2xl">{title}</h1>
        {showDropdown && <ChevronDown className="w-5 h-5 ml-2" />}
      </div>
      {showCamera && (
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20 p-2"
        >
          <Camera className="w-6 h-6" />
        </Button>
      )}
    </div>
  );
}
