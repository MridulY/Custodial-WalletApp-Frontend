import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, QrCode, Settings } from 'lucide-react';

export function Sidebar() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const menuItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/swap', label: 'Swap', icon: ArrowLeftRight },
    { path: '/receive', label: 'Receive', icon: QrCode },
    { path: '/settings', label: 'Settings', icon: Settings }
  ];
  
  return (
    <div className="p-4 h-full">
      <ul className="space-y-2">
        {menuItems.map(item => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`
                flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200
                ${isActive(item.path) 
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-100' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'}
              `}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}