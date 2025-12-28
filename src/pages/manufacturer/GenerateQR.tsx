import { useState } from "react";
import { ethers } from "ethers";
import { QRCodeCanvas } from "qrcode.react";
import { motion } from "framer-motion";
import { QrCode, Search, Loader2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { useWeb3 } from "@/hooks/use-web3";

// Minimal ERC721 ABI
const ERC721_ABI = [
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function name() view returns (string)"
];

export default function GenerateQR() {
  const { provider } = useWeb3();
  const [contractAddress, setContractAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedData, setGeneratedData] = useState<any>(null);
  const [verificationUrl, setVerificationUrl] = useState("");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Trim inputs to remove accidental whitespace
    const cleanAddress = contractAddress.trim();
    const cleanTokenId = tokenId.trim();

    if (!cleanAddress || !cleanTokenId) {
      toast.error("Please fill in all fields");
      return;
    }

    // Strict validation for address: Must be 42 chars, start with 0x, and be a valid address
    if (!cleanAddress.startsWith("0x") || cleanAddress.length !== 42 || !ethers.isAddress(cleanAddress)) {
      toast.error("Invalid Contract Address", {
        description: "Please enter a valid 42-character hexadecimal address. Do not use truncated addresses (e.g. 0x...123)."
      });
      return;
    }

    setLoading(true);
    setGeneratedData(null);

    try {
      // Use provided provider or fallback to public RPC
      const rpcProvider = provider || new ethers.JsonRpcProvider("https://rpc-amoy.polygon.technology/");
      
      // Checksum the address to ensure it's properly formatted
      const checksummedAddress = ethers.getAddress(cleanAddress);
      const contract = new ethers.Contract(checksummedAddress, ERC721_ABI, rpcProvider);

      // Verify NFT exists by fetching owner
      const owner = await contract.ownerOf(cleanTokenId);
      const name = await contract.name().catch(() => "Unknown Collection");

      const url = `${window.location.origin}/verify?contract=${checksummedAddress}&tokenId=${cleanTokenId}`;
      setVerificationUrl(url);
      
      setGeneratedData({
        name,
        owner,
        contractAddress: checksummedAddress,
        tokenId: cleanTokenId
      });
      
      toast.success("QR Code Generated Successfully");
    } catch (error: any) {
      console.error(error);
      
      // Handle specific errors
      if (error.code === 'UNSUPPORTED_OPERATION' && error.operation === 'getEnsAddress') {
         toast.error("Network Error", {
            description: "Could not resolve address. Please ensure the contract address is a valid 42-character hexadecimal address."
         });
      } else if (error.code === 'CALL_EXCEPTION') {
        toast.error("Contract Error", {
            description: "Could not fetch NFT data. Verify the contract address and token ID are correct."
        });
      } else {
        toast.error("Failed to fetch NFT data", {
            description: "Check the contract address and token ID, or ensure you are on the correct network."
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(verificationUrl);
    toast.success("URL copied to clipboard");
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h1 className="text-3xl font-bold text-white">Generate QR Code</h1>
        <p className="text-gray-400">Create verification QR codes for existing NFTs</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-slate-900/50 backdrop-blur-xl border border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Search className="h-5 w-5 text-cyan-400" />
                NFT Details
              </CardTitle>
              <CardDescription>Enter the NFT contract address and Token ID</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGenerate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contract" className="text-gray-300">Contract Address</Label>
                  <Input
                    id="contract"
                    placeholder="0x..."
                    value={contractAddress}
                    onChange={(e) => setContractAddress(e.target.value)}
                    className="bg-slate-950/50 border-slate-800 text-white font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tokenId" className="text-gray-300">Token ID</Label>
                  <Input
                    id="tokenId"
                    placeholder="1"
                    value={tokenId}
                    onChange={(e) => setTokenId(e.target.value)}
                    className="bg-slate-950/50 border-slate-800 text-white font-mono"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying & Generating...
                    </>
                  ) : (
                    <>
                      <QrCode className="mr-2 h-4 w-4" />
                      Generate QR Code
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {generatedData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="bg-slate-900/50 backdrop-blur-xl border border-cyan-500/20 h-full">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <QrCode className="h-5 w-5 text-purple-400" />
                  Generated QR Code
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-6">
                <div className="bg-white p-4 rounded-xl">
                  <QRCodeCanvas
                    value={verificationUrl}
                    size={200}
                    level={"H"}
                    includeMargin={true}
                  />
                </div>
                
                <div className="w-full space-y-3">
                  <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Collection:</span>
                      <span className="text-white font-medium">{generatedData.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Token ID:</span>
                      <span className="text-white font-mono">{generatedData.tokenId}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Owner:</span>
                      <span className="text-cyan-400 font-mono text-xs truncate max-w-[150px]">{generatedData.owner}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Input 
                      readOnly 
                      value={verificationUrl} 
                      className="bg-slate-950/50 border-slate-800 text-gray-400 text-xs font-mono"
                    />
                    <Button size="icon" variant="outline" onClick={copyToClipboard} className="shrink-0 border-slate-800 hover:bg-slate-800">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}