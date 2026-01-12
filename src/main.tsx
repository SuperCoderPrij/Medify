import { Toaster } from "@/components/ui/sonner";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import { InstrumentationProvider } from "@/instrumentation.tsx";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { StrictMode, useEffect, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import "./index.css";
import "./types/global.d.ts";
import { Web3Provider } from "@/hooks/use-web3";
import { PageLoader } from "@/components/PageLoader";

// Lazy load route components for better code splitting
const Landing = lazy(() => import("./pages/Landing.tsx"));
const AuthPage = lazy(() => import("./pages/Auth.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

// Manufacturer Pages
const ManufacturerLayout = lazy(() => import("./pages/manufacturer/ManufacturerLayout.tsx"));
const ManufacturerDashboard = lazy(() => import("./pages/manufacturer/Dashboard.tsx"));
const ManufacturerMedicines = lazy(() => import("./pages/manufacturer/Medicines.tsx"));
const CreateMedicine = lazy(() => import("./pages/manufacturer/CreateMedicine.tsx"));
const GenerateQR = lazy(() => import("./pages/manufacturer/GenerateQR.tsx"));
const ManufacturerReports = lazy(() => import("./pages/manufacturer/Reports.tsx"));
const ConsumerDashboard = lazy(() => import("./pages/consumer/Dashboard.tsx"));
const Verify = lazy(() => import("./pages/Verify.tsx"));
const NotVerified = lazy(() => import("./pages/NotVerified.tsx"));
const Reports = lazy(() => import("./pages/Reports.tsx"));

// Simple loading fallback for route transitions
function RouteLoading() {
  return <PageLoader />;
}

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);



function RouteSyncer() {
  const location = useLocation();
  useEffect(() => {
    window.parent.postMessage(
      { type: "iframe-route-change", path: location.pathname },
      "*",
    );
  }, [location.pathname]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "navigate") {
        if (event.data.direction === "back") window.history.back();
        if (event.data.direction === "forward") window.history.forward();
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <VlyToolbar />
    <InstrumentationProvider>
      <ConvexAuthProvider client={convex}>
        <Web3Provider>
          <BrowserRouter>
            <RouteSyncer />
            <Suspense fallback={<RouteLoading />}>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/auth" element={<AuthPage redirectAfterAuth="/" />} /> {/* TODO: change redirect after auth to correct page */}
                <Route path="/verify" element={<Verify />} />
                <Route path="/not-verified" element={<NotVerified />} />
                <Route path="/reports" element={<Reports />} />
                
                {/* Consumer Routes */}
                <Route path="/app" element={<ConsumerDashboard />} />

                {/* Manufacturer Routes */}
                <Route path="/manufacturer" element={<ManufacturerLayout />}>
                  <Route index element={<ManufacturerDashboard />} />
                  <Route path="dashboard" element={<ManufacturerDashboard />} />
                  <Route path="medicines" element={<ManufacturerMedicines />} />
                  <Route path="create" element={<CreateMedicine />} />
                  <Route path="generate-qr" element={<GenerateQR />} />
                  <Route path="reports" element={<ManufacturerReports />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
          <Toaster />
        </Web3Provider>
      </ConvexAuthProvider>
    </InstrumentationProvider>
  </StrictMode>,
);