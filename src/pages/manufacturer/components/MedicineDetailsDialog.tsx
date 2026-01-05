import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Box, Copy } from "lucide-react";
import { toast } from "sonner";

interface MedicineDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  medicine: any;
}

export function MedicineDetailsDialog({ isOpen, onOpenChange, medicine }: MedicineDetailsDialogProps) {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  if (!medicine) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Box className="h-5 w-5 text-cyan-400" />
            Medicine Details
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Full details for {medicine.medicineName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider">Medicine Name</label>
              <div className="font-medium text-lg">{medicine.medicineName}</div>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider">Batch Number</label>
              <div className="font-mono text-cyan-400">{medicine.batchNumber}</div>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider">Type</label>
              <div className="capitalize">{medicine.medicineType}</div>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider">Quantity</label>
              <div>{medicine.quantity} units</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider">Manufacturing Date</label>
              <div>{medicine.manufacturingDate}</div>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider">Expiry Date</label>
              <div className="text-red-300">{medicine.expiryDate}</div>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider">MRP</label>
              <div>${medicine.mrp}</div>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider">Status</label>
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
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 space-y-4 pt-4 border-t border-slate-800">
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider">Token ID</label>
              <div className="flex items-center gap-2">
                <div className="font-mono text-xs bg-slate-950 p-2 rounded border border-slate-800 text-gray-300 flex-1 overflow-hidden text-ellipsis">
                  {medicine.tokenId}
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-gray-400 hover:text-white"
                  onClick={() => copyToClipboard(medicine.tokenId, "Token ID")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider">Transaction Hash</label>
              <div className="flex items-center gap-2">
                <div className="font-mono text-xs bg-slate-950 p-2 rounded border border-slate-800 text-gray-300 flex-1 overflow-hidden text-ellipsis">
                  {medicine.transactionHash}
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-gray-400 hover:text-white"
                  onClick={() => copyToClipboard(medicine.transactionHash, "Transaction Hash")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
             <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider">Contract Address</label>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="font-mono text-xs bg-slate-950 p-2 rounded border border-slate-800 text-gray-300 flex-1 break-all">
                    {medicine.contractAddress}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-gray-400 hover:text-white"
                    onClick={() => copyToClipboard(medicine.contractAddress, "Contract Address")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                {medicine.contractAddress && medicine.contractAddress.length < 42 && (
                  <div className="text-xs text-amber-500 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    Warning: This address appears to be truncated.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
