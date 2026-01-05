import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { ethers } from 'ethers';
import { toast } from 'sonner';

export const POLYGON_AMOY_CHAIN_ID = '80002';
const POLYGON_AMOY_CHAIN_ID_HEX = '0x13882';

interface Web3ContextType {
  account: string | null;
  isConnecting: boolean;
  provider: ethers.BrowserProvider | null;
  chainId: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchToAmoy: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | null>(null);

export function Web3Provider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);

  const switchToAmoy = useCallback(async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: POLYGON_AMOY_CHAIN_ID_HEX }],
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: POLYGON_AMOY_CHAIN_ID_HEX,
                chainName: 'Polygon Amoy Testnet',
                nativeCurrency: {
                  name: 'POL',
                  symbol: 'POL',
                  decimals: 18,
                },
                rpcUrls: ['https://rpc-amoy.polygon.technology/'],
                blockExplorerUrls: ['https://www.oklink.com/amoy'],
              },
            ],
          });
        } catch (addError) {
          console.error(addError);
          toast.error("Failed to add Polygon Amoy network");
        }
      } else {
        console.error(switchError);
        toast.error("Failed to switch network");
      }
    }
  }, []);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      toast.error("MetaMask not found", {
        description: "Please install MetaMask to use this feature."
      });
      return;
    }

    setIsConnecting(true);
    try {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await browserProvider.send("eth_requestAccounts", []);
      
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setProvider(browserProvider);
        
        const network = await browserProvider.getNetwork();
        setChainId(network.chainId.toString());
        
        // Clear explicit disconnect flag
        localStorage.removeItem("isExplicitlyDisconnected");

        toast.success("Wallet Connected", {
          description: `Connected: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`
        });
      }
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      toast.error("Connection Failed", {
        description: error.message || "Failed to connect to wallet"
      });
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setProvider(null);
    setChainId(null);
    // Set flag to prevent auto-reconnect
    localStorage.setItem("isExplicitlyDisconnected", "true");
    toast.info("Wallet Disconnected");
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      console.log("Ethereum provider detected");
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(browserProvider);

      // Check if already connected
      browserProvider.listAccounts().then((accounts) => {
        if (accounts.length > 0) {
          // Check if user explicitly disconnected previously
          const wasDisconnected = localStorage.getItem("isExplicitlyDisconnected") === "true";
          
          if (!wasDisconnected) {
            // In ethers v6, listAccounts returns Signer objects, we need the address
            accounts[0].getAddress().then((address) => {
               setAccount(address);
            });
            
            browserProvider.getNetwork().then((network) => {
              setChainId(network.chainId.toString());
            });
          }
        }
      });

      // Listen for account changes
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          // If accounts changed in MetaMask, we should update, unless explicitly disconnected?
          // Usually if user switches account in MetaMask, they want to see it.
          // So we update and clear the disconnect flag if it exists, assuming user interaction with wallet implies intent.
          setAccount(accounts[0]);
          localStorage.removeItem("isExplicitlyDisconnected");
          toast.info("Account Changed", {
            description: `Switched to ${accounts[0].slice(0, 6)}...`
          });
        } else {
          setAccount(null);
          toast.info("Wallet Disconnected");
        }
      };

      // Listen for chain changes
      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, []);

  return (
    <Web3Context.Provider value={{
      account,
      isConnecting,
      provider,
      chainId,
      connectWallet,
      disconnectWallet,
      switchToAmoy
    }}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
}
