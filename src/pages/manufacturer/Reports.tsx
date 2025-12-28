import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Clock, MapPin, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

export default function ManufacturerReports() {
  const reports = useQuery(api.reports.getManufacturerReports);
  const updateStatus = useMutation(api.reports.updateReportStatus);

  const handleStatusUpdate = async (reportId: Id<"reports">, status: string) => {
    try {
      await updateStatus({ reportId, status });
      toast.success(`Report marked as ${status}`);
    } catch (error) {
      toast.error("Failed to update report status");
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h1 className="text-3xl font-bold text-white">Counterfeit Reports</h1>
        <p className="text-gray-400">Review and manage suspicious activity reports</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6">
        {reports === undefined ? (
          <div className="text-center text-gray-500 py-12">Loading reports...</div>
        ) : reports.length === 0 ? (
          <div className="text-center text-gray-500 py-12 bg-slate-900/50 rounded-xl border border-slate-800">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500/50" />
            <h3 className="text-lg font-medium text-white">No Reports Found</h3>
            <p>Great news! There are no pending counterfeit reports.</p>
          </div>
        ) : (
          reports.map((report, index) => (
            <motion.div
              key={report._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 hover:border-cyan-500/30 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-white flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-400" />
                        Suspicious Activity Reported
                      </CardTitle>
                      <CardDescription>
                        Report ID: {report._id} • {new Date(report._creationTime).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        report.status === "pending"
                          ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                          : report.status === "resolved"
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                      }
                    >
                      {report.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Medicine Details</h4>
                      <div className="text-white font-medium">
                        {report.medicine?.medicineName || "Unknown Medicine"}
                      </div>
                      <div className="text-sm text-gray-500">
                        Batch: {report.medicine?.batchNumber || "N/A"}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Report Reason</h4>
                      <p className="text-gray-300">{report.reason}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Location</h4>
                      <div className="flex items-center gap-2 text-gray-300">
                        <MapPin className="h-4 w-4 text-cyan-400" />
                        {report.location || "Location not provided"}
                      </div>
                    </div>
                    {report.description && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-1">Additional Details</h4>
                        <p className="text-gray-300 text-sm">{report.description}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
                {report.status === "pending" && (
                  <CardFooter className="flex justify-end gap-3 border-t border-slate-800 pt-4">
                    <Button
                      variant="outline"
                      className="border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                      onClick={() => handleStatusUpdate(report._id, "dismissed")}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Dismiss as False Alarm
                    </Button>
                    <Button
                      className="bg-cyan-500 hover:bg-cyan-600 text-white"
                      onClick={() => handleStatusUpdate(report._id, "resolved")}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Mark as Resolved
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
