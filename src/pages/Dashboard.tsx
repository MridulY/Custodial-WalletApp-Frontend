import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAtomValue, useSetAtom } from 'jotai';
import { ArrowUpRight, ArrowDownRight, Send, Plus, RefreshCw } from 'lucide-react';
import { tokenAtom, transactionAtom, totalBalanceAtom, walletAtom } from '../state/atoms';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { TokenIcon } from '../components/ui/TokenIcon';
import { Transaction } from '../types';
import { tokenService } from '../services/token';

export function Dashboard() {
  const tokens = useAtomValue(tokenAtom);
  const transactions = useAtomValue(transactionAtom);
  const totalBalance = useAtomValue(totalBalanceAtom);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const wallet = useAtomValue(walletAtom);
  const setTokens = useSetAtom(tokenAtom);

  useEffect(() => {
      const fetchTokens = async () => {
        if (wallet) {
          try {
            // Call the getTokens function to fetch wallet's token data
            const tokenData = await tokenService.getTokens(wallet.address);
  
            // If token data is not empty, update the state and store in localStorage
            if (tokenData.length > 0) {
              setTokens(tokenData);
              localStorage.setItem("demo_tokens", JSON.stringify(tokenData)); // Store in localStorage
            }
          } catch (error) {
            console.error("Error fetching tokens:", error);
          }
        }
      };
  
      // If wallet is available, fetch token data
      if (wallet) {
        fetchTokens();
      }
    }, [wallet, setTokens]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const refreshBalances = () => {
    setIsRefreshing(true);
    // Simulate API call to refresh balances
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  const getTransactionIcon = (transaction: Transaction) => {
    switch (transaction.type) {
      case 'send':
        return <ArrowUpRight className="text-error-500" />;
      case 'receive':
        return <ArrowDownRight className="text-success-500" />;
      case 'swap':
        return (
          <div className="bg-accent-100 dark:bg-accent-900 p-1 rounded-full">
            <RefreshCw size={16} className="text-accent-500" />
          </div>
        );
      default:
        return null;
    }
  };

  const formatTransactionTitle = (transaction: Transaction) => {
    const token = tokens.find(t => t.id === transaction.token);
    
    switch (transaction.type) {
      case 'send':
        return `Sent ${transaction.amount} ${token?.symbol || 'tokens'}`;
      case 'receive':
        return `Received ${transaction.amount} ${token?.symbol || 'tokens'}`;
      case 'swap':
        return transaction.details || `Swapped ${token?.symbol || 'tokens'}`;
      default:
        return 'Unknown transaction';
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your assets</p>
        </div>
        <div className="flex mt-4 md:mt-0 space-x-3">
          <Button
            variant="outline"
            onClick={refreshBalances}
            className="bg-white/5 hover:bg-white/10 border-white/10"
            icon={
              <RefreshCw
                size={18}
                className={isRefreshing ? "animate-spin" : ""}
              />
            }
            disabled={isRefreshing}
          >
            Refresh
          </Button>
          <Link to="/swap">
            <Button
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 border-0 text-white shadow-lg shadow-indigo-500/25"
              icon={<RefreshCw size={18} />}
            >
              Swap
            </Button>
          </Link>
        </div>
      </div>

      <Card className="bg-gradient-to-r from-primary-900 to-accent-900 text-white">
        <CardContent className="py-6">
          <h2 className="text-base font-medium text-gray-300 mb-2">
            Total Balance
          </h2>
          <div className="text-3xl font-bold mb-4">
            {formatCurrency(totalBalance)}
          </div>
          <div className="flex space-x-4">
            <Link to="/receive">
              <Button
                size="sm"
                variant="outline"
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-none hover:from-blue-600 hover:to-indigo-700 shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                icon={<Plus size={16} />}
              >
                Receive
              </Button>
            </Link>
            <Link to="/swap">
              <Button
                size="sm"
                variant="outline"
                className="bg-gradient-to-r from-green-500 to-teal-600 text-white border-none hover:from-green-600 hover:to-teal-700 shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                icon={<Send size={16} />}
              >
                Swap
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Assets</h2>
            </CardHeader>
            <div className="overflow-hidden">
              {tokens.map((token) => (
                <Link to={`/token/${token.id}`} key={token.id}>
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center">
                      <div className="mr-4">
                        <TokenIcon name={token.icon} size={40} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium">{token.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {token.symbol}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {formatCurrency(token.value)}
                            </p>
                            <p
                              className={`text-sm ${
                                token.change24h >= 0
                                  ? "text-success-500"
                                  : "text-error-500"
                              }`}
                            >
                              {token.change24h >= 0 ? "+" : ""}
                              {token.change24h}%
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 flex justify-between text-sm">
                          <span>
                            {token.balance} {token.symbol}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">
                            ${token.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Recent Transactions</h2>
            </CardHeader>
            <div className="overflow-hidden">
              {transactions.length > 0 ? (
                transactions.slice(0, 5).map((transaction) => (
                  <div
                    key={transaction.id}
                    className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 last:border-0"
                  >
                    <div className="flex items-center">
                      <div className="mr-3 p-2 rounded-full bg-gray-100 dark:bg-gray-800">
                        {getTransactionIcon(transaction)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium text-sm">
                              {formatTransactionTitle(transaction)}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(transaction.timestamp)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p
                              className={`font-medium text-sm ${
                                transaction.type === "receive"
                                  ? "text-success-500"
                                  : ""
                              }`}
                            >
                              {transaction.type === "send"
                                ? "-"
                                : transaction.type === "receive"
                                ? "+"
                                : ""}
                              {transaction.amount}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {transaction.status}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  <p>No transactions yet</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}