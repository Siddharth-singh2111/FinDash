'use client';

import { Transaction } from '@/store/useFinanceStore';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface ExpenseChartProps {
  transactions: Transaction[];
}


const COLORS = ['#3b82f6', '#f97316', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];

export default function ExpenseChart({ transactions }: ExpenseChartProps) {
  // 1. Filter to only look at expenses
  const expenses = transactions.filter((t) => t.type === 'expense');

  // 2. Group expenses by category and sum them up
  const chartData = expenses.reduce((acc: { name: string; value: number }[], curr) => {
    const existingCategory = acc.find(item => item.name === curr.category);
    if (existingCategory) {
      existingCategory.value += curr.amount;
    } else {
      acc.push({ name: curr.category, value: curr.amount });
    }
    return acc;
  }, [])
  .sort((a, b) => b.value - a.value);

  if (chartData.length === 0) {
    return <div className="h-full flex items-center justify-center text-gray-500">No expenses recorded yet.</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending Breakdown</h3>
      <div className="flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Legend layout="vertical" verticalAlign="middle" align="right" iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}