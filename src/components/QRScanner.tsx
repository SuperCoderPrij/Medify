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
  // Use a unique ID for each instance to avoid conflicts
  const [elementId] = useState(() => `qr-reader-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    let isMounted = true;
    let html5QrCode: any;

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
        
        // Use global window.Html5Qrcode from CDN
        if (!window.Html5Qrcode) {
            throw new Error("Scanner library not loaded");
        }

        // Create new instance
        html5QrCode = new window.Html5Qrcode(elementId);
        scannerRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: "environment" },
          { 
            fps: 10, 
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0
          },
          (decodedText: string, decodedResult: any) => {
            if (isMounted) onScanSuccess(decodedText, decodedResult);
          },
          (errorMessage: string) => {
            // Only report critical errors or if explicitly requested
            // Many errors are just "no QR code found" in the current frame
            // if (isMounted && onScanFailure) onScanFailure(errorMessage);
          }
        );
        
        if (isMounted) setIsLoading(false);
      } catch (err: any) {
        console.error("Error starting scanner:", err);
        if (isMounted) {
            setIsLoading(false);
            // Only show error if it's a permission issue or critical failure
            if (err?.name === "NotAllowedError" || err?.message?.includes("permission")) {
                setScanError("Camera permission denied. Please allow camera access.");
            } else {
                // Don't show generic error immediately, let user try upload
                // setScanError("Failed to start camera. Please try uploading an image.");
            }
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
        // Use Promise.resolve to handle cases where stop() returns undefined or a promise
        Promise.resolve(scanner.stop())
            .catch(() => {
                // Ignore stop errors (e.g. if not running)
            })
            .finally(() => {
                // Always try to clear
                scanner.clear().catch(() => {});
            });
      }
    };
  }, [onScanSuccess, onScanFailure, elementId]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    if (!window.Html5Qrcode) {
        setScanError("Scanner library not loaded.");
        return;
    }

    try {
        setIsLoading(true);
        setScanError(null);
        
        // Create a temporary container for file scanning to avoid conflicts with camera
        // This isolates the file scan from the active camera scanner
        const tempId = `temp-qr-${Math.random().toString(36).substr(2, 9)}`;
        const tempDiv = document.createElement('div');
        tempDiv.id = tempId;
        tempDiv.style.display = 'none';
        document.body.appendChild(tempDiv);

        try {
            const fileScanner = new window.Html5Qrcode(tempId);
            const result = await fileScanner.scanFile(file, true);
            onScanSuccess(result, null);
            // Cleanup file scanner
            fileScanner.clear().catch(() => {});
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
    // Force re-mount or reload
    window.location.reload();
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-4">
      <div className="relative bg-black rounded-lg overflow-hidden min-h-[300px] w-full border border-slate-800 shadow-inner">
        <div id={elementId} className="w-full h-full min-h-[300px]" />
        
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 text-white z-10">
            <Loader2 className="h-10 w-10 animate-spin text-cyan-400 mb-3" />
            <p className="text-sm text-gray-400 font-medium">Initializing Scanner...</p>
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