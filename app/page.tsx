"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Home,
  ChevronRight,
  Sparkle
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { AuthButton } from "./components/auth-button";

export default function LandingPage() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="relative min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-20 bg-transparent transition-all">
        <div className="flex items-center cursor-pointer">
          <span className="text-xl font-bold tracking-tight text-white">
            Agoranodes
          </span>
        </div>

        <NavMenu />

        <AuthButton />
      </nav>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden">
        {/* Hero Background Image - natural height */}
        <img
          src="/bg-hero-cite.jpg"
          alt="Cité grecque"
          className="w-full h-auto object-contain z-0"
        />


        {/* Content */}
        <motion.div
          style={{ y: y1, opacity }}
          className="absolute top-0 left-0 right-0 z-30 flex flex-col items-center justify-start pt-28 text-center px-6 max-w-6xl mx-auto h-screen"
        >
          <span
            className="inline-block px-4 py-1.5 mb-8 text-sm font-semibold tracking-widest uppercase text-indigo-900/60 bg-white/20 backdrop-blur-sm rounded-full border border-white/30"
          >
            L'intelligence Collective
          </span>

          <h1
            className="text-6xl md:text-8xl lg:text-9xl font-bold text-neutral-900 leading-[0.9] tracking-tight"
          >
            Construisons <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 via-indigo-950 to-neutral-800">
              ensemble
            </span> <br />
            la démocratie
          </h1>

          <p
            className="mt-12 text-lg md:text-xl text-neutral-800/70 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Le futur de la gouvernance ne se décrète pas, il s'assemble.
            Rejoignez une architecture de pensée modulaire et décentralisée.
          </p>

          <div
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button className="group relative flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20">
              Commencer l'exploration
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 rounded-full text-lg font-semibold text-neutral-800 hover:bg-white/40 backdrop-blur-sm transition-all border border-white/50">
              Voir le manifeste
            </button>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30"
        >
          <div className="w-6 h-10 border-2 border-neutral-900/20 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-neutral-900/40 rounded-full" />
          </div>
        </motion.div>
      </section>

    </div>
  );
}

const menuItems = [
  { href: "/", icon: <Home size={18} />, label: null },
  { href: "/how-it-works", icon: null, label: "Explications" },
  { href: "/publications", icon: null, label: "Publications" },
  { href: "/forum", icon: null, label: "Forum" },
  { href: "/framework", icon: null, label: "Framework" },
];

function NavMenu() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0); // Page d'accueil par défaut
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const targetIndex = hoveredIndex !== null ? hoveredIndex : activeIndex;
    const targetEl = itemRefs.current[targetIndex];
    const containerEl = containerRef.current;

    if (targetEl && containerEl) {
      const containerRect = containerEl.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();
      setPillStyle({
        left: targetRect.left - containerRect.left,
        width: targetRect.width,
      });
    }
  }, [hoveredIndex, activeIndex]);

  return (
    <div
      ref={containerRef}
      className="hidden md:flex items-center gap-0.5 bg-[#000000]/70 px-1.5 py-1.5 rounded-full relative"
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {/* Sliding pill background */}
      <motion.div
        className="absolute bg-white rounded-full h-[calc(100%-12px)] top-1.5"
        animate={{
          left: pillStyle.left,
          width: pillStyle.width,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
        }}
      />

      {menuItems.map((item, index) => (
        <Link
          key={item.href}
          href={item.href}
          ref={(el) => { itemRefs.current[index] = el; }}
          onMouseEnter={() => setHoveredIndex(index)}
          onClick={() => setActiveIndex(index)}
          className={`
            relative z-10 flex items-center justify-center px-4 py-1.5 rounded-full text-sm font-medium transition-colors
            ${(hoveredIndex !== null ? hoveredIndex === index : activeIndex === index)
              ? "text-neutral-900"
              : "text-white"}
            ${item.icon && !item.label ? "px-2.5" : ""}
          `}
        >
          {item.icon}
          {item.label && <span>{item.label}</span>}
        </Link>
      ))}
    </div>
  );
}

