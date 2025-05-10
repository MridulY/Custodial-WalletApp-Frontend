import { Outlet, Navigate } from "react-router-dom";
import { useAtomValue } from "jotai";
import { walletAtom, authAtom } from "../../state/atoms";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";

export function Layout() {
  const auth = useAtomValue(authAtom);
  const wallet = useAtomValue(walletAtom);

  // Check if the user is on an auth page
  const isAuthPage =
    window.location.pathname === "/login" ||
    window.location.pathname === "/register";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar />

      <div className="flex flex-1">
        {auth.user && wallet && (
          <div className="hidden md:block w-64 border-r border-gray-200 dark:border-gray-700">
            <Sidebar />
          </div>
        )}

        <div className="flex-1 overflow-auto">
          <main className="container mx-auto px-4 py-6 max-w-4xl animate-fade-in">
            <Outlet />
          </main>
        </div>
      </div>

      {auth.user && wallet && <Footer />}
    </div>
  );
}
