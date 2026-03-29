"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Cpu } from "lucide-react";
import { cn } from "@/lib/utils"; 

// --- 1. Technical Components ---

// A ticking number that simulates live data
export function LiveData({ min, max, label, unit }) {
    const [val, setVal] = useState(min);

    useEffect(() => {
        const interval = setInterval(() => {
            setVal(v => Math.max(min, Math.min(max, v + (Math.random() - 0.5) * 5)));
        }, 100);
        return () => clearInterval(interval);
    }, [min, max]);

    return (
        <div className="flex flex-col font-mono text-xs">
            <span className="text-neutral-500 uppercase tracking-wider text-[10px]">{label}</span>
            <div className="flex items-baseline gap-1">
                <span className="text-orange-400 font-bold">{val.toFixed(2)}</span>
                <span className="text-neutral-600">{unit}</span>
            </div>
        </div>
    );
};

// "Cut Corner" Card (Sci-fi Shape)
export function TechCard({ children, className, delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className={cn(
                "relative border border-white/10 bg-slate-950/80 p-6 backdrop-blur-md",
                "before:absolute before:-left-[1px] before:-top-[1px] before:h-4 before:w-4 before:border-l before:border-t before:border-orange-400",
                "after:absolute after:-bottom-[1px] after:-right-[1px] after:h-4 after:w-4 after:border-b after:border-r after:border-orange-400",
                className
            )}
            // Using clip-path to physically cut the corner
            style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)" }}
        >
            {children}
        </motion.div>
    );
}

// Scanning Grid Background
export function GridScanner() {
    return (
        <div className="fixed inset-0 pointer-events-none z-0">
            {/* Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />

            {/* Scanning Line */}
            <motion.div
                animate={{ top: ["0%", "100%"] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-400/50 to-transparent shadow-[0_0_20px_rgba(249,115,22,0.5)]"
            />

            {/* Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_90%)]" />
        </div>
    );
}

// 2. Animated Robotic Core (Abstract Visualization)
export function CoreVisualizer() {
    return (
        <div className="relative h-64 w-64 mx-auto my-8 scale-75 md:scale-100">
            {/* Rotating Rings */}
            {[...Array(3)].map((_, i) => (
                <motion.div
                    key={i}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10 - i * 2, repeat: Infinity, ease: "linear", repeatType: "loop" }}
                    className={cn(
                        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#ea580c]/30",
                        i === 0 ? "h-64 w-64 border-2 opacity-20" : "",
                        i === 1 ? "h-48 w-48 border opacity-40" : "",
                        i === 2 ? "h-32 w-32 border-2 opacity-60" : ""
                    )}
                    style={{ borderStyle: i % 2 === 0 ? "solid" : "dashed" }}
                />
            ))}

            {/* Central Pulse */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute h-16 w-16 rounded-full bg-orange-500 blur-xl opacity-50"
                />
                <Cpu className="relative z-10 h-10 w-10 text-orange-400" />
            </div>

            {/* Orbiting Data Points */}
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
            >
                <div className="absolute top-0 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-orange-300 shadow-[0_0_10px_cyan]" />
            </motion.div>
        </div>
    )
}

// 3. Holographic Button
export function HoloButton({ text, onClick }) {
    return (
        <button onClick={onClick} className="group relative overflow-hidden bg-orange-500/10 px-8 py-3 font-mono text-sm font-bold uppercase tracking-widest text-orange-400 transition-all hover:bg-orange-500 hover:text-black">
            <span className="relative z-10 flex items-center gap-2">
                {text} <ChevronRight className="h-4 w-4" />
            </span>
            {/* Scanline hover effect */}
            <div className="absolute inset-0 -translate-y-full bg-gradient-to-b from-transparent via-white/20 to-transparent transition-transform duration-300 group-hover:translate-y-full" />
            {/* Border corners */}
            <div className="absolute top-0 left-0 h-2 w-2 border-l-2 border-t-2 border-orange-400" />
            <div className="absolute bottom-0 right-0 h-2 w-2 border-r-2 border-b-2 border-orange-400" />
        </button>
    );
}
