import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { Plus, Search, Wallet, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useWeb3 } from "@/hooks/use-web3";
import { MedicinesTable } from "./components/MedicinesTable";
import { MedicineDetailsDialog } from "./components/MedicineDetailsDialog";
import { DeleteMedicineDialog } from "./components/DeleteMedicineDialog";

export default function ManufacturerMedicines() {
  const medicines = useQuery(api.medicines.getManufacturerMedicines);
  const toggleStatus = useMutation(api.medicines.toggleMedicineStatus);
  const deleteMedicine = useMutation(api.medicines.deleteMedicine);
  const { account, connectWallet, disconnectWallet } = useWeb3();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [medicineToDelete, setMedicineToDelete] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleToggleStatus = async (id: any, currentStatus: boolean) => {
    try {
      await toggleStatus({ id, isActive: !currentStatus });
      toast.success(`Medicine ${!currentStatus ? "activated" : "deactivated"} successfully`);
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    }
  };

  const handleDeleteMedicine = async () => {
    if (!medicineToDelete) return;
    try {
      await deleteMedicine({ id: medicineToDelete._id });
      toast.success("Medicine deleted successfully");
      setIsDeleteDialogOpen(false);
      setMedicineToDelete(null);
    } catch (error) {
      toast.error("Failed to delete medicine");
      console.error(error);
    }
  };

  const filteredMedicines = medicines?.filter((medicine) => 
    medicine.medicineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    medicine.batchNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openBlockchain = (txHash: string) => {
    if (!txHash) {
        toast.error("No transaction hash available");
        return;
    }
    // Using OKLink for Amoy testnet
    window.open(`https://www.oklink.com/amoy/tx/${txHash}`, "_blank");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-bold text-white">My Medicines</h1>
          <p className="text-gray-400">Manage your minted medicine NFTs</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          {account ? (
            <Button 
              variant="outline" 
              onClick={disconnectWallet}
              className="border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10"
            >
              <Wallet className="mr-2 h-4 w-4" />
              {account.slice(0, 6)}...{account.slice(-4)}
              <LogOut className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button 
              variant="outline" 
              onClick={connectWallet}
              className="border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10"
            >
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </Button>
          )}
          <Link to="/manufacturer/create">
            <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Mint New Medicine
            </Button>
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-xl overflow-hidden"
      >
        <div className="p-4 border-b border-cyan-500/20 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search medicines by name or batch..."
              className="pl-9 bg-slate-950/50 border-slate-800 focus:border-cyan-500/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <MedicinesTable 
          medicines={filteredMedicines}
          onViewDetails={(medicine) => {
            setSelectedMedicine(medicine);
            setIsDetailsOpen(true);
          }}
          onToggleStatus={handleToggleStatus}
          onDelete={(medicine) => {
            setMedicineToDelete(medicine);
            setIsDeleteDialogOpen(true);
          }}
          onOpenBlockchain={openBlockchain}
        />
      </motion.div>

      <MedicineDetailsDialog 
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        medicine={selectedMedicine}
      />

      <DeleteMedicineDialog 
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        medicine={medicineToDelete}
        onConfirm={handleDeleteMedicine}
      />
    </div>
  );
}