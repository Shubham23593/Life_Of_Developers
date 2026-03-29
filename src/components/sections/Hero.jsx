'use client';

import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotionValue } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useHeroStore } from '@/store/heroStore';
import { GridScanner } from '@/components/SciFiUI';
import Overlay from '@/components/layout/Overlay';
import { TerminalSquare, AlertCircle } from 'lucide-react';

// Lazy-load the R3F Three.js Canvas to avoid SSR hydration issues
const HeroScene = dynamic(() => import('@/components/canvas/HeroScene'), { ssr: false, loading: () => null });

const PHASES = [
    { id: '01', tag: 'THE SURFACE', sub: 'Confidence: 100%', body: 'Just watched a 10-minute "Become a Senior Dev" video. I am a God. I can build Facebook in a weekend. My code is poetic.' },
    { id: '02', tag: 'THE TWILIGHT ZONE', sub: 'Reality Check: 47 Tabs Open', body: 'Entered the MERN stack. Why is CSS like this? Why does "npm install" take 3 years? I spend 4 hours debugging a semicolon.' },
    { id: '03', tag: 'THE MIDNIGHT ABYSS', sub: 'The 3 AM Hallucinations', body: 'Training an AI model to solve my problems, but now the AI is also depressed. Stack Overflow is my only family now.' },
    { id: '04', tag: 'THE TRENCHES', sub: 'Final Boss: Deployment', body: 'It worked on my machine. It’s not working on the server. I am now 10% human, 90% caffeine, and 100% bugs. Scroll to witness the final merge conflict. ↓' },
];

