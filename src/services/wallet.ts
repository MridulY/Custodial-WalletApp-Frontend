
import axios from 'axios';
import { WalletData } from '../types';
import { authService } from "./auth";

const API_URL = "http://localhost:3000/api";

class WalletService {
  private async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const token = authService.getToken();
    if (!token) throw new Error("Not authenticated");

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Request failed");
    }

    return response.json();
  }
  // Use API call for wallet creation
  async createWallet(label: string): Promise<WalletData> {
    const response = await this.fetchWithAuth("/wallet/create", {
      method: "POST",
      body: JSON.stringify({ label }),
    });
    console.log("Data from frontend wallet servide ", response);

    localStorage.setItem("wallet", JSON.stringify(response));
    return response;
  }

  async getWallets(): Promise<WalletData[]> {
    return this.fetchWithAuth("/wallet");
  }

  async deleteWallet(address: string): Promise<void> {
    await this.fetchWithAuth(`/wallet/${address}`, {
      method: "DELETE",
    });
    localStorage.removeItem("wallet");
  }

  // Use API call for token swapping
  async swapTokens(
    amountIn: string,
    amountOutMin: string,
    path: string[],
    to: string,
    deadline: number
  ) {
    const response = await axios.post("http://localhost:3000/api/wallet/swap", {
      amountIn,
      amountOutMin,
      path,
      to,
      deadline,
    });
    return response.data;
  }
}

export const walletService = new WalletService();
