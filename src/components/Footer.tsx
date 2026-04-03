import { LayoutDashboard } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/5 bg-[#050505]/50 backdrop-blur-md relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Brand & Copyright */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2 text-white">
              <LayoutDashboard size={18} className="text-blue-500" />
              <span className="font-semibold tracking-tight">FinDash</span>
            </div>
            <p className="text-sm text-zinc-500">
              &copy; {new Date().getFullYear()} FinDash Inc. All rights reserved.
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm font-medium text-zinc-400">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <div className="w-px h-4 bg-white/10"></div>
            
          </div>

        </div>
      </div>
    </footer>
  );
}