import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Box, Calendar, MoreVertical, FileText, ExternalLink, Ban, CheckCircle, Trash2 } from "lucide-react";

interface MedicinesTableProps {
  medicines: any[] | undefined;
  onViewDetails: (medicine: any) => void;
  onToggleStatus: (id: any, currentStatus: boolean) => void;
  onDelete: (medicine: any) => void;
  onOpenBlockchain: (txHash: string) => void;
}

export function MedicinesTable({ 
  medicines, 
  onViewDetails, 
  onToggleStatus, 
  onDelete, 
  onOpenBlockchain 
}: MedicinesTableProps) {
  return (
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
                        onClick={() => onViewDetails(medicine)}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="hover:bg-slate-800 focus:bg-slate-800 cursor-pointer"
                        onClick={() => onOpenBlockchain(medicine.transactionHash)}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View on Blockchain
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className={`hover:bg-slate-800 focus:bg-slate-800 cursor-pointer ${medicine.isActive ? "text-yellow-400" : "text-green-400"}`}
                        onClick={() => onToggleStatus(medicine._id, medicine.isActive)}
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
                        onClick={() => onDelete(medicine)}
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
  );
}
