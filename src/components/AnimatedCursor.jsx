"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

export default function AnimatedCursor() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isMouseDown, setIsMouseDown] = useState(false);
    
    useEffect(() => {
        // Only run on non-touch devices
        if (window.matchMedia("(pointer: coarse)").matches) return;

        const updateMousePosition = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
            
            // Optimization trick: verify if hovering a clickable recursively
            const target = e.target;
            const isClickable = target.closest("a, button, input-[type='submit'], input-[type='image'], label[for], select, div.group") || target.tagName.toLowerCase() === 'button' || target.tagName.toLowerCase() === 'a';
            setIsHovering(Boolean(isClickable));
        };

        const handleMouseDown = () => setIsMouseDown(true);
        const handleMouseUp = () => setIsMouseDown(false);

        window.addEventListener("mousemove", updateMousePosition);
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", updateMousePosition);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    // Outer ring variants (Spring Physics)
    const variants = {
        default: {
            x: mousePosition.x - 24, // center the 48px circle
            y: mousePosition.y - 24,
            scale: 1,
            opacity: 1,
            backgroundColor: "rgba(249, 115, 22, 0.0)", 
            borderColor: "rgba(251, 146, 60, 0.4)",
            borderWidth: "1px",
            rotate: 0,
            transition: {
                type: "spring",
                damping: 25,
                stiffness: 400,
                mass: 0.5
            }
        },
        hover: {
            x: mousePosition.x - 30, // center the 60px circle
            y: mousePosition.y - 30,
            scale: 1,
            opacity: 0.8,
            backgroundColor: "rgba(249, 115, 22, 0.1)", // Amber wash
            borderColor: "rgba(251, 146, 60, 0.8)",
            borderWidth: "2px",
            borderStyle: "dashed",
            rotate: 180,
            transition: {
                type: "spring",
                damping: 20,
                stiffness: 300,
                rotate: { duration: 1.5, repeat: Infinity, ease: "linear" }
            }
        },
        mousedown: {
            x: mousePosition.x - 12,
            y: mousePosition.y - 12,
            scale: 1,
            opacity: 1,
            backgroundColor: "rgba(249, 115, 22, 0.4)",
            borderColor: "rgba(251, 146, 60, 1)",
            borderWidth: "4px",
            transition: {
                type: "spring",
                damping: 10,
                stiffness: 500
            }
        }
    };

    // Fast inner dot physics
    const dotVariants = {
        default: {
            x: mousePosition.x - 4,
            y: mousePosition.y - 4,
            opacity: 1,
            scale: 1,
            transition: { type: "tween", duration: 0, ease: "linear" }
        },
        hover: {
            x: mousePosition.x - 4,
            y: mousePosition.y - 4,
            opacity: 1,
            scale: 0, // shrink inner dot on hover
            transition: { type: "spring", damping: 15, stiffness: 400 }
        },
        mousedown: {
            x: mousePosition.x - 4,
            y: mousePosition.y - 4,
            opacity: 1,
            scale: 2, // burst inner dot on click
            transition: { type: "spring", damping: 10, stiffness: 400 }
        }
    };

    const currentState = isMouseDown ? "mousedown" : isHovering ? "hover" : "default";

    // Detect if valid coordinates exist (prevents corner flash on first render)
    if (mousePosition.x === 0 && mousePosition.y === 0) return null;

    return (
        <div className="hidden md:block">
            {/* Outer Sci-Fi Ring */}
            <motion.div
                variants={variants}
                animate={currentState}
                className="fixed top-0 left-0 z-[99999] pointer-events-none rounded-full flex items-center justify-center overflow-visible"
                style={{ 
                    // Base size of standard outer circle
                    height: isHovering ? 60 : isMouseDown ? 24 : 48,
                    width: isHovering ? 60 : isMouseDown ? 24 : 48,
                    mixBlendMode: 'difference' 
                }}
            >
                {/* Visual sci-fi crosshairs on default mode */}
                {!isHovering && !isMouseDown && (
                    <>
                        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-orange-400/30 -translate-x-1/2" />
                        <div className="absolute left-0 right-0 top-1/2 h-px bg-orange-400/30 -translate-y-1/2" />
                    </>
                )}
            </motion.div>

            {/* Inner Precision Dot */}
            <motion.div
                variants={dotVariants}
                animate={currentState}
                className="fixed top-0 left-0 w-2 h-2 rounded-full bg-orange-400 z-[100000] pointer-events-none shadow-[0_0_10px_rgba(249,115,22,1)]"
            />
        </div>
    );
}
