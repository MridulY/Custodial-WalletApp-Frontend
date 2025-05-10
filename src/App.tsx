import { Routes, Route, Navigate } from 'react-router-dom';
import { useAtomValue, useSetAtom } from 'jotai';
import { Wallet, WalletCreate, Dashboard, Swap, Settings, Receive, Login, Register } from './pages';
import { Layout } from './components/layout/Layout';
import {walletAtom, authAtom } from "./state/atoms";
import { useEffect } from 'react';
import { authService } from './services/auth';
import { ToastContainer } from "react-toastify";

function App() {
  const auth = useAtomValue(authAtom);
  const setAuth = useSetAtom(authAtom);
  const wallet = useAtomValue(walletAtom);

  useEffect(() => {
    async function verifyAuth() {
      const user = await authService.verifyToken();
      setAuth({ user, isLoading: false, error: null });
    }
    verifyAuth();
  }, [setAuth]);


  return (
    <>
    <ToastContainer position="top-center" autoClose={3000} hideProgressBar={true} />
    <Routes>
      <Route path="/" element={<Layout />}>
        {!auth.user ? (
          <>
            <Route index element={<Navigate to="/login" replace />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : !wallet ? (
          <>
            <Route index element={<Wallet />} />
            <Route path="create" element={<WalletCreate />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            <Route index element={<Dashboard />} />
            <Route path="swap" element={<Swap />} />
            <Route path="receive" element={<Receive />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Route>
    </Routes>
    </>
  );
}

export default App;