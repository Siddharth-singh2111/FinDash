import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  isLoading: boolean; 
  addTransactionAsync: (transaction: Omit<Transaction, 'id'>) => Promise<void>; 
  setRole: (role: 'admin' | 'viewer') => void;
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      transactions: initialTransactions,
      role: 'viewer',
      isLoading: false,
      
      // 3. Mock API Call Simulation
      addTransactionAsync: async (transaction) => {
        set({ isLoading: true }); // Start loading
        
        // Simulate a 1-second network request to a backend
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        set((state) => ({
          transactions: [
            ...state.transactions, 
            { ...transaction, id: crypto.randomUUID() }
          ],
          isLoading: false 
        }));
      },
        
      setRole: (role) => set({ role }),
    }),
    {
      name: 'finance-storage',
    }
  )
);