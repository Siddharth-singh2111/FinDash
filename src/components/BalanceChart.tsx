'use client';

import { Transaction } from '@/store/useFinanceStore';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface BalanceChartProps {
  transactions: Transaction[];
}

export default function BalanceChart({ transactions }: BalanceChartProps) {
  // Transform raw transactions into an array of objects grouped by date
  const chartData = transactions
    .reduce((acc: any[], curr) => {
      const existingDate = acc.find(item => item.date === curr.date);
      
      if (existingDate) {
        existingDate[curr.type] += curr.amount;
      } else {
        acc.push({
          date: curr.date,
          income: curr.type === 'income' ? curr.amount : 0,
          expense: curr.type === 'expense' ? curr.amount : 0,
        });
      }
      return acc;
    }, [])
    // Sort chronologically
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // If there's no data, show a clean empty state
  if (chartData.length === 0) {
    return <div className="h-full flex items-center justify-center text-gray-500">No data available for chart.</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Cash Flow Trend</h3>
      <div className="flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
            <YAxis tickFormatter={(val) => `$${val}`} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} cursor={{ stroke: '#9ca3af', strokeWidth: 1, strokeDasharray: '3 3' }} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }} />
            <Area type="monotone" dataKey="income" name="Income" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
            <Area type="monotone" dataKey="expense" name="Expenses" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}