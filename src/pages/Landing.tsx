import { motion } from "framer-motion";
import { ArrowRight, Shield, QrCode, CheckCircle, Activity, Lock, Smartphone, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export default function Landing() {
  const navigate = useNavigate();

  // Generate random stars for background animation
  const stars = Array.from({ length: 100 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 1.5 + 0.5, // Faster blinking speed
    delay: Math.random() * 5
  }));

  return (
    <div className="min-h-screen bg-[#030014] text-white overflow-hidden relative">
      
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-[#030014] to-cyan-900/10 z-0 pointer-events-none" />
      
      {/* Animated Stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white z-0"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
          }}
          animate={{
            opacity: [0.1, 0.7, 0.1],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Floating Glow Orbs */}
      <motion.div 
        animate={{ 
          x: [0, 50, 0],
          y: [0, -30, 0],
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-20 w-72 h-72 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none z-0"
      />
      <motion.div 
        animate={{ 
          x: [0, -50, 0],
          y: [0, 30, 0],
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none z-0"
      />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] z-0 pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 md:gap-4 cursor-pointer" onClick={() => navigate("/")}>
          <div className="relative">
            <div className="absolute inset-0 blur-xl bg-cyan-400/20 rounded-full" />
            <img 
              src="https://harmless-tapir-303.convex.cloud/api/storage/6fe7d1e8-1ae1-4599-8bb9-5c6b39e1af03" 
              alt="Dhanvantari Logo" 
              className="relative h-[46px] w-[46px] md:h-[76px] md:w-[76px] object-contain rounded-full p-1 transition-all duration-300" 
            />
          </div>
          <span className="text-[28px] md:text-[46px] font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-samarkan tracking-wide transition-all duration-300">
            Dhanvantari
          </span>
        </div>
        
        <div className="flex items-center gap-2 md:gap-3">
          <Button
            onClick={() => {
              console.log("Navigating to dashboard");
              navigate("/auth?redirect=/app");
            }}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all duration-300"
          >
            Scan now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
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
              <Button
                onClick={() => {
                  console.log("Navigating to scan/app");
                  navigate("/auth?redirect=/app");
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
                  navigate("/auth?redirect=/manufacturer");
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

      {/* How It Works Section - Split View */}
      <section className="relative z-10 py-24 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                How It Works
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              A dual-sided ecosystem ensuring trust from factory to pharmacy.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 relative">
            {/* Center Divider (Desktop) */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent -translate-x-1/2" />
            
            {/* Consumer Side */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              <div className="flex flex-col items-center md:items-end text-center md:text-right space-y-8">
                <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 p-4 rounded-2xl border border-purple-500/30 mb-4">
                  <Smartphone className="w-12 h-12 text-purple-400" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">For Consumers</h3>
                <p className="text-gray-400 mb-8 max-w-md">
                  Instantly verify the authenticity of your medicines with a simple scan.
                </p>
                
                <div className="space-y-6 w-full max-w-md">
                  {[
                    { title: "Scan QR Code", desc: "Use your phone camera to scan the secure QR on the package.", icon: QrCode },
                    { title: "Instant Verification", desc: "Immediate feedback on product authenticity via blockchain.", icon: CheckCircle },
                    { title: "View Details", desc: "See manufacturing date, expiry, and origin details.", icon: Database },
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + (i * 0.1) }}
                      className="bg-slate-900/50 p-4 rounded-xl border border-purple-500/10 hover:border-purple-500/40 transition-colors flex flex-row-reverse md:flex-row items-center gap-4"
                    >
                      <div className="flex-1 text-left md:text-right">
                        <h4 className="font-semibold text-white">{item.title}</h4>
                        <p className="text-sm text-gray-400">{item.desc}</p>
                      </div>
                      <div className="bg-purple-500/10 p-2 rounded-lg">
                        <item.icon className="w-5 h-5 text-purple-400" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Manufacturer Side */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-8">
                <div className="bg-gradient-to-br from-cyan-500/20 to-teal-500/20 p-4 rounded-2xl border border-cyan-500/30 mb-4">
                  <Database className="w-12 h-12 text-cyan-400" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">For Manufacturers</h3>
                <p className="text-gray-400 mb-8 max-w-md">
                  Secure your supply chain and protect your brand reputation.
                </p>

                <div className="space-y-6 w-full max-w-md">
                  {[
                    { title: "Mint Digital Twin", desc: "Create an immutable NFT record for each medicine batch.", icon: Database },
                    { title: "Generate Secure QR", desc: "Print unique QR codes linked to blockchain records.", icon: QrCode },
                    { title: "Track Analytics", desc: "Monitor scans and detect potential counterfeit attempts.", icon: Activity },
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + (i * 0.1) }}
                      className="bg-slate-900/50 p-4 rounded-xl border border-cyan-500/10 hover:border-cyan-500/40 transition-colors flex items-center gap-4"
                    >
                      <div className="bg-cyan-500/10 p-2 rounded-lg">
                        <item.icon className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-semibold text-white">{item.title}</h4>
                        <p className="text-sm text-gray-400">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
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
            onClick={() => {
              console.log("Navigating to scan/app");
              navigate("/auth?redirect=/app");
            }}
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:shadow-[0_0_40px_rgba(34,211,238,0.6)] transition-all duration-300 text-lg px-8 py-6 cursor-pointer"
          >
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-cyan-500/20 bg-slate-950/50 backdrop-blur-xl py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>&copy; 2024 Dhanvantari. Powered by Blockchain Technology.</p>
        </div>
      </footer>
    </div>
  );
}