import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Activity, Lock, QrCode, Shield } from "lucide-react";
import { useNavigate } from "react-router";

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative z-10 pt-20 pb-32 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Stop Counterfeit
            </span>
            <br />
            <span className="text-white">Medicines with Blockchain</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Verify medicine authenticity instantly with QR codes powered by NFT technology.
            Protect lives, build trust.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => {
                console.log("Navigating to scan/app");
                navigate("/app");
              }}
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all duration-300 text-lg px-8 py-6 cursor-pointer"
            >
              <QrCode className="mr-2 h-5 w-5" />
              Scan Medicine Now
            </Button>

            <Button
              onClick={() => {
                console.log("Navigating to manufacturer");
                navigate("/manufacturer/dashboard");
              }}
              size="lg"
              variant="outline"
              className="border-2 border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400 transition-all duration-300 text-lg px-8 py-6 cursor-pointer"
            >
              <Lock className="mr-2 h-5 w-5" />
              Manufacturer Portal
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto"
        >
          {[
            { label: "Medicines Protected", value: "10K+", icon: Shield },
            { label: "Scans Performed", value: "50K+", icon: QrCode },
            { label: "Counterfeits Detected", value: "500+", icon: Activity },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-slate-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-6 shadow-[0_0_20px_rgba(34,211,238,0.1)]"
            >
              <stat.icon className="h-8 w-8 text-cyan-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
