'use client';

import { useFinanceStore } from '@/store/useFinanceStore';
import { formatCurrency } from '@/lib/utils';
import { Lightbulb, AlertTriangle, TrendingUp } from 'lucide-react';

export default function Insights() {
  const transactions = useFinanceStore((state) => state.transactions);

  // 1. Calculate highest spending category
  const expenses = transactions.filter(t => t.type === 'expense');
  
  const expensesByCategory = expenses.reduce((acc: Record<string, number>, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  // Find the category with the max value
  const topCategory = Object.keys(expensesByCategory).reduce((a, b) => 
    expensesByCategory[a] > expensesByCategory[b] ? a : b
  , '');

  const topCategoryAmount = expensesByCategory[topCategory] || 0;

  // 2. Calculate savings rate (Total Income vs Total Expense)
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

  if (transactions.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-xl p-6 text-white shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <Lightbulb className="text-yellow-400" size={24} />
        <h3 className="text-lg font-semibold">AI Financial Insights</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Insight 1: Top Spending */}
        <div className="bg-white/10 p-4 rounded-lg border border-white/20 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-orange-400 mt-1" size={20} />
            <div>
              <p className="text-sm text-blue-200 font-medium mb-1">Top Spending Category</p>
              <p className="text-base font-semibold">
                You spent {formatCurrency(topCategoryAmount)} on <span className="text-orange-400">{topCategory}</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Insight 2: Savings Health */}
        <div className="bg-white/10 p-4 rounded-lg border border-white/20 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <TrendingUp className="text-green-400 mt-1" size={20} />
            <div>
              <p className="text-sm text-blue-200 font-medium mb-1">Financial Health</p>
              <p className="text-base font-semibold">
                {savingsRate > 0 
                  ? `Great job! You are saving ${savingsRate.toFixed(1)}% of your income.` 
                  : "Watch out! Your expenses are exceeding your income right now."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}