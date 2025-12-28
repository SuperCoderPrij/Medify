import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { Box, Calendar, MoreVertical, Plus, Search } from "lucide-react";
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

export default function ManufacturerMedicines() {
  const medicines = useQuery(api.medicines.getManufacturerMedicines);

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
        >
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
                          <DropdownMenuItem className="hover:bg-slate-800 focus:bg-slate-800 cursor-pointer">
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-slate-800 focus:bg-slate-800 cursor-pointer">
                            View on Blockchain
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-slate-800 focus:bg-slate-800 cursor-pointer text-red-400">
                            Deactivate
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
    </div>
  );
}
