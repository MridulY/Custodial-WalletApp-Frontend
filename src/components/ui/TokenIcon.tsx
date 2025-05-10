import { Bitcoin, Feather as Ethereum, DollarSign, Currency as CurrencyPound, Wallet } from 'lucide-react';

type TokenIconProps = {
  name: string;
  size?: number;
  className?: string;
};

export function TokenIcon({ name, size = 24, className = '' }: TokenIconProps) {
  const getIcon = () => {
    switch (name.toLowerCase()) {
      case 'bitcoin':
      case 'btc':
        return <Bitcoin size={size} className={`text-orange-500 ${className}`} />;
      case 'ethereum':
      case 'eth':
        return <Ethereum size={size} className={`text-purple-500 ${className}`} />;
      case 'usd':
      case 'usdt':
      case 'usdc':
      case 'tether':
      case 'usd-coin':
        return <DollarSign size={size} className={`text-green-500 ${className}`} />;
      case 'gbp':
        return <CurrencyPound size={size} className={`text-blue-500 ${className}`} />;
      case 'uniswap':
      case 'uni':
        return (
          <div className={`flex items-center justify-center bg-pink-500 rounded-full p-1 ${className}`} style={{ width: size, height: size }}>
            <svg width={size - 8} height={size - 8} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M64 0C28.7 0 0 28.7 0 64C0 99.3 28.7 128 64 128C99.3 128 128 99.3 128 64C128 28.7 99.3 0 64 0Z" fill="#FF007A"/>
              <path d="M96.3 64.5C96.3 56.4 90.4 49.8 82.7 49.8C79.7 49.8 76.9 50.8 74.7 52.5C69.5 47.5 62.2 44.5 54 44.5C45.8 44.5 38.5 47.5 33.3 52.5C31.1 50.8 28.3 49.8 25.3 49.8C17.6 49.8 11.7 56.4 11.7 64.5C11.7 70.8 15.3 76.1 20.5 78.2C20.4 79.3 20.3 80.4 20.3 81.5C20.3 94.7 35.4 105.5 54 105.5C72.6 105.5 87.7 94.7 87.7 81.5C87.7 80.4 87.6 79.3 87.5 78.2C92.7 76.1 96.3 70.8 96.3 64.5Z" fill="white"/>
              <path d="M83.9 72.2C83.1 76.8 80.1 80.8 75.8 83.1C69.4 86.5 60.4 86.5 54 83.1C49.7 80.8 46.7 76.8 45.9 72.2C43.6 72.7 41.2 73.4 38.8 74.3C39.9 81.4 44.5 87.3 51.3 90.8C60 95.3 71.8 95.3 80.5 90.8C87.3 87.3 91.9 81.4 93 74.3C90.6 73.4 88.2 72.7 85.9 72.2H83.9Z" fill="#FF007A"/>
              <path d="M40.5 54.1C42.2 52.5 44.7 51.6 47.2 51.6C52.2 51.6 56.3 55.7 56.3 60.7C56.3 65.7 52.2 69.8 47.2 69.8C42.2 69.8 38.1 65.7 38.1 60.7C38.1 58.2 39 55.7 40.5 54.1ZM47.2 63.4C49.4 63.4 51.2 61.6 51.2 59.4C51.2 57.1 49.4 55.4 47.2 55.4C44.9 55.4 43.2 57.1 43.2 59.4C43.2 61.6 44.9 63.4 47.2 63.4Z" fill="#FF007A"/>
              <path d="M87.5 54.1C89.2 52.5 91.7 51.6 94.2 51.6C99.2 51.6 103.3 55.7 103.3 60.7C103.3 65.7 99.2 69.8 94.2 69.8C89.2 69.8 85.1 65.7 85.1 60.7C85.1 58.2 86 55.7 87.5 54.1ZM94.2 63.4C96.4 63.4 98.2 61.6 98.2 59.4C98.2 57.1 96.4 55.4 94.2 55.4C91.9 55.4 90.2 57.1 90.2 59.4C90.2 61.6 91.9 63.4 94.2 63.4Z" fill="#FF007A"/>
            </svg>
          </div>
        );
      default:
        return <Wallet size={size} className={className} />;
    }
  };

  return getIcon();
}