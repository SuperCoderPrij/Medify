import { useState, useRef } from "react";
import { ethers } from "ethers";
import { QRCodeCanvas } from "qrcode.react";
import { motion } from "framer-motion";
import { QrCode, Search, Loader2, Copy, Download, Box, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useWeb3 } from "@/hooks/use-web3";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

// Minimal ERC721 ABI
const ERC721_ABI = [
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function name() view returns (string)"
];

export default function GenerateQR() {
  const { provider } = useWeb3();
  const medicines = useQuery(api.medicines.getManufacturerMedicines);
  
  // Manual Mode State
  const [contractAddress, setContractAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedData, setGeneratedData] = useState<any>(null);
  const [verificationUrl, setVerificationUrl] = useState("");

  // Batch Mode State
  const [selectedMedicineId, setSelectedMedicineId] = useState<string>("");
  const medicineUnits = useQuery(api.medicines.getMedicineUnits, 
    selectedMedicineId ? { medicineId: selectedMedicineId as Id<"medicines"> } : "skip"
  );
  const [isDownloading, setIsDownloading] = useState(false);

  // Manual Generation Handler
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const cleanAddress = contractAddress.trim();
    const cleanTokenId = tokenId.trim();

    if (!cleanAddress || !cleanTokenId) {
      toast.error("Please fill in all fields");
      return;
    }

    console.log("Validating address:", cleanAddress);

    if (cleanAddress.includes("...")) {
      toast.error("Truncated Address Detected", {
        description: "It looks like you pasted a truncated address. Please use the full address."
      });
      return;
    }

    if (!cleanAddress.startsWith("0x")) {
      toast.error("Invalid Address Format", {
        description: "Address must start with '0x'"
      });
      return;
    }

    if (cleanAddress.length !== 42) {
      toast.error("Invalid Address Length", {
        description: `Address must be 42 characters long. Current length: ${cleanAddress.length}`
      });
      return;
    }

    if (!ethers.isAddress(cleanAddress)) {
      toast.error("Invalid Address", {
        description: "The address is not a valid Ethereum address. Check for typos or checksum errors."
      });
      return;
    }

    setLoading(true);
    setGeneratedData(null);

    try {
      const rpcProvider = provider || new ethers.JsonRpcProvider("https://rpc-amoy.polygon.technology/");
      const checksummedAddress = ethers.getAddress(cleanAddress);
      const contract = new ethers.Contract(checksummedAddress, ERC721_ABI, rpcProvider);

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
      if (error.code === 'UNSUPPORTED_OPERATION' && error.operation === 'getEnsAddress') {
         toast.error("Network Error", {
            description: "Could not resolve address. Please ensure the contract address is a valid 42-character hexadecimal address."
         });
      } else {
        toast.error("Failed to fetch NFT data", {
            description: "Check the contract address and token ID."
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

  const downloadBatchQRs = async () => {
    if (!medicineUnits || medicineUnits.length === 0) return;
    
    setIsDownloading(true);
    
    try {
      // Dynamically import JSZip
      const JSZipModule = await import("jszip");
      const JSZip = JSZipModule.default || JSZipModule;
      
      const zip = new JSZip();
      const folder = zip.folder("qr-codes");
      
      if (!folder) throw new Error("Failed to create zip folder");

      let count = 0;
      
      // Generate QR for each unit
      for (const unit of medicineUnits) {
        const canvas = document.getElementById(`qr-canvas-${unit.tokenId}`) as HTMLCanvasElement;
        if (canvas) {
          try {
            const dataUrl = canvas.toDataURL("image/png");
            const base64Data = dataUrl.split(',')[1];
            folder.file(`${unit.tokenId}.png`, base64Data, { base64: true });
            count++;
          } catch (e) {
            console.warn("Canvas export failed for unit:", unit.tokenId);
          }
        }
      }
      
      if (count === 0) {
        toast.error("No QR codes found to download", {
          description: "Please ensure QR codes are visible on screen."
        });
        return;
      }

      const content = await zip.generateAsync({ type: "blob" });
      const fileName = `batch-${selectedMedicineId}-qrs.zip`;
      
      // Direct download using anchor tag
      const url = window.URL.createObjectURL(content);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.style.display = "none";
      document.body.appendChild(link);
      
      link.click();
      
      // Cleanup after a short delay
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
      
      toast.success("Download started", {
        description: `${count} QR codes zipped.`
      });
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download QR codes");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h1 className="text-3xl font-bold text-white">Generate QR Codes</h1>
        <p className="text-gray-400">Create verification QR codes for your medicines</p>
      </motion.div>

      <Tabs defaultValue="batch" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-900/50 border border-cyan-500/20">
          <TabsTrigger value="batch" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
            <Layers className="mr-2 h-4 w-4" />
            Batch Generation
          </TabsTrigger>
          <TabsTrigger value="manual" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
            <QrCode className="mr-2 h-4 w-4" />
            Manual Entry
          </TabsTrigger>
        </TabsList>

        <TabsContent value="batch" className="space-y-6 mt-6">
          <Card className="bg-slate-900/50 backdrop-blur-xl border border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Box className="h-5 w-5 text-cyan-400" />
                Select Medicine Batch
              </CardTitle>
              <CardDescription>Choose a medicine batch to generate QR codes for all units</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-gray-300">Medicine Batch</Label>
                <Select onValueChange={setSelectedMedicineId} value={selectedMedicineId}>
                  <SelectTrigger className="bg-slate-950/50 border-slate-800 text-white">
                    <SelectValue placeholder="Select a medicine..." />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-white">
                    {medicines?.map((medicine) => (
                      <SelectItem key={medicine._id} value={medicine._id}>
                        {medicine.medicineName} (Batch: {medicine.batchNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedMedicineId && medicineUnits && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      Found {medicineUnits.length} units
                    </div>
                    <Button 
                      type="button"
                      onClick={downloadBatchQRs} 
                      disabled={isDownloading || medicineUnits.length === 0}
                      className="bg-cyan-500 hover:bg-cyan-600 text-white"
                    >
                      {isDownloading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="mr-2 h-4 w-4" />
                      )}
                      Download All QRs
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {medicineUnits.map((unit) => (
                      <div key={unit._id} className="bg-slate-950/50 p-4 rounded-lg border border-slate-800 flex flex-col items-center gap-3">
                        <div className="bg-white p-2 rounded">
                          <QRCodeCanvas
                            id={`qr-canvas-${unit.tokenId}`}
                            value={`${window.location.origin}/verify?contract=${JSON.parse(unit.qrCodeData).contract}&tokenId=${unit.tokenId}`}
                            size={120}
                            level={"M"}
                            includeMargin={true}
                          />
                        </div>
                        <div className="text-center w-full">
                          <div className="text-xs text-gray-400 font-mono truncate w-full" title={unit.tokenId}>
                            {unit.tokenId}
                          </div>
                          <div className="text-xs text-cyan-500">Unit #{unit.serialNumber}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
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
        </TabsContent>
      </Tabs>
    </div>
  );
}