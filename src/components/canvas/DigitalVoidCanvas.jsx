'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, Text, MeshTransmissionMaterial, Instance, Instances, Stars } from '@react-three/drei';
import { EffectComposer, Glitch, ChromaticAberration, Vignette, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

/**
 * Procedural 3D Laptop Model
 */
function ProceduralLaptop({ progress }) {
  const lidRef = useRef();
  const screenLightRef = useRef();

  useFrame(() => {
    if (!lidRef.current) return;
    // Section 1-2 (0.0 to 0.2): Open the laptop
    const openFactor = THREE.MathUtils.clamp(progress * 10, 0, 1);
    lidRef.current.rotation.x = THREE.MathUtils.lerp(Math.PI / 2, 0, openFactor);
    
    // Zoom in hard into the laptop screen
    if (progress > 0.05 && progress < 0.25) {
        // Just fade out the laptop as we go "inside"
        const opacity = 1 - THREE.MathUtils.clamp((progress - 0.1) * 10, 0, 1);
        screenLightRef.current.intensity = opacity * 5;
    }
  });

  return (
    <group position={[0, -1, 0]}>
      {/* Base */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[3, 0.1, 2]} />
        <meshStandardMaterial color="#111" metalness={0.8} />
      </mesh>
      {/* Lid Hinge */}
      <group position={[0, 0, -1]} ref={lidRef}>
        {/* Lid Screen */}
        <mesh position={[0, 1, 0]}>
          <boxGeometry args={[3, 2, 0.1]} />
          <meshStandardMaterial color="#222" metalness={0.9} />
        </mesh>
        <rectAreaLight ref={screenLightRef} width={2.8} height={1.8} position={[0, 1, 0.06]} color="#00ffff" intensity={2} />
        <mesh position={[0, 1, 0.06]}>
          <planeGeometry args={[2.8, 1.8]} />
          <meshBasicMaterial color="#002222" transparent opacity={0.8} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Floating Code Strings for Section 2
 */
function FloatingCode({ progress }) {
    const groupRef = useRef();
    const codes = ["console.log()", "const data = {};", "while(true)", "<h1>Hello World</h1>", "npm start", "git commit"];
    
    useFrame(({ clock }) => {
        if (!groupRef.current) return;
        const visible = progress > 0.05 && progress < 0.25;
        const targetScale = visible ? 1 : 0;
        groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
        groupRef.current.rotation.y = clock.elapsedTime * 0.1;
    });

    return (
        <group ref={groupRef} scale={0}>
            {codes.map((text, i) => (
                <Text 
                    key={i} 
                    position={[(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10]}
                    fontSize={0.4}
                    color="#00ffff"
                >
                    {text}
                </Text>
            ))}
        </group>
    );
}

/**
 * Floating glass primitives for Learning phase (Sec 4)
 */
function GlassPrimitives({ progress }) {
    const groupRef = useRef();
    
    useFrame(({ clock }) => {
        if (!groupRef.current) return;
        const t = clock.elapsedTime;
        const visible = progress > 0.25 && progress < 0.45;
        const tScale = visible ? 1 : 0.001;
        groupRef.current.scale.lerp(new THREE.Vector3(tScale, tScale, tScale), 0.05);
        groupRef.current.rotation.x = t * 0.2;
        groupRef.current.rotation.y = t * 0.3;
    });

    return (
        <group ref={groupRef} scale={0.001}>
            <Float speed={2}>
                <mesh position={[-2, 1, 0]}>
                    <icosahedronGeometry args={[1, 0]} />
                    <meshPhysicalMaterial thickness={2} roughness={0.1} transmission={1} ior={1.5} color="#88aaff" envMapIntensity={2} />
                </mesh>
                <mesh position={[2, -1, 1]}>
                    <torusGeometry args={[0.8, 0.3, 16, 32]} />
                    <meshPhysicalMaterial thickness={2} roughness={0.1} transmission={1} ior={1.5} color="#ff88aa" envMapIntensity={2} />
                </mesh>
            </Float>
        </group>
    );
}

/**
 * Galaxy nodes and paths representing network completion (Sec 8-10)
 */
function GalaxyNetwork({ progress }) {
    const groupRef = useRef();
    const instancedRef = useRef();
    const particlesCount = 900;
    
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const positions = useMemo(() => {
        const positions = [];
        for (let i = 0; i < particlesCount; i++) {
            // spherical distribution
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(2 * Math.random() - 1);
            const radius = 5 + Math.random() * 15;
            positions.push({
                x: radius * Math.sin(phi) * Math.cos(theta),
                y: radius * Math.sin(phi) * Math.sin(theta),
                z: radius * Math.cos(phi),
                speed: Math.random() * 0.02
            });
        }
        return positions;
    }, []);

    useFrame(({ clock }) => {
        if (!groupRef.current || !instancedRef.current) return;
        
        // Appear from 0.7 onwards (Breakthrough/Success)
        const active = progress > 0.65;
        const tScale = active ? 1 : 0.001;
        groupRef.current.scale.lerp(new THREE.Vector3(tScale, tScale, tScale), 0.05);

        // Slow spiral at the end
        const spiralSpeed = progress > 0.85 ? 0.05 : 0.5;
        groupRef.current.rotation.y += spiralSpeed * 0.02;

        positions.forEach((data, i) => {
            dummy.position.set(data.x, data.y, data.z);
            // Move inwards/outwards to breathe
            data.y += Math.sin(clock.elapsedTime + i) * 0.01;
            dummy.updateMatrix();
            instancedRef.current.setMatrixAt(i, dummy.matrix);
        });
        instancedRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <group ref={groupRef} scale={0.001}>
            <instancedMesh ref={instancedRef} args={[null, null, particlesCount]}>
                <sphereGeometry args={[0.08, 8, 8]} />
                <meshStandardMaterial color="#ffffff" emissive="#aaaaaa" emissiveIntensity={2} />
            </instancedMesh>
        </group>
    );
}

/**
 * Main Controller orchestrating environmental conditions based on scroll
 */
function SceneOrchestrator({ progress }) {
    const { scene } = useThree();
    
    // Background and Fog interpolation targets
    const targets = useMemo(() => [
        { c: new THREE.Color('#000000'), f: new THREE.Color('#000000'), d: 0.02 }, // 0: Spark
        { c: new THREE.Color('#050000'), f: new THREE.Color('#220000'), d: 0.08 }, // 2: Struggle (Red Matrix)
        { c: new THREE.Color('#0a0022'), f: new THREE.Color('#0a0022'), d: 0.01 }, // 4: Learning (Purple Depth)
        { c: new THREE.Color('#222222'), f: new THREE.Color('#111111'), d: 0.15 }, // 7: Burnout (Heavy Grey)
        { c: new THREE.Color('#050a1a'), f: new THREE.Color('#050a1a'), d: 0.02 }, // 9: Success/Galaxy
    ], []);

    useEffect(() => {
        scene.fog = new THREE.FogExp2('#000000', 0.02);
        if (!scene.background) {
            scene.background = new THREE.Color('#000000');
        }
    }, [scene]);

    useFrame(() => {
        let currentTarget = targets[0];
        
        if (progress > 0.15 && progress <= 0.3) currentTarget = targets[1];
        else if (progress > 0.3 && progress <= 0.6) currentTarget = targets[2];
        else if (progress > 0.6 && progress <= 0.75) currentTarget = targets[3];
        else if (progress > 0.75) currentTarget = targets[4];

        if (scene.background && scene.background.isColor) {
            scene.background.lerp(currentTarget.c, 0.05);
        }
        if (scene.fog) {
            scene.fog.color.lerp(currentTarget.f, 0.05);
            scene.fog.density = THREE.MathUtils.lerp(scene.fog.density, currentTarget.d, 0.05);
        }
    });

    return (
        <>
            <ambientLight intensity={progress > 0.75 ? 1 : 0.2} />
            <directionalLight 
                position={[10, 10, 5]} 
                intensity={progress > 0.6 && progress < 0.75 ? 0.2 : 2} 
                color={progress > 0.15 && progress < 0.3 ? "#ff0000" : "#ffffff"} 
            />
        </>
    );
}

/**
 * Main Component Export
 */
export default function DigitalVoidCanvas({ scrollYProgress }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        return scrollYProgress.on('change', (v) => setProgress(v));
    }, [scrollYProgress]);

    return (
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }} gl={{ alpha: false, antialias: false, powerPreference: "high-performance" }}>
            <color attach="background" args={['#000000']} />
            <Environment preset="city" />
            <SceneOrchestrator progress={progress} />
            
            <Stars radius={50} depth={50} count={progress > 0.8 ? 5000 : 2000} factor={4} saturation={1} fade speed={1} />
            
            <ProceduralLaptop progress={progress} />
            <FloatingCode progress={progress} />
            <GlassPrimitives progress={progress} />
            <GalaxyNetwork progress={progress} />

            <EffectComposer disableNormalPass multisampling={0}>
                <Glitch
                    active={progress > 0.2 && progress < 0.3}
                    delay={[0.1, 1.5]}
                    duration={[0.1, 0.4]}
                    strength={[0.1, 0.4]}
                />
                <ChromaticAberration
                    offset={[0.005 * (progress > 0.6 && progress < 0.7 ? 5 : 1), 0.005]}
                />
                {progress > 0.6 && progress < 0.7 && (
                    <Vignette eskil={false} offset={0.1} darkness={1.5} />
                )}
                <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} height={300} intensity={1.5} />
            </EffectComposer>
        </Canvas>
    );
}
