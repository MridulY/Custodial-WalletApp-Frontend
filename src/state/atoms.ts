import { atom } from 'jotai';
import { TokenData, WalletData, Transaction, AuthState } from "../types";

// Auth atom
export const authAtom = atom<AuthState>({
  user: null,
  isLoading: false,
  error: null,
});

// Load initial state from localStorage if available
const loadTokens = (): TokenData[] => {
  const stored = localStorage.getItem('demo_tokens');
  return stored ? JSON.parse(stored) : [];
};

const loadWallet = (): WalletData | null => {
  const stored = localStorage.getItem('wallet');
  return stored ? JSON.parse(stored) : null;
};

const loadTransactions = (): Transaction[] => {
  const stored = localStorage.getItem('transactions');
  return stored ? JSON.parse(stored) : [];
};

// Create atoms
export const walletAtom = atom<WalletData | null>(loadWallet());
export const tokenAtom = atom<TokenData[]>(loadTokens());
export const transactionAtom = atom<Transaction[]>(loadTransactions());

// Derived atoms
export const totalBalanceAtom = atom((get) => {
  const tokens = get(tokenAtom);
  return tokens.reduce((total, token) => total + token.value, 0);
});

export const tokenByIdAtom = atom(
  null,
  (get, set, { id, updates }: { id: string; updates: Partial<TokenData> }) => {
    const tokens = get(tokenAtom);
    const updated = tokens.map((token) => 
      token.id === id ? { ...token, ...updates } : token
    );
    set(tokenAtom, updated);
    localStorage.setItem('demo_tokens', JSON.stringify(updated));
  }
);

export const addTransactionAtom = atom(
  null,
  (get, set, transaction: Transaction) => {
    const transactions = [transaction, ...get(transactionAtom)];
    set(transactionAtom, transactions);
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }
);