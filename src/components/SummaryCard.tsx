'use client'; // Required for framer-motion

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface SummaryCardProps {
  title: string;
  amount: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
}

export default function SummaryCard({ title, amount, icon: Icon, trend = 'neutral' }: SummaryCardProps) {
  return (
    <motion.div 
      // Add spring-based hover and tap animations
      whileHover={{ y: -5, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="relative group overflow-hidden bg-[#0f0f11] p-6 rounded-2xl border border-white/5 shadow-xl cursor-default"
    >
      {/* Subtle top glow effect */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex items-center gap-4 relative z-10">
        <div className={cn(
          "p-4 rounded-xl border",
          trend === 'up' ? "bg-green-500/10 border-green-500/20 text-green-400" : 
          trend === 'down' ? "bg-red-500/10 border-red-500/20 text-red-400" : 
          "bg-blue-500/10 border-blue-500/20 text-blue-400"
        )}>
          <Icon size={24} />
        </div>
        
        <div>
          <p className="text-sm font-medium text-zinc-400 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white tracking-tight">{amount}</h3>
        </div>
      </div>
    </motion.div>
  );
}