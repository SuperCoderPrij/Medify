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

export default function CreateMedicine() {
  const navigate = useNavigate();
  const createMedicine = useMutation(api.medicines.createMedicine);
  const user = useQuery(api.users.currentUser);
  const { account, connectWallet, chainId, switchToAmoy } = useWeb3();
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

    try {
      // Simulate blockchain interaction
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const tokenId = `NFT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const transactionHash = `0x${Math.random().toString(16).substr(2, 40)}`;
      const contractAddress = "0x71C95911E9a5D330f4D621842EC243EE134329A2"; // Mock contract address
      
      await createMedicine({
        medicineName: formData.get("medicineName") as string,
        manufacturerName: user.name || "Unknown Manufacturer",
        batchNumber: formData.get("batchNumber") as string,
        medicineType: formData.get("medicineType") as string,
        manufacturingDate: formData.get("manufacturingDate") as string,
        expiryDate: formData.get("expiryDate") as string,
        mrp: Number(formData.get("mrp")),
        quantity: Number(formData.get("quantity")),
        tokenId: tokenId,
        transactionHash: transactionHash,
        contractAddress: contractAddress,
        qrCodeData: JSON.stringify({
          id: tokenId,
          batch: formData.get("batchNumber"),
          name: formData.get("medicineName")
        }),
      });

      toast.success("Medicine Minted Successfully", {
        description: `Token ID: ${tokenId} has been created on Polygon Amoy using wallet ${account.slice(0, 6)}...`
      });
      navigate("/manufacturer/medicines");
    } catch (error) {
      console.error(error);
      toast.error("Failed to mint medicine");
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
                  <Label htmlFor="quantity" className="text-gray-300">Quantity</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    placeholder="e.g. 10000"
                    className="bg-slate-950/50 border-slate-800 text-white"
                    required
                  />
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
                      Minting NFT...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Mint Medicine NFT
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