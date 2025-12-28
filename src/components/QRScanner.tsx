import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Image, Loader2, RefreshCw, AlertCircle, Camera } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";

interface QRScannerProps {
  onScanSuccess: (decodedText: string, decodedResult: any) => void;
  onScanFailure?: (error: any) => void;
}

export default function QRScanner({ onScanSuccess, onScanFailure }: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Use a unique ID for each instance to avoid conflicts
  const [elementId] = useState(() => `qr-reader-${Math.random().toString(36).substr(2, 9)}`);
  const isMountedRef = useRef(true);

  const cleanupScanner = async () => {
    if (scannerRef.current) {
      const scanner = scannerRef.current;
      scannerRef.current = null;
      try {
        if (scanner.isScanning) {
          await scanner.stop();
        }
      } catch (e) {
        console.warn("Failed to stop scanner:", e);
      }
      try {
        await scanner.clear();
      } catch (e) {
        // ignore clear errors
      }
    }
  };

  const startCamera = useCallback(async () => {
    if (!document.getElementById(elementId)) return;

    try {
      if (isMountedRef.current) {
        setIsLoading(true);
        setScanError(null);
      }

      await cleanupScanner();

      // Check for Secure Context (HTTPS)
      if (window.isSecureContext === false) {
        throw new Error("Camera access requires a secure context (HTTPS). Please use localhost or HTTPS.");
      }
      
      // Check for MediaDevices support
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera not supported in this browser.");
      }

      // Explicitly check for cameras first to trigger permission prompt if needed
      // This works best when triggered by a user action (like the Retry button)
      try {
        const devices = await Html5Qrcode.getCameras();
        if (!devices || devices.length === 0) {
          throw new Error("No camera devices found.");
        }
      } catch (e: any) {
        // If getCameras fails, it might be permission denied
        if (e?.name === "NotAllowedError" || e?.message?.includes("permission")) {
          throw new Error("Camera permission denied. Please allow camera access.");
        }
        // If it's another error, we might still try to start, but usually getCameras is the gatekeeper
        throw e;
      }
      
      // Create new instance
      const html5QrCode = new Html5Qrcode(elementId);
      scannerRef.current = html5QrCode;

      // Start the scanner
      await html5QrCode.start(
        { facingMode: "environment" },
        { 
          fps: 10, 
          qrbox: (viewfinderWidth, viewfinderHeight) => {
            const minEdgePercentage = 0.7; // 70%
            const minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
            const qrboxSize = Math.floor(minEdgeSize * minEdgePercentage);
            return {
              width: qrboxSize,
              height: qrboxSize
            };
          },
        },
        (decodedText: string, decodedResult: any) => {
          if (isMountedRef.current) onScanSuccess(decodedText, decodedResult);
        },
        (errorMessage: string) => {
          // Only report critical errors or if explicitly requested
        }
      );

      if (isMountedRef.current) setIsLoading(false);
    } catch (err: any) {
      console.error("Error starting scanner:", err);
      if (isMountedRef.current) {
        setIsLoading(false);
        // Detailed error handling
        let errorMessage = "Failed to start camera.";
        
        if (err?.name === "NotAllowedError" || err?.message?.includes("permission") || err?.message?.includes("denied")) {
          errorMessage = "Camera permission denied. Please allow camera access.";
        } else if (err?.name === "NotFoundError" || err?.message?.includes("device")) {
          errorMessage = "No camera found on this device.";
        } else if (err?.name === "NotReadableError") {
          errorMessage = "Camera is in use by another app or not readable.";
        } else if (err?.name === "OverconstrainedError") {
          errorMessage = "Camera constraints not satisfied.";
        } else if (err?.message?.includes("secure context")) {
          errorMessage = err.message;
        } else if (err?.message) {
          errorMessage = `Camera Error: ${err.message}`;
        }
        
        setScanError(errorMessage);
      }
    }
  }, [elementId, onScanSuccess]);

  useEffect(() => {
    isMountedRef.current = true;
    
    // Initialize with a slight delay to ensure DOM is ready
    const timer = setTimeout(() => {
      startCamera();
    }, 500);

    return () => {
      isMountedRef.current = false;
      clearTimeout(timer);
      cleanupScanner();
    };
  }, [startCamera]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    try {
        setIsLoading(true);
        setScanError(null);
        
        // Create a temporary container for file scanning
        const tempId = `temp-qr-${Math.random().toString(36).substr(2, 9)}`;
        const tempDiv = document.createElement('div');
        tempDiv.id = tempId;
        tempDiv.style.display = 'none';
        document.body.appendChild(tempDiv);

        try {
            // Use imported Html5Qrcode
            const fileScanner = new Html5Qrcode(tempId);
            const result = await fileScanner.scanFile(file, true);
            onScanSuccess(result, null);
            // Cleanup file scanner
            try { await fileScanner.clear(); } catch {}
        } catch (err) {
             console.error("Error scanning file:", err);
             setScanError("Could not read QR code from image. Please try a clearer image.");
        } finally {
            if (document.body.contains(tempDiv)) {
                document.body.removeChild(tempDiv);
            }
        }
    } catch (err) {
        console.error("Error in file upload handler:", err);
        setScanError("Error processing image.");
    } finally {
        setIsLoading(false);
        // Reset file input
        if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRetry = () => {
    // Calling startCamera from a button click (user gesture) allows permission prompts
    startCamera();
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Upload Button - Moved Outside and Above */}
      <div className="flex justify-center w-full">
          <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileUpload}
          />
          <Button 
              variant="secondary" 
              className="w-full bg-slate-900/80 backdrop-blur-md text-white hover:bg-slate-800 border border-cyan-500/30 shadow-lg transition-all hover:scale-105"
              onClick={() => fileInputRef.current?.click()}
          >
              <Image className="mr-2 h-4 w-4 text-cyan-400" />
              Upload Image to Scan
          </Button>
      </div>

      <div className="relative bg-slate-900 rounded-lg overflow-hidden min-h-[250px] w-full border-2 border-cyan-500/30 shadow-inner group">
        <div id={elementId} className="w-full h-full" />
        
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 text-white z-10">
            <Loader2 className="h-10 w-10 animate-spin text-cyan-400 mb-3" />
            <p className="text-sm text-gray-400 font-medium">Initializing Scanner...</p>
          </div>
        )}
        
        {scanError && !isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/95 text-white z-10 p-6 text-center">
            <AlertCircle className="h-10 w-10 text-red-400 mb-3" />
            <p className="text-red-400 mb-6 font-medium">{scanError}</p>
            <div className="flex gap-3">
                <Button 
                    variant="outline" 
                    onClick={handleRetry}
                    className="border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10"
                >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    {scanError.includes("permission") ? "Request Permission" : "Retry Camera"}
                </Button>
            </div>
          </div>
        )}
        
        {/* Overlay for scanning guide */}
        {!isLoading && !scanError && (
            <div className="absolute inset-0 pointer-events-none border-[30px] border-black/30 z-0">
                <div className="w-full h-full border-2 border-cyan-500/50 relative">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}