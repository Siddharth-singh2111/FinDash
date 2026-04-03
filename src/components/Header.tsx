'use client';

import { useFinanceStore } from '@/store/useFinanceStore';
import { LayoutDashboard, Shield, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Header() {
  const { role, setRole } = useFinanceStore();

  return (
    
    <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-6xl z-50 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 transition-all duration-300">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo / Brand */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="p-2 bg-gradient-to-tr from-blue-600 to-violet-600 rounded-xl shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
              <LayoutDashboard size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">FinDash</span>
          </div>

          {/* Role Toggle */}
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setRole('viewer')}
                className={cn(
                  "flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-300",
                  role === 'viewer' ? "bg-white/10 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"
                )}
              >
                <User size={14} />
                Viewer
              </button>
              <button
                onClick={() => setRole('admin')}
                className={cn(
                  "flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-300",
                  role === 'admin' ? "bg-blue-500/20 text-blue-400 shadow-sm" : "text-zinc-400 hover:text-zinc-200"
                )}
              >
                <Shield size={14} />
                Admin
              </button>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}