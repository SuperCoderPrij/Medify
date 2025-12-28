import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";

interface QRScannerProps {
  onScanSuccess: (decodedText: string, decodedResult: any) => void;
  onScanFailure?: (error: any) => void;
}

export default function QRScanner({ onScanSuccess, onScanFailure }: QRScannerProps) {
  const scannerRef = useRef<any>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize scanner
    // Use a unique ID for the element
    const elementId = "html5qr-code-full-region";
    
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

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch((error: any) => {
            console.error("Failed to clear html5-qrcode scanner. ", error);
        });
        scannerRef.current = null;
      }
    };
  }, [onScanSuccess, onScanFailure]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div id="html5qr-code-full-region" className="bg-slate-900 rounded-lg overflow-hidden" />
      {scanError && <p className="text-red-500 text-sm mt-2">{scanError}</p>}
    </div>
  );
}