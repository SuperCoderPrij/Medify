import { motion } from "framer-motion";
import { Navbar } from "./landing/Navbar";
import { Hero } from "./landing/Hero";
import { HowItWorks } from "./landing/HowItWorks";
import { CTA } from "./landing/CTA";
import { ReportForm } from "./landing/ReportForm";
import { Footer } from "./landing/Footer";

export default function Landing() {
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
    <div className="min-h-screen bg-[#030014] text-white overflow-x-hidden font-sans selection:bg-cyan-500/30">
      
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

      <Navbar />
      <Hero />
      <HowItWorks />
      <CTA />
      <ReportForm />
      <Footer />
    </div>
  );
}