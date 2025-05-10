import axios from 'axios';
import { TokenData, Transaction } from '../types/index';
import { ethers } from 'ethers';
const API_URL = "http://localhost:3000/api";

const PREDEFINED_TOKEN_ADDRESSES = [
  // {
  //   id: "0x4ffD88e2DB68323585986233CEDf0ff087C72D30", // Example token A address (Ethereum)
  //   symbol: "ETH",
  //   name: "Ethereum",
  //   decimals: 18,
  // },
  // {
  //   id: "0x06DDeeD3D2Eb3dEad723c037b89E4384BFb29Bf8", // Example token B address (Tether)
  //   symbol: "USDT",
  //   name: "Tether",
  //   decimals: 6,
  // },
  // {
  //   id: "0xA0b86991C6218b36C1D19D4A2e9Eb0Ce3606eB48", // USD Coin (USDC)
  //   symbol: "USDC",
  //   name: "USD Coin",
  //   decimals: 6,
  // },
  // {
  //   id: "0x6B175474E89094C44Da98b954EedeAC495271d0F", // DAI Stablecoin
  //   symbol: "DAI",
  //   name: "Dai",
  //   decimals: 18,
  // },
  // {
  //   id: "0x514910771AF9Ca656af840dff83E8264EcF986CA", // Chainlink (LINK)
  //   symbol: "LINK",
  //   name: "Chainlink",
  //   decimals: 18,
  // },
  // {
  //   id: "0x0D8775F648430679A709E98d2b0Cb6250d2887EF", // Basic Attention Token (BAT)
  //   symbol: "BAT",
  //   name: "Basic Attention Token",
  //   decimals: 18,
  // },
  // {
  //   id: "0x3F58a6359d08fe0AEEcD849fbCF3d3b6D1fF8995", // Uniswap (UNI)
  //   symbol: "UNI",
  //   name: "Uniswap",
  //   decimals: 18,
  // },
  // {
  //   id: "0x4e2e7e2799a12c726cbf1f09f8dfb8b4dce1f592", // Aave (AAVE)
  //   symbol: "AAVE",
  //   name: "Aave",
  //   decimals: 18,
  // },
  {
    id: "0xe1cdd8F52FcBf06cb4582f4816a2634a842D5bBC", // Tether (USDT) ERC-20 on Ethereum
    symbol: "ALGOX",
    name: "Algorithm X",
    decimals: 6,
  },
  {
    id: "0x779877A7B0D9E8603169DdbD7836e478b4624789", // Synthetix Network Token (SNX)
    symbol: "LINK",
    name: "Chain Link",
    decimals: 18,
  },
  {
    id: "0x4ffD88e2DB68323585986233CEDf0ff087C72D30", // Synthetix Network Token (SNX)
    symbol: "BEL",
    name: "Bella",
    decimals: 18,
  },
  {
    id: "0x06DDeeD3D2Eb3dEad723c037b89E4384BFb29Bf8", // Synthetix Network Token (SNX)
    symbol: "ASTX",
    name: "AstarX",
    decimals: 18,
  },
];

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

const PROVIDER_URL =
  "https://sepolia.infura.io/v3/3b5892c7c5654215bf520b0e28e3ed52";

