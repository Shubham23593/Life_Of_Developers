'use client';

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useHeroStore } from "@/store/heroStore";
import { Cpu, TerminalSquare, Rss } from "lucide-react";

export default function Preloader() {
    const setLoaded = useHeroStore((state) => state.setLoaded);
    const [done, setDone] = useState(false);
    
    // Core Refs
    const containerRef = useRef(null);
    const hudGroupRef = useRef(null);
    
    // SVG Parts
    const progressCircleRef = useRef(null);
    const outerRingRef = useRef(null);
    const innerRingRef = useRef(null);

    // Text Parts
    const numberRef = useRef(null);
    const logsRef = useRef([]);
    const flashRef = useRef(null);

    const radius = 140;
    const circumference = 2 * Math.PI * radius;

    const DATA_LOGS = [
        "BOOTING KERNEL SYS.01...",
        "MOUNTING ALGORITHMS...",
        "COMPILING SHADER MATRICES...",
        "AWAITING DEPLOYMENT PROTOCOL...",
        "ESTABLISHED."
    ];

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                onComplete: () => {
                    document.body.style.overflow = '';
                    setLoaded();
                    setDone(true);
                }
            });

            const counter = { val: 0 };

            // 1. Initial 3D Pop-In (The Reactor Assemblies!)
            gsap.set(outerRingRef.current, { scale: 0, rotationZ: -180, opacity: 0 });
            gsap.set(innerRingRef.current, { scale: 0, rotationZ: 180, opacity: 0 });
            gsap.set(progressCircleRef.current, { strokeDashoffset: circumference });
            gsap.set(flashRef.current, { opacity: 0 });

            tl.to(outerRingRef.current, { scale: 1, rotationZ: 0, opacity: 1, duration: 1.5, ease: 'back.out(1)' }, 0);
            tl.to(innerRingRef.current, { scale: 1, rotationZ: 0, opacity: 1, duration: 1.5, ease: 'back.out(1.5)' }, 0.2);

            // 2. Continuous Ambient Spin
            gsap.to(outerRingRef.current, { rotationZ: '+=360', duration: 10, repeat: -1, ease: 'none' });
            gsap.to(innerRingRef.current, { rotationZ: '-=360', duration: 8, repeat: -1, ease: 'none' });

            // 3. The Central Math Sequence (0 to 100)
            tl.to(counter, {
                val: 100,
                duration: 2.5,
                ease: "power2.inOut",
                onUpdate: () => {
                    const prog = Math.round(counter.val);
                    
                    // Update numeric core
                    if (numberRef.current) numberRef.current.innerText = prog.toString();

                    // Update actual SVG circle draw!
                    if (progressCircleRef.current) {
                        const offset = circumference - (prog / 100) * circumference;
                        gsap.set(progressCircleRef.current, { strokeDashoffset: offset });
                    }
                }
            }, 1.0);

            // 4. Staggering Fake Log Sequence tied perfectly to the 2.5s numeric load
            tl.fromTo(logsRef.current, 
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.3, stagger: 2.5 / 5, ease: 'power2.out' }, // Divides time by 5 logs
                1.0
            );

            // 5. THE CLIMAX DETONATION (At EXACTLY 100%)
            // Pulse the reactor larger
            tl.to(hudGroupRef.current, { scale: 1.1, filter: 'brightness(1.5)', duration: 0.2, ease: 'power2.out' }, 3.5);

            // FLASH WHITE!
            tl.to(flashRef.current, { opacity: 1, duration: 0.1 }, 3.6);

            // Instant Implosion (Collapse reactor to pixel size)
            tl.to(hudGroupRef.current, { scale: 0, opacity: 0, duration: 0.5, ease: 'back.in(2)' }, 3.7);

            // Fade the white flash back out beautifully to reveal the native 3D site completely loaded!
            tl.to(flashRef.current, { opacity: 0, duration: 0.8, ease: 'power2.inOut' }, 3.8);

        }, containerRef);

        return () => ctx.revert();
    }, [setLoaded, circumference]);

    if (done) return null;

    return (
        <div ref={containerRef} className="fixed inset-0 z-[1000] bg-[#020202] flex items-center justify-center overflow-hidden pointer-events-none select-none">
            
            {/* The Solid Flash Detonator Screen */}
            <div ref={flashRef} className="absolute inset-0 bg-white z-50 pointer-events-none opacity-0 mix-blend-screen" />

            {/* --- THE MASTER HUD GROUP --- */}
            <div ref={hudGroupRef} className="relative flex items-center justify-center w-[400px] h-[400px]">
                
                {/* 1. The Core SVG Ring Structure */}
                <svg className="absolute inset-0 w-full h-full -rotate-90 overflow-visible drop-shadow-[0_0_20px_rgba(249,115,22,0.4)]">
                    
                    <defs>
                        <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#facc15" />
                            <stop offset="50%" stopColor="#f97316" />
                            <stop offset="100%" stopColor="#ea580c" />
                        </linearGradient>
                    </defs>

                    {/* Faded Background Track */}
                    <circle 
                        cx="200" cy="200" r={radius} 
                        stroke="rgba(249,115,22,0.05)" 
                        strokeWidth="12" 
                        fill="none" 
                    />

                    {/* The Active Drawing GSAP Progress Bar Line */}
                    <circle 
                        ref={progressCircleRef}
                        cx="200" cy="200" r={radius} 
                        stroke="url(#glowGradient)" 
                        strokeWidth="12" 
                        strokeLinecap="round" 
                        fill="none" 
                        style={{ strokeDasharray: circumference, strokeDashoffset: circumference }} 
                        className="transition-all duration-[50ms]"
                    />
                </svg>

                {/* 2. Outer Complex Geometries (CSS Based) */}
                <div 
                    ref={outerRingRef}
                    className="absolute w-[360px] h-[360px] rounded-full border border-orange-500/20 shadow-[inset_0_0_50px_rgba(249,115,22,0.1)] flex items-center justify-center"
                    style={{ borderStyle: 'dashed', borderWidth: '1px', borderDasharray: '4 12' }}
                >
                    <div className="absolute top-0 w-2 h-4 bg-orange-500 rounded-full drop-shadow-[0_0_10px_#f97316]" />
                    <div className="absolute bottom-0 w-2 h-4 bg-orange-500 rounded-full drop-shadow-[0_0_10px_#f97316]" />
                </div>

                {/* 3. Inner Complex Geometries (CSS Based) */}
                <div 
                    ref={innerRingRef}
                    className="absolute w-[220px] h-[220px] rounded-full border-2 border-orange-400/40"
                    style={{ borderStyle: 'dotted', borderDasharray: '2 8' }}
                >
                     <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-2 bg-orange-400 rounded-full" />
                     <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-2 bg-orange-400 rounded-full" />
                </div>

                {/* 4. The Numeric Display Engine inside the Rings */}
                <div className="absolute flex flex-col items-center justify-center">
                    <Rss size={20} className="text-orange-500/50 mb-2 animate-pulse" />
                    
                    <div className="flex items-start text-orange-400 drop-shadow-[0_0_30px_#f97316]">
                        <span 
                            ref={numberRef} 
                            className="text-7xl font-black tracking-tighter tabular-nums leading-none"
                            style={{ fontFamily: 'var(--font-sans)', transform: 'translateY(5px)' }}
                        >
                            0
                        </span>
                        <span className="text-2xl font-bold mt-2 ml-1 opacity-50">%</span>
                    </div>

                    <span className="font-mono text-[9px] text-orange-400/80 tracking-[0.3em] uppercase mt-4">
                        SYSTEM . CORE
                    </span>
                </div>

            </div>

            {/* --- THE SIDE DIAGNOSTIC UI --- */}
            
            {/* Left Data Logs */}
            <div className="absolute bottom-12 left-12 flex flex-col gap-1 hidden md:flex">
                <div className="flex items-center gap-2 mb-2">
                     <Cpu size={14} className="text-orange-500" />
                     <span className="font-mono text-xs font-bold text-orange-500 tracking-widest uppercase">
                         Diagnostics
                     </span>
                </div>
                {DATA_LOGS.map((log, i) => (
                    <span 
                        key={i} 
                        ref={el => logsRef.current[i] = el}
                        className="font-mono text-[10px] text-slate-400 tracking-widest uppercase opacity-0"
                    >
                        {log}
                    </span>
                ))}
            </div>

            {/* Right Matrix Output */}
            <div className="absolute bottom-12 right-12 hidden md:flex flex-col items-end gap-1 opacity-30">
                 <TerminalSquare size={24} className="text-orange-500 mb-2" />
                 <span className="font-mono text-[10px] text-white tracking-[0.2em]">[ OK ] PORT_3000</span>
                 <span className="font-mono text-[10px] text-white tracking-[0.2em]">[ OK ] DOM_RENDERED</span>
                 <span className="font-mono text-[10px] text-white tracking-[0.2em]">[ OK ] WEBGL_MOUNTED</span>
                 <div className="w-12 h-px bg-orange-500 mt-2" />
            </div>

        </div>
    );
}