import { motion } from "framer-motion";
import { XCircle, AlertTriangle, ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router";

export default function NotVerified() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 py-12">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none z-0" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-red-500/10 rounded-full mb-4">
            <ShieldAlert className="h-10 w-10 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-red-500">
            Verification Failed
          </h1>
        </div>

        <Card className="bg-slate-900/80 backdrop-blur-xl border border-red-500/20 shadow-2xl shadow-red-900/20">
          <CardHeader>
            <CardTitle className="text-center text-white flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-red-400">
                <XCircle className="h-6 w-6" />
                <span>Not Verified</span>
              </div>
              <span className="text-sm font-normal text-gray-400">
                This product could not be verified against our records.
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-4 flex gap-3 items-start">
              <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="font-medium text-red-400 text-sm">Potential Counterfeit Warning</h3>
                <p className="text-xs text-red-300/80 leading-relaxed">
                  The QR code you scanned does not match any authentic medicine batch in the blockchain registry. This product may be counterfeit, expired, or tampered with.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-400">Recommended Actions:</h4>
              <ul className="text-sm text-gray-300 space-y-2 list-disc pl-4">
                <li>Do not consume this medicine.</li>
                <li>Check the packaging for signs of tampering.</li>
                <li>Contact the manufacturer or retailer immediately.</li>
                <li>Report this incident to local health authorities.</li>
              </ul>
            </div>

            <div className="pt-4">
              <Button 
                className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700" 
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
