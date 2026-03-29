'use client';

import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotionValue } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useHeroStore } from '@/store/heroStore';
import { Briefcase, Flame, Lightbulb, Rocket, ChevronRight, Terminal, Cpu, Network } from 'lucide-react';

const DeploymentScene = dynamic(() => import('@/components/canvas/Deploymentscene'), {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-[#030305]" />,
});

const NARRATIVE_PHASES = [
    {
        id: 'phase-floor',
        num: '04',
        badge: 'REAL WORLD',
        title: 'Deadlines & Pressure',
        body: 'Code became my career. The stakes are much higher now. Every bug directly impacts production, and every commit is scrutinized.',
        icon: <Briefcase size={32} strokeWidth={1.5} />,
        accent: 'from-orange-600 to-amber-600',
        glow: 'shadow-[0_0_50px_rgba(249,115,22,0.3)]',
        textColor: 'text-orange-400',
        borderColor: 'border-orange-500/30'
    },
    {
        id: 'phase-rise',
        num: '05',
        badge: 'THE BURNOUT',
        title: 'Sleepless Nights',
        body: 'Endless debugging. Doubt and exhaustion setting in. It feels like the weight of the entire server is resting solely on your shoulders.',
        icon: <Flame size={32} strokeWidth={1.5} />,
        accent: 'from-red-600 to-orange-500',
        glow: 'shadow-[0_0_50px_rgba(239,68,68,0.3)]',
        textColor: 'text-red-400',
        borderColor: 'border-red-500/30'
    },
    {
        id: 'phase-screen',
        num: '06',
        badge: 'BREAKTHROUGH',
        title: 'The Realization',
        body: 'Growth takes time. The struggles are not failures, they are the vital stepping stones to total system mastery and architectural elegance.',
        icon: <Lightbulb size={32} strokeWidth={1.5} />,
        accent: 'from-amber-500 to-yellow-400',
        glow: 'shadow-[0_0_50px_rgba(251,191,36,0.3)]',
        textColor: 'text-amber-400',
        borderColor: 'border-amber-500/30'
    },
    {
        id: 'phase-mastery',
        num: '07',
        badge: 'MASTERY',
        title: 'Deployment Ready',
        body: 'I became a developer. But the journey never truly ends. The pipeline is automated. The infrastructure is solid. The code is Poetry.',
        icon: <Rocket size={32} strokeWidth={1.5} />,
        accent: 'from-orange-500 to-amber-300',
        glow: 'shadow-[0_0_50px_rgba(249,115,22,0.4)]',
        textColor: 'text-orange-400',
        borderColor: 'border-orange-500/40'
    },
];

export default function Chapter03() {
    const isMobile = useHeroStore(s => s.isMobile);
    const containerRef = useRef(null);
    const contentRef = useRef(null);
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const cardsRef = useRef([]);
    const progressRef = useRef(null);
    
    // Provide a motion value for the 3D scene background to interpret scroll natively
    const scrollMV = useMotionValue(0);

    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        let ctx = gsap.context(() => {
            if (!containerRef.current || cardsRef.current.length === 0) return;

            // Use the same GSAP sequence logic as Hero.jsx without fixed pins
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 1,
                    onUpdate: (self) => {
                        // Native motion value binding for 3D Camera Path
                        scrollMV.set(self.progress);
                        // Update bottom progress bar natively
                        if (progressRef.current) {
                            gsap.set(progressRef.current, { scaleX: self.progress });
                        }
                    }
                }
            });

            // Initial states for horizontal bottom deck (Starts far below and slightly detached toward camera)
            gsap.set(cardsRef.current, { opacity: 0, y: 200, z: 200, rotationX: -45, transformPerspective: 1000 });

            // 1. Zoom out and fade the massive title elegantly
            tl.to([titleRef.current], { 
                scale: 1.15, 
                opacity: 0, 
                filter: 'blur(15px)', 
                duration: 2, 
                ease: 'power2.inOut' 
            }, 0);

            // 2. Sequential "Apple Card Deck" Timeline
            let time = 2; // start after title fades
            const dur = 1.5; // push/pull time
            const hold = 3.5; // read time

            NARRATIVE_PHASES.forEach((phase, i) => {
                // Flip UP organically from below the screen with satisfying optical bounce
                tl.to(cardsRef.current[i], {
                    opacity: 1,
                    y: 0,
                    z: 0,
                    rotationX: 0,
                    duration: dur,
                    ease: 'expo.out'
                }, time);

                time += hold;

                // Send BACK deeply into the void organically, optical blurring creating true focal depth
                if (i !== NARRATIVE_PHASES.length - 1) {
                    tl.to(cardsRef.current[i], {
                        opacity: 0,
                        z: -500,      // Pushes physically backward, into screen
                        y: -30,       // Slight upward natural drift
                        rotationX: 20, // Tilted slightly upwards like dropping a card backwards
                        filter: 'blur(20px)', // True optic focus drop
                        duration: dur,
                        ease: 'power2.inOut'
                    }, time);
                    time += dur * 0.4; // Slightly overlap the next card coming in for fluidity
                }
            });

            // Fade out the entire scene right before the scroll completes
            tl.to(contentRef.current, { opacity: 0, scale: 0.95, duration: 2, ease: 'power2.inOut' });
            
        }, containerRef);

        return () => ctx.revert();
    }, [isMobile, scrollMV]);

    return (
        <section className="relative w-full bg-[#020202] text-white">
            
            {/* The absolute structural boundary: 400vh tall wrapper for native sticky scrolling */}
            <div ref={containerRef} className="relative w-full h-[400vh] bg-transparent">
                
                {/* The Sticky Fullscreen Lens */}
                <div className="sticky top-0 w-full h-screen overflow-hidden bg-[#020202] z-10 pointer-events-auto">
                    
                    <div ref={contentRef} className="w-full h-full relative">
                    
                    {/* 1. Underlying 3D Canvas Context */}
                    <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(3,3,5,0.7)_100%)] mix-blend-screen pointer-events-none">
                        <DeploymentScene scrollProgress={scrollMV} isMobile={isMobile} />
                    </div>
                    
                    {/* Ambient Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vh] bg-orange-500/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none z-0" />

                    {/* 2. FOREGROUND A: Massive Cinematic Typography */}
                    <div className="absolute top-[8%] md:top-[10%] left-0 w-full flex flex-col items-center justify-start z-20 pointer-events-none px-4">
                        <h2 ref={titleRef} className="text-[14vw] sm:text-[12vw] md:text-[8vw] lg:text-[7vw] font-black uppercase tracking-tighter drop-shadow-2xl text-center leading-[0.85] w-full mix-blend-plus-lighter">
                            The Arc of <br className="md:hidden" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-500 drop-shadow-[0_0_20px_rgba(249,115,22,0.3)]">Progress</span>
                        </h2>
                    </div>

                    {/* 3. FOREGROUND B: Floating Narrative Tech Cards (Bottom pinned) */}
                    <div className="absolute bottom-12 md:bottom-20 inset-x-0 mx-auto z-30 flex justify-center px-4 md:px-8 w-full perspective-1000 md:h-[220px]">
                        {NARRATIVE_PHASES.map((phase, i) => (
                            <div
                                key={phase.id}
                                ref={(el) => (cardsRef.current[i] = el)}
                                className={`absolute bottom-0 w-[calc(100%-2rem)] md:w-full max-w-lg md:max-w-4xl bg-[#08080c]/85 backdrop-blur-2xl border ${phase.borderColor} rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] opacity-0 transform-style-3d pointer-events-auto ${phase.glow} overflow-hidden flex flex-col md:flex-row gap-4 md:gap-6`}
                            >
                                {/* Feature Side */}
                                <div className={`flex flex-row md:flex-col justify-between items-center md:items-start w-full md:w-1/4 pb-3 md:pb-0 border-b md:border-b-0 md:border-r border-white/10 md:pr-4 shrink-0`}>
                                    <h2 className="font-sans text-4xl sm:text-5xl md:text-6xl font-black text-white mix-blend-overlay leading-none">
                                        {phase.num}
                                    </h2>
                                    <div className="flex items-center md:items-start gap-2 md:gap-0 mt-0 md:mt-2">
                                        <div className={`hidden md:block text-white ${phase.textColor}`}>
                                            {phase.icon}
                                        </div>
                                        <span className={`font-mono text-[10px] sm:text-xs md:text-[10px] ${phase.textColor} font-bold uppercase tracking-[0.2em] md:mt-1`}>
                                            {phase.badge}
                                        </span>
                                    </div>
                                </div>

                                {/* Body Text Side */}
                                <div className="flex flex-col justify-center w-full md:w-3/4 gap-2 md:gap-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <ChevronRight size={14} className={phase.textColor} />
                                        <span className={`font-mono text-xs sm:text-sm md:text-md font-bold tracking-widest uppercase ${phase.textColor}`}>
                                            {phase.title}
                                        </span>
                                    </div>
                                    <p className="text-slate-300 font-sans text-xs sm:text-sm md:text-base leading-relaxed">
                                        &quot;{phase.body}&quot;
                                    </p>
                                </div>
                                
                                {/* Inner glow line top */}
                                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${phase.accent}`} />
                            </div>
                        ))}
                    </div>

                    {/* 4. Global Indicators (Progress Bar) */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90vw] md:w-[80vw] max-w-4xl h-0.5 bg-white/10 z-30 overflow-hidden rounded-full">
                        <div 
                            ref={progressRef} 
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 origin-left"
                            style={{ transform: 'scaleX(0)' }}
                        />
                    </div>
                    
                    </div>
                    
                </div>
            </div>
        </section>
    );
}