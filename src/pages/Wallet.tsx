import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSetAtom } from 'jotai';
import { PlusCircle, KeyRound, ArrowRight } from 'lucide-react';
import { walletAtom } from '../state/atoms';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { walletService } from '../services/wallet';

export function Wallet() {
  const [importMode, setImportMode] = useState(false);
  const [privateKey, setPrivateKey] = useState('');
  const [error, setError] = useState('');
  const setWallet = useSetAtom(walletAtom);
  const navigate = useNavigate();

  const handleImport = () => {
    if (!privateKey.trim()) {
      setError('Please enter a private key or seed phrase');
      return;
    }

    try {
      const wallet = walletService.importWallet(privateKey, 'My Imported Wallet');
      
      if (wallet) {
        setWallet(wallet);
        navigate('/');
      } else {
        setError('Invalid private key or seed phrase');
      }
    } catch (err) {
      setError('Invalid private key or seed phrase');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to CryptoVault</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Your secure custodial wallet for Ethereum and ERC-20 tokens
        </p>
      </div>
      
      {!importMode ? (
        <div className="space-y-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link to="/create">
              <CardContent className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 bg-accent-100 dark:bg-accent-900 rounded-full mr-4">
                    <PlusCircle className="h-6 w-6 text-accent-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Create a new wallet</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Generate a new wallet address
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </CardContent>
            </Link>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Import Wallet</h2>
            <Input
              label="Private Key or Seed Phrase"
              placeholder="Enter private key or seed phrase"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              error={error}
              type="password"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Enter your private key or 12-24 word seed phrase to import your wallet.
            </p>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setImportMode(false)}>
                Back
              </Button>
              <Button fullWidth onClick={handleImport}>
                Import Wallet
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}