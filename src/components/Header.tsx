'use client';

import { useFinanceStore } from '@/store/useFinanceStore';
import { LayoutDashboard, Shield, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Header() {
  // We only extract what we need from the store to prevent unnecessary re-renders
  const { role, setRole } = useFinanceStore();

  return (
    <header className="sticky top-0 z-10 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo / Brand */}
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <LayoutDashboard size={20} />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">FinDash</span>
          </div>

          {/* Role Toggle & Profile */}
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setRole('viewer')}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                  role === 'viewer' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}
              >
                <User size={16} />
                Viewer
              </button>
              <button
                onClick={() => setRole('admin')}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                  role === 'admin' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}
              >
                <Shield size={16} />
                Admin
              </button>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}