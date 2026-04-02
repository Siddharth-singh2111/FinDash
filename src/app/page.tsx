'use client'; // We need this now because we are reading from Zustand

import Header from '@/components/Header';
import SummaryCard from '@/components/SummaryCard';
import { useFinanceStore } from '@/store/useFinanceStore';
import { formatCurrency } from '@/lib/utils';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import BalanceChart from '@/components/BalanceChart';
import ExpenseChart from '@/components/ExpenseChart';
import TransactionList from '@/components/TransactionList';

export default function Home() {
  // 1. Pull transactions from our global store
  const transactions = useFinanceStore((state) => state.transactions);

  // 2. Calculate derived state (Income, Expenses, Balance)
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-500">Track and manage your financial activity.</p>
          </div>
          
          {/* Summary Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SummaryCard 
              title="Total Balance" 
              amount={formatCurrency(balance)} 
              icon={Wallet} 
              trend="neutral"
            />
            <SummaryCard 
              title="Total Income" 
              amount={formatCurrency(totalIncome)} 
              icon={TrendingUp} 
              trend="up"
            />
            <SummaryCard 
              title="Total Expenses" 
              amount={formatCurrency(totalExpense)} 
              icon={TrendingDown} 
              trend="down"
            />
          </div>

          {/* Placeholder for Charts (Next Step) */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-96">
              <BalanceChart transactions={transactions} />
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-96">
              <ExpenseChart transactions={transactions} />
            </div>
          </div>

          <div className="mt-8">
            <TransactionList />
          </div>
        </div>
      </main>
    </div>
  );
}