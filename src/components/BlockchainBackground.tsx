import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const BlockchainBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-slate-950 pointer-events-none">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Floating Blocks */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-sm rounded-lg"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight + 100,
            opacity: 0,
            scale: 0.5,
            rotate: 0,
          }}
          animate={{
            y: [null, Math.random() * -100],
            opacity: [0, 0.5, 0],
            scale: [0.5, 1, 0.5],
            rotate: [0, 90, 180],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5,
          }}
          style={{
            width: Math.random() * 40 + 20,
            height: Math.random() * 40 + 20,
          }}
        />
      ))}

      {/* Connecting Lines / Network Effect */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <defs>
          <pattern
            id="grid-pattern"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 100 0 L 0 0 0 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-cyan-500"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
      </svg>

      {/* Glowing Orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};