export default function Hero() {
    const isLoaded = useHeroStore((s) => s.isLoaded);
    const scrollMV = useMotionValue(0);

    // DOM Refs
    const wrapperRef = useRef(null);
    const titleRef = useRef(null);
    const cardsRef = useRef([]);

    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        let ctx = gsap.context(() => {
            if (!wrapperRef.current) return;

            // We do NOT use GSAP `pin` to completely eliminate any collision bugs.
            // We animate strictly based on the CSS sticky tracking wrapper length (400vh).
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: wrapperRef.current,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 1,
                    onUpdate: (self) => {
                        // Crucial: Feed pure GSAP scroll progress (0-1) into Framer MotionValue 
                        // so the 3D `<HeroScene>` can natively interpret its camera path!
                        scrollMV.set(self.progress);
                    }
                },
            });

            // Set initial card states
            gsap.set(cardsRef.current, { opacity: 0, y: 150, rotationX: -45, transformPerspective: 1000 });

            // 1. Zoom out and fade the massive title early (0-15%)
            tl.to(titleRef.current, { 
                scale: 1.5, 
                opacity: 0, 
                filter: 'blur(30px)', 
                duration: 2, 
                ease: 'power2.in' 
            }, 0);

            // 2. Sequential "Apple Card Deck" Timeline
            let time = 2; // start after title fades
            const dur = 1.5; // time physically spent moving in/out
            const hold = 3.0; // time spending sitting stationary on screen for reading

            PHASES.forEach((phase, i) => {
                // Animate IN (flip up from bottom)
                tl.to(cardsRef.current[i], {
                    opacity: 1,
                    y: 0,
                    rotationX: 0,
                    duration: dur,
                    ease: 'back.out(1)'
                }, time);

                time += hold;

                // If NOT the last item, animate OUT (flip backward into the depth)
                if (i !== PHASES.length - 1) {
                    tl.to(cardsRef.current[i], {
                        opacity: 0,
                        y: -150,
                        rotationX: 45,
                        filter: 'blur(10px)',
                        duration: dur,
                        ease: 'power3.in'
                    }, time);
                    time += dur;
                }
            });

            tl.to({}, { duration: 1 }); // Bottom scroll padding to let the last card sit before Phase 2

        }, wrapperRef);

        return () => ctx.revert();
    }, [isLoaded]);

    return (
        /* The Absolute structural boundary: 400vh tall to guarantee zero layout collisions */
        <div ref={wrapperRef} className="relative w-full h-[400vh] bg-transparent">
            
            {/* The Sticky Fullscreen Lens */}
            <div className="sticky top-0 w-full h-screen overflow-hidden bg-black z-10 pointer-events-auto">
                
                {/* 1. Global Overlay transferred from page.js (Clock, etc) */}
                <Overlay isLoaded={isLoaded} />

                {/* 2. BACKGROUND: The Native 3D Laptop Environment (Full Screen, Highly Responsive) */}
                <div className="absolute inset-0 z-0">
                    {/* The 3D Scene */}
                    <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(3,3,5,0.7)_100%)]">
                        {isLoaded && <HeroScene scrollProgress={scrollMV} />}
                    </div>
                    {/* Grid overlay for aesthetic framing */}
                    <GridScanner />
                </div>

                {/* 3. FOREGROUND A: Massive Cinematic Typography (Centered initially) */}
                <div ref={titleRef} className="absolute inset-0 flex flex-col items-center justify-center -mt-[10%] z-20 pointer-events-none px-4">
                    <h1 
                        className="text-[14vw] sm:text-[13vw] md:text-[11vw] lg:text-[9vw] font-black tracking-tighter text-slate-100 uppercase leading-[0.85] w-full text-center drop-shadow-[0_20px_40px_rgba(249,115,22,0.3)] mix-blend-plus-lighter"
                        style={{ fontFamily: "var(--font-sans)" }}
                    >
                        LIFE OF
                    </h1>
                    <h1 
                        className="text-[14vw] sm:text-[13vw] md:text-[11vw] lg:text-[9vw] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-300 uppercase leading-[0.85] w-full text-center mix-blend-plus-lighter"
                        style={{ fontFamily: "var(--font-sans)" }}
                    >
                        DEVELOPER
                    </h1>
                </div>

                {/* 4. FOREGROUND B: Floating Narrative Tech Cards (Bottom pinned for Mobile Response) */}
                <div className="absolute bottom-6 md:bottom-12 inset-x-0 mx-auto z-30 flex justify-center px-4 md:px-8 w-full perspective-1000 h-[280px] md:h-[220px]">
                    {PHASES.map((phase, i) => (
                        <div 
                            key={phase.id}
                            ref={el => cardsRef.current[i] = el}
                            className="absolute bottom-0 w-full max-w-lg md:max-w-3xl bg-[#030305]/85 backdrop-blur-2xl border border-orange-500/30 rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9)] opacity-0 transform-style-3d pointer-events-auto"
                        >
                            <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6 relative">
                                
                                {/* 01 Header Side */}
                                <div className="flex flex-row md:flex-col justify-between items-center md:items-start w-full md:w-1/4 pb-3 md:pb-0 border-b md:border-b-0 md:border-r border-orange-500/20 md:pr-4">
                                    <h2 className="font-sans text-5xl md:text-6xl font-black text-white mix-blend-overlay">
                                        {phase.id}
                                    </h2>
                                    <div className="flex items-center md:items-start gap-1 md:gap-0 mt-0 md:mt-2">
                                        <AlertCircle size={12} className="text-orange-400 hidden md:block" />
                                        <span className="font-mono text-[9px] md:text-[10px] text-orange-400 uppercase tracking-[0.2em] md:mt-1">
                                            {phase.tag}
                                        </span>
                                    </div>
                                </div>

                                {/* Body Text Side */}
                                <div className="flex flex-col justify-center w-full md:w-3/4 gap-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <TerminalSquare size={14} className="text-orange-500" />
                                        <span className="font-mono text-xs md:text-sm text-amber-500 font-bold tracking-widest uppercase">
                                            {phase.sub}
                                        </span>
                                    </div>
                                    <p className="text-slate-300 font-sans text-sm md:text-base leading-relaxed">
                                        "{phase.body}"
                                    </p>
                                </div>

                            </div>
                            
                            {/* Card Tech Circuit Light */}
                            <div className="absolute top-4 right-4 md:top-6 md:right-6 w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_10px_#f97316]" />
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}