'use client';

import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code2, Palette, Braces, Layers, Atom, Server, Database, Box } from 'lucide-react';

// Using 8 modules to populate the massive horizontal timeline
const MODULES = [
    { id: 'html', label: 'HTML5', desc: 'Architecting the DOM', icon: <Code2 size={40} />, color: 'text-orange-500', glow: 'shadow-[0_0_30px_#f97316]' },
    { id: 'css', label: 'CSS3', desc: 'Visual Fidelity', icon: <Palette size={40} />, color: 'text-blue-400', glow: 'shadow-[0_0_30px_#60a5fa]' },
    { id: 'js', label: 'JAVASCRIPT', desc: 'Dynamic Logic', icon: <Braces size={40} />, color: 'text-yellow-400', glow: 'shadow-[0_0_30px_#facc15]' },
    { id: 'react', label: 'REACT.JS', desc: 'Component Systems', icon: <Atom size={40} />, color: 'text-cyan-400', glow: 'shadow-[0_0_30px_#22d3ee]' },
    { id: 'node', label: 'NODE.JS', desc: 'Backend Engineering', icon: <Server size={40} />, color: 'text-green-500', glow: 'shadow-[0_0_30px_#22c55e]' },
    { id: 'db', label: 'DATABASES', desc: 'State Persistence', icon: <Database size={40} />, color: 'text-emerald-400', glow: 'shadow-[0_0_30px_#34d399]' },
    { id: 'docker', label: 'DOCKER', desc: 'Containerization', icon: <Box size={40} />, color: 'text-blue-500', glow: 'shadow-[0_0_30px_#3b82f6]' },
    { id: 'fw', label: 'FRAMEWORKS', desc: 'Scaling the Build', icon: <Layers size={40} />, color: 'text-purple-400', glow: 'shadow-[0_0_30px_#c084fc]' },
];

