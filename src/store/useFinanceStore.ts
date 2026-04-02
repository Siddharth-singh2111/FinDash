import { create } from 'zustand';

// 1. Define the shape of our data
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  type: TransactionType;
  description: string;
}

// 2. Create some initial mock data
const initialTransactions: Transaction[] = [
  { id: '1', date: '2026-04-01', amount: 3200, category: 'Salary', type: 'income', description: 'Monthly Salary' },
  { id: '2', date: '2026-04-02', amount: 850, category: 'Housing', type: 'expense', description: 'Rent' },
  { id: '3', date: '2026-04-05', amount: 120, category: 'Food', type: 'expense', description: 'Groceries' },
  { id: '4', date: '2026-04-08', amount: 60, category: 'Utilities', type: 'expense', description: 'Internet Bill' },
  { id: '5', date: '2026-04-10', amount: 200, category: 'Entertainment', type: 'expense', description: 'Concert Tickets' },
];

// 3. Define the structure of our Global Store
interface FinanceState {
  transactions: Transaction[];
  role: 'admin' | 'viewer';
  
  // Actions to mutate the state
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  setRole: (role: 'admin' | 'viewer') => void;
}

// 4. Create the actual store using Zustand
export const useFinanceStore = create<FinanceState>((set) => ({
  transactions: initialTransactions,
  role: 'viewer', // Default role
  
  // The set function allows us to update the state immutably
  addTransaction: (transaction) => 
    set((state) => ({
      transactions: [
        ...state.transactions, 
        { ...transaction, id: crypto.randomUUID() } // Generate a unique ID on the fly
      ]
    })),
    
  setRole: (role) => set({ role }),
}));