export interface TokenData {
  id: string;
  name: string;
  symbol: string;
  balance: number;
  value: number;
  price: number;
  change24h: number;
  icon: string;
}

export interface WalletData {
  address: string;
  label: string;
  createdAt: number;
  encryptedPrivateKey: string;
  mnemonic: string;
}

export interface Transaction {
  id: string;
  type: "send" | "receive" | "swap";
  token: string;
  amount: number;
  timestamp: number;
  status: "pending" | "completed" | "failed";
  address?: string;
  fee?: number;
  details?: string;
  txHash?: string;
}

export interface SwapData {
  fromToken: string;
  toToken: string;
  amount: number;
  estimatedReturn: number;
  slippage: number;
  fee: number;
}

export interface UserData {
  id: string;
  email: string;
  name: string;
  token: string;
}

export interface AuthState {
  user: UserData | null;
  isLoading: boolean;
  error: string | null;
}