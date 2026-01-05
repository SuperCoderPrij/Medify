import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";

interface DeleteMedicineDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  medicine: any;
  onConfirm: () => void;
}

export function DeleteMedicineDialog({ isOpen, onOpenChange, medicine, onConfirm }: DeleteMedicineDialogProps) {
  if (!medicine) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-800 text-white">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription className="text-gray-400">
            This action cannot be undone. This will permanently delete the medicine record
            for <span className="text-white font-medium">{medicine.medicineName}</span> from the database.
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
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 text-white border-0"
          >
            Delete Medicine
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
