'use client';

import { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, PerspectiveCamera, Stars } from '@react-three/drei';
import { useMotionValue } from 'framer-motion';
import RoomModel from './RoomModel';
import { useHeroStore } from '@/store/heroStore';

/**
 * HeroScene
 * ─────────
 * Mounts the R3F Canvas. Camera position / rotation is driven by
 * scrollProgress (0-1) which is passed down from Hero.jsx as a
 * framer-motion MotionValue so it never triggers React re-renders.
 */
export default function HeroScene({ scrollProgress }) {
  const isMobile = useHeroStore((s) => s.isMobile);

  return (
    <Canvas
      dpr={isMobile ? 1 : [1, 1.5]}
      gl={{
        antialias: !isMobile,
        alpha: false,
        powerPreference: 'high-performance',
      }}
      // Set to absolute black to maximize the neon contrast
      style={{ background: '#000000' }}
    >
      {/* ── Ambient / Key Lights ── */}
      {/* Deep, dark violet ambient baseline */}
      <ambientLight intensity={0.15} color="#050510" />
      
      {/* Primary Key Light — Bright Cyan */}
      <pointLight
        position={[0, 3, 0]}
        intensity={0.6}
        color="#f97316"
        distance={8}
        decay={2}
      />
      
      {/* Rim light from behind — Deep Purple */}
      <pointLight
        position={[-4, 2, -3]}
        intensity={0.4}
        color="#ea580c"
        distance={10}
        decay={2}
      />
      
      {/* Desk/Accent light — Swapped from Orange to Hot Pink/Magenta */}
      <pointLight
        position={[2, 0.5, 1]}
        intensity={0.4} // Slightly boosted intensity to balance the dark room
        color="#f97316"
        distance={4}
        decay={2}
      />

      {/* ── Stars (deep background) ── */}
      <Stars
        radius={60}
        depth={30}
        count={isMobile ? 800 : 2000}
        factor={2}
        saturation={0.8} // Boosted saturation so stars pick up the neon tint
        fade
        speed={0.4}
      />

      {/* ── Environment (studio HDRI for realistic metallic reflections) ── */}
      <Environment preset="night" />

      {/* ── Camera ── */}
      {/* Driven imperatively inside RoomModel via useFrame */}
      <PerspectiveCamera makeDefault fov={55} near={0.1} far={100} />

      {/* ── Scene content ── */}
      <RoomModel scrollProgress={scrollProgress} isMobile={isMobile} />
    </Canvas>
  );
}