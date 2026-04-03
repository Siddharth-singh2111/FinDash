'use client';

import { useState } from 'react';
import { useFinanceStore, TransactionType } from '@/store/useFinanceStore';
import { formatCurrency, cn } from '@/lib/utils';
import { Search, Plus, X, Download, Loader2 } from 'lucide-react'; // Added Download and Loader2
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function TransactionList() {
  // Pulled in isLoading and the new addTransactionAsync
  const { transactions, role, addTransactionAsync, isLoading } = useFinanceStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc'); // Added Advanced Sorting state
  const [isAdding, setIsAdding] = useState(false);

  const [newTx, setNewTx] = useState({
    description: '',
    amount: '',
    category: 'Food',
    type: 'expense' as TransactionType,
    date: new Date().toISOString().split('T')[0], 
  });

  // Derived State: Filtered & Advanced Sorted Transactions
  const filteredTransactions = transactions
    .filter((tx) => {
      const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || tx.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'date-asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === 'amount-high') return b.amount - a.amount;
      if (sortBy === 'amount-low') return a.amount - b.amount;
      return 0;
    });

  const categories = ['All', ...Array.from(new Set(transactions.map(t => t.category)))];

  // CSV Export Functionality
  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const csvData = filteredTransactions.map(tx => 
      `${tx.date},"${tx.description}",${tx.category},${tx.type},${tx.amount}`
    );
    
    const blob = new Blob([headers.join(',') + '\n' + csvData.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Export Successful', { description: 'Your CSV file has been downloaded.' });
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTx.description || !newTx.amount) return;

    // Await the Mock API Call
    await addTransactionAsync({
      description: newTx.description,
      amount: parseFloat(newTx.amount),
      category: newTx.category,
      type: newTx.type,
      date: newTx.date,
    });
    
    setIsAdding(false); 
    setNewTx({ ...newTx, description: '', amount: '' }); 

    toast.success('Transaction saved successfully', {
      description: `${newTx.description} for $${newTx.amount} has been added.`,
    });
  };

  return (
    <div className="bg-[#0f0f11] rounded-2xl border border-white/5 shadow-xl overflow-hidden">
      
      {/* Header & Actions */}
      <div className="p-6 border-b border-white/5 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
        
        <div className="flex flex-wrap items-center gap-3">
          
          <button onClick={exportToCSV} className="flex items-center gap-2 px-3 py-2 bg-white/5 text-zinc-300 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition-colors">
            <Download size={14} /> Export CSV
          </button>

          <div className="w-px h-6 bg-white/10 hidden sm:block"></div>

          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-400 transition-colors" size={16} />
            <input
              type="text"
              placeholder="Search..."
              className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all w-32 sm:w-48"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-zinc-300 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all [&>option]:bg-[#0f0f11]"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          {/* Advanced Sorting */}
          <select
            className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-zinc-300 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all [&>option]:bg-[#0f0f11]"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-high">Amount: High to Low</option>
            <option value="amount-low">Amount: Low to High</option>
          </select>

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
          <input type="date" required className="p-2 bg-[#050505] border border-white/10 rounded-md text-sm text-zinc-300 focus:outline-none focus:border-blue-500/50" value={newTx.date} onChange={e => setNewTx({...newTx, date: e.target.value})} disabled={isLoading} />
          <input type="text" required placeholder="Description" className="p-2 bg-[#050505] border border-white/10 rounded-md text-sm text-zinc-300 placeholder:text-zinc-600 lg:col-span-2 focus:outline-none focus:border-blue-500/50" value={newTx.description} onChange={e => setNewTx({...newTx, description: e.target.value})} disabled={isLoading} />
          <input type="number" required placeholder="Amount" min="0" step="0.01" className="p-2 bg-[#050505] border border-white/10 rounded-md text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50" value={newTx.amount} onChange={e => setNewTx({...newTx, amount: e.target.value})} disabled={isLoading} />
          <select className="p-2 bg-[#050505] border border-white/10 rounded-md text-sm text-zinc-300 focus:outline-none focus:border-blue-500/50 [&>option]:bg-[#0f0f11]" value={newTx.type} onChange={e => setNewTx({...newTx, type: e.target.value as TransactionType})} disabled={isLoading}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <button type="submit" disabled={isLoading} className="p-2 bg-green-500/10 text-green-400 border border-green-500/20 rounded-md text-sm font-medium hover:bg-green-500/20 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : 'Save Data'}
          </button>
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
                <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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