class TokenService {
  private provider: ethers.JsonRpcProvider;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(PROVIDER_URL);
  }
  // Get all tokens for the current wallet
  async getTokens(walletAddress: string): Promise<TokenData[]> {
    try {
      const tokenData: TokenData[] = [];

      for (const token of PREDEFINED_TOKEN_ADDRESSES) {
        const tokenContract = new ethers.Contract(
          token.id,
          ERC20_ABI,
          this.provider
        );

        // Get the balance of the token for the wallet address
        const balance = await tokenContract.balanceOf(walletAddress);
        const decimals = await tokenContract.decimals();

        // Format the balance to the correct decimal precision
        const formattedBalance = ethers.formatUnits(balance, decimals);

        if (Number(formattedBalance) > 0) {
          tokenData.push({
            id: token.id,
            name: token.name,
            symbol: token.symbol,
            balance: parseFloat(formattedBalance),
            price: 0, // Can be populated with real-time pricing data if available
            change24h: 0, // Same as above, if real-time data is available
            icon: token.symbol.toLowerCase(),
            value: 0,
          });
        }
      }
      console.log("Token data is", tokenData);
      localStorage.setItem("demo_tokens", JSON.stringify(tokenData));

      return tokenData;
    } catch (error) {
      console.error("Error fetching token data:", error);
      return [];
    }
  }

  // Update token balance (simulated)
  async updateBalance(
    tokenId: string,
    newBalance: number,
    walletAddress: string
  ): Promise<TokenData | null> {
    const tokens = await this.getTokens(walletAddress); // Await the promise to get the tokens
    const tokenIndex = tokens.findIndex((t) => t.id === tokenId);

    if (tokenIndex === -1) return null;

    const token: TokenData = tokens[tokenIndex];
    const updatedToken = {
      ...token,
      balance: newBalance,
      value: newBalance * token.price,
    };

    tokens[tokenIndex] = updatedToken;
    localStorage.setItem("demo_tokens", JSON.stringify(tokens));

    return updatedToken;
  }

  // Get token price (simulated)
  async getPrice(tokenId: string, walletAddress: string): Promise<number> {
    const tokens = this.getTokens(walletAddress);
    const token = (await tokens).find((t) => t.id === tokenId);

    if (!token) throw new Error(`Token ${tokenId} not found`);

    // In a real implementation, this would call a price API
    return token.price;
  }

  // Get transaction history
  getTransactions(): Transaction[] {
    const stored = localStorage.getItem("transactions");
    return stored ? JSON.parse(stored) : [];
  }

  // Add a new transaction
  addTransaction(transaction: Transaction): void {
    const transactions = [transaction, ...this.getTransactions()];
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }

  // Simulate a token transfer (send/receive)
  async transferToken(
    tokenId: string,
    amount: number,
    to: string,
    type: "send" | "receive",
    walletAddress: string
  ): Promise<Transaction> {
    const tokens = this.getTokens(walletAddress);
    const token = (await tokens).find((t) => t.id === tokenId);

    if (!token) throw new Error(`Token ${tokenId} not found`);

    // Validate balance for send operations
    if (type === "send" && token.balance < amount) {
      throw new Error("Insufficient balance");
    }

    // Update token balance
    const newBalance =
      type === "send" ? token.balance - amount : token.balance + amount;

    await this.updateBalance(tokenId, newBalance, walletAddress);

    // Create transaction record
    const transaction: Transaction = {
      id: Math.random().toString(36).substring(2, 15),
      type,
      token: tokenId,
      amount,
      timestamp: Date.now(),
      status: "completed",
      address: to,
      fee: type === "send" ? 0.001 : 0,
    };

    this.addTransaction(transaction);
    return transaction;
  }

  // Simulate token swap
  async swapTokens(
    fromTokenId: string,
    toTokenId: string,
    amount: number,
    walletAddress: string
  ): Promise<Transaction> {
    console.log("Wallet value in token service frontend is ", walletAddress);
    console.log("Amount in token service is ", amount);
    const tokens = this.getTokens(walletAddress);
    const fromToken = (await tokens).find((t) => t.id === fromTokenId);
    const toToken = (await tokens).find((t) => t.id === toTokenId);

    if (!fromToken || !toToken) {
      throw new Error("Invalid token selection");
    }

    if (fromToken.balance < amount) {
      throw new Error("Insufficient balance");
    }

    // Calculate exchange rate (simplified for demo)
    const exchangeRate = fromToken.price / toToken.price;
    const receivedAmount = amount * exchangeRate * 0.99; // 1% swap fee

    // Update balances locally
    await this.updateBalance(
      fromTokenId,
      fromToken.balance - amount,
      walletAddress
    );
    await this.updateBalance(
      toTokenId,
      toToken.balance + receivedAmount,
      walletAddress
    );

    // Create transaction record locally
    const transaction: Transaction = {
      id: Math.random().toString(36).substring(2, 15),
      type: "swap",
      token: fromTokenId,
      amount,
      timestamp: Date.now(),
      status: "completed",
      fee: amount * 0.01, // 1% fee
      details: `Swapped ${amount} ${
        fromToken.symbol
      } for ${receivedAmount.toFixed(6)} ${toToken.symbol}`,
    };

    this.addTransaction(transaction);

    // Call the backend service for the actual swap (passing token data and wallet address)
    const response = await axios.post(`${API_URL}/wallet/swap`, {
      fromTokenAddress: fromTokenId,
      toTokenAddress: toTokenId,
      amount: amount.toString(),
      walletAddress: walletAddress
    });

    // Process the response (e.g., storing the transaction hash or result)
    const swapResult = response.data;

    // Optionally update transaction status or hash
    transaction.txHash = swapResult.txHash;

    return transaction;
  }
}

export const tokenService = new TokenService();

async function getTokenBalance(
  walletAddress: string,
  tokenAddress: string,
  decimals: number
) {
  const tokenContract = new ethers.Contract(
    tokenAddress,
    [
      "function balanceOf(address owner) view returns (uint256)",
      "function decimals() view returns (uint8)",
    ],
    new ethers.JsonRpcProvider(
      "https://sepolia.infura.io/v3/3b5892c7c5654215bf520b0e28e3ed52"
    )
  );

  const balance = await tokenContract.balanceOf(walletAddress);
  return ethers.formatUnits(balance, decimals);
}
