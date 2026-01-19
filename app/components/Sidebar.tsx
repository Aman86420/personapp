"use client";

import { X, Home, Settings, Calendar, CircleUser } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToDays: () => void;
  onNavigateToHome: () => void;
  onNavigateToAccount: () => void;
}

export function Sidebar({ isOpen, onClose, onNavigateToDays, onNavigateToHome, onNavigateToAccount }: SidebarProps) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Header */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4">
          <span className="font-semibold text-gray-900">Menu</span>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-3">
          <button
            onClick={onNavigateToHome}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </button>

          {/* Days Card Item */}
          <button
            onClick={onNavigateToDays}
            className="w-full bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900">Days</span>
            </div>
            <p className="text-xs text-gray-600 text-left">View all your created days</p>
          </button>

          <button
            onClick={onNavigateToAccount}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <CircleUser className="w-5 h-5" />
            <span>Profile</span>
          </button>
          <button
            onClick={onClose}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </nav>
      </aside>
    </>
  );
}