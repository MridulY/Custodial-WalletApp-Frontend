# Wallet Generator & Token Swap

## Overview
The **Wallet Generator & Token Swap** project is a decentralized wallet creation and token swap application designed to interact with the Ethereum blockchain. The frontend is built with **React.js** and **TailwindCSS**, while the backend is built with **Node.js** and **Express.js**. The project enables users to generate Ethereum wallets, securely store private keys, and swap tokens using the Uniswap V2 protocol on the Ethereum testnet.

---

## Frontend

### Overview
The **frontend** of the **Wallet Generator & Token Swap** application provides a user interface for wallet creation, token swap functionality, and transaction history. The frontend connects with the backend via **Axios** for API communication. It offers a user-friendly interface for generating Ethereum wallets, performing token swaps, and managing transactions. The application is fully responsive and supports both mobile and desktop devices, ensuring accessibility for all users.

### Technologies Used
- **React.js**: A powerful JavaScript library for building user interfaces.
- **Jotai**: Minimal state management solution for React.
- **TailwindCSS**: A utility-first CSS framework for fast and flexible UI design.
- **Axios**: Promise-based HTTP client to interact with the backend API.
- **Lucide-React**: Customizable icons used throughout the app.
- **ethers.js**: Lightweight library to interact with Ethereum blockchain and smart contracts.
  
### Features
- **Wallet Creation**: Allows users to generate a new Ethereum wallet with a custom name. The wallet creation process generates a new address, private key, and mnemonic phrase.
- **Token Swap**: Facilitates swapping of ERC-20 tokens via Uniswap V2 on the Ethereum testnet. The frontend shows estimated values for tokens and interacts with the backend to perform the swap.
- **Transaction History**: Displays the history of completed transactions (swaps).
- **Responsive UI**: Mobile-first, adaptive design optimized for both mobile and desktop experiences.
- **Dark Mode**: Supports a dark theme for better accessibility and user preference.
  
### Setup Instructions

#### 1. Clone the Repository
To get started, clone the repository to your local machine:

```bash
git clone https://github.com/your-repo/frontend
cd frontend
```

#### 2. Install Dependencies
Ensure Node.js and npm are installed. If not, install them from the official website.

```bash
npm install
```

#### 3. Run the Application
Start the application locally:

```bash
npm run dev
```

### Folder Structure

```bash
/frontend
  ├── /components        # Reusable UI components
  ├── /pages            # Page components (Dashboard, WalletCreate, Swap, etc.)
  ├── /services         # API calls and logic for interaction with backend
  ├── /state            # Jotai state management
  ├── /utils            # Helper utilities (validation, formatting)
  ├── /assets           # Static files (icons, images)
  ├── /types            # TypeScript types
  ├── App.js            # Main React component
  ├── tailwind.config.js # TailwindCSS configuration
  └── package.json      # Dependencies and metadata
```

### Here Is The Home Page Look Of The App
![Alt Text](/assets/Dashboard.png)
