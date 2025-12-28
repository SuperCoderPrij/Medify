import { useEffect, useRef, useState } from "react";

interface QRScannerProps {
  onScanSuccess: (decodedText: string, decodedResult: any) => void;
  onScanFailure?: (error: any) => void;
}

export default function QRScanner({ onScanSuccess, onScanFailure }: QRScannerProps) {
  const scannerRef = useRef<any>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [libLoaded, setLibLoaded] = useState(false);

  useEffect(() => {
    // Dynamic import to avoid module loading issues during initial bundle load
    // We check if the module is available
    import("html5-qrcode").then((mod) => {
        console.log("html5-qrcode loaded", mod);
        setLibLoaded(true);
    }).catch(err => {
        console.error("Failed to load html5-qrcode library", err);
        setScanError("Failed to load scanner library. Please refresh.");
    });
  }, []);

  useEffect(() => {
    if (!libLoaded) return;

    // Use a unique ID for the element to avoid conflicts if multiple scanners exist (though unlikely here)
    const elementId = "html5qr-code-full-region";
    
    // Ensure the element exists in the DOM before initializing
    if (!document.getElementById(elementId)) return;

    const startScanner = async () => {
        try {
            const { Html5QrcodeScanner } = await import("html5-qrcode");
            
            if (!scannerRef.current) {
                const scanner = new Html5QrcodeScanner(
                    elementId,
                    { 
                        fps: 10, 
                        qrbox: { width: 250, height: 250 },
                        aspectRatio: 1.0,
                        showTorchButtonIfSupported: true,
                    },
                    /* verbose= */ false
                );
            
                scanner.render(
                    (decodedText: string, decodedResult: any) => {
                        // Stop scanning after success if needed, or just callback
                        scanner.clear();
                        onScanSuccess(decodedText, decodedResult);
                    },
                    (errorMessage: string) => {
                        // parse error, ignore it.
                        if (onScanFailure) onScanFailure(errorMessage);
                    }
                );
                
                scannerRef.current = scanner;
            }
        } catch (e) {
            console.error("Error initializing scanner:", e);
            setScanError("Failed to initialize camera.");
        }
    };

    startScanner();

    return () => {
      if (scannerRef.current) {
        try {
            scannerRef.current.clear().catch((error: any) => {
                console.error("Failed to clear html5-qrcode scanner. ", error);
            });
        } catch (e) {
            console.error("Error clearing scanner", e);
        }
        scannerRef.current = null;
      }
    };
  }, [libLoaded, onScanSuccess, onScanFailure]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div id="html5qr-code-full-region" className="bg-slate-900 rounded-lg overflow-hidden min-h-[300px]" />
      {scanError && <p className="text-red-500 text-sm mt-2">{scanError}</p>}
    </div>
  );
}