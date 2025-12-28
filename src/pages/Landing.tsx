import { motion } from "framer-motion";
import { Shield, Scan, Lock, Zap, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import QRScanner from "@/components/QRScanner";
import { useState } from "react";

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [isScanOpen, setIsScanOpen] = useState(false);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      if (user?.role === "manufacturer") {
        navigate("/manufacturer");
      } else {
        navigate("/app");
      }
    } else {
      navigate("/auth?redirect=/app");
    }
  };

  const handleScanSuccess = (decodedText: string) => {
    setIsScanOpen(false);
    if (decodedText.includes("/verify?")) {
      window.location.href = decodedText;
    } else {
      // If it's not a URL, maybe redirect to app with the code?
      // For now, just redirect to app
      navigate("/app");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white overflow-hidden">
      {/* Animated background grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      {/* Navbar */}
      <nav className="relative z-10 border-b border-cyan-500/20 bg-slate-950/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="relative">
                <Shield className="h-8 w-8 text-cyan-400" />
                <div className="absolute inset-0 blur-xl bg-cyan-400/50" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                PharmaAuth
              </span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Button
                onClick={handleGetStarted}
                disabled={isLoading}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all duration-300"
              >
                {isLoading ? "Loading..." : isAuthenticated ? (user?.role === "manufacturer" ? "Manufacturer Portal" : "Dashboard") : "Get Started"}
                <Zap className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
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
              <Dialog open={isScanOpen} onOpenChange={setIsScanOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:shadow-[0_0_40px_rgba(34,211,238,0.6)] transition-all duration-300 text-lg px-8 py-6"
                  >
                    <Scan className="mr-2 h-5 w-5" />
                    Scan Medicine Now
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-lg max-h-[85vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Scan Medicine QR</DialogTitle>
                  </DialogHeader>
                  <div className="w-full pb-2">
                    <QRScanner onScanSuccess={handleScanSuccess} />
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button
                onClick={() => navigate("/manufacturer")}
                size="lg"
                variant="outline"
                className="border-2 border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400 transition-all duration-300 text-lg px-8 py-6"
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
              { label: "Scans Performed", value: "50K+", icon: Scan },
              { label: "Counterfeits Detected", value: "500+", icon: AlertTriangle },
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

      {/* Features Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                How It Works
              </span>
            </h2>
            <p className="text-xl text-gray-300">Three simple steps to verify authenticity</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Lock,
                title: "Mint NFT",
                description: "Manufacturers create unique NFTs for each medicine batch on the blockchain",
                color: "cyan",
              },
              {
                icon: Scan,
                title: "Scan QR Code",
                description: "Consumers scan the QR code on medicine packaging using their phone camera",
                color: "purple",
              },
              {
                icon: CheckCircle,
                title: "Verify Instantly",
                description: "System checks blockchain and confirms if medicine is genuine or counterfeit",
                color: "pink",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative group"
              >
                <div className="bg-slate-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-8 h-full hover:border-cyan-400/50 transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.1)] hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                  <div className={`inline-flex p-3 rounded-lg bg-${feature.color}-500/10 mb-4`}>
                    <feature.icon className={`h-8 w-8 text-${feature.color}-400`} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-white">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-12 text-center shadow-[0_0_40px_rgba(34,211,238,0.2)]"
        >
          <h2 className="text-4xl font-bold mb-4 text-white">
            Ready to Protect Your Medicines?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of manufacturers and consumers fighting counterfeit medicines
          </p>
          <Button
            onClick={handleGetStarted}
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:shadow-[0_0_40px_rgba(34,211,238,0.6)] transition-all duration-300 text-lg px-8 py-6"
          >
            Get Started Now
            <Zap className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-cyan-500/20 bg-slate-950/50 backdrop-blur-xl py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>&copy; 2024 PharmaAuth. Powered by Blockchain Technology.</p>
        </div>
      </footer>
    </div>
  );
}