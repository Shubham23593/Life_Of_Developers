'use client';

import { useRef, useEffect, useState } from 'react';
import { useScroll, useTransform, useMotionValue, useSpring, motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useHeroStore } from '@/store/heroStore';
import { TechCard, GridScanner, LiveData, CoreVisualizer } from '@/components/SciFiUI';

/* Lazy-load canvas to avoid SSR issues */
const HeroScene = dynamic(() => import('@/components/canvas/HeroScene'), {
  ssr: false,
  loading: () => null,
});

/* ─── Phase definitions ──────────────────────────────────────────── */
const PHASES = [
  {
    id: '01',
    tag: 'THE SURFACE',
    sub: 'Confidence Level: 100% (The Tutorial Era)',
    body: 'Just watched a 10-minute "Become a Senior Dev" video. I am a God. I can build Facebook in a weekend. My code is poetic. My variable names are perfect. Life is good.',
    range: [0, 0.28],
    align: 'left',
  },
  {
    id: '02',
    tag: 'THE TWILIGHT ZONE',
    sub: 'Reality Check: 47 Chrome Tabs Open',
    body: 'Entered the MERN stack. Why is CSS like this? Why does "npm install" take 3 years? I spend 4 hours debugging a semicolon and 2 minutes actually writing code. Send help.',
    range: [0.25, 0.53],
    align: 'right',
  },
  {
    id: '03',
    tag: 'THE MIDNIGHT ABYSS',
    sub: 'The 3 AM Hallucinations',
    body: 'Training an AI model to solve my problems, but now the AI is also depressed. I have forgotten what the sun looks like. Stack Overflow is my only family now. If it works, DON’T TOUCH IT.',
    range: [0.50, 0.78],
    align: 'left',
  },
  {
    id: '04',
    tag: 'THE TRENCHES',
    sub: 'Final Boss: Deployment',
    body: 'It worked on my machine. It’s not working on the server. I am now 10% human, 90% caffeine, and 100% bugs. I have reached the bottom. Scroll to witness the final merge conflict. ↓',
    range: [0.75, 1.00],
    align: 'center',
  },
];

/* ─── Telemetry Sidebar ─────────────────── */
function DashboardSidebar({ scrollYProgress, isMobile }) {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    return scrollYProgress.on('change', (v) => setPct(Math.round(v * 100)));
  }, [scrollYProgress]);

  const activeIndex = PHASES.findIndex((p) => pct / 100 >= p.range[0] && pct / 100 <= p.range[1]);
  const activePhase = PHASES[activeIndex >= 0 ? activeIndex : 0];

  const yOpacity = useTransform(scrollYProgress, [0.85, 0.95], [1, 0]);

  return (
    <motion.div 
      style={{ opacity: yOpacity }}
      className={`absolute ${isMobile ? 'bottom-0 left-0 w-full' : 'top-1/2 -translate-y-1/2 left-8 w-80'} z-40 pointer-events-none`}
    >
      <TechCard className="backdrop-blur-2xl bg-black/40 border-orange-500/20 shadow-2xl">
        {/* Core Visualizer */}
        {!isMobile && (
           <div className="flex justify-center mb-6 border-b border-orange-500/10 pb-6">
              <CoreVisualizer size={120} />
           </div>
        )}

        {/* Live Data Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
           <LiveData min={40} max={99} label="CPU USAGE" unit="%" />
           <LiveData min={10} max={100} label="I/O THREADS" unit="mb/s" />
        </div>

        {/* Narrative Timeline */}
        <div className="space-y-4">
            <h4 className="text-xs font-mono text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">
               Timeline Diagnostics
            </h4>
            
            <AnimatePresence mode="popLayout">
               <motion.div 
                  key={activePhase.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="bg-orange-500/10 border-l-2 border-orange-500 p-4 rounded-r-lg"
               >
                  <span className="text-[10px] text-orange-400 font-mono tracking-widest block mb-1">
                     PHASE {activePhase.id} // {activePhase.tag}
                  </span>
                  <p className="text-slate-200 font-bold mb-1 font-sans">{activePhase.sub}</p>
                  <p className="text-[11px] text-slate-400 font-mono tracking-wide leading-relaxed">
                     {activePhase.body}
                  </p>
               </motion.div>
            </AnimatePresence>
        </div>

        {/* Timeline dots */}
        <div className="flex items-center gap-2 mt-6 justify-center">
            {PHASES.map((p, idx) => (
                <div 
                   key={p.id} 
                   className={`h-1.5 transition-all duration-300 ${idx === activeIndex ? 'w-8 bg-orange-500 shadow-[0_0_10px_#f97316]' : 'w-2 bg-slate-800'}`}
                />
            ))}
        </div>
      </TechCard>
    </motion.div>
  );
}

