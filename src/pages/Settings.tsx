import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtomValue, useSetAtom } from 'jotai';
import { Copy, Check, ArrowRight, LogOut, Shield, Bell, MonitorSmartphone } from 'lucide-react';
import { walletAtom } from '../state/atoms';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { walletService } from '../services/wallet';

export function Settings() {
  const wallet = useAtomValue(walletAtom);
  const setWallet = useSetAtom(walletAtom);
  const navigate = useNavigate();
  
  const [copied, setCopied] = useState(false);
  const [confirmingLogout, setConfirmingLogout] = useState(false);
  
  if (!wallet) {
    navigate('/');
    return null;
  }

  const walletName = localStorage.getItem("walletName");
  const walletCreatedAt = localStorage.getItem("walletCreatedAt");
  
  const copyAddress = () => {
    navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleLogout = () => {
    if (confirmingLogout) {
      walletService.deleteWallet();
      setWallet(null);
      navigate('/');
    } else {
      setConfirmingLogout(true);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your wallet settings and preferences
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Wallet Information</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Wallet Address
                </label>
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
                    {copied ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Wallet Name
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    readOnly
                    value={walletName || "No name set"}
                    className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 py-2 px-3"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Created On
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    readOnly
                    value={
                      walletCreatedAt
                        ? new Date(walletCreatedAt).toLocaleDateString()
                        : "N/A"
                    }
                    className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 py-2 px-3"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="pt-4">
          <Button
            variant="danger"
            fullWidth
            icon={<LogOut size={18} />}
            onClick={handleLogout}
          >
            {confirmingLogout ? "Confirm Log Out" : "Log Out of Wallet"}
          </Button>
          {confirmingLogout && (
            <p className="text-sm text-center mt-2 text-gray-500">
              This will disconnect your wallet. You can access it again with
              your private key or seed phrase.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}