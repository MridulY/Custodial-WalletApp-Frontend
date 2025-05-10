import { Link } from "react-router-dom";
import { useAtomValue, useSetAtom } from "jotai";
import { Wallet, Settings, Menu, X, LogOut } from "lucide-react";
import { walletAtom, authAtom } from "../../state/atoms";
import { useState } from "react";
import { authService } from "../../services/auth";

export function Navbar() {
  const wallet = useAtomValue(walletAtom);
  const auth = useAtomValue(authAtom);
  const setAuth = useSetAtom(authAtom);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    authService.logout();
    setAuth({ user: null, isLoading: false, error: null });
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Wallet className="h-8 w-8 text-accent-600" />
              <span className="text-xl font-bold">CryptoVault</span>
            </Link>
          </div>

          {auth.user && (
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {auth.user.email}
              </div>
              {wallet && (
                <div className="text-sm bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1 flex items-center">
                  <span className="font-mono">{`${wallet.address.substring(
                    0,
                    6
                  )}...${wallet.address.substring(
                    wallet.address.length - 4
                  )}`}</span>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
              >
                <LogOut className="h-5 w-5" />
              </button>
              {wallet && (
                <Link
                  to="/settings"
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Settings className="h-5 w-5" />
                </Link>
              )}
            </div>
          )}

          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && auth.user && (
        <div className="md:hidden animate-slide-down">
          <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200 dark:border-gray-700">
            {wallet ? (
              <>
                <Link
                  to="/"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/swap"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Swap
                </Link>
                <Link
                  to="/receive"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Receive
                </Link>
                <Link
                  to="/settings"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Settings
                </Link>
              </>
            ) : (
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                Create Wallet
              </Link>
            )}
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
            >
              Log Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
