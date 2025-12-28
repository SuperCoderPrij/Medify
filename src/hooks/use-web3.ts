import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { toast } from 'sonner';

export function useWeb3() {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);

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
    toast.info("Wallet Disconnected");
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(browserProvider);

      // Check if already connected
      browserProvider.listAccounts().then((accounts: ethers.JsonRpcSigner[]) => {
        if (accounts.length > 0) {
          // In ethers v6, listAccounts returns Signer objects, we need the address
          accounts[0].getAddress().then((address: string) => {
             setAccount(address);
          });
          
          browserProvider.getNetwork().then((network: ethers.Network) => {
            setChainId(network.chainId.toString());
          });
        }
      });

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          toast.info("Account Changed", {
            description: `Switched to ${accounts[0].slice(0, 6)}...`
          });
        } else {
          setAccount(null);
          toast.info("Wallet Disconnected");
        }
      });

      // Listen for chain changes
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }, []);

  return {
    account,
    isConnecting,
    provider,
    chainId,
    connectWallet,
    disconnectWallet
  };
}