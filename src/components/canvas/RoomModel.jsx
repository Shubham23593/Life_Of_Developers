'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MeshDistortMaterial, Float, Trail, Text } from '@react-three/drei';
import * as THREE from 'three';

/**
 * RoomModel
 * ─────────
 * Procedural desk / room built from primitives.
 */

/* ─── Camera keyframes ─────────────────────────────────────────────── */
// [progress, posX, posY, posZ, targetX, targetY, targetZ]

const DESKTOP_KEYFRAMES = [
  [0.00, 0, 8, 6, 0, 0.8, 0],       // top-down drop start
  [0.25, 0, 2.5, 5, 0, 0.8, 0],     // wide desk view
  [0.50, 0, 1.4, 2.2, 0, 1.1, -0.3], // close to laptop screen
  [0.75, 1.6, 1.0, 2.0, 0.5, 0.5, -0.2], // pivot → mug
  [1.00, 0, 1.15, 0.3, 0, 1.1, -1.2], // into portal
];

const MOBILE_KEYFRAMES = [
  [0.00, 0, 10, 8, 0, 0.8, 0],      // higher/further back
  [0.25, 0, 3.5, 7.5, 0, 0.8, 0],   // pulled back for portrait view
  [0.50, 0, 1.8, 3.5, 0, 1.1, -0.3], // further from laptop
  [0.75, 1.0, 1.3, 3.0, 0.2, 0.5, -0.2], // tighter pivot so mug isn't cut off
  [1.00, 0, 1.15, 0.5, 0, 1.1, -1.2], // into portal
];

function lerpKeyframe(frames, t) {
  if (t <= frames[0][0]) return frames[0];
  if (t >= frames[frames.length - 1][0]) return frames[frames.length - 1];
  for (let i = 0; i < frames.length - 1; i++) {
    const a = frames[i], b = frames[i + 1];
    if (t >= a[0] && t <= b[0]) {
      const u = (t - a[0]) / (b[0] - a[0]);
      const e = u * u * (3 - 2 * u); // smooth-step
      return a.map((v, idx) => (idx === 0 ? t : v + (b[idx] - v) * e));
    }
  }
}

