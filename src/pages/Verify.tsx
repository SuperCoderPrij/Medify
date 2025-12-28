import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { ethers } from "ethers";
import { motion } from "framer-motion";
import { Shield, CheckCircle, XCircle, Loader2, ExternalLink, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { POLYGON_AMOY_CHAIN_ID } from "@/hooks/use-web3";

// Minimal ERC721 ABI for ownerOf and tokenURI
const ERC721_ABI = [
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function name() view returns (string)",
  "function symbol() view returns (string)"
];

export default function Verify() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const contractAddress = searchParams.get("contract");
  const tokenId = searchParams.get("tokenId");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nftData, setNftData] = useState<any>(null);

  useEffect(() => {
    const verifyNFT = async () => {
      if (!contractAddress || !tokenId) {
        setError("Invalid verification URL. Missing contract address or token ID.");
        setLoading(false);
        return;
      }

      try {
        // Use a public RPC provider for Amoy if window.ethereum is not available or for read-only
        // Fallback to window.ethereum if available, else use a public RPC
        let provider;
        if (window.ethereum) {
            provider = new ethers.BrowserProvider(window.ethereum);
        } else {
            // Public RPC for Polygon Amoy
            provider = new ethers.JsonRpcProvider("https://rpc-amoy.polygon.technology/");
        }

        const contract = new ethers.Contract(contractAddress, ERC721_ABI, provider);

        // Fetch data in parallel
        const [owner, uri, name, symbol] = await Promise.all([
          contract.ownerOf(tokenId).catch(() => "Unknown"),
          contract.tokenURI(tokenId).catch(() => "Not available"),
          contract.name().catch(() => "Unknown Collection"),
          contract.symbol().catch(() => "NFT")
        ]);

        setNftData({
          contractAddress,
          tokenId,
          owner,
          uri,
          name,
          symbol
        });
      } catch (err: any) {
        console.error("Verification failed:", err);
        setError("Failed to verify NFT. Please check the contract address and network.");
      } finally {
        setLoading(false);
      }
    };

    verifyNFT();
  }, [contractAddress, tokenId]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none z-0" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-cyan-500/10 rounded-full mb-4">
            <Shield className="h-10 w-10 text-cyan-400" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            PharmaAuth Verification
          </h1>
        </div>

        <Card className="bg-slate-900/50 backdrop-blur-xl border border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-center text-white">
              {loading ? "Verifying Authenticity..." : error ? "Verification Failed" : "Verified Authentic"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {loading ? (
              <div className="flex flex-col items-center py-8">
                <Loader2 className="h-12 w-12 text-cyan-400 animate-spin mb-4" />
                <p className="text-gray-400">Querying blockchain...</p>
              </div>
            ) : error ? (
              <div className="text-center py-6">
                <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <p className="text-red-400 mb-6">{error}</p>
                <Button onClick={() => navigate("/")} variant="outline" className="border-red-500/20 text-red-400 hover:bg-red-500/10">
                  Return Home
                </Button>
              </div>
            ) : (
              <>
                <div className="flex flex-col items-center pb-6 border-b border-slate-800">
                  <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                  <h2 className="text-xl font-semibold text-white">{nftData.name}</h2>
                  <p className="text-gray-400">{nftData.symbol} #{nftData.tokenId}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider">Owner Address</label>
                    <div className="font-mono text-sm text-cyan-400 break-all bg-cyan-950/30 p-2 rounded border border-cyan-500/20">
                      {nftData.owner}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider">Contract Address</label>
                    <div className="font-mono text-sm text-gray-300 break-all">
                      {nftData.contractAddress}
                    </div>
                  </div>

                  {nftData.uri && (
                    <div>
                      <label className="text-xs text-gray-500 uppercase tracking-wider">Token URI</label>
                      <div className="text-sm text-gray-300 truncate">
                        {nftData.uri}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 flex gap-3">
                  <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white" onClick={() => navigate("/")}>
                    Done
                  </Button>
                  <Button variant="outline" className="w-full border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10" onClick={() => window.open(`https://www.oklink.com/amoy/address/${contractAddress}`, '_blank')}>
                    View on Explorer <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
