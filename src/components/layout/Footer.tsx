import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, QrCode, Settings } from 'lucide-react';

export function Footer() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <footer className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-2">
      <div className="flex justify-around">
        <Link
          to="/"
          className={`flex flex-col items-center p-2 ${isActive('/') ? 'text-accent-600' : ''}`}
        >
          <LayoutDashboard className="h-6 w-6" />
          <span className="text-xs mt-1">Dashboard</span>
        </Link>
        
        <Link
          to="/swap"
          className={`flex flex-col items-center p-2 ${isActive('/swap') ? 'text-accent-600' : ''}`}
        >
          <ArrowLeftRight className="h-6 w-6" />
          <span className="text-xs mt-1">Swap</span>
        </Link>
        
        <Link
          to="/receive"
          className={`flex flex-col items-center p-2 ${isActive('/receive') ? 'text-accent-600' : ''}`}
        >
          <QrCode className="h-6 w-6" />
          <span className="text-xs mt-1">Receive</span>
        </Link>
        
        <Link
          to="/settings"
          className={`flex flex-col items-center p-2 ${isActive('/settings') ? 'text-accent-600' : ''}`}
        >
          <Settings className="h-6 w-6" />
          <span className="text-xs mt-1">Settings</span>
        </Link>
      </div>
    </footer>
  );
}