"use client";

import React from "react";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

// Inline SVG Icons for Socials
const GithubIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
        <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
);

const LinkedinIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
    </svg>
);

const InstagramIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
);
import { HoloButton } from "@/components/SciFiUI";

export default function FinalCallToAction() {
    return (
        <section className="relative min-h-[100vh] w-full bg-[#020202] flex flex-col items-center justify-center overflow-hidden">
            
            {/* 1. Cinematic Background Layering */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.15)_0%,rgba(0,0,0,1)_70%)] pointer-events-none" />
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-orange-500/10 to-transparent" />

            {/* Scanning Laser Effect */}
            <motion.div
                animate={{ top: ["0%", "100%"] }}
                transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-400/80 to-transparent shadow-[0_0_20px_rgba(249,115,22,0.8)] opacity-60 pointer-events-none z-0"
            />
            
            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
            
            {/* 2. Main Narrative Content */}
            <div className="relative z-10 w-full max-w-5xl px-4 flex flex-col items-center justify-center">
                <motion.div 
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="flex flex-col items-center justify-center w-full gap-8 md:gap-12"
                >
                    {/* Typography Group */}
                    <div className="flex flex-col items-center  text-center gap-4 sm:gap-6">
                        {/* Epilogue Tag */}
                        {/* <div className="flex items-center gap-3 px-4 py-1.5 rounded-full border border-orange-500/20 bg-orange-500/5 backdrop-blur-md">
                            <Activity className="text-orange-400 w-4 h-4 animate-pulse" />
                            
                        </div> */}

                        {/* Massive Typography */}
                        <h2 className="text-[10vw] sm:text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-orange-300 to-orange-600 tracking-tighter leading-tight drop-shadow-[0_10px_40px_rgba(249,115,22,0.2)] pb-2">
                            Every developer <br className="hidden sm:block" /> has a story.
                        </h2>
                        
                        <p className="text-lg md:text-2xl text-slate-400 font-mono max-w-2xl leading-relaxed tracking-wide pt-2">
                            This is mine. <span className="text-orange-200/90 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">Start yours today.</span>
                        </p>
                    </div>
                    
                    {/* Interactive Group: HoloButton + Socials */}
                    <div className="flex flex-col items-center gap-16 mt-4 md:mt-8 w-full">
                        
                        {/* Primary Action Button Wrapper */}
                        <div className="flex items-center justify-center transform transition-transform hover:scale-105 duration-300">
                            <HoloButton text="INITIALIZE CONNECTION" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
                        </div>

                        {/* The Social Command Center */}
                        <div className="w-full max-w-2xl flex flex-col items-center relative">
                            {/* Decorative line spanning behind the socials */}
                            <div className="absolute top-1/2 -z-10 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2" />
                            
                            <div className="flex items-center gap-6 sm:gap-10 bg-[#060606] px-8 sm:px-12 py-4 rounded-full border border-orange-500/20 shadow-[0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-xl">
                                {/* Github */}
                                <a 
                                    href="https://github.com/Shubham23593" 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="group flex items-center justify-center p-3 rounded-full hover:bg-orange-500/10 transition-all duration-300 relative border border-transparent hover:border-orange-500/30"
                                >
                                    <GithubIcon className="w-6 h-6 sm:w-7 sm:h-7 text-slate-400 group-hover:text-amber-400 transition-colors duration-300" />
                                    <div className="absolute inset-0 bg-orange-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </a>

                                {/* LinkedIn */}
                                <a 
                                    href="https://www.linkedin.com/in/shubham-dalvi-7586b0342/" 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="group flex items-center justify-center p-3 rounded-full hover:bg-orange-500/10 transition-all duration-300 relative border border-transparent hover:border-orange-500/30"
                                >
                                    <LinkedinIcon className="w-6 h-6 sm:w-7 sm:h-7 text-slate-400 group-hover:text-orange-400 transition-colors duration-300" />
                                    <div className="absolute inset-0 bg-orange-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </a>

                                {/* Instagram */}
                                <a 
                                    href="https://www.instagram.com/shubham__7883/" 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="group flex items-center justify-center p-3 rounded-full hover:bg-orange-500/10 transition-all duration-300 relative border border-transparent hover:border-orange-500/30"
                                >
                                    <InstagramIcon className="w-6 h-6 sm:w-7 sm:h-7 text-slate-400 group-hover:text-red-400 transition-colors duration-300" />
                                    <div className="absolute inset-0 bg-red-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </a>
                            </div>
                            
                        </div>
                        
                    </div>

                </motion.div>
            </div>
            
            {/* 4. Terminal Footnotes */}
            <div className="absolute bottom-6 left-6 hidden lg:flex flex-col font-mono text-[9px] text-orange-500/40 tracking-widest leading-loose">
                <span>[SYS_STATUS]: ONLINE</span>
                <span>[DESTINATION]: OMNIVERSAL</span>
            </div>
            <div className="absolute bottom-6 right-6 hidden lg:flex flex-col font-mono text-[9px] text-orange-500/40 tracking-widest leading-loose text-right">
                <span>{new Date().getFullYear()} © SHUBHAM DALVI</span>
                <span>BUILD: V_1.0.0</span>
            </div>
        </section>
    );
}
