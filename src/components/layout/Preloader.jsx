'use client';

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useHeroStore } from "@/store/heroStore";
import { Terminal } from "lucide-react";

export default function Preloader() {
    const setLoaded = useHeroStore((state) => state.setLoaded);
    const [done, setDone] = useState(false);
    
    // Core structure refs
    const containerRef = useRef(null);
    const leftDoorRef = useRef(null);
    const rightDoorRef = useRef(null);
    
    // UI elements
    const lineRef = useRef(null);
    const numberRef = useRef(null);
    const wrapperRef = useRef(null);
    const glitchTextRef = useRef(null);

    const DUMMY_STRINGS = [
        "SYS.ALLOCATING_MEMORY...",
        "MOUNTING_LOCAL_DRIVES...",
        "DECRYPTING_USER_PAYLOAD...",
        "BYPASSING_FIREWALL...",
        "ESTABLISHING_UPLINK..."
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

            // 0. Setup initial states
            gsap.set(lineRef.current, { scaleX: 0, rotation: 0 });
            gsap.set(numberRef.current, { y: 50, opacity: 0 });
            gsap.set(glitchTextRef.current, { y: -50, opacity: 0 });

            // 1. Ignite the central horizon line
            tl.to(lineRef.current, { scaleX: 1, duration: 0.8, ease: "power4.inOut" }, 0);
            
            // 2. Text pops out from behind the line
            tl.to(numberRef.current, { y: 0, opacity: 1, duration: 0.8, ease: "expo.out" }, 0.5);
            tl.to(glitchTextRef.current, { y: 0, opacity: 1, duration: 0.8, ease: "expo.out" }, 0.5);

            // 3. Counter and Fake Data Sequence
            const counter = { val: 0 };
            let lastProg = -1;
            let lastStrIndex = -1;
            
            tl.to(counter, {
                val: 100,
                duration: 2.2, // Fast, punchy load
                ease: "power2.inOut",
                onUpdate: () => {
                    const prog = Math.round(counter.val);
                    if (prog !== lastProg) {
                        if (numberRef.current) {
                            numberRef.current.innerText = prog.toString() + "%";
                        }
                        
                        // Optimized: Only mutate DOM for text glitch if string ACTUALLY changes!
                        if (glitchTextRef.current) {
                            const strIndex = Math.min(Math.floor((prog / 100) * DUMMY_STRINGS.length), DUMMY_STRINGS.length - 1);
                            if (strIndex !== lastStrIndex) {
                                glitchTextRef.current.innerText = DUMMY_STRINGS[strIndex];
                                lastStrIndex = strIndex;
                            }
                        }
                        lastProg = prog;
                    }
                }
            }, 0.8);

            // 4. The 100% Climax (Wait securely for viewers to see 100%)
            // The loading finishes at time 3.0 (0.8 + 2.2). We wait 0.4s.
            
            // Text shrinks and vanishes into the line
            tl.to(numberRef.current, { y: 50, opacity: 0, duration: 0.4, ease: "power3.in" }, 3.4);
            tl.to(glitchTextRef.current, { y: -50, opacity: 0, duration: 0.4, ease: "power3.in" }, 3.4);

            // 5. The line violently rotates 90 degrees to form a vertical slice
            tl.to(lineRef.current, { rotation: 90, scaleX: 2, duration: 0.6, ease: "back.inOut(1.5)" }, 3.7);

            // 6. The line explodes wider into a blinding flash
            tl.to(lineRef.current, { scaleY: 100, opacity: 0, duration: 0.4, ease: "power4.in" }, 4.3);

            // 7. The vertical Vault Doors physically slide apart!
            tl.to(leftDoorRef.current, { x: "-100%", duration: 1.2, ease: "power4.inOut" }, 4.5);
            tl.to(rightDoorRef.current, { x: "100%", duration: 1.2, ease: "power4.inOut" }, 4.5);

        }, containerRef);

        return () => ctx.revert();
    }, [setLoaded]);

    if (done) return null;

    return (
        <div ref={containerRef} className="fixed inset-0 z-[1000] flex pointer-events-none select-none overflow-hidden bg-transparent">
            
            {/* The Vertical Vault Doors (Left and Right Split) - Removed heavy box shadows for massive performance boost during slide */}
            <div 
                ref={leftDoorRef} 
                className="absolute top-0 left-0 w-1/2 h-full bg-[#030305] z-40 border-r border-orange-500/20" 
            />
            <div 
                ref={rightDoorRef} 
                className="absolute top-0 right-0 w-1/2 h-full bg-[#030305] z-40 border-l border-orange-500/20" 
            />
            
            {/* The Animated UI Canvas layer (Over the doors) */}
            <div className="absolute inset-0 z-50 flex items-center justify-center">
                
                {/* Visual Line (The active geometric slicer) - Removed mix-blend-screen for performance */}
                <div 
                    ref={lineRef} 
                    className="absolute w-3/4 md:w-1/2 h-[2px] bg-orange-500 origin-center" 
                />

                {/* Typography Wrapper */}
                <div ref={wrapperRef} className="relative flex flex-col items-center justify-center w-full h-full overflow-hidden">
                    
                    {/* TOP SECTION: Massive Numeric Counter */}
                    <div className="absolute bottom-[50%] mb-4 flex items-end">
                        <span 
                            ref={numberRef} 
                            // Removed heavy drop shadow for buttery smooth 60fps tracking
                            className="text-7xl md:text-9xl font-black text-white tracking-tighter tabular-nums"
                            style={{ fontFamily: 'var(--font-sans)', transform: 'translateY(50px)' }}
                        >
                            0%
                        </span>
                    </div>

                    {/* BOTTOM SECTION: Glitching Status Codes */}
                    <div className="absolute top-[50%] mt-6 flex items-center gap-3">
                        {/* Changed animate-pulse to static to avoid CSS thread conflict with GSAP */}
                        <Terminal size={16} className="text-orange-500" />
                        <span 
                            ref={glitchTextRef} 
                            // Removed heavy drop shadow
                            className="font-mono text-[10px] md:text-xs text-orange-400 tracking-[0.3em] uppercase"
                            style={{ transform: 'translateY(-50px)' }}
                        >
                            INITIALIZING_SYSTEM...
                        </span>
                    </div>
                </div>

            </div>

            {/* Corner Decorative Borders */}
            <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-orange-500/30 z-50 rounded-tl-xl opacity-50" />
            <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-orange-500/30 z-50 rounded-tr-xl opacity-50" />
            <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-orange-500/30 z-50 rounded-bl-xl opacity-50" />
            <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-orange-500/30 z-50 rounded-br-xl opacity-50" />

        </div>
    );
}