/* ─── Hero (main export) ──────────────────────────────────────────── */
export default function Hero() {
  const isLoaded = useHeroStore((s) => s.isLoaded);
  const setIsMobile = useHeroStore((s) => s.setIsMobile);
  const isMobile = useHeroStore((s) => s.isMobile);

  /* Pinned scroll container */
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  /* MotionValue passed raw to Three.js (no React re-renders) */
  const scrollMV = useMotionValue(0);
  useEffect(() => {
    return scrollYProgress.on('change', (v) => scrollMV.set(v));
  }, [scrollYProgress, scrollMV]);

  /* Responsive detection */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [setIsMobile]);

  /* Hero Typography Scales */
  const titleY = useTransform(scrollYProgress, [0, 0.25], [0, -500]);
const titleOpacity = useTransform(scrollYProgress, [0.15, 0.25], [1, 0]);
  

  return (
    <>
      {/* 400vh scroll driver */}
      <div ref={containerRef} className="relative h-[400vh] bg-transparent">

        {/* ── Pinned 3D canvas (full viewport) ── */}
        <motion.div
          className="sticky top-0 w-full h-screen overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          <HeroScene scrollProgress={scrollMV} />

          {/* Environmental Grid overlay */}
          <GridScanner />

          {/* Heavy Vignette gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 70% 50%, transparent 20%, rgba(2,6,23,0.95) 80%)',
            }}
          />

          {/* High-End Typography Header */}
          <motion.div 
             style={{ 
  y: titleY, 
  opacity: titleOpacity
}}
             
             className={`absolute ${isMobile ? 'top-[10%] left-6' : 'top-[15%] left-[30rem]'} pointer-events-none z-10`}
          >
              <div className="overflow-hidden">
                 <motion.h1 
                    initial={{ y: 50 }} animate={{ y: 0 }} transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                    className="text-6xl md:text-8xl lg:text-[10rem] font-sans font-black tracking-tighter text-slate-100 uppercase"
                    style={{ lineHeight: 0.9 }}
                 >
                    Life Of 
                 </motion.h1>
              </div>
              <div className="overflow-hidden">
                 <motion.h1 
                    initial={{ y: 50 }} animate={{ y: 0 }} transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
                    className="text-6xl md:text-8xl lg:text-[10rem] font-sans font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-300 uppercase drop-shadow-[0_0_30px_rgba(249,115,22,0.4)]"
                    style={{ lineHeight: 0.9 }}
                 >
                    Developer
                 </motion.h1>
              </div>
              
              <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
                 className="mt-6 md:mt-10 flex items-center gap-4 border-l-2 border-orange-500 pl-4 max-w-sm"
              >
                  {/* <p className="text-slate-400 font-mono text-xs md:text-sm tracking-wide leading-relaxed">
                     Building digital systems from chaos. Scroll to initialize the timeline and open the node core.
                  </p> */}
              </motion.div>
          </motion.div>

          {/* New Left Sidebar replacing floating panels */}
          <DashboardSidebar scrollYProgress={scrollYProgress} isMobile={isMobile} />

          {/* Scroll progress bar (Orange Glow) */}
          <motion.div
             className="absolute bottom-0 left-0 h-[3px] origin-left z-50 bg-orange-500 shadow-[0_0_20px_#f97316]"
             style={{
                width: "100%",
                scaleX: useSpring(scrollYProgress, { stiffness: 100, damping: 30 }),
                opacity: useTransform(scrollYProgress, [0.8, 0.9], [1, 0])
             }}
          />
        </motion.div>
      </div>
    </>
  );
}