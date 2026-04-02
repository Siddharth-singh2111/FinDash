'use client';

import { useState } from 'react';
import { useFinanceStore, TransactionType } from '@/store/useFinanceStore';
import { formatCurrency, cn } from '@/lib/utils';
import { Search, Plus, X } from 'lucide-react';

export default function TransactionList() {
  // 1. Pull what we need from global state
  const { transactions, role, addTransaction } = useFinanceStore();

  // 2. Local UI State for filters and form toggle
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isAdding, setIsAdding] = useState(false);

  // 3. Local Form State
  const [newTx, setNewTx] = useState({
    description: '',
    amount: '',
    category: 'Food',
    type: 'expense' as TransactionType,
    date: new Date().toISOString().split('T')[0], // Today's date as YYYY-MM-DD
  });

  // 4. Derived State: Filtered Transactions
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || tx.category === categoryFilter;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort newest first

  // Unique categories for the dropdown filter
  const categories = ['All', ...Array.from(new Set(transactions.map(t => t.category)))];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTx.description || !newTx.amount) return;

    addTransaction({
      description: newTx.description,
      amount: parseFloat(newTx.amount),
      category: newTx.category,
      type: newTx.type,
      date: newTx.date,
    });
    
    setIsAdding(false); // Close form
    setNewTx({ ...newTx, description: '', amount: '' }); // Reset form
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      
      {/* Header & Actions */}
      <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search description..."
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          {/* RBAC: Only show Add button to Admins */}
          {role === 'admin' && (
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              {isAdding ? <X size={16} /> : <Plus size={16} />}
              {isAdding ? 'Cancel' : 'Add'}
            </button>
          )}
        </div>
      </div>

      {/* Conditional Add Transaction Form */}
      {role === 'admin' && isAdding && (
        <form onSubmit={handleAddSubmit} className="p-6 bg-blue-50 border-b border-blue-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          <input type="date" required className="p-2 border rounded-md text-sm" value={newTx.date} onChange={e => setNewTx({...newTx, date: e.target.value})} />
          <input type="text" required placeholder="Description" className="p-2 border rounded-md text-sm lg:col-span-2" value={newTx.description} onChange={e => setNewTx({...newTx, description: e.target.value})} />
          <input type="number" required placeholder="Amount" min="0" step="0.01" className="p-2 border rounded-md text-sm" value={newTx.amount} onChange={e => setNewTx({...newTx, amount: e.target.value})} />
          <select className="p-2 border rounded-md text-sm" value={newTx.type} onChange={e => setNewTx({...newTx, type: e.target.value as TransactionType})}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <button type="submit" className="p-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700">Save</button>
        </form>
      )}

      {/* Transaction Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Description</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm text-gray-500">{tx.date}</td>
                  <td className="p-4 text-sm font-medium text-gray-900">{tx.description}</td>
                  <td className="p-4 text-sm">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {tx.category}
                    </span>
                  </td>
                  <td className={cn(
                    "p-4 text-sm font-bold text-right",
                    tx.type === 'income' ? "text-green-600" : "text-gray-900"
                  )}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  No transactions found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}