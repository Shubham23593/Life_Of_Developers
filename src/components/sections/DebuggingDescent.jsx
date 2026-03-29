'use client';

import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const ERRORS = [
    "TypeError: undefined is not a function",
    "Unhandled Rejection (NetworkError)",
    "Maximum call stack size exceeded",
    "Missing dependency in useEffect",
    "Cannot read property 'map' of null",
    "Warning: React has detected a change in the order of Hooks",
    "CORS policy: No 'Access-Control-Allow-Origin' header is present"
];

export default function DebuggingDescent() {
    const wrapperRef = useRef(null);
    const containerRef = useRef(null);
    const terminalRef = useRef(null);
    const devImgRef = useRef(null);
    const marqueeRef1 = useRef(null);
    const marqueeRef2 = useRef(null);
    const textLinesRef = useRef([]);

    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        let ctx = gsap.context(() => {
            if (!wrapperRef.current || !containerRef.current) return;

            // Pin the container for 400vh
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: wrapperRef.current,
                    pin: containerRef.current,
                    start: 'top top',
                    end: '+=400%',
                    scrub: 1,
                },
            });

            // 1. Marquee Parallax (Opposite directions)
            tl.to(marqueeRef1.current, { x: '-20%', ease: 'none' }, 0);
            tl.to(marqueeRef2.current, { x: '20%', ease: 'none' }, 0);

            // 2. Terminal Scales Up and shakes
            tl.fromTo(terminalRef.current, 
                { scale: 0.8, y: 150, rotationX: 10, opacity: 0 },
                { scale: 1, y: 0, rotationX: 0, opacity: 1, duration: 1.5, ease: "power2.out" }, 
                0
            );

            // 3. Falling Developer Image scales and dives
            tl.to(devImgRef.current, { scale: 0.6, y: 150, rotation: 15, duration: 2 }, 0);

            // 4. Sequential Text Revelations in Terminal
            textLinesRef.current.forEach((line, index) => {
                tl.fromTo(line, 
                    { opacity: 0, x: -30, filter: 'blur(10px)' },
                    { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.8, ease: "power2.out" },
                    index * 0.6 + 1
                );
            });

            // 5. Epic climax: The resolution (Red terminal turns Cyan)
            tl.to(terminalRef.current, { 
                borderColor: 'rgba(6, 182, 212, 0.8)', // Cyan-500
                boxShadow: '0 0 60px rgba(6, 182, 212, 0.5)',
                duration: 1.5,
                ease: 'power2.inOut'
            }, "-=1.5");

            // Character plunges into the abyss
            tl.to(devImgRef.current, { 
                y: window.innerHeight + 800, 
                scale: 0.2,
                opacity: 0,
                duration: 2, 
                ease: 'power3.in' 
            }, "-=1.5");

        }, wrapperRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={wrapperRef} className="relative w-full bg-transparent">
            {/* Height 100vh because the ScrollTrigger pins it */}
            <section ref={containerRef} className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center pointer-events-none">
                
                {/* Background Marquees */}
                <div className="absolute inset-0 flex flex-col justify-between py-[15vh] opacity-30 mix-blend-screen overflow-hidden z-0">
                    <div ref={marqueeRef1} className="flex whitespace-nowrap text-red-500 font-mono text-opacity-40 text-6xl md:text-[8rem] font-black w-[400vw] -ml-[50vw]">
                        {ERRORS.join(" // ")} // {ERRORS.join(" // ")}
                    </div>
                    <div ref={marqueeRef2} className="flex whitespace-nowrap text-orange-500 font-mono text-opacity-40 text-6xl md:text-[8rem] font-black w-[400vw] -ml-[150vw]">
                       FATAL_ERROR // OUT_OF_MEMORY // SYNTAX_ERROR // FATAL_ERROR // OUT_OF_MEMORY // SYNTAX_ERROR
                    </div>
                </div>

                {/* Floating Character */}
                <div className="absolute inset-0 flex justify-center items-center z-10 pointer-events-none transition-transform">
                     <div ref={devImgRef} className="relative w-72 md:w-[28rem] drop-shadow-[0_0_30px_rgba(255,0,0,0.4)]">
                        <img src="/image_c51503.png" alt="Falling Developer" className="w-full h-auto object-contain" />
                     </div>
                </div>

                {/* Main Glassmorphism Terminal */}
                <div className="relative z-20 w-[95%] md:w-[70%] lg:w-[50%] mt-48 md:mt-24 pointer-events-auto">
                    <div ref={terminalRef} className="rounded-2xl border border-red-500/50 bg-[#05050a]/80 backdrop-blur-2xl shadow-[0_20px_60px_rgba(239,68,68,0.2)] overflow-hidden flex flex-col">
                        
                        {/* Terminal Header */}
                        <div className="flex items-center justify-between px-6 py-3 bg-red-950/40 border-b border-red-500/30">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/80 animate-pulse shadow-[0_0_10px_#ef4444]"></div>
                                <div className="w-3 h-3 rounded-full bg-orange-400/80"></div>
                                <div className="w-3 h-3 rounded-full bg-slate-600/80"></div>
                            </div>
                            <span className="text-[10px] md:text-sm text-red-400/80 font-mono tracking-widest uppercase">root@dev-server: ~/THE_STRUGGLE</span>
                        </div>

                        {/* Terminal Body */}
                        <div className="p-6 md:p-12 font-mono text-sm md:text-lg flex flex-col gap-8 md:gap-10 min-h-[450px] relative">
                            {/* CRT Scanline Overlay */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,0,0.03)_50%,transparent_50%)] bg-[length:100%_4px] pointer-events-none" />
                            
                            <p ref={(el) => { if (el) textLinesRef.current[0] = el; }} className="text-red-400 flex items-start gap-4">
                                <span className="text-red-900 select-none">~</span> 
                                <span><span className="text-red-500 font-bold">ERROR:</span> System overloaded. Red text floods the monitor. The compiler rejects every operation.</span>
                            </p>

                            <p ref={(el) => { if (el) textLinesRef.current[1] = el; }} className="text-orange-400 flex items-start gap-4">
                                <span className="text-orange-900 select-none">~</span> 
                                <span><span className="text-orange-500 font-bold">WARN:</span> Hours of debugging lead down a dead end. Documentation provides no answers.</span>
                            </p>

                            <p ref={(el) => { if (el) textLinesRef.current[2] = el; }} className="text-slate-300 flex items-start gap-4">
                                <span className="text-slate-600 select-none">~</span> 
                                <span><span className="text-indigo-400 font-bold">INFO:</span> Initiating deep-focus protocol. Tracing variables manually through the stack.</span>
                            </p>

                            <p ref={(el) => { if (el) textLinesRef.current[3] = el; }} className="text-cyan-400 flex items-start gap-4 mt-auto border-t border-cyan-500/20 pt-6">
                                <span className="text-cyan-900 select-none">~</span> 
                                <span><span className="text-cyan-500 font-bold leading-relaxed shadow-cyan-500/50 drop-shadow-md">SUCCESS:</span> Semicolon found. Syntax resolved. Chaos transitions into pure logic. System stable.</span>
                            </p>

                            {/* Blinking Cursor */}
                            <div className="absolute bottom-10 left-12 w-3 h-6 bg-cyan-400 animate-[pulse_1s_step-start_infinite]"></div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}