'use client';

import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotionValue } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useHeroStore } from '@/store/heroStore';
import { Briefcase, Flame, Lightbulb, Rocket } from 'lucide-react';

const DeploymentScene = dynamic(() => import('@/components/canvas/Deploymentscene'), {
    ssr: false,
    loading: () => null,
});

const NARRATIVE_PHASES = [
    {
        id: 'phase-floor',
        badge: '04 // REAL WORLD',
        title: 'Deadlines & Pressure',
        body: 'Code became my career. The stakes are much higher now. Every bug directly impacts production.',
        icon: <Briefcase size={24} />,
        accent: 'from-blue-500 to-indigo-500',
        glow: 'shadow-[0_0_30px_#3b82f6]',
        textColor: 'text-blue-400'
    },
    {
        id: 'phase-rise',
        badge: '05 // THE BURNOUT',
        title: 'Sleepless Nights',
        body: 'Endless debugging. Doubt and exhaustion setting in. It feels like the weight of the server is on your shoulders.',
        icon: <Flame size={24} />,
        accent: 'from-red-500 to-orange-500',
        glow: 'shadow-[0_0_30px_#ef4444]',
        textColor: 'text-red-400'
    },
    {
        id: 'phase-screen',
        badge: '06 // BREAKTHROUGH',
        title: 'The Realization',
        body: 'Growth takes time. The struggles are not failures, they are the stepping stones to total system mastery.',
        icon: <Lightbulb size={24} />,
        accent: 'from-cyan-400 to-emerald-400',
        glow: 'shadow-[0_0_30px_#22d3ee]',
        textColor: 'text-cyan-400'
    },
    {
        id: 'phase-mastery',
        badge: '07 // MASTERY',
        title: 'Deployment',
        body: 'I became a developer... But the journey never ends. The pipeline is automated. The code is Poetry.',
        icon: <Rocket size={24} />,
        accent: 'from-orange-500 to-yellow-400',
        glow: 'shadow-[0_0_30px_#f97316]',
        textColor: 'text-orange-400'
    },
];

