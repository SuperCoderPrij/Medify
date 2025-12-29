import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useWeb3, POLYGON_AMOY_CHAIN_ID } from "@/hooks/use-web3";
import { ethers } from "ethers";
import { PHARMA_NFT_ABI, PHARMA_NFT_ADDRESS } from "@/lib/blockchain";

export default function CreateMedicine() {
  const navigate = useNavigate();
  const createMedicine = useMutation(api.medicines.createMedicine);
  const user = useQuery(api.users.currentUser);
  const { account, connectWallet, chainId, switchToAmoy, provider } = useWeb3();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    if (!account) {
      toast.error("Wallet not connected", {
        description: "Please connect your MetaMask wallet to mint NFTs."
      });
      connectWallet();
      return;
    }

    if (chainId !== POLYGON_AMOY_CHAIN_ID) {
      toast.error("Wrong Network", {
        description: "Please switch to Polygon Amoy Testnet."
      });
      switchToAmoy();
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const quantity = Number(formData.get("quantity"));

    // For real blockchain transactions, we might want to limit batch size or handle it differently
    // Since we are minting 1 NFT per batch in this simplified logic (or loop for units?)
    // The prompt says "Manufacturer mints NFT". Usually 1 NFT = 1 Batch or 1 Unit.
    // The contract supports minting individual items. 
    // For this demo, let's assume we mint ONE NFT representing the BATCH for simplicity and gas costs,
    // OR we loop. The prompt says "NFT generation MUST be implemented".
    // Let's mint ONE NFT for the Batch to keep it usable on testnet without waiting for 100 txs.
    
    try {
      const signer = await provider?.getSigner();
      if (!signer) throw new Error("No signer available");

      const contract = new ethers.Contract(PHARMA_NFT_ADDRESS, PHARMA_NFT_ABI, signer);

      const medicineName = formData.get("medicineName") as string;
      const batchNumber = formData.get("batchNumber") as string;
      const manufacturerName = user.name || "Unknown Manufacturer";
      const expiryDate = formData.get("expiryDate") as string;
      const manufacturingDate = formData.get("manufacturingDate") as string;
      const medicineType = formData.get("medicineType") as string;
      const mrp = Number(formData.get("mrp"));

      // Create Metadata (On-chain via Data URI for simplicity, or IPFS)
      const metadata = {
        name: `${medicineName} - Batch ${batchNumber}`,
        description: `Authentic ${medicineName} manufactured by ${manufacturerName}`,
        image: "https://vly.ai/logo.png", // Placeholder image
        attributes: [
            { trait_type: "Batch", value: batchNumber },
            { trait_type: "Manufacturer", value: manufacturerName },
            { trait_type: "Expiry", value: expiryDate },
            { trait_type: "Type", value: medicineType }
        ]
      };

      const tokenURI = `data:application/json;base64,${btoa(JSON.stringify(metadata))}`;
      const medicineIdUUID = crypto.randomUUID(); // Internal ID reference

      toast.info("Confirm Transaction", {
        description: "Please confirm the minting transaction in MetaMask..."
      });

      // Call Smart Contract
      const tx = await contract.mintMedicine(
        account,
        tokenURI,
        medicineIdUUID,
        batchNumber,
        manufacturerName,
        expiryDate,
        manufacturingDate
      );

      toast.loading("Minting in progress...", {
        description: "Waiting for blockchain confirmation..."
      });

      const receipt = await tx.wait();
      
      // Get Token ID from events
      // Event: MedicineMinted(uint256 indexed tokenId, string batchNumber, address manufacturer)
      let tokenId = "";
      for (const log of receipt.logs) {
        try {
            const parsed = contract.interface.parseLog(log);
            if (parsed && parsed.name === "MedicineMinted") {
                tokenId = parsed.args[0].toString();
                break;
            }
        } catch (e) { continue; }
      }

      if (!tokenId) throw new Error("Failed to retrieve Token ID from transaction logs");

      // Save to Convex (Digital Twin)
      await createMedicine({
        medicineName,
        manufacturerName,
        batchNumber,
        medicineType,
        manufacturingDate,
        expiryDate,
        mrp,
        quantity: quantity, // We still track quantity in DB, even if we minted 1 Batch NFT
        tokenId: tokenId,
        transactionHash: receipt.hash,
        contractAddress: PHARMA_NFT_ADDRESS,
        qrCodeData: JSON.stringify({
          contract: PHARMA_NFT_ADDRESS,
          tokenId: tokenId,
          batch: batchNumber
        }),
      });

      toast.success("Medicine Minted Successfully", {
        description: `Token ID: ${tokenId} minted on Polygon Amoy.`
      });
      navigate("/manufacturer/medicines");
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to mint medicine", {
        description: error.reason || error.message || "Transaction failed"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Link to="/manufacturer/medicines">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Mint New Medicine</h1>
          <p className="text-gray-400">Create a digital twin NFT for your medicine batch</p>
        </div>
      </motion.div>

      {!account && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-yellow-400" />
            <div>
              <h3 className="font-medium text-yellow-400">Wallet Connection Required</h3>
              <p className="text-sm text-yellow-400/80">You need to connect your MetaMask wallet to mint NFTs.</p>
            </div>
          </div>
          <Button 
            onClick={connectWallet}
            variant="outline" 
            className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
          >
            Connect Wallet
          </Button>
        </motion.div>
      )}

      {account && chainId !== POLYGON_AMOY_CHAIN_ID && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-purple-400" />
            <div>
              <h3 className="font-medium text-purple-400">Wrong Network</h3>
              <p className="text-sm text-purple-400/80">Please switch to Polygon Amoy Testnet to mint NFTs.</p>
            </div>
          </div>
          <Button 
            onClick={switchToAmoy}
            variant="outline" 
            className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
          >
            Switch Network
          </Button>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-slate-900/50 backdrop-blur-xl border border-cyan-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Shield className="h-5 w-5 text-cyan-400" />
              Batch Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="medicineName" className="text-gray-300">Medicine Name</Label>
                  <Input
                    id="medicineName"
                    name="medicineName"
                    placeholder="e.g. Amoxicillin 500mg"
                    className="bg-slate-950/50 border-slate-800 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="batchNumber" className="text-gray-300">Batch Number</Label>
                  <Input
                    id="batchNumber"
                    name="batchNumber"
                    placeholder="e.g. BATCH-2024-001"
                    className="bg-slate-950/50 border-slate-800 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medicineType" className="text-gray-300">Type</Label>
                  <Select name="medicineType" required>
                    <SelectTrigger className="bg-slate-950/50 border-slate-800 text-white">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-white">
                      <SelectItem value="tablet">Tablet</SelectItem>
                      <SelectItem value="capsule">Capsule</SelectItem>
                      <SelectItem value="syrup">Syrup</SelectItem>
                      <SelectItem value="injection">Injection</SelectItem>
                      <SelectItem value="ointment">Ointment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-gray-300">Quantity (Units)</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    max="100"
                    placeholder="e.g. 50"
                    className="bg-slate-950/50 border-slate-800 text-white"
                    required
                  />
                  <p className="text-xs text-gray-500">Max 100 units for this demo</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manufacturingDate" className="text-gray-300">Manufacturing Date</Label>
                  <Input
                    id="manufacturingDate"
                    name="manufacturingDate"
                    type="date"
                    className="bg-slate-950/50 border-slate-800 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryDate" className="text-gray-300">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    name="expiryDate"
                    type="date"
                    className="bg-slate-950/50 border-slate-800 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mrp" className="text-gray-300">MRP ($)</Label>
                  <Input
                    id="mrp"
                    name="mrp"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="bg-slate-950/50 border-slate-800 text-white"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <Button
                  type="submit"
                  disabled={isSubmitting || !account || chainId !== POLYGON_AMOY_CHAIN_ID}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white py-6 text-lg font-semibold shadow-[0_0_20px_rgba(34,211,238,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Minting Batch NFTs...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Mint Medicine Batch
                    </>
                  )}
                </Button>
                <p className="text-center text-xs text-gray-500 mt-4">
                  This action will create a permanent record on the blockchain.
                  Gas fees may apply.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}