import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // 1. Import persist

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  type: TransactionType;
  description: string;
}

const initialTransactions: Transaction[] = [
  { id: '1', date: '2026-04-01', amount: 3200, category: 'Salary', type: 'income', description: 'Monthly Salary' },
  { id: '2', date: '2026-04-02', amount: 850, category: 'Housing', type: 'expense', description: 'Rent' },
  { id: '3', date: '2026-04-05', amount: 120, category: 'Food', type: 'expense', description: 'Groceries' },
  { id: '4', date: '2026-04-08', amount: 60, category: 'Utilities', type: 'expense', description: 'Internet Bill' },
  { id: '5', date: '2026-04-10', amount: 200, category: 'Entertainment', type: 'expense', description: 'Concert Tickets' },
];

interface FinanceState {
  transactions: Transaction[];
  role: 'admin' | 'viewer';
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  setRole: (role: 'admin' | 'viewer') => void;
}

// 2. Wrap the store configuration in persist()
export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      transactions: initialTransactions,
      role: 'viewer',
      
      addTransaction: (transaction) => 
        set((state) => ({
          transactions: [
            ...state.transactions, 
            { ...transaction, id: crypto.randomUUID() }
          ]
        })),
        
      setRole: (role) => set({ role }),
    }),
    {
      name: 'finance-storage', // 3. Name of the item in localStorage
    }
  )
);