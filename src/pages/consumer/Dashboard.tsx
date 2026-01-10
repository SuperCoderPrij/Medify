import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { AlertTriangle, Camera, CheckCircle, History, QrCode, Search, Shield, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, lazy, Suspense } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const QRScanner = lazy(() => import("@/components/QRScanner"));

export default function ConsumerDashboard() {
  const { user } = useAuth();
  const [isScanning, setIsScanning] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [scanResult, setScanResult] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const scanHistory = useQuery(api.scans.getUserScanHistory, { limit: 10 });
  const recordScan = useMutation(api.scans.recordScan);
  const getMedicineByQR = useQuery(api.medicines.getMedicineByQRCode, 
    manualCode ? { qrCodeData: manualCode } : "skip"
  );

  // Handle successful scan from QRScanner
  const handleScanSuccess = async (decodedText: string) => {
    console.log("Scanned:", decodedText);
    
    // Validate QR Code
    const isValidUrl = decodedText.includes("/verify?");
    let isValidJson = false;
    try {
      const parsed = JSON.parse(decodedText);
      if (parsed.id || parsed.batch || parsed.contract) isValidJson = true;
    } catch (e) {
      // Not JSON
    }

    if (!isValidUrl && !isValidJson) {
      toast.error("Invalid QR Code. Please scan a valid Dhanvantari medicine QR code.");
      return;
    }
    
    // Check if it's a verification URL
    if (decodedText.includes("/verify?")) {
      window.location.href = decodedText;
      return;
    }

    // Otherwise treat as raw data (legacy/manual format)
    setManualCode(decodedText);
    // The useEffect or manual trigger will handle the rest, but let's trigger verification directly
    // We need to wait for the query to update if we rely on manualCode state, 
    // but for immediate feedback we might want to parse it if it's JSON
    try {
        const parsed = JSON.parse(decodedText);
        // If it's our JSON format
        if (parsed.id) {
            // It's likely our internal format
            // We can set manualCode to trigger the query
            setManualCode(decodedText);
        }
    } catch (e) {
        // Not JSON, maybe just an ID
        setManualCode(decodedText);
    }
    
    setIsDialogOpen(false);
    toast.success("QR Code Scanned!");
  };

  const handleSimulateScan = async () => {
    setIsScanning(true);
    // Simulate scanning delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For demo purposes, we'll try to find a medicine with the entered code
    // In a real app, this would come from the camera
    if (!manualCode) {
      toast.error("Please enter a QR code or Batch ID to simulate scan");
      setIsScanning(false);
      return;
    }

    try {
      // The query `getMedicineByQR` runs automatically when `manualCode` changes
      // We just need to react to the result
      if (getMedicineByQR) {
        await recordScan({
          medicineId: getMedicineByQR._id,
          scanResult: "genuine",
          location: "Web Dashboard",
          deviceInfo: navigator.userAgent,
        });
        setScanResult({ status: "genuine", medicine: getMedicineByQR });
        toast.success("Medicine Verified: Genuine");
      } else {
        // If we can't find it, it might be counterfeit (or just doesn't exist in our DB)
        setScanResult({ status: "unknown" });
        toast.warning("Medicine not found in registry");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error processing scan");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 pb-20">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none z-0" />
      
      <div className="max-w-md mx-auto relative z-10 space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <img 
              src="https://harmless-tapir-303.convex.cloud/api/storage/2a6ec2fc-0b6b-4926-a3a2-316eccd24c4f" 
              alt="Logo" 
              className="h-8 w-8 object-contain" 
            />
            <span className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Dhanvantari
            </span>
          </div>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-xs font-bold">
            {user?.name?.[0] || "U"}
          </div>
        </header>

        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold mb-1">Hello, {user?.name || "Consumer"}</h1>
          <p className="text-gray-400">Verify your medicines instantly.</p>
        </motion.div>

        {/* Scan Action */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border-cyan-500/30 backdrop-blur-xl overflow-hidden">
            <CardContent className="p-6 text-center space-y-6">
              <div className="h-32 w-32 mx-auto bg-cyan-500/20 rounded-full flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-full border-2 border-cyan-500/50 animate-ping" />
                <QrCode className="h-16 w-16 text-cyan-400" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white">Scan Medicine</h2>
                <p className="text-sm text-gray-400">Point your camera at the QR code on the medicine pack</p>
              </div>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white py-6 text-lg shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                    <Camera className="mr-2 h-5 w-5" />
                    Scan Now
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Scan Medicine QR</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <Suspense fallback={<div className="p-8 text-center text-gray-400">Loading Scanner...</div>}>
                      <QRScanner 
                        onScanSuccess={handleScanSuccess} 
                        onScanFailure={(err) => console.log(err)}
                      />
                    </Suspense>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-400">Or enter QR Data / Batch ID manually:</p>
                      <div className="flex gap-2">
                        <Input 
                          value={manualCode}
                          onChange={(e) => setManualCode(e.target.value)}
                          placeholder='e.g. {"id":"NFT-..."}'
                          className="bg-slate-950 border-slate-800"
                        />
                        <Button onClick={handleSimulateScan} disabled={isScanning}>
                          {isScanning ? "Verifying..." : "Verify"}
                        </Button>
                      </div>
                    </div>
                    
                    {scanResult && (
                      <div className={`p-4 rounded-lg border ${
                        scanResult.status === "genuine" 
                          ? "bg-green-500/10 border-green-500/30" 
                          : "bg-red-500/10 border-red-500/30"
                      }`}>
                        <div className="flex items-center gap-3 mb-2">
                          {scanResult.status === "genuine" ? (
                            <CheckCircle className="h-6 w-6 text-green-400" />
                          ) : (
                            <AlertTriangle className="h-6 w-6 text-red-400" />
                          )}
                          <span className="font-bold text-lg capitalize">
                            {scanResult.status === "genuine" ? "Authentic Medicine" : "Verification Failed"}
                          </span>
                        </div>
                        {scanResult.medicine && (
                          <div className="text-sm space-y-1 text-gray-300">
                            <p>Name: <span className="text-white">{scanResult.medicine.medicineName}</span></p>
                            <p>Batch: <span className="text-white">{scanResult.medicine.batchNumber}</span></p>
                            <p>Expiry: <span className="text-white">{scanResult.medicine.expiryDate}</span></p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Scans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <History className="h-4 w-4 text-cyan-400" />
              Recent Scans
            </h3>
            <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300">View All</Button>
          </div>

          <div className="space-y-3">
            {scanHistory === undefined ? (
              <div className="text-center py-8 text-gray-500">Loading history...</div>
            ) : scanHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500 bg-slate-900/50 rounded-xl border border-slate-800">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No scans yet</p>
              </div>
            ) : (
              scanHistory.map((scan) => (
                <div
                  key={scan._id}
                  className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex items-center justify-between hover:border-cyan-500/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      scan.scanResult === "genuine" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                    }`}>
                      {scan.scanResult === "genuine" ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                    </div>
                    <div>
                      <div className="font-medium text-white">
                        {scan.medicine?.medicineName || "Unknown Item"}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(scan._creationTime).toLocaleDateString()} • {new Date(scan._creationTime).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className={
                    scan.scanResult === "genuine" 
                      ? "border-green-500/20 text-green-400" 
                      : "border-red-500/20 text-red-400"
                  }>
                    {scan.scanResult}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}