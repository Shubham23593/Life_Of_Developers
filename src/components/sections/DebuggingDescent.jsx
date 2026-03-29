'use client';

import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AlertOctagon, TerminalSquare, AlertTriangle, CheckCircle2 } from 'lucide-react';

const MESSAGES = [
    { type: 'ERROR', color: 'red', text: 'System overloaded. The compiler rejects every operation. Terminal flooded with red.', icon: <AlertOctagon size={16} /> },
    { type: 'FATAL', color: 'red', text: 'TypeError: undefined is not a function. Stack trace lost in oblivion.', icon: <AlertOctagon size={16} /> },
    { type: 'WARN', color: 'orange', text: 'Hours of debugging lead down a dead end. Stack Overflow provides no answers.', icon: <AlertTriangle size={16} /> },
    { type: 'INFO', color: 'slate', text: 'Initiating deep-focus protocol. Tracing variables manually through the dependency graph.', icon: <TerminalSquare size={16} /> },
];

const SUCCESS_MSG = {
    type: 'SUCCESS', color: 'cyan', text: 'Semicolon found. Syntax resolved. Chaos transitions into pure logic. System Stable.', icon: <CheckCircle2 size={24} />
};

export default function DebuggingDescent() {
    const wrapperRef = useRef(null);
    const bgRef = useRef(null);
    const titleRef = useRef(null);
    const cardsRef = useRef([]);
    const successCardRef = useRef(null);
    const fallingDevRef = useRef(null);
    const redOverlayRef = useRef(null);

    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        let ctx = gsap.context(() => {
            if (!wrapperRef.current) return;

            // Strict CSS sticky bounding timeline - absolutely no GSAP Pin logic to assure no layout collisions!
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: wrapperRef.current,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 1,
                },
            });

            // Set initial 3D states
            gsap.set(cardsRef.current, { z: 500, y: 300, rotationX: -30, opacity: 0, scale: 0.5 });
            gsap.set(successCardRef.current, { y: 200, opacity: 0, scale: 0.8, filter: 'blur(10px)' });
            gsap.set(fallingDevRef.current, { y: '-10vh', rotationZ: 0 });

            // 1. Initial Parallax & Title movement
            tl.to(titleRef.current, { y: -50, opacity: 0, filter: 'blur(10px)', duration: 1 }, 0);
            
            // Endless falling rotation of the character synced to scroll
            tl.to(fallingDevRef.current, { y: '50vh', rotationZ: 45, duration: 6, ease: 'none' }, 0);

            // 2. The "Overwhelming Error Windows" Stack Sequence
            // They fly out of the Z-axis camera space and slam into the screen randomly
            let time = 0.5;
            const posData = [
                { x: '-10%', y: '0%', rZ: -5 },
                { x: '15%', y: '10%', rZ: 8 },
                { x: '-20%', y: '25%', rZ: -12 },
                { x: '5%', y: '35%', rZ: 5 },
            ];

            MESSAGES.forEach((msg, i) => {
                tl.to(cardsRef.current[i], {
                    z: 0,
                    x: posData[i].x,
                    y: posData[i].y,
                    rotationX: 0,
                    rotationZ: posData[i].rZ,
                    opacity: 1,
                    scale: 1,
                    duration: 1.5,
                    ease: 'back.out(1.2)'
                }, time);
                
                // Slightly shake the screen every time an error hits
                tl.to(redOverlayRef.current, { opacity: 0.6, duration: 0.1, yoyo: true, repeat: 1 }, time);

                time += 0.8; // Next error card spawns swiftly
            });

            // 3. The Collapse (Everything falls away)
            tl.to(cardsRef.current, {
                y: '100vh',
                rotationZ: (i) => i % 2 === 0 ? 45 : -45,
                opacity: 0,
                duration: 1.5,
                ease: 'power3.in',
                stagger: 0.1
            }, time + 0.5);

            tl.to(fallingDevRef.current, { y: '250vh', scale: 0, opacity: 0, duration: 1.5, ease: 'power3.in' }, time + 0.5);

            // 4. The Resolution (Success Climax)
            tl.to(bgRef.current, { backgroundColor: '#020617', duration: 1 }, time + 1.2); // Switch to deep blue/cyan base
            tl.to(redOverlayRef.current, { opacity: 0, duration: 0.5 }, time + 1.2); // Kill the red alarm

            tl.to(successCardRef.current, {
                y: 0,
                opacity: 1,
                scale: 1,
                filter: 'blur(0px)',
                duration: 1.5,
                ease: 'expo.out'
            }, time + 1.5);

            tl.to({}, { duration: 1 }); // Pad end of scroll

        }, wrapperRef);

        return () => ctx.revert();
    }, []);

    // Aesthetic color mappers for Tailwind
    const getBorderColor = (color) => {
        if (color === 'red') return 'border-red-500/50 hover:border-red-500';
        if (color === 'orange') return 'border-orange-500/50 hover:border-orange-500';
        if (color === 'cyan') return 'border-cyan-500/80 shadow-[0_0_40px_rgba(6,182,212,0.4)]';
        return 'border-slate-500/50 hover:border-slate-500';
    };

    const getTextColor = (color) => {
        if (color === 'red') return 'text-red-400';
        if (color === 'orange') return 'text-orange-400';
        if (color === 'cyan') return 'text-cyan-400';
        return 'text-slate-300';
    };

    return (
        /* The container takes up 400vh physically to ensure absolutely NO collision with Phase 3 */
        <div ref={wrapperRef} className="relative w-full h-[400vh] bg-transparent">
            
            {/* The sticky inner window tracking the viewport perfectly */}
            <div ref={bgRef} className="sticky top-0 w-full h-screen overflow-hidden bg-[#0a0505] flex flex-col items-center z-10 pointer-events-none transition-colors duration-1000">
                
                {/* 1. Ambient Red Alarm Light overlay */}
                <div ref={redOverlayRef} className="absolute inset-0 bg-red-900/10 mix-blend-color-burn opacity-30 z-0 pointer-events-none" />
                
                {/* 2. Visual Matrix Waterfall styling (Static background, CSS animated) */}
                <div className="absolute inset-x-0 top-0 h-[200vh] flex justify-between px-[5%] opacity-10 mix-blend-screen pointer-events-none z-0">
                    <div className="w-[1px] h-full bg-gradient-to-b from-red-500 to-transparent shadow-[0_0_15px_#ef4444] animate-[pulse_2s_ease-in-out_infinite]" />
                    <div className="w-[1px] h-full bg-gradient-to-b from-red-500 to-transparent shadow-[0_0_15px_#ef4444] animate-[pulse_3s_ease-in-out_infinite]" />
                    <div className="w-[1px] h-full bg-gradient-to-b from-red-500 to-transparent shadow-[0_0_15px_#ef4444] animate-[pulse_2.5s_ease-in-out_infinite]" />
                </div>

                {/* 3. The Title / Header */}
                <div ref={titleRef} className="absolute top-[10vh] flex flex-col items-center z-20 w-full px-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                        <span className="text-[10px] md:text-xs tracking-[0.4em] text-red-500/80 uppercase font-mono font-bold">
                            PHASE // 02
                        </span>
                    </div>
                    <h2 
                        className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-100 tracking-tighter uppercase drop-shadow-[0_10px_30px_rgba(239,68,68,0.5)] text-center"
                        style={{ fontFamily: 'var(--font-sans)' }}
                    >
                        THE <span className="text-red-500 line-through decoration-[6px] decoration-slate-900">STRUGGLE</span>
                        <br className="md:hidden" />
                        <span className="ml-2 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">DESCENT</span>
                    </h2>
                </div>

                {/* 4. The Developer Falling Asset */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                     <div ref={fallingDevRef} className="relative w-[300px] md:w-[450px] drop-shadow-[0_20px_50px_rgba(239,68,68,0.3)] filter contrast-125 saturate-50 mix-blend-screen">
                        {/* We use the character image. The GSAP logic perfectly floats him around the chaos */}
                        <img src="/image_c51503.png" alt="Developer Falling" className="w-full h-auto object-contain opacity-60" />
                     </div>
                </div>

                {/* 5. The Glass Holographic Error Stack */}
                <div className="absolute inset-0 flex items-center justify-center z-30 perspective-1000 -mt-[10vh] pointer-events-auto">
                    
                    {/* The 4 Overwhelming Error Cards */}
                    {MESSAGES.map((msg, i) => (
                        <div 
                            key={i}
                            ref={el => cardsRef.current[i] = el}
                            className={`absolute w-[90%] md:w-[600px] bg-[#050508]/85 backdrop-blur-3xl border ${getBorderColor(msg.color)} rounded-xl p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9)] transform-style-3d cursor-crosshair transition-colors duration-300`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`p-2 rounded-md bg-white/5 ${getTextColor(msg.color)} border border-white/5`}>
                                    {msg.icon}
                                </div>
                                <div className="flex flex-col gap-1 w-full">
                                    <div className="flex justify-between items-center w-full">
                                        <span className={`font-mono text-xs font-bold ${getTextColor(msg.color)} tracking-widest uppercase`}>
                                            SYS.{msg.type}
                                        </span>
                                        <span className="font-mono text-[9px] text-slate-500">
                                            0x00{i}F{i * 4}
                                        </span>
                                    </div>
                                    <p className="font-mono text-sm md:text-base text-slate-300 leading-relaxed mt-2">
                                        {msg.text}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* The 1 Resolution / Success Climax Card */}
                    <div 
                        ref={successCardRef}
                        className={`absolute w-[95%] md:w-[700px] bg-[#020617]/95 backdrop-blur-3xl border ${getBorderColor(SUCCESS_MSG.color)} rounded-2xl p-8 md:p-10 transform-style-3d pointer-events-auto z-50 overflow-hidden shadow-[0_30px_60px_rgba(6,182,212,0.15)]`}
                    >
                        {/* Shimmer overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent w-[200%] pointer-events-none" style={{ animation: 'shimmer 3s linear infinite' }} />
                        <style jsx>{`
                            @keyframes shimmer {
                                0% { transform: translateX(-100%); }
                                100% { transform: translateX(50%); }
                            }
                        `}</style>
                        
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
                            <div className={`p-4 md:p-5 rounded-2xl bg-cyan-950/50 ${getTextColor(SUCCESS_MSG.color)} border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.3)]`}>
                                {SUCCESS_MSG.icon}
                            </div>
                            <div className="flex flex-col items-center md:items-start text-center md:text-left">
                                <span className={`font-mono text-sm md:text-base font-bold ${getTextColor(SUCCESS_MSG.color)} tracking-widest uppercase mb-2`}>
                                    [ END_OF_STRUGGLE // SYS.RESOLVED ]
                                </span>
                                <p className="font-sans text-xl md:text-3xl font-black text-slate-100 tracking-tight leading-tight uppercase">
                                    {SUCCESS_MSG.text}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}