export default function BlueprintAssembly() {
    const wrapperRef = useRef(null);
    const containerRef = useRef(null);
    const horizontalTrackRef = useRef(null);
    
    const uiRef = useRef(null);
    const charAreaRef = useRef(null);
    const textRef = useRef(null);
    const cardsRef = useRef([]);

    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        let ctx = gsap.context(() => {
            if (!wrapperRef.current || !containerRef.current || !horizontalTrackRef.current) return;

            // Helper to get total scrollable width of the horizontal track
            const getScrollAmount = () => {
                let trackWidth = horizontalTrackRef.current.scrollWidth;
                return -(trackWidth - window.innerWidth);
            };

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: wrapperRef.current,
                    pin: containerRef.current,
                    start: 'top top',
                    end: () => `+=${getScrollAmount() * -1}`, // 1px horizontal scroll = 1px vertical scroll length
                    scrub: 1,
                    invalidateOnRefresh: true, // Recalculates on window resize
                },
            });

            // 1. Initial Animations (Fading in the left HUD)
            gsap.set(uiRef.current, { x: -50, opacity: 0 });
            gsap.set(charAreaRef.current, { y: 100, opacity: 0 });
            gsap.set(textRef.current, { x: -50, opacity: 0 });
            gsap.set(cardsRef.current, { y: 100, opacity: 0, scale: 0.8 });

            tl.to(uiRef.current, { x: 0, opacity: 1, duration: 2, ease: "power2.out" }, 0);
            tl.to(charAreaRef.current, { y: 0, opacity: 1, duration: 2.5, ease: "power3.out" }, 0);
            tl.to(textRef.current, { x: 0, opacity: 1, duration: 2, ease: "power2.out" }, 0.5);

            // 2. Fly in the massive horizontal cards simultaneously as scrub starts
            tl.to(cardsRef.current, {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 4,
                stagger: 0.5,
                ease: "back.out(1.2)"
            }, 0);

            // 3. THE MAGIC: Horizontal Native Scrolling
            tl.to(horizontalTrackRef.current, {
                x: getScrollAmount,
                duration: 20, // Long duration translates to the immense scroll distance
                ease: "none"
            }, 1);

            // 4. Highlight climax
            tl.to(charAreaRef.current, {
                filter: 'drop-shadow(0 0 50px rgba(6,182,212,0.8))',
                duration: 5,
            }, 15);

            tl.to({}, { duration: 2 }); // Pad end

        }, wrapperRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={wrapperRef} className="relative w-full overflow-hidden bg-transparent">
            {/* The Pinned Window Container */}
            <section ref={containerRef} className="relative h-screen w-full flex items-center bg-transparent overflow-hidden">
                
                {/* --- 1. LEFT STATIC COLUMN (The Dashboard HUD) --- */}
                {/* Fixed rigidly to the left side, z-index 40 so it floats OVER the horizontally scrolling cards */}
                <div className="absolute top-0 left-0 w-full lg:w-[35%] h-full flex flex-col justify-between pt-8 md:pt-12 px-6 md:px-12 z-40 bg-gradient-to-r from-[#030305] via-[#050508]/90 to-transparent pointer-events-none">
                    
                    {/* Top HUD Title */}
                    <div ref={uiRef}>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] md:text-xs tracking-[0.4em] text-orange-400 uppercase font-mono">
                                PHASE // 03
                            </span>
                            <div className="h-px w-10 md:w-20 bg-gradient-to-r from-orange-400 to-transparent" />
                        </div>
                        <h2
                            className="text-4xl md:text-5xl lg:text-7xl font-bold text-orange-400/95 tracking-tighter mt-3 uppercase drop-shadow-[0_0_20px_rgba(234,88,12,0.4)]"
                            style={{ fontFamily: "var(--font-sans)" }}
                        >
                            LEARNING <br className="hidden lg:block"/> & GROWTH
                        </h2>
                    </div>

                    {/* Middle Narrative Box */}
                    <div ref={textRef} className="w-full max-w-sm border-l-4 border-orange-500 pl-6 py-6 bg-black/40 backdrop-blur-md rounded-r-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] mt-auto mb-[5vh] pointer-events-auto">
                        <p className="text-slate-300 font-mono text-xs md:text-sm lg:text-base leading-relaxed">
                            I started understanding… Building… breaking… learning… My ideas turned into real projects. From simple pages to complex applications.
                        </p>
                    </div>

                    {/* Bottom Floating Developer */}
                    <div ref={charAreaRef} className="relative w-[150px] md:w-[220px] lg:w-[280px] z-30 drop-shadow-[0_20px_40px_rgba(234,88,12,0.3)] mb-[2vh]">
                        <img
                            src="/standing-dev.png"
                            alt="Developer Growth"
                            className="w-full h-auto object-contain filter contrast-125"
                            onError={(e) => e.target.style.display = 'none'}
                        />
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[120%] h-3 bg-orange-500/30 blur-[15px] rounded-[100%]" />
                    </div>

                </div>

                {/* --- 2. THE HORIZONTAL SCROLLING TIMELINE TRACK --- */}
                {/* Starts from the right margin, extends 500vw off-screen, and travels left perfectly via GSAP */}
                <div className="absolute top-0 left-0 h-full w-full flex items-center z-20 pointer-events-none">
                    <div 
                        ref={horizontalTrackRef} 
                        className="flex items-center pl-[20%] md:pl-[40vw] pr-[20vw] gap-8 md:gap-16 w-max pointer-events-auto shrink-0"
                    >
                        {MODULES.map((mod, i) => (
                            <div 
                                key={mod.id}
                                ref={el => cardsRef.current[i] = el}
                                className="group relative shrink-0 w-[240px] md:w-[320px] lg:w-[400px] h-[360px] md:h-[450px] bg-[#050508]/80 backdrop-blur-xl border border-orange-500/20 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 hover:border-orange-500/80 hover:-translate-y-4 hover:shadow-[0_30px_60px_rgba(234,88,12,0.3)] cursor-crosshair flex flex-col justify-between p-8 md:p-10"
                            >
                                {/* Diagonal Glare Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                
                                {/* Top: Icon and Circuit logic */}
                                <div className="flex justify-between items-start w-full relative z-10">
                                    <div className={`p-4 md:p-5 rounded-2xl bg-black/40 border border-orange-500/20 transition-all duration-500 group-hover:scale-110 group-hover:${mod.glow}`}>
                                        <div className={`${mod.color} drop-shadow-[0_0_10px_currentColor] opacity-80 group-hover:opacity-100`}>
                                            {mod.icon}
                                        </div>
                                    </div>
                                    <div className="font-mono text-[10px] md:text-xs text-orange-500/50 uppercase tracking-widest">
                                        PHASE_03_{String(i + 1).padStart(2, '0')}
                                    </div>
                                </div>

                                {/* Graphic Centerpiece */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[1px] bg-gradient-to-r from-transparent via-orange-500/10 to-transparent -rotate-45 pointer-events-none" />
                                
                                {/* Bottom: Typography */}
                                <div className="flex flex-col gap-2 relative z-10">
                                    <div className="h-px w-12 bg-orange-500/40 group-hover:w-full group-hover:bg-orange-500 transition-all duration-700 ease-out mb-2" />
                                    <h3 className="font-sans text-2xl md:text-3xl lg:text-4xl font-bold text-slate-100 uppercase tracking-tighter group-hover:text-white transition-colors">
                                        {mod.label}
                                    </h3>
                                    <p className="font-mono text-xs md:text-sm text-slate-400 group-hover:text-orange-200/80 transition-colors">
                                        {mod.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </section>
        </div>
    );
}