import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { AlertTriangle, MapPin, Calendar, ArrowLeft, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { PageLoader } from "@/components/PageLoader";

export default function Reports() {
  const navigate = useNavigate();
  const reports = useQuery(api.reports.getPublicReports);

  return (
    <div className="min-h-screen bg-[#030014] text-white p-4 md:p-8">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none z-0" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img 
              src="https://harmless-tapir-303.convex.cloud/api/storage/6fe7d1e8-1ae1-4599-8bb9-5c6b39e1af03" 
              alt="Logo" 
              className="h-10 w-10 object-cover rounded-full" 
            />
            <span className="font-bold text-xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-samarkan tracking-wide pt-1">
              Dhanvantari
            </span>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <ShieldAlert className="h-10 w-10 text-red-500" />
            Public Counterfeit Reports
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Transparency is key to safety. View recent reports of suspicious medicines submitted by our community.
          </p>
        </motion.div>

        {reports === undefined ? (
          <div className="flex justify-center py-20">
            <PageLoader className="bg-transparent" />
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-slate-800">
            <ShieldAlert className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-300">No Reports Yet</h3>
            <p className="text-gray-500 mt-2">Be the first to report suspicious activity if you spot it.</p>
            <Button 
              className="mt-6 bg-cyan-500 hover:bg-cyan-600"
              onClick={() => navigate("/")}
            >
              Submit a Report
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report, index) => (
              <motion.div
                key={report._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 hover:border-red-500/30 transition-all duration-300 h-full">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <Badge 
                        variant="outline" 
                        className="bg-red-500/10 text-red-400 border-red-500/20 mb-2"
                      >
                        {report.reason.replace(/_/g, " ").toUpperCase()}
                      </Badge>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(report._creationTime).toLocaleDateString()}
                      </span>
                    </div>
                    <CardTitle className="text-white text-lg leading-tight">
                      {report.medicineName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {report.batchNumber && (
                      <div className="text-sm text-gray-400">
                        Batch: <span className="text-gray-300 font-mono">{report.batchNumber}</span>
                      </div>
                    )}
                    
                    {report.location && (
                      <div className="flex items-start gap-2 text-sm text-gray-400">
                        <MapPin className="h-4 w-4 text-cyan-500 shrink-0 mt-0.5" />
                        <span>{report.location}</span>
                      </div>
                    )}

                    {report.description && (
                      <div className="bg-black/20 p-3 rounded-lg text-sm text-gray-300 italic">
                        "{report.description}"
                      </div>
                    )}

                    <div className="pt-2 flex items-center justify-between border-t border-white/5 mt-2">
                      <span className="text-xs text-gray-500">Status</span>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${
                          report.status === "resolved" 
                            ? "bg-green-500/10 text-green-400" 
                            : report.status === "reviewed"
                            ? "bg-blue-500/10 text-blue-400"
                            : "bg-yellow-500/10 text-yellow-400"
                        }`}
                      >
                        {report.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