/* ─── sub-components ──────────────────────────────────────────────── */
function Desk() {
  return (
    <group position={[0, 0, 0]}>
      {/* desk top */}
      <mesh receiveShadow castShadow position={[0, 0.72, 0]}>
        <boxGeometry args={[3.8, 0.06, 1.8]} />
        {/* Deep, dark violet-black to absorb neon lights perfectly */}
        <meshStandardMaterial color="#05020a" roughness={0.2} metalness={0.8} />
      </mesh>
      {/* legs */}
      {[[-1.7, -0.8], [1.7, -0.8], [-1.7, 0.8], [1.7, 0.8]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.36, z]} castShadow>
          <boxGeometry args={[0.07, 0.72, 0.07]} />
          <meshStandardMaterial color="#000000" roughness={0.4} metalness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function Laptop({ screenGlow, lidAngle }) {
  const lidRef = useRef();
  const screenRef = useRef();
  const glowRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (lidRef.current) lidRef.current.rotation.x = lidAngle.current;

    if (screenRef.current) {
      const openness = Math.min(1, Math.abs(lidAngle.current) / 1.15);
      screenRef.current.emissiveIntensity = openness * (0.4 + Math.sin(t * 3) * 0.05);
    }

    if (glowRef.current) {
      glowRef.current.intensity = screenGlow.current * 1.8 + 0.2;
    }
  });

  return (
    <group position={[0, 0.75, -0.2]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.3, 0.03, 0.88]} />
        <meshStandardMaterial color="#08080c" roughness={0.3} metalness={0.9} />
      </mesh>

      <mesh position={[0, 0.018, 0]}>
        <boxGeometry args={[1.24, 0.005, 0.82]} />
        <meshStandardMaterial color="#040406" roughness={0.6} />
      </mesh>

      <mesh position={[0, 0.025, -0.43]}>
        <boxGeometry args={[1.1, 0.04, 0.02]} />
        <meshStandardMaterial color="#111111" metalness={0.95} roughness={0.1} />
      </mesh>

      <group ref={lidRef} rotation={[0, 0, 0]} position={[0, 0.025, -0.43]}>
        <group position={[0, 0, 0.43]}>
          <mesh castShadow position={[0, 0.01, 0]}>
            <boxGeometry args={[1.3, 0.02, 0.88]} />
            <meshStandardMaterial color="#08080c" roughness={0.3} metalness={0.9} />
          </mesh>

          <mesh position={[0, -0.001, 0]}>
            <boxGeometry args={[1.2, 0.01, 0.78]} />
            <meshStandardMaterial color="#000000" roughness={0.4} />
          </mesh>

          {/* SCREEN PORTAL — Cyan Emissive */}
          <mesh ref={screenRef} position={[0, -0.006, 0]}>
            <boxGeometry args={[1.1, 0.002, 0.68]} />
            <meshStandardMaterial
              color="#001122"
              emissive="#22c55e"
              emissiveIntensity={0}
              roughness={0.8}
              metalness={0.1}
            />
          </mesh>

          {/* Cyan screen light */}
          <pointLight
            ref={glowRef}
            position={[0, -0.1, 0]}
            color="#22c55e"
            intensity={0}
            distance={5}
            decay={2}
          />

          {/* Code text snippet */}
          <group position={[0, -0.008, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <Text
              position={[0, 0, 0]}
              fontSize={0.05}
              color="#22c55e"
              anchorX="center"
              anchorY="middle"
              maxWidth={1.0}
            >
              {`function deploy() {\n  initiateCyberpunkTheme();\n  console.log("Online");\n}`}
            </Text>
          </group>
        </group>
      </group>
    </group>
  );
}

function CoffeeMug() {
  const steamRef = useRef();
  useFrame(({ clock }) => {
    if (steamRef.current) {
      steamRef.current.position.y = 1.15 + Math.sin(clock.getElapsedTime() * 1.2) * 0.04;
      steamRef.current.rotation.y += 0.01;
    }
  });
  return (
    <group position={[1.4, 0.75, 0.3]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.1, 0.09, 0.18, 24]} />
        <meshStandardMaterial color="#0a0a0c" roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh position={[0.13, 0, 0]}>
        <torusGeometry args={[0.06, 0.012, 10, 20, Math.PI]} />
        <meshStandardMaterial color="#0a0a0c" roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.09, 0]}>
        <circleGeometry args={[0.088, 24]} />
        <meshStandardMaterial color="#000000" roughness={0.1} />
      </mesh>
      {/* Magenta steam wisps */}
      <group ref={steamRef} position={[0, 0.38, 0]}>
        {[0, 0.08, -0.06].map((x, i) => (
          <mesh key={i} position={[x, i * 0.06, 0]}>
            <sphereGeometry args={[0.015 + i * 0.005, 6, 6]} />
            <meshStandardMaterial color="#22c55e" transparent opacity={0.15 - i * 0.04} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* Floating bug icons — Hot Pink/Magenta */
function BugOrbit({ count = 5, visible }) {
  const groupRef = useRef();
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.4;
    groupRef.current.children.forEach((child, i) => {
      child.rotation.z = clock.getElapsedTime() * 0.8 + (i * Math.PI * 2) / count;
    });
  });
  return (
    <group ref={groupRef} position={[0, 1.4, 0]} visible={visible}>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const r = 0.9;
        return (
          <mesh key={i} position={[Math.cos(angle) * r, 0, Math.sin(angle) * r]}>
            <octahedronGeometry args={[0.045, 0]} />
            <meshStandardMaterial
              color="#22c55e"
              emissive="#22c55e"
              emissiveIntensity={1.5}
              roughness={0.2}
            />
          </mesh>
        );
      })}
    </group>
  );
}

