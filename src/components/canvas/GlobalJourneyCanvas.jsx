'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Stars, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Procedural 3D Model: The Journey Core
 * It morphs its geometry and position based on scroll progress.
 */
function JourneyCore({ scrollY }) {
  const groupRef = useRef();
  const sphereRef = useRef();
  const particlesRef = useRef();

  // Create 1000 procedural particles (The "Code Bugs / Data")
  const [positions, scales] = useMemo(() => {
    const pos = new Float32Array(1000 * 3);
    const scl = new Float32Array(1000);
    for (let i = 0; i < 1000; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20 + 5; // Offset towards camera
      scl[i] = Math.random();
    }
    return [pos, scl];
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Scroll varies from roughly 0 to 1 at the bottom of the page
    // We just read `window.scrollY / window.innerHeight` roughly since the page is ~500vh
    const progress = Math.min(Math.max(window.scrollY / (window.innerHeight * 4), 0), 1);
    const time = state.clock.elapsedTime;

    // 1. Core Sphere Rotation & Distortion
    groupRef.current.rotation.y = time * 0.2 + progress * Math.PI * 4;
    groupRef.current.rotation.x = time * 0.1;

    // Move the core towards the right as we scroll down to avoid text overlay on the left
    const targetX = THREE.MathUtils.lerp(0, 3, progress);
    const targetZ = THREE.MathUtils.lerp(0, -5, progress);
    
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.05);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.05);

    // 2. Alter materials based on phase
    if (sphereRef.current) {
        // Distort heavily during phase 2 (Struggle)
        const distortAmount = progress > 0.25 && progress < 0.5 ? 0.8 : (progress >= 0.5 ? 0.1 : 0.4);
        sphereRef.current.distort = THREE.MathUtils.lerp(sphereRef.current.distort, distortAmount, 0.05);
        
        // Wireframe activates in Phase 3 (Growth/Blueprint)
        sphereRef.current.wireframe = progress > 0.45;
    }

    // 3. Particles form a vortex during phase 4 (Mastery), chaos earlier
    if (particlesRef.current) {
        particlesRef.current.rotation.y = time * 0.05 + progress * 2;
        particlesRef.current.material.opacity = THREE.MathUtils.lerp(0.1, 0.8, progress);
        
        const attrs = particlesRef.current.geometry.attributes.position;
        for(let i=0; i<1000; i++) {
            const ix = i * 3;
            // Vortex math
            const angle = Math.atan2(attrs.array[ix+2], attrs.array[ix]) + (0.01 * (progress > 0.7 ? 5 : 1));
            const radius = Math.sqrt(attrs.array[ix]*attrs.array[ix] + attrs.array[ix+2]*attrs.array[ix+2]);
            
            // Bring closer to center if highly progressed
            const targetRadius = progress > 0.7 ? radius * 0.99 : radius;
            
            attrs.array[ix] = Math.cos(angle) * targetRadius;
            attrs.array[ix+2] = Math.sin(angle) * targetRadius;
            
            // Fall downwards/upwards
            attrs.array[ix+1] -= 0.02;
            if (attrs.array[ix+1] < -10) attrs.array[ix+1] = 10;
        }
        attrs.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
        <mesh>
          <icosahedronGeometry args={[2, 4]} />
          <MeshDistortMaterial 
            ref={sphereRef}
            color="#ffffff" 
            emissive="#222222"
            envMapIntensity={2} 
            clearcoat={1} 
            clearcoatRoughness={0.1} 
            metalness={0.8}
            roughness={0.2}
            distort={0.4}
            speed={2}
          />
        </mesh>
      </Float>

      {/* Floating Network Nodes */}
      <points ref={particlesRef}>
        <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={1000} array={positions} itemSize={3} />
            <bufferAttribute attach="attributes-scale" count={1000} array={scales} itemSize={1} />
        </bufferGeometry>
        <pointsMaterial size={0.08} color="#ffffff" transparent opacity={0.4} sizeAttenuation />
      </points>
    </group>
  );
}

export default function GlobalJourneyCanvas() {
  return (
    <div className="fixed inset-0 w-full h-screen z-0 bg-slate-950 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
        <spotLight position={[-10, -10, -10]} intensity={2} color="#444444" />
        
        <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        <Environment preset="city" />

        <JourneyCore />
      </Canvas>
      {/* Heavy vignette for dramatic depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)] opacity-80" />
    </div>
  );
}
