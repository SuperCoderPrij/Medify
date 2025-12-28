import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { Box, Calendar, MoreVertical, Plus, Search, ExternalLink, Ban, CheckCircle, FileText, Trash2, Wallet, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useWeb3 } from "@/hooks/use-web3";

export default function ManufacturerMedicines() {
  const medicines = useQuery(api.medicines.getManufacturerMedicines);
  const toggleStatus = useMutation(api.medicines.toggleMedicineStatus);
  const deleteMedicine = useMutation(api.medicines.deleteMedicine);
  const { account, connectWallet, disconnectWallet } = useWeb3();
  
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
              placeholder="Search medicines..."
              className="pl-9 bg-slate-950/50 border-slate-800 focus:border-cyan-500/50"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-950/50">
              <TableRow className="hover:bg-transparent border-cyan-500/20">
                <TableHead className="text-gray-400">Medicine Name</TableHead>
                <TableHead className="text-gray-400">Batch No.</TableHead>
                <TableHead className="text-gray-400">Type</TableHead>
                <TableHead className="text-gray-400">Expiry Date</TableHead>
                <TableHead className="text-gray-400">Quantity</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medicines === undefined ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                    Loading medicines...
                  </TableCell>
                </TableRow>
              ) : medicines.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-gray-500">
                    No medicines found. Mint your first medicine NFT!
                  </TableCell>
                </TableRow>
              ) : (
                medicines.map((medicine) => (
                  <TableRow key={medicine._id} className="hover:bg-slate-800/50 border-slate-800">
                    <TableCell className="font-medium text-white">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                          <Box className="h-4 w-4" />
                        </div>
                        {medicine.medicineName}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">{medicine.batchNumber}</TableCell>
                    <TableCell className="text-gray-300 capitalize">{medicine.medicineType}</TableCell>
                    <TableCell className="text-gray-300">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-gray-500" />
                        {medicine.expiryDate}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">{medicine.quantity}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          medicine.isActive
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                        }
                      >
                        {medicine.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-gray-300">
                          <DropdownMenuItem 
                            className="hover:bg-slate-800 focus:bg-slate-800 cursor-pointer"
                            onClick={() => {
                              setSelectedMedicine(medicine);
                              setIsDetailsOpen(true);
                            }}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="hover:bg-slate-800 focus:bg-slate-800 cursor-pointer"
                            onClick={() => openBlockchain(medicine.transactionHash)}
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View on Blockchain
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className={`hover:bg-slate-800 focus:bg-slate-800 cursor-pointer ${medicine.isActive ? "text-yellow-400" : "text-green-400"}`}
                            onClick={() => handleToggleStatus(medicine._id, medicine.isActive)}
                          >
                            {medicine.isActive ? (
                              <>
                                <Ban className="mr-2 h-4 w-4" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="hover:bg-slate-800 focus:bg-slate-800 cursor-pointer text-red-400 focus:text-red-400"
                            onClick={() => {
                              setMedicineToDelete(medicine);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </motion.div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Box className="h-5 w-5 text-cyan-400" />
              Medicine Details
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Full details for {selectedMedicine?.medicineName}
            </DialogDescription>
          </DialogHeader>
          
          {selectedMedicine && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">Medicine Name</label>
                  <div className="font-medium text-lg">{selectedMedicine.medicineName}</div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">Batch Number</label>
                  <div className="font-mono text-cyan-400">{selectedMedicine.batchNumber}</div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">Type</label>
                  <div className="capitalize">{selectedMedicine.medicineType}</div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">Quantity</label>
                  <div>{selectedMedicine.quantity} units</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">Manufacturing Date</label>
                  <div>{selectedMedicine.manufacturingDate}</div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">Expiry Date</label>
                  <div className="text-red-300">{selectedMedicine.expiryDate}</div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">MRP</label>
                  <div>${selectedMedicine.mrp}</div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">Status</label>
                  <Badge
                    variant="outline"
                    className={
                      selectedMedicine.isActive
                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                        : "bg-red-500/10 text-red-400 border-red-500/20"
                    }
                  >
                    {selectedMedicine.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>

              <div className="col-span-1 md:col-span-2 space-y-4 pt-4 border-t border-slate-800">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">Token ID</label>
                  <div className="font-mono text-xs bg-slate-950 p-2 rounded border border-slate-800 text-gray-300">
                    {selectedMedicine.tokenId}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">Transaction Hash</label>
                  <div className="font-mono text-xs bg-slate-950 p-2 rounded border border-slate-800 text-gray-300 break-all">
                    {selectedMedicine.transactionHash}
                  </div>
                </div>
                 <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">Contract Address</label>
                  <div className="font-mono text-xs bg-slate-950 p-2 rounded border border-slate-800 text-gray-300 break-all">
                    {selectedMedicine.contractAddress}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white">
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription className="text-gray-400">
              This action cannot be undone. This will permanently delete the medicine record
              for <span className="text-white font-medium">{medicineToDelete?.medicineName}</span> from the database.
              <br /><br />
              Note: The NFT on the blockchain will remain, but it will no longer be tracked in this system.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button variant="outline" className="bg-transparent border-slate-700 text-white hover:bg-slate-800 hover:text-white">
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleDeleteMedicine}
              className="bg-red-500 hover:bg-red-600 text-white border-0"
            >
              Delete Medicine
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}