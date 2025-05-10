import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetAtom } from "jotai";
import { Loader2, Check, Copy, CloudLightning } from "lucide-react";
import { walletAtom } from "../state/atoms";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardFooter } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { walletService } from "../services/wallet";
import { decryptPrivateKey } from "../utils/cryptoUtils";
import { toast } from "react-toastify";

export function WalletCreate() {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [walletData, setWalletData] = useState<{
    address: string;
    privateKey: string;
    mnemonic: string;
  } | null>(null);
  const [walletName, setWalletName] = useState("My Wallet");
  const [copied, setCopied] = useState<string | null>(null);
  const setWallet = useSetAtom(walletAtom);
  const [decryptedPrivateKey, setDecryptedPrivateKey] = useState<string | null>(
    null
  );
  const navigate = useNavigate();

  const generateWallet = async () => {
    setIsGenerating(true);

    try {
      // Make API call to the backend to generate the wallet
      const response = await walletService.createWallet(walletName);
      const mnemonic = response.mnemonic ? response.mnemonic.toString() : "";
      const createdAt = new Date().toISOString();
      const decryptedKey = await decryptPrivateKey(
        response.encryptedPrivateKey
      );
      setWalletData({
        address: response.address,
        privateKey: decryptedKey,
        mnemonic: mnemonic,
      });
      localStorage.setItem("walletName", walletName);
      localStorage.setItem("walletCreatedAt", createdAt);
      setStep(2);
      toast.success(
        `Wallet Created Successfully with address ${response.address}`,
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
        }
      );
    } catch (error) {
      console.error("Error generating wallet", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
    toast.success(
      `Copied To ClipBoard`,
      {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      }
    );
  };

  const saveWallet = () => {
    if (walletData) {
      setWallet(walletData);
      navigate("/");
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create a New Wallet</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {step === 1
            ? "Generate a new Ethereum wallet address"
            : "Save your recovery information"}
        </p>
      </div>

      {step === 1 ? (
        <Card>
          <CardContent className="pt-6">
            <Input
              label="Wallet Name"
              value={walletName}
              onChange={(e) => setWalletName(e.target.value)}
              placeholder="My Wallet"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              This name is only visible to you and helps you identify this
              wallet.
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate("/")}>
              Back
            </Button>
            <Button onClick={generateWallet} isLoading={isGenerating}>
              Generate Wallet
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-yellow-800 dark:text-yellow-500 mb-2">
                Important
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                Save this information in a secure location. Anyone with access
                to your private key or seed phrase can access your funds.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Wallet Address
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    readOnly
                    value={walletData?.address || ""}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 py-2 px-3"
                  />
                  <button
                    onClick={() =>
                      walletData &&
                      copyToClipboard(walletData.address, "address")
                    }
                    className="ml-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  >
                    {copied === "address" ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Private Key
                </label>
                <div className="flex items-center">
                  <input
                    type="password"
                    readOnly
                    value={decryptedPrivateKey || walletData?.privateKey || ""}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 py-2 px-3"
                  />
                  <button
                    onClick={() =>
                      walletData &&
                      copyToClipboard(walletData.privateKey, "privateKey")
                    }
                    className="ml-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  >
                    {copied === "privateKey" ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Seed Phrase
                </label>
                <div className="flex items-center">
                  <textarea
                    readOnly
                    value={walletData?.mnemonic || ""}
                    rows={2}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 py-2 px-3"
                  />
                  <button
                    onClick={() =>
                      walletData &&
                      copyToClipboard(walletData.mnemonic, "mnemonic")
                    }
                    className="ml-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  >
                    {copied === "mnemonic" ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button onClick={saveWallet}>I've Saved These Details</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
