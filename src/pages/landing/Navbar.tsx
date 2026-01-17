import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";

export function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
      <div className="flex items-center gap-2 md:gap-4 cursor-pointer" onClick={() => navigate("/")}>
        <div className="relative">
          <div className="absolute inset-0 blur-xl bg-cyan-400/20 rounded-full" />
          <img 
            src="https://harmless-tapir-303.convex.cloud/api/storage/6fe7d1e8-1ae1-4599-8bb9-5c6b39e1af03" 
            alt="Dhanvantari Logo" 
            className="relative h-[46px] w-[46px] md:h-[76px] md:w-[76px] object-cover rounded-full transition-all duration-300" 
          />
        </div>
        <span className="text-[28px] md:text-[46px] font-normal bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-samarkan tracking-wide transition-all duration-300 pt-2">
          Dhanvantari
        </span>
      </div>
      
      <div className="flex items-center gap-2 md:gap-3">
        <Button
          onClick={() => {
            console.log("Navigating to dashboard");
            navigate("/app");
          }}
          className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all duration-300"
        >
          Scan now
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </nav>
  );
}