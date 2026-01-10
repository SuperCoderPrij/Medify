import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Box,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  Shield,
  Wallet,
  X,
  QrCode
} from "lucide-react";
import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useWeb3 } from "@/hooks/use-web3";
import { useEffect } from "react";

export default function ManufacturerLayout() {
  const { isAuthenticated, isLoading, signOut, user } = useAuth();
  const { account, connectWallet, disconnectWallet, isConnecting } = useWeb3();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (!isLoading && !isAuthenticated) {
    return null;
  }

  const navItems = [
    {
      title: "Dashboard",
      href: "/manufacturer/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "My Medicines",
      href: "/manufacturer/medicines",
      icon: Box,
    },
    {
      title: "Mint New Medicine",
      href: "/manufacturer/create",
      icon: PlusCircle,
    },
    {
      title: "Generate QR",
      href: "/manufacturer/generate-qr",
      icon: QrCode,
    },
    {
      title: "Reports",
      href: "/manufacturer/reports",
      icon: FileText,
    },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex overflow-hidden">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none z-0" />

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900/80 backdrop-blur-md border-b border-cyan-500/20 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <img 
            src="https://harmless-tapir-303.convex.cloud/api/storage/2a6ec2fc-0b6b-4926-a3a2-316eccd24c4f" 
            alt="Logo" 
            className="h-8 w-8 object-contain" 
          />
          <span className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Dhanvantari
          </span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden fixed inset-0 top-16 z-40 bg-slate-950/95 backdrop-blur-xl p-4"
          >
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                    location.pathname === item.href
                      ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </Link>
              ))}
              <Button
                variant="ghost"
                className="justify-start px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 mt-4"
                onClick={() => signOut()}
              >
                <LogOut className="h-5 w-5 mr-3" />
                Sign Out
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="hidden lg:flex flex-col border-r border-cyan-500/20 bg-slate-900/50 backdrop-blur-xl z-10 relative"
      >
        <div className="h-16 flex items-center px-6 border-b border-cyan-500/20">
          <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
            <img 
              src="https://harmless-tapir-303.convex.cloud/api/storage/2a6ec2fc-0b6b-4926-a3a2-316eccd24c4f" 
              alt="Logo" 
              className="h-8 w-8 shrink-0 object-contain" 
            />
            {isSidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-bold text-xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
              >
                Dhanvantari
              </motion.span>
            )}
          </div>
        </div>

        <div className="flex-1 py-6 px-3">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden",
                  location.pathname === item.href
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.1)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className={cn("h-5 w-5 shrink-0", location.pathname === item.href && "text-cyan-400")} />
                {isSidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="whitespace-nowrap"
                  >
                    {item.title}
                  </motion.span>
                )}
                {!isSidebarOpen && (
                  <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-cyan-500/20">
                    {item.title}
                  </div>
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-cyan-500/20">
          {/* Wallet Connection */}
          <div className="mb-4">
            {account ? (
              <Button
                variant="ghost"
                className={cn(
                  "w-full p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center gap-3 h-auto hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 group transition-all",
                  !isSidebarOpen && "justify-center p-2"
                )}
                onClick={disconnectWallet}
              >
                <Wallet className="h-5 w-5 text-cyan-400 group-hover:text-red-400 shrink-0" />
                {isSidebarOpen && (
                  <div className="overflow-hidden text-left">
                    <div className="text-xs text-cyan-400 group-hover:text-red-400 font-medium">Connected</div>
                    <div className="text-xs text-gray-400 group-hover:text-red-300 truncate" title={account}>
                      {account.slice(0, 6)}...{account.slice(-4)}
                    </div>
                  </div>
                )}
              </Button>
            ) : (
              <Button
                variant="outline"
                className={cn(
                  "w-full border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300",
                  !isSidebarOpen && "px-0 justify-center"
                )}
                onClick={connectWallet}
                disabled={isConnecting}
              >
                <Wallet className={cn("h-5 w-5", isSidebarOpen && "mr-2")} />
                {isSidebarOpen && (isConnecting ? "Connecting..." : "Connect Wallet")}
              </Button>
            )}
          </div>

          <div className={cn("flex items-center gap-3 mb-4", !isSidebarOpen && "justify-center")}>
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold shrink-0">
              {user?.name?.[0] || "M"}
            </div>
            {isSidebarOpen && (
              <div className="overflow-hidden">
                <div className="font-medium text-sm truncate">{user?.name || "Manufacturer"}</div>
                <div className="text-xs text-gray-400 truncate">{user?.email}</div>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            className={cn(
              "w-full text-red-400 hover:text-red-300 hover:bg-red-500/10",
              !isSidebarOpen && "px-0 justify-center"
            )}
            onClick={() => signOut()}
          >
            <LogOut className={cn("h-5 w-5", isSidebarOpen && "mr-2")} />
            {isSidebarOpen && "Sign Out"}
          </Button>
        </div>

        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-20 bg-slate-900 border border-cyan-500/20 rounded-full p-1 text-cyan-400 hover:text-white hover:bg-cyan-500/20 transition-colors"
        >
          {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative z-10 pt-16 lg:pt-0">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}