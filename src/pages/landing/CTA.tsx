import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";

export function CTA() {
  const navigate = useNavigate();

  return (
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
            navigate("/app");
          }}
          size="lg"
          className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:shadow-[0_0_40px_rgba(34,211,238,0.6)] transition-all duration-300 text-lg px-8 py-6 cursor-pointer"
        >
          Get Started Now
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </motion.div>
    </section>
  );
}
