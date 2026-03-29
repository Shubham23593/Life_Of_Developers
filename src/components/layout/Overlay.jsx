'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Overlay({ isLoaded }) {
  const [time, setTime] = useState("");

  /* Live clock */
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateClock(); // Set immediately to avoid hydration flicker
    const id = setInterval(updateClock, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <AnimatePresence>
      {isLoaded && (
        <motion.header
          className="fixed top-8 left-8 z-50 flex items-center justify-between pointer-events-none"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
        >
          {/* Logo matching the Preloader exactly */}
          <div className="pointer-events-auto flex items-center gap-4">
            
            {/* The ">_" Terminal Box */}
            <div 
              className="w-10 h-10 rounded border border-[#ea580c]/30 flex items-center justify-center bg-cyan-950/20 text-slate-200/80 font-mono text-sm"
              style={{
                boxShadow: '0 0 15px rgba(249,115,22, 0.1)',
              }}
            >
              &gt;_
            </div>
            
            {/* Text & Clock */}
            <div className="flex flex-col">
              <span
                className="text-orange-400 text-base font-bold leading-none tracking-wide"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Dev.Life
              </span>
              <p
                className="text-orange-400 text-[10px] tracking-widest font-mono uppercase leading-none mt-1.5"
              >
                {time || "00:00:00"}
              </p>
            </div>
            
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}