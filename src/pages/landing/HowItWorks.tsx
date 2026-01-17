import { motion } from "framer-motion";
import { Activity, CheckCircle, Database, QrCode, Smartphone } from "lucide-react";

export function HowItWorks() {
  return (
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
  );
}