/* Digital grid floor — Deep Purple */
function DigitalGrid({ opacity }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.material.opacity = opacity.current;
      ref.current.material.emissiveIntensity = 0.5 + Math.sin(clock.getElapsedTime() * 2) * 0.2;
    }
  });
  return (
    <mesh ref={ref} position={[0, -0.5, -2]} rotation={[-0.1, 0, 0]}>
      <planeGeometry args={[20, 20, 20, 20]} />
      <meshStandardMaterial
        color="#10002b"
        emissive="#16a34a"
        emissiveIntensity={0.8}
        wireframe
        transparent
        opacity={0}
      />
    </mesh>
  );
}

/* ─── Main export ─────────────────────────────────────────────────── */
export default function RoomModel({ scrollProgress, isMobile }) {
  const { camera } = useThree();

  // Select the appropriate keyframes based on the device
  const activeKeyframes = useMemo(() => isMobile ? MOBILE_KEYFRAMES : DESKTOP_KEYFRAMES, [isMobile]);

  const camPos = useMemo(() => new THREE.Vector3(), []);
  const camTarget = useMemo(() => new THREE.Vector3(), []);
  const tmpPos = useMemo(() => new THREE.Vector3(), []);
  const tmpTarget = useMemo(() => new THREE.Vector3(), []);

  const screenGlow = useRef(0);
  const gridOpacity = useRef(0);
  const lidAngle = useRef(0);

  useFrame((_, delta) => {
    const t = scrollProgress.get();

    // ── Camera Update ──────────────────────────────────────────────────
    const kf = lerpKeyframe(activeKeyframes, t);
    tmpPos.set(kf[1], kf[2], kf[3]);
    tmpTarget.set(kf[4], kf[5], kf[6]);

    const damp = isMobile ? 0.06 : 0.04;
    camPos.lerp(tmpPos, 1 - Math.pow(damp, delta * 60));
    camTarget.lerp(tmpTarget, 1 - Math.pow(damp, delta * 60));

    camera.position.copy(camPos);
    camera.lookAt(camTarget);

    // ── Animations ────────────────────────────────────────────────────
    const LID_OPEN_START = 0.85;
    const LID_OPEN_ANGLE = -1.15;
    let targetLid = 0;
    if (t > LID_OPEN_START) {
      const rawT = Math.min(1, (t - LID_OPEN_START) / (1 - LID_OPEN_START));
      const easedT = rawT * rawT * (3 - 2 * rawT);
      targetLid = LID_OPEN_ANGLE * easedT;
    }
    lidAngle.current = THREE.MathUtils.lerp(lidAngle.current, targetLid, 0.1);

    const openness = Math.min(1, Math.abs(lidAngle.current) / 1.15);
    screenGlow.current = THREE.MathUtils.lerp(screenGlow.current, openness, 0.04);

    gridOpacity.current = THREE.MathUtils.lerp(
      gridOpacity.current,
      t > 0.75 ? (t - 0.75) * 4 : 0,
      0.05
    );
  });

  return (
    <group>
      {/* Pure black floor and walls to emphasize neon lights */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#000000" roughness={0.9} />
      </mesh>

      <mesh position={[0, 3, -3.5]} receiveShadow>
        <planeGeometry args={[10, 6]} />
        <meshStandardMaterial color="#020202" roughness={0.95} />
      </mesh>

      {/* Side wall glow strip (Cyan) */}
      <mesh position={[-4.5, 1.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[8, 3]} />
        <meshStandardMaterial
          color="#000000"
          emissive="#22c55e"
          emissiveIntensity={0.12}
          roughness={1}
        />
      </mesh>

      <Desk />
      <Laptop screenGlow={screenGlow} lidAngle={lidAngle} />
      <CoffeeMug />
      <BugOrbit count={6} visible={true} />
      <DigitalGrid opacity={gridOpacity} />

      {/* Neon accent strips on desk edge (Cyan) */}
      <mesh position={[0, 0.73, 0.91]}>
        <boxGeometry args={[3.8, 0.008, 0.006]} />
        <meshStandardMaterial
          color="#22c55e"
          emissive="#22c55e"
          emissiveIntensity={4}
        />
      </mesh>
    </group>
  );
}