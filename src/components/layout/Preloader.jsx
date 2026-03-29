"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Terminal, ShieldAlert } from "lucide-react";
import { useHeroStore } from "@/store/heroStore";

// --- Internal Tech Components for Preloader --- //

const LiveData = ({ min, max, label, unit }) => {
    const [val, setVal] = useState(min);
    useEffect(() => {
        const interval = setInterval(() => {
            setVal(v => Math.max(min, Math.min(max, v + (Math.random() - 0.5) * 5)));
        }, 100);
        return () => clearInterval(interval);
    }, [min, max]);

    return (
        <div className="flex flex-col font-mono text-xs">
            <span className="text-neutral-500 uppercase tracking-widest text-[9px] mb-0.5">{label}</span>
            <div className="flex items-baseline gap-1">
                <span className="text-orange-400 font-bold">{val.toFixed(2)}</span>
                <span className="text-orange-400/50">{unit}</span>
            </div>
        </div>
    );
};

const steps = [
    { p: 0, head: "SYS.BOOT", desc: "Initializing developer workspace..." },
    { p: 25, head: "ENV.SYNC", desc: "Establishing local server..." },
    { p: 55, head: "NPM.INSTALL", desc: "Resolving dependencies..." },
    { p: 85, head: "COMPILING", desc: "Building assets..." },
    { p: 100, head: "ONLINE", desc: "Hello World. Ready." }
];

const Preloader = () => {
    const setLoaded = useHeroStore((state) => state.setLoaded);
    const [count, setCount] = useState(0);
    const [activeStep, setActiveStep] = useState(steps[0]);
    const [done, setDone] = useState(false);

    // Progression logic
    useEffect(() => {
        const timer = setInterval(() => {
            setCount((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                const increment = prev < 30 ? 0.8 : prev < 70 ? 1.5 : 0.5;
                const next = prev + increment;
                return next > 100 ? 100 : next;
            });
        }, 40);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const current = steps.findLast(s => count >= s.p);
        if (current) setActiveStep(current);
        
        if (count === 100) {
            const timeout = setTimeout(() => {
                setDone(true);
                setLoaded();
            }, 1200);
            return () => clearTimeout(timeout);
        }
    }, [count, setLoaded]);

    return (
        <AnimatePresence>
            {!done && (
                <motion.div 
                    key="preloader-operator"
                    initial={{ opacity: 1 }}
                    exit={{ 
                        opacity: 0, 
                        scale: 1.1,
                        filter: "blur(10px)",
                        transition: { duration: 1.2, ease: [0.8, 0, 0.1, 1] } 
                    }}
                    className="fixed inset-0 z-[1000] bg-slate-950 flex items-center justify-center overflow-hidden selection:bg-orange-500/30"
                >
                    {/* 1. SCANNING GRID BACKGROUND */}
                    <div className="absolute inset-0 pointer-events-none z-0">
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]" />
                        <motion.div
                            animate={{ top: ["-10%", "110%"] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-400/50 to-transparent shadow-[0_0_20px_rgba(249,115,22,0.5)]"
                        />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_85%)]" />
                    </div>

                    {/* 2. TOP HUD ELEMENTS */}
                    <div className="absolute top-8 left-8 right-8 flex justify-between items-start z-20 pointer-events-none hidden md:flex">
                        <div className="flex gap-8">
                            <LiveData min={12} max={24} label="NET_LATENCY" unit="ms" />
                            <LiveData min={3.2} max={4.1} label="CPU_CLOCK" unit="GHz" />
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <ShieldAlert className="w-4 h-4 text-orange-400/50 mb-1" />
                            <span className="text-orange-400/70 font-mono text-[9px] tracking-widest uppercase">Encryption_Valid</span>
                            <span className="text-slate-200/80 font-mono text-[9px] tracking-[0.3em]">NODE_MUMBAI</span>
                        </div>
                    </div>

                    {/* 3. CENTRAL CORE & COUNTER */}
                    <div className="relative z-10 flex flex-col items-center justify-center w-full">
                        
                        {/* Robotic Core Rings around the number */}
                        <div className="absolute flex items-center justify-center pointer-events-none">
                            {[...Array(3)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                                    transition={{ duration: 15 - i * 3, repeat: Infinity, ease: "linear" }}
                                    className={`absolute rounded-full border border-orange-400/20`}
                                    style={{
                                        width: `${320 + i * 80}px`,
                                        height: `${320 + i * 80}px`,
                                        borderStyle: i === 1 ? "dashed" : "solid",
                                        opacity: 0.3 + (i * 0.1)
                                    }}
                                />
                            ))}
                            {/* Cyan orbiting data point */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                className="absolute w-[400px] h-[400px]"
                            >
                                <div className="absolute top-0 left-1/2 w-2 h-2 -translate-x-1/2 rounded-full bg-orange-300 shadow-[0_0_15px_cyan]" />
                            </motion.div>
                        </div>

                        {/* The Percentage Counter */}
                        <div className="relative flex flex-col items-center">
                            <Cpu className="w-8 h-8 text-orange-400/50 mb-4 animate-pulse" />
                            <h1 
                                className="text-8xl md:text-[10rem] font-bold text-orange-400 leading-none tracking-tighter tabular-nums drop-shadow-[0_0_30px_rgba(249,115,22,0.3)]"
                                style={{ fontFamily: "var(--font-sans)" }}
                            >
                                {Math.floor(count).toString().padStart(3, '0')}
                                <span className="text-4xl md:text-6xl text-orange-400 ml-2">%</span>
                            </h1>
                        </div>
                    </div>

                    {/* 4. BOTTOM HUD & PROGRESS */}
                    <div className="absolute bottom-10 left-8 right-8 flex flex-col gap-6 z-20">
                        
                        {/* Cut-Corner Tech Card for Narrative */}
                        <div className="relative self-start border border-orange-400/20 bg-slate-950/80 p-4 backdrop-blur-md min-w-[300px]"
                             style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)" }}
                        >
                            {/* Corner Accents */}
                            <div className="absolute -left-[1px] -top-[1px] h-3 w-3 border-l border-t border-orange-400" />
                            
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeStep.head}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <Terminal className="w-3 h-3 text-orange-400" />
                                        <span className="text-orange-400 font-bold font-mono text-[10px] tracking-widest uppercase">
                                            {activeStep.head}
                                        </span>
                                    </div>
                                    <p className="text-slate-400 font-mono text-[11px] uppercase tracking-wide">
                                        {activeStep.desc}
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Segmented Loading Bar */}
                        <div className="relative w-full h-2 bg-slate-950 border border-white/5 flex gap-[2px] p-[2px]">
                            {/* Bar Brackets */}
                            <div className="absolute -left-2 -top-2 h-2 w-2 border-l border-t border-orange-400/50" />
                            <div className="absolute -right-2 -bottom-2 h-2 w-2 border-r border-b border-orange-400/50" />
                            
                            {Array.from({ length: 40 }).map((_, i) => (
                                <motion.div 
                                    key={i}
                                    className="flex-1 h-full bg-orange-500"
                                    animate={{ 
                                        opacity: count > (i * 2.5) ? 1 : 0.1,
                                        boxShadow: count > (i * 2.5) ? "0 0 10px rgba(249,115,22,0.5)" : "none"
                                    }}
                                    transition={{ duration: 0.1 }}
                                />
                            ))}
                        </div>

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Preloader;