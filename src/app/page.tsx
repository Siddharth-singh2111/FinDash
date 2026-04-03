'use client'; 

import Header from '@/components/Header';
import Footer from '@/components/Footer'; // 1. Import the Footer
import SummaryCard from '@/components/SummaryCard';
import { useFinanceStore } from '@/store/useFinanceStore';
import { formatCurrency } from '@/lib/utils';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import BalanceChart from '@/components/BalanceChart';
import ExpenseChart from '@/components/ExpenseChart';
import TransactionList from '@/components/TransactionList';
import Insights from '@/components/Insights';
import { motion } from 'framer-motion';

// ... (keep your existing variants) ...
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 300, damping: 24 } 
  }
};

export default function Home() {
  const transactions = useFinanceStore((state) => state.transactions);

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="min-h-screen text-zinc-100 font-sans selection:bg-blue-500/30 overflow-x-hidden flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-8">
        <motion.div 
          className="space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          
          <motion.div variants={itemVariants}>
            <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
            <p className="text-zinc-400 mt-1">Track and manage your financial activity securely.</p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <SummaryCard title="Total Balance" amount={formatCurrency(balance)} icon={Wallet} trend="neutral" />
             <SummaryCard title="Total Income" amount={formatCurrency(totalIncome)} icon={TrendingUp} trend="up" />
             <SummaryCard title="Total Expenses" amount={formatCurrency(totalExpense)} icon={TrendingDown} trend="down" />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Insights />
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#0f0f11] p-6 rounded-2xl border border-white/5 shadow-xl h-96">
              <BalanceChart transactions={transactions} />
            </div>
            <div className="bg-[#0f0f11] p-6 rounded-2xl border border-white/5 shadow-xl h-96">
              <ExpenseChart transactions={transactions} />
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <TransactionList />
          </motion.div>

        </motion.div>
      </main>
      <Footer />
    </div>
  );
}