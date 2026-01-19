"use client";

import { Menu } from 'lucide-react';

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-40">
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Left Side - Logo/Icon */}
        <button
          onClick={onMenuClick}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          aria-label="Open menu"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
            <Menu className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-gray-900 text-lg hidden sm:inline">App Name</span>
        </button>

        {/* Right Side - Navigation Items */}
        <div className="flex items-center gap-6">
          <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
            Item One
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
            Item Two
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
            Item Three
          </a>
        </div>
      </div>
    </nav>
  );
}
