import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Image, Loader2, RefreshCw } from "lucide-react";

interface QRScannerProps {
  onScanSuccess: (decodedText: string, decodedResult: any) => void;
  onScanFailure?: (error: any) => void;
}

export default function QRScanner({ onScanSuccess, onScanFailure }: QRScannerProps) {
  const scannerRef = useRef<any>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let html5QrCode: any;
    const elementId = "qr-reader";

    const initScanner = async () => {
      // Ensure element exists
      if (!document.getElementById(elementId)) {
        console.warn("Scanner element not found, retrying...");
        return;
      }

      try {
        setIsLoading(true);
        setScanError(null);
        
        // Dynamic import
        const { Html5Qrcode } = await import("html5-qrcode");
        
        // Cleanup existing instance if any to prevent "Code scanner is already defined" error
        if (scannerRef.current) {
            try {
                await scannerRef.current.stop();
                await scannerRef.current.clear();
            } catch (e) {
                // ignore cleanup errors
            }
        }

        html5QrCode = new Html5Qrcode(elementId);
        scannerRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: "environment" },
          { 
            fps: 10, 
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0
          },
          (decodedText: string, decodedResult: any) => {
            // Success callback
            onScanSuccess(decodedText, decodedResult);
          },
          (errorMessage: string) => {
            // Error callback (called frequently when no QR is found)
            if (onScanFailure) onScanFailure(errorMessage);
          }
        );
        
        setIsLoading(false);
      } catch (err: any) {
        console.error("Error starting scanner:", err);
        setIsLoading(false);
        // Only show error if it's a permission issue or critical failure
        if (err?.name === "NotAllowedError" || err?.message?.includes("permission")) {
            setScanError("Camera permission denied. Please allow camera access.");
        } else {
            setScanError("Failed to start camera. Please try uploading an image.");
        }
      }
    };

    // Initialize with a slight delay to ensure DOM is ready and previous instances are cleared
    const timer = setTimeout(initScanner, 500);

    return () => {
      clearTimeout(timer);
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {}).finally(() => {
            scannerRef.current.clear().catch(() => {});
        });
      }
    };
  }, [onScanSuccess, onScanFailure]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    if (!scannerRef.current) {
        // If scanner instance doesn't exist (e.g. failed to load), try to load lib just for file scan
        try {
            const { Html5Qrcode } = await import("html5-qrcode");
            scannerRef.current = new Html5Qrcode("qr-reader");
        } catch (err) {
            setScanError("Failed to load scanner library.");
            return;
        }
    }

    try {
        setIsLoading(true);
        const result = await scannerRef.current.scanFile(file, true);
        onScanSuccess(result, null);
    } catch (err) {
        console.error("Error scanning file:", err);
        setScanError("Could not read QR code from image. Please try a clearer image.");
    } finally {
        setIsLoading(false);
        // Reset file input
        if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRetry = () => {
    setScanError(null);
    setIsLoading(true);
    // Force re-render/re-init by toggling a key or just reloading page if needed, 
    // but here we rely on the effect running again if we could trigger it.
    // For simplicity, we'll just reload the window if it's a hard failure, 
    // or let the user try file upload.
    window.location.reload();
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-4">
      <div className="relative bg-black rounded-lg overflow-hidden min-h-[300px] w-full border border-slate-800 shadow-inner">
        <div id="qr-reader" className="w-full h-full min-h-[300px]" />
        
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 text-white z-10">
            <Loader2 className="h-10 w-10 animate-spin text-cyan-400 mb-3" />
            <p className="text-sm text-gray-400 font-medium">Initializing Camera...</p>
          </div>
        )}
        
        {scanError && !isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/95 text-white z-10 p-6 text-center">
            <p className="text-red-400 mb-6 font-medium">{scanError}</p>
            <div className="flex gap-3">
                <Button 
                    variant="outline" 
                    onClick={handleRetry}
                    className="border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10"
                >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Retry Camera
                </Button>
            </div>
          </div>
        )}
        
        {/* Overlay for scanning guide */}
        {!isLoading && !scanError && (
            <div className="absolute inset-0 pointer-events-none border-[30px] border-black/30">
                <div className="w-full h-full border-2 border-cyan-500/50 relative">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>
                </div>
            </div>
        )}
      </div>

      <div className="flex justify-center">
        <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileUpload}
        />
        <Button 
            variant="secondary" 
            className="w-full bg-slate-800 text-white hover:bg-slate-700 border border-slate-700"
            onClick={() => fileInputRef.current?.click()}
        >
            <Image className="mr-2 h-4 w-4" />
            Upload Image to Scan
        </Button>
      </div>
    </div>
  );
}