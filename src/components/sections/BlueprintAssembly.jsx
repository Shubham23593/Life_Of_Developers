'use client';

import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code2, Palette, Braces, Layers } from 'lucide-react';
import { CoreVisualizer } from '@/components/SciFiUI';

const MODULES = [
    { id: 'html', label: 'HTML', fromX: -200, fromY: -200, posClasses: "-top-10 -left-10 md:-top-16 md:-left-16", icon: <Code2 size={24} /> },
    { id: 'css', label: 'CSS', fromX: 200, fromY: -200, posClasses: "-top-10 -right-10 md:-top-16 md:-right-16", icon: <Palette size={24} /> },
    { id: 'js', label: 'JAVASCRIPT', fromX: -200, fromY: 200, posClasses: "-bottom-10 -left-10 md:-bottom-16 md:-left-16", icon: <Braces size={24} /> },
    { id: 'fw', label: 'FRAMEWORKS', fromX: 200, fromY: 200, posClasses: "-bottom-10 -right-10 md:-bottom-16 md:-right-16", icon: <Layers size={24} /> },
];

export default function BlueprintAssembly() {
    const wrapperRef = useRef(null);
    const containerRef = useRef(null);
    const charAreaRef = useRef(null);
    const narrativeRef = useRef(null);
    const coreRef = useRef(null);
    const modulesRef = useRef([]);

    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        let ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: wrapperRef.current,
                    pin: true,
                    start: 'top top',
                    end: '+=300%', // 3 viewport heights of scrolling
                    scrub: 1,
                },
            });

            // 1. Text & Character Fade In
            tl.fromTo(narrativeRef.current,
                { x: -50, opacity: 0 },
                { x: 0, opacity: 1, duration: 1 }
            );

            tl.fromTo(charAreaRef.current,
                { y: 200, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
                "<0.2" // Start slightly after narrative
            );

            // 2. Core Server Pulses In
            tl.fromTo(coreRef.current,
                { scale: 0, opacity: 0, rotation: -90 },
                { scale: 1, opacity: 1, rotation: 0, duration: 1, ease: "back.out(1.5)" }
            );

            // 3. Modules Fly In from corners
            MODULES.forEach((mod, i) => {
                tl.from(modulesRef.current[i],
                    { x: mod.fromX, y: mod.fromY, opacity: 0, scale: 0.5, duration: 1, ease: "back.out(1.2)" },
                    "-=0.6"
                );
            });

            tl.to({}, { duration: 0.5 }); // Breathing room at the end

        }, wrapperRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={wrapperRef} className="relative w-full bg-transparent overflow-hidden">
            <section ref={containerRef} className="relative h-screen w-full flex flex-col md:flex-row bg-transparent">

                {/* --- 1. BACKGROUND LAYER --- */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.10]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(249,115,22, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22, 0.4) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000000_90%)] pointer-events-none" />

                {/* --- 2. TITLE (Top Left) --- */}
                <div className="absolute top-8 left-6 md:top-12 md:left-12 z-50 pointer-events-none">
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] md:text-xs tracking-[0.4em] text-orange-400 uppercase font-mono">
                            PHASE // 03
                        </span>
                        <div className="h-px w-10 bg-gradient-to-r from-orange-400 to-transparent" />
                    </div>
                    <h2
                        className="text-3xl md:text-5xl lg:text-6xl font-bold text-orange-400/95 tracking-tighter mt-3"
                        style={{ fontFamily: "var(--font-sans)" }}
                    >
                        LEARNING & GROWTH
                    </h2>
                </div>

                {/* --- 3. LEFT SIDE: NARRATIVE & CHARACTER --- */}
                <div className="relative w-full md:w-1/2 h-[50vh] md:h-full flex flex-col justify-end md:justify-center pt-[120px] md:pt-[200px] px-6 md:pl-12 md:pr-0 z-30">
                    
                    {/* Text Narrative */}
                    <div ref={narrativeRef} className="max-w-md relative z-40 will-change-transform">
                        <p className="text-slate-400 font-mono text-sm md:text-base leading-relaxed border-l-2 border-orange-400/50 pl-6 bg-orange-500/5 py-4 rounded-r-lg backdrop-blur-sm">
                            I started understanding… Building… breaking… learning… My ideas turned into real projects. From simple pages to complex applications.
                        </p>
                    </div>

                    {/* CHARACTER ANCHOR */}
                    <div ref={charAreaRef} className="absolute bottom-0 right-0 md:right-10 w-[60%] md:w-[70%] max-w-[250px] md:max-w-[350px] z-20 pointer-events-none flex flex-col items-center will-change-transform">
                        <img
                            src="/standing-dev.png"
                            alt="Standing Developer"
                            className="w-full h-auto object-contain drop-shadow-[0_-10px_30px_rgba(249,115,22,0.15)]"
                            onError={(e) => e.target.style.display = 'none'}
                        />
                        {/* Hover Pad (Cyan/Orange Energy Disc) */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-4 bg-orange-500/20 blur-xl rounded-full" />
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[60%] h-[2px] bg-gradient-to-r from-transparent via-orange-300 to-transparent blur-sm rounded-full" />
                    </div>
                </div>

                {/* --- 4. RIGHT SIDE: THE ARCHITECTURE HUB --- */}
                <div className="relative w-full md:w-1/2 h-[50vh] md:h-full flex items-center justify-center z-30 mt-8 md:mt-0">
                    
                    {/* A relative container to hold the absolute-positioned modules */}
                    <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
                        
                        {/* The Core Server Node */}
                        <div ref={coreRef} className="relative z-20 flex flex-col items-center justify-center group">
                            <CoreVisualizer />
                        </div>

                        {/* Animated Connection Modules */}
                        {MODULES.map((mod, i) => (
                            <div key={mod.id} 
                                 ref={el => modulesRef.current[i] = el}
                                 className={`absolute z-10 w-24 h-24 bg-transparent border border-[#ea580c]/30 rounded-xl flex flex-col items-center justify-center p-2 shadow-[0_0_15px_rgba(249,115,22,0.1)] overflow-hidden will-change-transform ${mod.posClasses}`}
                            >
                                <div className="text-orange-400 mb-1 opacity-80">{mod.icon}</div>
                                <span className="font-mono text-orange-200 text-[10px] font-bold text-center leading-tight tracking-wider">{mod.label}</span>
                                
                                {/* Top highlight */}
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-300/50 to-transparent" />
                            </div>
                        ))}

                    </div>
                </div>

            </section>
        </div>
    );
}