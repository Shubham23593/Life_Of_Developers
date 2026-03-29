// src/app/layout.js
// ─────────────────────────────────────────────────────────────────
// SERVER COMPONENT — do NOT add 'use client' here.
// Keeping it server-side allows:
//   1. export const metadata (SEO, OG tags)
//   2. next/font optimisation (zero layout shift)
//
// All client-side logic (Lenis, Zustand, Three.js) lives inside
// page.js and its dynamic() imports, which are always 'use client'.
// ─────────────────────────────────────────────────────────────────

import './globals.css';
/* ── Google Fonts ────────────────────────────────────────────────── */
import { Inter, JetBrains_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['300', '400', '500', '700', '900'],
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['300', '400', '500', '700'],
  display: 'swap',
});

/* ── SEO Metadata ───────────────────────────────────────────────── */
export const metadata = {
  title: 'Life of a Developer — Operator Log',
  description:
    'An immersive 3D storytelling timeline documenting the evolution of a developer.',
};

/* ── Root Layout ────────────────────────────────────────────────── */
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="bg-black text-green-400 font-mono selection:bg-green-500 selection:text-black antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}