export default function Chapter04() {
    const isMobile = useHeroStore(s => s.isMobile);

    const wrapperRef = useRef(null);
    const containerRef = useRef(null);
    const wheelRef = useRef(null);
    const cardsRef = useRef([]);
    const titleRef = useRef(null);

    // Provide a motion value for the 3D scene background to interpret scroll progress natively
    const scrollMV = useMotionValue(0);

    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        let ctx = gsap.context(() => {
            if (!wrapperRef.current || !wheelRef.current) return;

            // Massive Orbital GSAP Timeline (400vh bound)
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: wrapperRef.current,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 1, // Flawless continuous tracking
                    onUpdate: (self) => {
                        // Pass math to the 3D scene
                        scrollMV.set(self.progress);
                    }
                },
            });

            // 1. Initial fade-in of the orbital structure
            gsap.set(wheelRef.current, { opacity: 0, scale: 0.8, y: 100 });
            gsap.set(titleRef.current, { opacity: 0, y: -50 });

            tl.to(wheelRef.current, { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0);
            tl.to(titleRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0);

            // 2. The Great Orbital Rotation (Math is beautiful)
            // 4 Cards separated by 40 degrees. Total rotation needed to bring the last card to Top-Center is -120 degrees.
            const totalDegrees = 120; // 3 gaps * 40 = 120
            
            // Spin the master wheel Left
            tl.to(wheelRef.current, { 
                rotation: -totalDegrees, 
                duration: 4, 
                ease: "none" 
            }, 0.5); // Start spinning after the fade-in

            // Counter-spin ALL cards mathematically to exactly offset the wheel, keeping the text upright!
            cardsRef.current.forEach((card) => {
                tl.to(card, { 
                    rotation: `+=${totalDegrees}`, // whatever its current start rotation is, add 120!
                    duration: 4, 
                    ease: "none" 
                }, 0.5);
            });

            // 3. Highlight states based on top-dead-center proximity
            // Provide a pulse to the card that is currently hovering near the center
            const stepDur = 4 / 3; // 4 duration divided by 3 transitions
            let t = 0.5; // start time aligned with rotation start
            
            cardsRef.current.forEach((card, i) => {
                // Dim all initially except the first
                if (i !== 0) gsap.set(card, { opacity: 0.3, filter: 'grayscale(100%) blur(5px)', scale: 0.8 });
                
                // When this card reaches the top dead center (time = 0.5 + i * stepDur)
                tl.to(card, { 
                    opacity: 1, 
                    filter: 'grayscale(0%) blur(0px)', 
                    scale: 1.1, 
                    duration: 0.5, 
                    ease: 'power2.out',
                    yoyo: true,  // It dims again as it leaves the top!
                    repeat: i === 3 ? 0 : 1 // The final card stays highlighted!
                }, t);

                t += stepDur;
            });

        }, wrapperRef);

        return () => ctx.revert();
    }, [scrollMV]);

    // Orbital Math Layout configuration
    // Determine the literal CSS radius size of the orbital wheel based on responsive assumptions
    const wheelSizeStyle = "w-[1200px] h-[1200px] md:w-[1500px] md:h-[1500px]";
    const radiusOffset = "translateY(-550px) md:translateY(-700px)"; // The distance from center to the perimeter
    const angleStep = 40; // Degrees between each card on the orbital arc

    return (
        /* Structural safe boundary: 400vh */
        <div ref={wrapperRef} className="relative w-full h-[400vh] bg-[#000000]">
            
            <div className="sticky top-0 w-full h-screen overflow-hidden bg-[#030305] flex items-center justify-center">
                
                {/* 1. The 3D Deployment Scene safely underneath the Orbital UI */}
                <div className="absolute inset-0 z-0 opacity-80 mix-blend-screen pointer-events-none">
                     <DeploymentScene scrollProgress={scrollMV} isMobile={isMobile} />
                </div>

                {/* Ambient Depth Gradients */}
                <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />

                {/* 2. Top Title Overlay */}
                <div ref={titleRef} className="absolute top-[8vh] flex flex-col items-center z-40 text-center pointer-events-none">
                     <span className="font-mono text-xs text-orange-400 tracking-[0.5em] uppercase mb-2">DEPLOYMENT PROTOCOL</span>
                     <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mix-blend-plus-lighter">
                         The Continuous <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300">Journey</span>
                     </h2>
                </div>

                {/* 3. THE GSAP ORBITAL RING ENGINE */}
                {/* The wheel is anchored far below the screen so only the top half arc is visible tracking across the viewport */}
                <div 
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[55%] md:translate-y-[60%] rounded-full ${wheelSizeStyle} z-20 pointer-events-none`}
                >
                    {/* The Structural Wheel Lines which physically rotate */}
                    <div ref={wheelRef} className="absolute inset-0 rounded-full border border-orange-500/20 shadow-[0_0_100px_rgba(249,115,22,0.05)] border-dashed">
                        
                        <div className="absolute inset-4 rounded-full border border-orange-400/10" />
                        <div className="absolute inset-10 rounded-full border-2 border-orange-400/5 border-dotted" />

                        {/* The Holographic Cards mounted precisely on the exact Mathematical Architecure of the Wheel */}
                        {NARRATIVE_PHASES.map((phase, i) => (
                            <div 
                                key={phase.id}
                                className="absolute top-1/2 left-1/2 w-0 h-0"
                                style={{ transform: `rotate(${i * angleStep}deg)` }} // Spaced geometrically around the core
                            >
                                {/* Offset exactly to the rim of the 1200px wheel */}
                                <div className={`absolute ${radiusOffset} -translate-x-1/2`}>
                                    
                                    {/* The GSAP Counter-Rotation Wrapper maintaining Text Gravity */}
                                    <div 
                                        ref={el => cardsRef.current[i] = el}
                                        style={{ transform: `rotate(${-i * angleStep}deg)` }} // Initializes perfectly upright
                                        className="pointer-events-auto"
                                    >
                                        
                                        {/* THE ACTUAL NARRATIVE CARD */}
                                        <div className={`w-[280px] md:w-[400px] p-6 md:p-8 bg-[#0a0a0f]/90 backdrop-blur-2xl border border-white/10 rounded-3xl ${phase.glow} transition-all duration-300 transform-style-3d`}>
                                            
                                            {/* Glowing Top Injection Line */}
                                            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${phase.accent} rounded-t-3xl`} />

                                            <div className="flex items-start gap-4 mb-4">
                                                <div className={`p-4 rounded-2xl bg-black/50 border border-white/10 ${phase.textColor}`}>
                                                    {phase.icon}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className={`font-mono text-[9px] md:text-[10px] tracking-widest uppercase ${phase.textColor} opacity-60`}>
                                                        {phase.badge}
                                                    </span>
                                                    <h3 className="font-sans text-xl md:text-2xl font-black text-white uppercase tracking-tight leading-tight mt-1">
                                                        {phase.title}
                                                    </h3>
                                                </div>
                                            </div>

                                            <p className="font-mono text-xs md:text-sm text-slate-300 leading-relaxed opacity-80">
                                                {phase.body}
                                            </p>
                                        </div>

                                        {/* Connecting Line physically locking the card to the wheel edge */}
                                        <div className="absolute -bottom-16 md:-bottom-24 left-1/2 w-0.5 h-16 md:h-24 bg-gradient-to-b from-orange-500/50 to-transparent -translate-x-1/2" />
                                        
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}