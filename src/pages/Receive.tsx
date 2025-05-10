import { useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { Copy, Check, ArrowDown } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { walletAtom, tokenAtom, addTransactionAtom } from '../state/atoms';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { TokenIcon } from '../components/ui/TokenIcon';
import { tokenService } from '../services/token';

export function Receive() {
  const wallet = useAtomValue(walletAtom);
  const tokens = useAtomValue(tokenAtom);
  const addTransaction = useSetAtom(addTransactionAtom);
  
  const [copied, setCopied] = useState(false);
  const [selectedToken, setSelectedToken] = useState(tokens[0]?.id);
  const [amount, setAmount] = useState('');
  const [simulateReceive, setSimulateReceive] = useState(false);
  const [isReceiving, setIsReceiving] = useState(false);
  
  const token = tokens.find(t => t.id === selectedToken);
  
  if (!wallet) {
    return <div>No wallet found</div>;
  }
  
  const copyAddress = () => {
    navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleSimulateReceive = async () => {
    if (!selectedToken || !amount || isNaN(parseFloat(amount))) return;
    
    setIsReceiving(true);
    
    try {
      // Simulate receiving tokens (for demo purposes)
      const transaction = await tokenService.transferToken(
        selectedToken,
        parseFloat(amount),
        wallet.address,
        "receive",
        wallet.address
      );
      
      addTransaction(transaction);
      setAmount('');
      setSimulateReceive(false);
    } catch (error) {
      console.error('Error simulating receive', error);
    } finally {
      setIsReceiving(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Receive</h1>
        <p className="text-gray-600 dark:text-gray-400">Receive tokens to your wallet</p>
      </div>
      
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Your Address</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex justify-center p-4 bg-white rounded-lg">
              <QRCodeSVG value={wallet.address} size={200} />
            </div>
            
            <div>
              <div className="flex items-center mb-2">
                <div className="p-2 bg-primary-100 dark:bg-primary-800 rounded-full mr-2">
                  <ArrowDown className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                </div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Your Wallet Address
                </label>
              </div>
              <div className="flex">
                <input
                  type="text"
                  readOnly
                  value={wallet.address}
                  className="flex-1 rounded-l-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 py-2 px-3"
                />
                <button
                  onClick={copyAddress}
                  className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-4 rounded-r-lg border border-gray-300 dark:border-gray-600 border-l-0 flex items-center"
                >
                  {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <div>
              <div className="flex items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select Token
                </label>
              </div>
              <div className="relative">
                <select
                  value={selectedToken}
                  onChange={(e) => setSelectedToken(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 px-3 appearance-none focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                >
                  {tokens.map(token => (
                    <option key={token.id} value={token.id}>
                      {token.name} ({token.symbol})
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  {token && <TokenIcon name={token.icon} size={20} />}
                </div>
              </div>
            </div>
            
            {/* Demo only: For simulating receiving tokens */}
            {!simulateReceive ? (
              <Button 
                variant="outline" 
                fullWidth 
                onClick={() => setSimulateReceive(true)}
              >
                Simulate Receiving Tokens (Demo)
              </Button>
            ) : (
              <div className="space-y-4">
                <Input
                  label="Amount to Receive"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={`0.00 ${token?.symbol}`}
                />
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setSimulateReceive(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    fullWidth 
                    onClick={handleSimulateReceive}
                    isLoading={isReceiving}
                    disabled={!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0}
                  >
                    Simulate Receive
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}