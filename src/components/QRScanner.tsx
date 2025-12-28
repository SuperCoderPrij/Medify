import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Image, Loader2, RefreshCw, AlertCircle } from "lucide-react";
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
  const initializationRef = useRef<Promise<any> | null>(null);

  useEffect(() => {
    let isMounted = true;
    let html5QrCode: Html5Qrcode | null = null;

    const initScanner = async () => {
      // Ensure element exists
      if (!document.getElementById(elementId)) {
        return;
      }

      try {
        if (isMounted) {
            setIsLoading(true);
            setScanError(null);
        }

        // Check for Secure Context (HTTPS)
        if (window.isSecureContext === false) {
            throw new Error("Camera access requires a secure context (HTTPS). Please use localhost or HTTPS.");
        }
        
        // Check for MediaDevices support
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error("Camera not supported in this browser.");
        }

        // Explicitly check for cameras first to trigger permission prompt if needed
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
            // Continue anyway to let start() try
        }
        
        // Create new instance using the imported class
        html5QrCode = new Html5Qrcode(elementId);
        scannerRef.current = html5QrCode;

        // Start the scanner with a timeout race
        const startPromise = html5QrCode.start(
          { facingMode: "environment" },
          { 
            fps: 10, 
            // Make qrbox responsive to avoid OverconstrainedError on small screens
            qrbox: (viewfinderWidth, viewfinderHeight) => {
                const minEdgePercentage = 0.7; // 70%
                const minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
                const qrboxSize = Math.floor(minEdgeSize * minEdgePercentage);
                return {
                    width: qrboxSize,
                    height: qrboxSize
                };
            },
            // Remove fixed aspectRatio to prevent constraints errors on some devices
            // aspectRatio: 1.0 
          },
          (decodedText: string, decodedResult: any) => {
            if (isMounted) onScanSuccess(decodedText, decodedResult);
          },
          (errorMessage: string) => {
            // Only report critical errors or if explicitly requested
            // if (isMounted && onScanFailure) onScanFailure(errorMessage);
          }
        );

        initializationRef.current = startPromise;

        // Timeout after 10 seconds if camera doesn't start
        await Promise.race([
            startPromise,
            new Promise((_, reject) => setTimeout(() => reject(new Error("Camera initialization timed out")), 10000))
        ]);
        
        if (isMounted) setIsLoading(false);
      } catch (err: any) {
        console.error("Error starting scanner:", err);
        if (isMounted) {
            setIsLoading(false);
            // Detailed error handling
            let errorMessage = "Failed to start camera.";
            
            if (err?.name === "NotAllowedError" || err?.message?.includes("permission")) {
                errorMessage = "Camera permission denied. Please allow camera access.";
            } else if (err?.name === "NotFoundError" || err?.message?.includes("device")) {
                errorMessage = "No camera found on this device.";
            } else if (err?.name === "NotReadableError") {
                errorMessage = "Camera is in use by another app or not readable.";
            } else if (err?.name === "OverconstrainedError") {
                errorMessage = "Camera constraints not satisfied (resolution/facing mode).";
            } else if (err?.message?.includes("timed out")) {
                errorMessage = "Camera took too long to start. Please try again.";
            } else if (err?.message?.includes("secure context")) {
                errorMessage = err.message;
            } else if (err?.message) {
                // Show the actual error message for debugging
                errorMessage = `Camera Error: ${err.message}`;
            } else {
                errorMessage = "Failed to start camera. Please ensure camera access is allowed for this site in your browser settings, and try again.";
            }
            
            setScanError(errorMessage);
        }
      }
    };

    // Initialize with a slight delay to ensure DOM is ready
    const timer = setTimeout(initScanner, 500);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      
      // Defensive cleanup
      if (scannerRef.current) {
        const scanner = scannerRef.current;
        scannerRef.current = null; // Prevent double cleanup

        // Use Promise.resolve to handle cases where stop() returns undefined or a promise
        Promise.resolve(scanner.stop())
            .catch((e) => {
                console.warn("Failed to stop scanner during cleanup:", e);
            })
            .finally(() => {
                try {
                    // Cast to any to avoid TS errors if types are mismatched
                    const clearPromise = scanner.clear() as any;
                    if (clearPromise && typeof clearPromise.catch === 'function') {
                        clearPromise.catch(() => {});
                    }
                } catch (e) {
                    // Ignore clear errors
                }
            });
      }
    };
  }, [onScanSuccess, onScanFailure, elementId]);

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
            const clearPromise = fileScanner.clear() as any;
            if (clearPromise && typeof clearPromise.catch === 'function') {
                clearPromise.catch(() => {});
            }
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
    setScanError(null);
    setIsLoading(true);
    window.location.reload();
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="relative bg-slate-900 rounded-lg overflow-hidden h-[300px] w-full border-2 border-cyan-500/30 shadow-inner group">
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
                    Retry Camera
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

      {/* Upload Button - Moved Outside */}
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
    </div>
  );
}