import { useState, useEffect } from 'react';
import { ArrowDown, RefreshCw } from 'lucide-react';
import { useAtomValue, useSetAtom } from 'jotai';
import { tokenAtom, addTransactionAtom, walletAtom } from '../state/atoms';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardFooter } from '../components/ui/Card';
import { TokenIcon } from '../components/ui/TokenIcon';
import { tokenService } from '../services/token';
import { toast } from 'react-toastify';

export function Swap() {
  const tokens = useAtomValue(tokenAtom);
  const addTransaction = useSetAtom(addTransactionAtom);
  const walletAddress = useAtomValue(walletAtom);
  
  const [fromToken, setFromToken] = useState(tokens[0]?.id || '');
  const [toToken, setToToken] = useState(tokens[1]?.id || '');
  const [amount, setAmount] = useState('');
  const [estimatedAmount, setEstimatedAmount] = useState('0');
  const [slippage, setSlippage] = useState(0.5);
  const [fee, setFee] = useState(0);
  const [isSwapping, setIsSwapping] = useState(false);
  const [error, setError] = useState('');
  
  const fromTokenObj = tokens.find(t => t.id === fromToken);
  const toTokenObj = tokens.find(t => t.id === toToken);
  
  useEffect(() => {
    if (fromToken && toToken && amount && !isNaN(parseFloat(amount))) {
      calculateSwap();
    } else {
      setEstimatedAmount('0');
      setFee(0);
    }
  }, [fromToken, toToken, amount]);
  
  const calculateSwap = () => {
    if (
      !fromTokenObj ||
      !toTokenObj ||
      isNaN(parseFloat(amount)) ||
      parseFloat(amount) <= 0
    ) {
      setEstimatedAmount("0");
      setFee(0);
      return;
    }

    const amountValue = parseFloat(amount);

    // Use a fixed ratio for swap (e.g., 1:1 for simplicity)
    const swapRatio = 0.8; // 1:1 for testnet purposes
    const estimatedValue = amountValue * swapRatio * 0.99; // 1% fee for swap

    // Calculate fee as 1% of the input amount
    const calculatedFee = amountValue * 0.01;

    // Update the estimated amount and fee state
    setFee(calculatedFee);
    setEstimatedAmount(estimatedValue.toFixed(6)); // Show 6 decimal places
  };

  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };
  
  const switchTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
  };
  
  const handleSwapConfirm = async () => {
    setError('');
    
    if (!fromToken || !toToken) {
      setError('Please select tokens');
      return;
    }
    
    const amountNumber = parseFloat(amount);
    
    if (!amount || isNaN(amountNumber) || amountNumber <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    if (!fromTokenObj || amountNumber > fromTokenObj.balance) {
      setError('Insufficient balance');
      return;
    }

    if (!walletAddress) {
      setError("Wallet address is not available");
      return;
    }
    
    setIsSwapping(true);
    console.log("waalet is on swap page", walletAddress?.address);
    
    try {
      // In a real app, this would be an API call
      const transaction = await tokenService.swapTokens(
        fromToken,
        toToken,
        amountNumber,
        walletAddress?.address
      );
      
      addTransaction(transaction);
      
      // Reset form after successful swap
      setAmount('');
      setIsSwapping(false);
      
      // Show success message
      toast.success(`Successfully Swapped ${fromToken} to ${toToken}!`, {
        position: "top-center", 
        autoClose: 3000,
        hideProgressBar: true,
      });
    } catch (error) {
      console.error('Error swapping tokens', error);
      setError((error as Error).message || 'Error during swap');
      setIsSwapping(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Swap Tokens</h1>
        <p className="text-gray-600 dark:text-gray-400">Exchange your tokens at the best rates</p>
      </div>
      
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Swap</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                From
              </label>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <div className="relative">
                    <select
                      value={fromToken}
                      onChange={(e) => setFromToken(e.target.value)}
                      className={`
                        w-full rounded-lg border border-gray-300 dark:border-gray-600
                        bg-white dark:bg-gray-800 py-2 px-3 appearance-none
                        focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent
                      `}
                    >
                      {tokens.map(token => (
                        <option key={token.id} value={token.id} disabled={token.id === toToken}>
                          {token.name} ({token.symbol})
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <TokenIcon name={fromTokenObj?.icon || ''} size={20} />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Balance: {fromTokenObj ? fromTokenObj.balance : 0} {fromTokenObj?.symbol}
                  </p>
                </div>
                <div className="w-1/3">
                  <input
                    type="number"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="0.0"
                    className={`
                      w-full rounded-lg border border-gray-300 dark:border-gray-600
                      bg-white dark:bg-gray-800 py-2 px-3
                      focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent
                    `}
                  />
                  <button 
                    className="text-xs text-accent-600 hover:underline mt-1 float-right"
                    onClick={() => fromTokenObj && setAmount(fromTokenObj.balance.toString())}
                  >
                    MAX
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={switchTokens}
                className="p-2 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ArrowDown className="h-5 w-5" />
              </button>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                To
              </label>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <div className="relative">
                    <select
                      value={toToken}
                      onChange={(e) => setToToken(e.target.value)}
                      className={`
                        w-full rounded-lg border border-gray-300 dark:border-gray-600
                        bg-white dark:bg-gray-800 py-2 px-3 appearance-none
                        focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent
                      `}
                    >
                      {tokens.map(token => (
                        <option key={token.id} value={token.id} disabled={token.id === fromToken}>
                          {token.name} ({token.symbol})
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <TokenIcon name={toTokenObj?.icon || ''} size={20} />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Balance: {toTokenObj ? toTokenObj.balance : 0} {toTokenObj?.symbol}
                  </p>
                </div>
                <div className="w-1/3">
                  <input
                    type="text"
                    value={estimatedAmount}
                    readOnly
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 py-2 px-3"
                  />
                  <p className="text-xs text-gray-500 mt-1">Estimated</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h3 className="text-sm font-medium mb-2">Swap Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Exchange Rate</span>
                  <span>
                    {fromTokenObj && toTokenObj
                      ? `1 ${fromTokenObj.symbol} ≈ ${(fromTokenObj.price / toTokenObj.price).toFixed(6)} ${toTokenObj.symbol}`
                      : '-'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Fee (1%)</span>
                  <span>{fee ? `${fee} ${fromTokenObj?.symbol}` : '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Slippage Tolerance</span>
                  <span>{slippage}%</span>
                </div>
              </div>
            </div>
            
            {error && (
              <div className="bg-error-50 dark:bg-error-900/30 text-error-700 dark:text-error-300 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            fullWidth
            onClick={handleSwapConfirm}
            disabled={isSwapping || !amount || !fromToken || !toToken}
            isLoading={isSwapping}
            icon={<RefreshCw size={18} />}
          >
            Swap Tokens
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}