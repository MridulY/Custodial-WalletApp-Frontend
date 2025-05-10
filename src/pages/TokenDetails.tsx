import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAtomValue, useSetAtom } from 'jotai';
import { ArrowLeft, Send, QrCode, ExternalLink, RefreshCw, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { tokenAtom, transactionAtom, addTransactionAtom } from '../state/atoms';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { TokenIcon } from '../components/ui/TokenIcon';
import { tokenService } from '../services/token';
import { Transaction } from '../types';

export function TokenDetails() {
  const { id } = useParams<{ id: string }>();
  const tokens = useAtomValue(tokenAtom);
  const allTransactions = useAtomValue(transactionAtom);
  const addTransaction = useSetAtom(addTransactionAtom);
  const navigate = useNavigate();
  
  const token = tokens.find(t => t.id === id);
  const transactions = allTransactions.filter(t => t.token === id);
  
  const [sending, setSending] = useState(false);
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  
  if (!token) {
    return (
      <div className="text-center py-8">
        <p>Token not found</p>
        <Link to="/" className="text-accent-600 hover:underline mt-4 inline-block">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const handleSend = async () => {
    setError('');
    
    const amountNumber = parseFloat(amount);
    
    if (!amount || isNaN(amountNumber)) {
      setError('Please enter a valid amount');
      return;
    }
    
    if (amountNumber <= 0) {
      setError('Amount must be greater than zero');
      return;
    }
    
    if (amountNumber > token.balance) {
      setError('Insufficient balance');
      return;
    }
    
    if (!address) {
      setError('Please enter a recipient address');
      return;
    }
    
    if (!address.startsWith('0x') || address.length !== 42) {
      setError('Invalid Ethereum address');
      return;
    }
    
    setSending(true);
    
    try {
      // In a real app, this would be an API call
      const transaction = await tokenService.transferToken(
        token.id,
        amountNumber,
        address,
        'send'
      );
      
      addTransaction(transaction);
      
      // Clear form and navigate back
      setAmount('');
      setAddress('');
      setSending(false);
      
      // Show success notification
      alert(`Successfully sent ${amountNumber} ${token.symbol}`);
    } catch (error) {
      console.error('Error sending tokens', error);
      setError((error as Error).message || 'Error sending tokens');
      setSending(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const getTransactionIcon = (transaction: Transaction) => {
    switch (transaction.type) {
      case 'send':
        return <ArrowUpRight className="text-error-500" />;
      case 'receive':
        return <ArrowDownRight className="text-success-500" />;
      case 'swap':
        return <RefreshCw size={16} className="text-accent-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/')}
          className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <TokenIcon name={token.icon} className="mr-2" /> {token.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{token.symbol}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="py-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Your Balance
                  </h2>
                  <div className="text-3xl font-bold mt-1">{token.balance} {token.symbol}</div>
                  <div className="text-lg text-gray-700 dark:text-gray-300 mt-1">
                    {formatCurrency(token.value)}
                  </div>
                </div>
                <div className="flex mt-4 md:mt-0 space-x-3">
                  <Link to="/receive">
                    <Button 
                      variant="outline"
                      icon={<QrCode size={18} />}
                    >
                      Receive
                    </Button>
                  </Link>
                  <Link to="/swap">
                    <Button 
                      icon={<Send size={18} />}
                    >
                      Swap
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Send {token.symbol}</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  label="Amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={`0.00 ${token.symbol}`}
                  error={error && error.includes('amount') ? error : ''}
                />
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    Available: {token.balance} {token.symbol}
                  </span>
                  <button 
                    className="text-accent-600 hover:underline"
                    onClick={() => setAmount(token.balance.toString())}
                  >
                    Max
                  </button>
                </div>
                
                <Input
                  label="Recipient Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="0x..."
                  error={error && error.includes('address') ? error : ''}
                />
                
                {error && !error.includes('amount') && !error.includes('address') && (
                  <p className="text-sm text-error-500">{error}</p>
                )}
                
                <Button 
                  fullWidth 
                  onClick={handleSend} 
                  disabled={sending}
                  isLoading={sending}
                >
                  Send {token.symbol}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Price Info</h2>
              <a 
                href={`https://coinmarketcap.com/currencies/${token.name.toLowerCase()}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-accent-600 hover:underline flex items-center text-sm"
              >
                View Market <ExternalLink size={14} className="ml-1" />
              </a>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Current Price</span>
                  <span className="font-medium">${token.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">24h Change</span>
                  <span className={token.change24h >= 0 ? 'text-success-500' : 'text-error-500'}>
                    {token.change24h >= 0 ? '+' : ''}{token.change24h}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Your Value</span>
                  <span className="font-medium">{formatCurrency(token.value)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Transaction History</h2>
              </CardHeader>
              <div className="overflow-hidden">
                {transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <div key={transaction.id} className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                      <div className="flex items-center">
                        <div className="mr-3 p-2 rounded-full bg-gray-100 dark:bg-gray-800">
                          {getTransactionIcon(transaction)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-medium text-sm">
                                {transaction.type === 'send' ? 'Sent' : transaction.type === 'receive' ? 'Received' : 'Swapped'}
                              </h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(transaction.timestamp)}</p>
                            </div>
                            <div className="text-right">
                              <p className={`font-medium text-sm ${
                                transaction.type === 'receive' ? 'text-success-500' : 
                                transaction.type === 'send' ? 'text-error-500' : ''
                              }`}>
                                {transaction.type === 'send' ? '-' : transaction.type === 'receive' ? '+' : ''}
                                {transaction.amount} {token.symbol}
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
    </div>
  );
}