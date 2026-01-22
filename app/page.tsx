"use client";

import React from "react";
import Link from "next/link";
import {
  Home,
  BookOpen,
  Layers,
  Vote,
  Info,
  ChevronRight,
  Cpu
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function LandingPage() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="relative min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-white/30 border-b border-white/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm rotate-45" />
          </div>
          <span className="text-xl font-bold tracking-tighter text-foreground">
            Agoranodes
          </span>
        </div>

        <div className="hidden md:flex items-center bg-white/40 p-1.5 rounded-full border border-white/40 shadow-sm">
          <NavLink href="/" icon={<Home size={18} />} label="Accueil" active />
          <NavLink href="/how-it-works" icon={<BookOpen size={18} />} label="Explications" />
          <NavLink href="/articles" icon={<Layers size={18} />} label="Contenus" />
          <NavLink href="/votes" icon={<Vote size={18} />} label="Votes" />
          <NavLink href="/about" icon={<Info size={18} />} label="À propos" />
        </div>

        <button className="bg-foreground text-background px-6 py-2 rounded-full font-medium hover:bg-neutral-800 transition-all active:scale-95 shadow-lg shadow-black/5">
          Login
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Dynamic Sky Background */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#7dd3fc] via-[#f9a8d4] to-[#ffedd5]">
          {/* Animated Sun/Glow */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-200/30 rounded-full blur-[120px]"
          />
        </div>

        {/* Clouds Overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-20 h-96 pointer-events-none">
          {/* Fluffy Bottom Clouds */}
          <Cloud speed={20} opacity={0.8} bottom={-20} left={-10} scale={1.5} />
          <Cloud speed={25} opacity={0.9} bottom={-40} right={-5} scale={1.8} />
          <Cloud speed={18} opacity={0.7} bottom={-10} left={30} scale={1.2} />

          {/* Foggy transition */}
          <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-white via-white/80 to-transparent" />
        </div>

        {/* Content */}
        <motion.div
          style={{ y: y1, opacity }}
          className="relative z-30 text-center px-6 max-w-6xl mx-auto"
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

      {/* Placeholder Content for Scroll */}
      <section className="relative z-30 bg-white py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { title: "Modulaire", desc: "Des briques de gouvernance adaptables à chaque communauté." },
            { title: "Transparent", desc: "Chaque décision est tracée, vérifiable et immuable par design." },
            { title: "Humain", desc: "La technologie au service du consensus, pas l'inverse." }
          ].map((item, i) => (
            <div key={i} className="group p-8 rounded-3xl border border-neutral-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all duration-500">
              <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center mb-6 text-indigo-600 group-hover:scale-110 transition-transform">
                <Cpu size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
              <p className="text-neutral-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function NavLink({ href, icon, label, active = false }: { href: string, icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <Link
      href={href}
      className={`
        flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all
        ${active
          ? "bg-white text-indigo-600 border border-indigo-100 shadow-sm"
          : "text-neutral-600 hover:text-neutral-900 hover:bg-white/50"}
      `}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function Cloud({ speed, opacity, bottom, left, right, scale }: { speed: number, opacity: number, bottom?: number, left?: number, right?: number, scale?: number }) {
  return (
    <motion.div
      initial={{ x: -100 }}
      animate={{ x: 100 }}
      transition={{ duration: speed, repeat: Infinity, repeatType: "mirror", ease: "linear" }}
      className="absolute blur-3xl"
      style={{
        bottom,
        left,
        right,
        opacity,
        transform: `scale(${scale || 1})`
      }}
    >
      <div className="flex gap-0 items-end">
        <div className="w-64 h-64 bg-white rounded-full" />
        <div className="w-80 h-80 bg-white rounded-full -ml-32" />
        <div className="w-48 h-48 bg-white rounded-full -ml-20" />
      </div>
    </motion.div>
  );
}
