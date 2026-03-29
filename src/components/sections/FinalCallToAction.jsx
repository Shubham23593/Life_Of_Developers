"use client";

import React from "react";
import { motion } from "framer-motion";
import { HoloButton } from "@/components/SciFiUI";

export default function FinalCallToAction() {
    return (
        <section className="relative h-screen w-full bg-black flex flex-col items-center justify-center overflow-hidden">
            
            {/* Background Details */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_90%)] pointer-events-none" />
            <motion.div
                animate={{ top: ["0%", "100%"] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent shadow-[0_0_20px_rgba(34,197,94,0.5)] opacity-50 pointer-events-none"
            />
            
            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center px-6">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="flex flex-col items-center"
                >
                    <span className="font-mono text-green-500 text-sm tracking-[0.4em] uppercase mb-4">
                        // EPILOGUE
                    </span>
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-green-500 tracking-tighter mb-4" style={{ fontFamily: "var(--font-mono)" }}>
                        Every developer has a story.
                    </h2>
                    <p className="text-xl md:text-2xl text-green-600 font-mono mb-10">
                        This is mine. <span className="text-green-400">Start yours today.</span>
                    </p>
                    
                    {/* HoloButton Action */}
                    <div className="flex justify-center">
                        <HoloButton text="Start Your Journey" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
                    </div>
                </motion.div>
            </div>
            
            {/* Corner Decorative Elements */}
            <div className="absolute bottom-8 left-8 hidden lg:block font-mono text-[10px] text-neutral-600">
                LIFELINE: ACTIVE <br />
                DESTINATION: OMNIVERSAL
            </div>
        </section>
    );
}
