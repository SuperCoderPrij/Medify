import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { ethers } from "ethers";
import { motion } from "framer-motion";
import { Shield, CheckCircle, XCircle, Loader2, ExternalLink, AlertTriangle, Package, Calendar, Info, Sparkles, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";

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

  // Fetch medicine data from Convex
  const medicineData = useQuery(api.medicines.getMedicineByUnitTokenId, 
    tokenId ? { tokenId } : "skip"
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nftData, setNftData] = useState<any>(null);

  // AI State
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAskingAi, setIsAskingAi] = useState(false);
  const askGemini = useAction(api.gemini.askAboutMedicine);

  const handleAskGemini = async () => {
    const name = medicineData?.medicineName || nftData?.name;
    const manufacturer = medicineData?.manufacturerName || "Unknown Manufacturer";
    
    if (!name) return;

    setIsAskingAi(true);
    try {
      const response = await askGemini({
        medicineName: name,
        manufacturer: manufacturer,
        details: medicineData ? `Batch: ${medicineData.batchNumber}` : undefined
      });
      setAiResponse(response);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAskingAi(false);
    }
  };

  useEffect(() => {
    // Redirect if error exists, loading is done, and no medicine data found
    if (error && !loading && !medicineData) {
        const timer = setTimeout(() => {
             navigate("/not-verified");
        }, 100);
        return () => clearTimeout(timer);
    }
  }, [error, loading, medicineData, navigate]);

  useEffect(() => {
    const verifyNFT = async () => {
      if (!contractAddress || !tokenId) {
        setError("Invalid verification URL. Missing contract address or token ID.");
        setLoading(false);
        return;
      }

      // Wait for medicineData to load if we have a tokenId that looks like a unit ID (contains hyphen)
      // This ensures we use the correct Batch Token ID for blockchain verification
      if (medicineData === undefined && tokenId.includes("-")) {
        return; // Keep loading
      }

      try {
        // Use a public RPC provider for Amoy if window.ethereum is not available or for read-only
        let provider;
        try {
            // Public RPC for Polygon Amoy
            provider = new ethers.JsonRpcProvider("https://rpc-amoy.polygon.technology/");
            // Test connection
            await provider.getNetwork();
        } catch (e) {
            console.warn("Failed to connect to primary RPC, trying fallback or browser provider");
            if (window.ethereum) {
                provider = new ethers.BrowserProvider(window.ethereum);
            }
        }

        if (!provider) {
             // If no provider works, we'll rely on Convex data if available
             console.warn("No web3 provider available");
             if (!medicineData) {
                 setError("No provider and no database record found.");
             }
        } else {
            const contract = new ethers.Contract(contractAddress, ERC721_ABI, provider);

            // Determine the correct Token ID to query on blockchain
            // If we have medicineData, use the batch tokenId. 
            // Otherwise, try to use the passed tokenId (fallback)
            const blockchainTokenId = medicineData?.tokenId || tokenId;

            console.log("Verifying on blockchain with Token ID:", blockchainTokenId);

            // Fetch data in parallel
            const [owner, uri, name, symbol] = await Promise.all([
            contract.ownerOf(blockchainTokenId).catch((err: any) => {
                console.error("Failed to fetch owner:", err);
                return null; // Return null instead of "Unknown" to trigger error check
            }),
            contract.tokenURI(blockchainTokenId).catch(() => "Not available"),
            contract.name().catch(() => "Unknown Collection"),
            contract.symbol().catch(() => "NFT")
            ]);

            if (!owner || owner === "0x0000000000000000000000000000000000000000") {
                throw new Error("Token does not exist or invalid owner");
            }

            setNftData({
            contractAddress,
            tokenId: blockchainTokenId,
            owner,
            uri,
            name,
            symbol
            });
        }
      } catch (err: any) {
        console.error("Verification failed:", err);
        // Don't set error if we have medicineData, just log it
        if (!medicineData) {
             setError("Failed to verify NFT on blockchain. Please check connection.");
        }
      } finally {
        setLoading(false);
      }
    };

    verifyNFT();
  }, [contractAddress, tokenId, medicineData]);

  // Combine loading state
  const isPageLoading = loading && !medicineData;

  // Check if medicine is active (if data exists)
  const isDeactivated = medicineData && medicineData.isActive === false;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 py-12">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none z-0" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-2xl"
      >
        <div className="text-center mb-8">
          <div 
            className="inline-flex items-center justify-center mb-4 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate("/")}
          >
            <img 
              src="https://harmless-tapir-303.convex.cloud/api/storage/6fe7d1e8-1ae1-4599-8bb9-5c6b39e1af03" 
              alt="Dhanvantari Logo" 
              className="h-20 w-20 object-cover rounded-full bg-cyan-500/10" 
            />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-samarkan tracking-wider">
            Dhanvantari Verification
          </h1>
        </div>

        <Card className="bg-slate-900/80 backdrop-blur-xl border border-cyan-500/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-center text-white flex flex-col items-center gap-2">
              {isPageLoading ? (
                "Verifying Authenticity..."
              ) : error && !medicineData ? (
                "Verification Failed"
              ) : isDeactivated ? (
                <div className="flex items-center gap-2 text-red-400">
                    <AlertTriangle className="h-6 w-6" />
                    <span>Batch Deactivated</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="h-6 w-6" />
                    <span>Verified Authentic</span>
                  </div>
                  <span className="text-sm font-normal text-gray-400">
                    {medicineData ? "Verified against Manufacturer Database" : "Verified on Blockchain"}
                  </span>
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {isPageLoading ? (
              <div className="flex flex-col items-center py-8">
                <Loader2 className="h-12 w-12 text-cyan-400 animate-spin mb-4" />
                <p className="text-gray-400">Querying blockchain & database...</p>
              </div>
            ) : error && !medicineData ? (
              <div className="text-center py-6">
                <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <p className="text-red-400 mb-6">{error}</p>
                <Button onClick={() => navigate("/")} variant="outline" className="border-red-500/20 text-red-400 hover:bg-red-500/10">
                  Return Home
                </Button>
              </div>
            ) : (
              <>
                {/* Primary Medicine Info */}
                <div className="flex flex-col items-center pb-6 border-b border-slate-800">
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {medicineData?.medicineName || nftData?.name || "Unknown Medicine"}
                  </h2>
                  {medicineData?.manufacturerName && (
                    <p className="text-gray-400 text-sm mb-1">
                      by {medicineData.manufacturerName}
                    </p>
                  )}
                  <p className="text-cyan-400 font-mono text-sm">
                    {medicineData?.unit?.tokenId || nftData?.tokenId || tokenId}
                  </p>
                  {isDeactivated && (
                      <div className="mt-2 px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs border border-red-500/20">
                          This batch has been marked as inactive/recalled by the manufacturer.
                      </div>
                  )}
                  {medicineData && (
                    <div className="mt-4 flex gap-2">
                        <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs border border-cyan-500/20">
                            {medicineData.medicineType}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs border border-purple-500/20">
                            Batch: {medicineData.batchNumber}
                        </span>
                    </div>
                  )}
                </div>

                {/* Detailed Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Medicine Details */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                            <Package className="h-4 w-4" /> Medicine Details
                        </h3>
                        <div className="bg-slate-950/50 rounded-lg p-4 space-y-3 border border-slate-800">
                            <div className="flex justify-between">
                                <span className="text-gray-500 text-sm">Manufacturer</span>
                                <span className="text-white text-sm font-medium">{medicineData?.manufacturerName || "Unknown"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 text-sm">MRP</span>
                                <span className="text-white text-sm font-medium">${medicineData?.mrp?.toFixed(2) || "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 text-sm">Unit Serial</span>
                                <span className="text-white text-sm font-medium">#{medicineData?.unit?.serialNumber || "N/A"}</span>
                            </div>
                        </div>

                        {/* AI Section */}
                        <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-lg p-4 border border-indigo-500/20">
                          {!aiResponse ? (
                            <Button 
                              onClick={handleAskGemini} 
                              disabled={isAskingAi}
                              variant="ghost"
                              className="w-full flex items-center justify-center gap-2 text-indigo-300 hover:text-indigo-200 hover:bg-indigo-500/20"
                            >
                              {isAskingAi ? (
                                <Sparkles className="h-4 w-4 animate-spin" />
                              ) : (
                                <Bot className="h-4 w-4" />
                              )}
                              {isAskingAi ? "Analyzing Medicine..." : "Ask Gemini AI about this medicine"}
                            </Button>
                          ) : (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-indigo-300 border-b border-indigo-500/20 pb-2">
                                <Sparkles className="h-4 w-4" />
                                <span className="font-semibold text-sm">Gemini AI Insights</span>
                              </div>
                              <div className="text-xs text-gray-300 whitespace-pre-wrap leading-relaxed">
                                {aiResponse}
                              </div>
                            </div>
                          )}
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                            <Calendar className="h-4 w-4" /> Important Dates
                        </h3>
                        <div className="bg-slate-950/50 rounded-lg p-4 space-y-3 border border-slate-800">
                            <div className="flex justify-between">
                                <span className="text-gray-500 text-sm">Manufacturing Date</span>
                                <span className="text-white text-sm font-medium">{medicineData?.manufacturingDate || "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 text-sm">Expiry Date</span>
                                <span className={`text-sm font-medium ${
                                    medicineData?.expiryDate && new Date(medicineData.expiryDate) < new Date() 
                                    ? "text-red-400" 
                                    : "text-green-400"
                                }`}>
                                    {medicineData?.expiryDate || "N/A"}
                                    {medicineData?.expiryDate && new Date(medicineData.expiryDate) < new Date() && " (Expired)"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Blockchain Details */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <Info className="h-4 w-4" /> Blockchain Verification
                    </h3>
                    <div className="bg-slate-950/50 rounded-lg p-4 space-y-4 border border-slate-800">
                        <div>
                            <label className="text-xs text-gray-500 block mb-1">Owner Address</label>
                            <div className="font-mono text-xs text-cyan-400 break-all bg-cyan-950/20 p-2 rounded border border-cyan-500/10">
                                {nftData?.owner || "Loading from chain..."}
                            </div>
                        </div>
                        
                        <div>
                            <label className="text-xs text-gray-500 block mb-1">Contract Address</label>
                            <div className="font-mono text-xs text-gray-300 break-all">
                                {contractAddress}
                            </div>
                        </div>

                        {nftData?.uri && nftData.uri !== "Not available" && (
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Token URI</label>
                                <div className="text-xs text-gray-400 truncate">
                                    {nftData.uri}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <Button className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white" onClick={() => navigate("/")}>
                    Done
                  </Button>
                  <Button 
                    variant="secondary" 
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700" 
                    onClick={() => window.open(`https://amoy.polygonscan.com/token/${contractAddress}?a=${nftData?.tokenId || tokenId}`, '_blank')}
                  >
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