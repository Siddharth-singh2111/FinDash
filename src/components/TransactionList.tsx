'use client';

import { useState } from 'react';
import { useFinanceStore, TransactionType } from '@/store/useFinanceStore';
import { formatCurrency, cn } from '@/lib/utils';
import { Search, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
 import { toast } from 'sonner';
export default function TransactionList() {
  const { transactions, role, addTransaction } = useFinanceStore();
 

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isAdding, setIsAdding] = useState(false);

  const [newTx, setNewTx] = useState({
    description: '',
    amount: '',
    category: 'Food',
    type: 'expense' as TransactionType,
    date: new Date().toISOString().split('T')[0], 
  });

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || tx.category === categoryFilter;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); 

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
    
    setIsAdding(false); 
    setNewTx({ ...newTx, description: '', amount: '' }); 

    // 2. Trigger the success toast!
    toast.success('Transaction saved successfully', {
      description: `${newTx.description} for $${newTx.amount} has been added to your ledger.`,
    });
  };

  return (
    <div className="bg-[#0f0f11] rounded-2xl border border-white/5 shadow-xl overflow-hidden">
      
      {/* Header & Actions */}
      <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Bar */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-400 transition-colors" size={16} />
            <input
              type="text"
              placeholder="Search description..."
              className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <select
            className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-zinc-300 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all [&>option]:bg-[#0f0f11]"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          {/* RBAC: Only show Add button to Admins */}
          {role === 'admin' && (
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg text-sm font-medium hover:bg-blue-500/20 hover:border-blue-500/40 transition-all duration-300"
            >
              {isAdding ? <X size={16} /> : <Plus size={16} />}
              {isAdding ? 'Cancel' : 'Add'}
            </button>
          )}
        </div>
      </div>

      {/* Conditional Add Transaction Form */}
      {role === 'admin' && isAdding && (
        <form onSubmit={handleAddSubmit} className="p-6 bg-white/[0.02] border-b border-white/5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          <input type="date" required className="p-2 bg-[#050505] border border-white/10 rounded-md text-sm text-zinc-300 focus:outline-none focus:border-blue-500/50" value={newTx.date} onChange={e => setNewTx({...newTx, date: e.target.value})} />
          <input type="text" required placeholder="Description" className="p-2 bg-[#050505] border border-white/10 rounded-md text-sm text-zinc-300 placeholder:text-zinc-600 lg:col-span-2 focus:outline-none focus:border-blue-500/50" value={newTx.description} onChange={e => setNewTx({...newTx, description: e.target.value})} />
          <input type="number" required placeholder="Amount" min="0" step="0.01" className="p-2 bg-[#050505] border border-white/10 rounded-md text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50" value={newTx.amount} onChange={e => setNewTx({...newTx, amount: e.target.value})} />
          <select className="p-2 bg-[#050505] border border-white/10 rounded-md text-sm text-zinc-300 focus:outline-none focus:border-blue-500/50 [&>option]:bg-[#0f0f11]" value={newTx.type} onChange={e => setNewTx({...newTx, type: e.target.value as TransactionType})}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <button type="submit" className="p-2 bg-green-500/10 text-green-400 border border-green-500/20 rounded-md text-sm font-medium hover:bg-green-500/20 transition-all duration-300">Save Data</button>
        </form>
      )}

      {/* Transaction Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.02] text-zinc-500 text-xs uppercase tracking-wider border-b border-white/5">
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Description</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium text-right">Amount</th>
            </tr>
          </thead>
         <tbody className="divide-y divide-white/5">
            <AnimatePresence initial={false}>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <motion.tr 
                    key={tx.id} 
                    // This creates the slide-down effect when a new row is added
                    initial={{ opacity: 0, height: 0, backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                    animate={{ opacity: 1, height: "auto", backgroundColor: "rgba(255, 255, 255, 0)" }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-white/[0.03] transition-colors group"
                  >
                    <td className="p-4 text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">{tx.date}</td>
                    <td className="p-4 text-sm font-medium text-zinc-200">{tx.description}</td>
                    <td className="p-4 text-sm">
                      <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-white/5 text-zinc-400 border border-white/10 shadow-sm">
                        {tx.category}
                      </span>
                    </td>
                    <td className={cn(
                      "p-4 text-sm font-bold text-right tracking-tight",
                      tx.type === 'income' ? "text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.2)]" : "text-white"
                    )}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </td>
                  </motion.tr>
                ))
              ) : (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <td colSpan={4} className="p-12 text-center">
                    <div className="inline-flex flex-col items-center justify-center space-y-3">
                      <div className="p-3 bg-white/5 rounded-full">
                        <Search className="text-zinc-600" size={24} />
                      </div>
                      <p className="text-zinc-500 text-sm">No transactions found matching your criteria.</p>
                    </div>
                  </td>
                </motion.tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}