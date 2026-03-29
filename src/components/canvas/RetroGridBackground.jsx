'use client';

import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle, Vec2 } from 'ogl';

const vertexShader = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0, 1);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform float uVelo; // Mouse velocity acts as "Turbo Speed"

  varying vec2 vUv;

  // --- PSEUDO 3D FUNCTIONS ---
  
  // Creates the grid lines
  float grid(vec2 pos, float scale) {
    vec2 grid = fract(pos * scale);
    // Smooth lines (anti-aliased)
    vec2 lines = smoothstep(0.02, 0.0, abs(grid - 0.5));
    return max(lines.x, lines.y);
  }

  void main() {
    // Normalized coordinates -1 to 1
    vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / uResolution.y;
    
    // --- 1. CAMERA SETUP (RAYCASTING) ---
    // We are simulating a camera looking forward
    vec3 ro = vec3(0.0, 1.0, -3.0); // Ray Origin (Camera height 1.0)
    vec3 rd = normalize(vec3(uv.x, uv.y - 0.2, 1.0)); // Ray Direction (tilted down slightly)

    // --- 2. PLANE INTERSECTION ---
    // We want to hit a floor at height y = 0
    // Equation: ro.y + t * rd.y = 0  -->  t = -ro.y / rd.y
    
    float t = -ro.y / rd.y;
    
    // If t < 0, we are looking at the sky (above the horizon)
    vec3 col = vec3(0.0); // Sky color (Black void)

    if (t > 0.0) {
        // Position on the floor
        vec3 pos = ro + rd * t;
        
        // --- 3. MOVEMENT & WARPING ---
        
        // Infinite forward movement
        // We add uTime to the Z axis.
        // We also add uVelo to make it "boost" when moving mouse
        float speed = (uTime * 0.5) + (uVelo * 0.1); 
        pos.z += speed;

        // Mouse Interaction:
        // Project mouse to 3D floor
        vec2 m = (uMouse - 0.5) * vec2(uResolution.x/uResolution.y, 1.0);
        // Approximate interaction zone based on screen UV vs Mouse UV
        float interact = 1.0 - smoothstep(0.0, 0.5, length(uv - m));
        
        // Warping the grid coordinates based on mouse
        // This creates the "Hill" or "Valley" effect under the cursor
        pos.x += sin(pos.z * 0.5) * interact * 2.0;
        pos.y += cos(pos.x * 0.5) * interact * 0.5;

        // --- 4. DRAWING THE GRID ---
        
        // Base Grid
        float g1 = grid(pos.xz, 1.0); // Large tiles
        float g2 = grid(pos.xz, 4.0); // Small sub-tiles
        
        // Combine grids (sub-grid is fainter)
        float totalGrid = g1 + g2 * 0.3;

        // --- 5. COLOR & FOG ---
        
        // Neon palette (Cyan / Magenta)
        vec3 gridColor = mix(
            vec3(0.0, 1.0, 0.8), // Cyan
            vec3(0.8, 0.0, 1.0), // Magenta
            sin(pos.z * 0.1) * 0.5 + 0.5 // Color shift over distance
        );

        // Intensity falloff (Fog)
        // Things far away (high t) should fade to black
        float fog = 1.0 / (1.0 + t * t * 0.1);
        
        // Add a "Pulse" that travels down the grid
        float pulse = smoothstep(0.0, 0.1, sin(pos.z - uTime * 5.0));

        col = gridColor * totalGrid * fog;
        
        // Add the pulse glow
        col += gridColor * pulse * 0.2 * fog;
    }

    // Vignette
    col *= 1.0 - length(uv) * 0.5;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function RetroGridBackground() {
    const containerRef = useRef(null);
    const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5, velo: 0, veloTarget: 0 });

    useEffect(() => {
        if (!containerRef.current) return;

        // --- SETUP ---
        const renderer = new Renderer({
            alpha: true,
            dpr: Math.min(window.devicePixelRatio, 2)
        });
        const gl = renderer.gl;
        containerRef.current.appendChild(gl.canvas);

        const geometry = new Triangle(gl);

        const program = new Program(gl, {
            vertex: vertexShader,
            fragment: fragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uResolution: { value: new Vec2(window.innerWidth, window.innerHeight) },
                uMouse: { value: new Vec2(0.5, 0.5) },
                uVelo: { value: 0 },
            },
        });

        const mesh = new Mesh(gl, { geometry, program });

        // --- EVENTS ---
        function resize() {
            if (!containerRef.current) return;
            renderer.setSize(window.innerWidth, window.innerHeight);
            program.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
        }
        window.addEventListener('resize', resize);
        resize();

        function updateMouse(e) {
            mouseRef.current.targetX = e.clientX / window.innerWidth;
            mouseRef.current.targetY = 1.0 - e.clientY / window.innerHeight;
        }
        window.addEventListener('mousemove', updateMouse);

        // --- ANIMATION ---
        let animationId;
        function update(t) {
            animationId = requestAnimationFrame(update);
            const time = t * 0.001;
            program.uniforms.uTime.value = time;

            const m = mouseRef.current;

            // Smooth Mouse Position
            const dx = m.targetX - m.x;
            const dy = m.targetY - m.y;
            m.x += dx * 0.1;
            m.y += dy * 0.1;

            // Calculate Speed for "Turbo Boost"
            // If mouse moves, we increase velocity target
            const moveSpeed = Math.sqrt(dx * dx + dy * dy) * 100.0;
            m.veloTarget = moveSpeed;
            // Decay velocity
            m.velo += (m.veloTarget - m.velo) * 0.05;

            program.uniforms.uMouse.value.set(m.x, m.y);
            program.uniforms.uVelo.value = m.velo;

            renderer.render({ scene: mesh });
        }
        animationId = requestAnimationFrame(update);

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', updateMouse);
            cancelAnimationFrame(animationId);
            if (containerRef.current && containerRef.current.contains(gl.canvas)) {
                containerRef.current.removeChild(gl.canvas);
            }
        };
    }, []);

    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            {/* 1. SHADER LAYER */}
            <div ref={containerRef} className="absolute inset-0 z-0" />

            {/* Scanline Overlay (Optional for extra retro feel) */}
            <div className="absolute inset-0 z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-20" />
        </div>
    );
}
