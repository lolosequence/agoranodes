"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight, BookOpen, BrainCircuit, Vote, Play, X } from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Navbar } from "./components/navbar";

const steps = [
  {
    id: "01",
    title: "Formation",
    icon: BookOpen,
    color: "bg-sky-400",
    rotation: "lg:-rotate-3 lg:translate-x-6",
    description: "Avant chaque vote, une phase de formation permet à chacun de comprendre les enjeux.",
  },
  {
    id: "02",
    title: "Quizz",
    icon: BrainCircuit,
    color: "bg-pink-300",
    rotation: "lg:-translate-y-12 lg:z-10",
    description: "Un questionnaire valide votre compréhension du sujet pour garantir un vote éclairé.",
  },
  {
    id: "03",
    title: "Vote",
    icon: Vote,
    color: "bg-rose-400",
    rotation: "lg:rotate-3 lg:-translate-x-6",
    description: "Votez en toute connaissance de cause. Chaque voix est ancrée sur la blockchain.",
  },
];

export default function LandingPage() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const overlayOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  const [selectedStep, setSelectedStep] = useState<typeof steps[number] | null>(null);

  useEffect(() => {
    if (selectedStep) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [selectedStep]);

  return (
    <div className="relative min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <Navbar variant="transparent" />

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden">
        {/* Hero Background Images - stacked */}
        <img
          src="/bg-hero-cite.jpg"
          alt="Cité grecque"
          className="w-full h-auto object-contain z-0"
        />
        <motion.img
          src="/bg-hero-cite.png"
          alt="Cité grecque - premier plan"
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 w-full h-auto object-contain z-10"
        />


        {/* Content */}
        <motion.div
          style={{ y: y1, opacity }}
          className="absolute inset-0 z-30 flex flex-col items-center text-center px-6 max-w-6xl mx-auto h-screen"
        >
          {/* Spacer top - pushes content to center */}
          <div className="flex-1" />

          <span
            className="inline-block px-4 py-1.5 mb-8 text-sm font-semibold tracking-widest uppercase text-indigo-900/60 bg-white/20 backdrop-blur-sm rounded-full border border-white/30"
          >
            L'intelligence Collective
          </span>

          <h1
            className="text-2xl md:text-3xl lg:text-[4rem] font-bold text-neutral-900 leading-tight tracking-tight"
          >
            Construisons ensemble <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 via-indigo-950 to-neutral-800">
              le système de gouvernance
            </span> <br />
            de demain
          </h1>

          <p
            className="mt-8 text-lg md:text-xl text-neutral-800/70 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Le futur de la gouvernance ne se décrète pas, il s'assemble.
            Rejoignez une architecture de pensée modulaire et décentralisée.
          </p>

          <div
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button className="group relative flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20">
              Commencer l'exploration
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 rounded-full text-lg font-semibold text-neutral-800 hover:bg-white/40 backdrop-blur-sm transition-all border border-white/50">
              Voir le manifeste
            </button>
          </div>

          {/* Spacer bottom - equal to top, keeps content centered */}
          <div className="flex-1" />

          {/* Scroll Indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mb-8"
          >
            <div className="w-6 h-10 border-2 border-neutral-900/20 rounded-full flex justify-center p-1">
              <div className="w-1 h-2 bg-neutral-900/40 rounded-full" />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Voting Process Section */}
      <section className="py-24 px-6 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#171717] leading-tight mb-6"
            >
              Un processus de vote éclairé
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl md:text-2xl font-medium text-neutral-800/70 leading-relaxed"
            >
              Trois étapes pour garantir des décisions collectives informées et légitimes.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mt-10"
            >
              <button className="inline-flex items-center gap-2 bg-[#171717] text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-all duration-300 shadow-lg active:scale-95 group">
                <Play className="fill-current group-hover:scale-110 transition-transform" size={20} />
                Play now
              </button>
            </motion.div>
          </div>

          {/* Fan/Overlapping Steps Layout */}
          <div className="flex flex-col lg:flex-row items-stretch justify-center gap-8 lg:gap-0 mt-24 px-4 lg:px-0">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 50, rotate: index === 0 ? -10 : index === 2 ? 10 : 0 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                onClick={() => setSelectedStep(step)}
                className={`group relative flex-1 ${step.color} ${step.rotation} min-h-[500px] p-10 rounded-[3.5rem] shadow-2xl flex flex-col items-center text-center transition-all duration-500 ease-out hover:z-20 hover:lg:rotate-0 hover:lg:-translate-y-16 cursor-pointer`}
              >
                {/* Step Number Badge */}
                <div className="absolute top-8 left-10">
                  <div className="px-4 py-1.5 bg-white/30 backdrop-blur-md rounded-full border border-white/20">
                    <span className="text-sm font-bold tracking-widest text-white uppercase">
                      Étape {step.id}
                    </span>
                  </div>
                </div>

                {/* Central Icon */}
                <div className="flex-1 flex items-center justify-center w-full">
                  <div className="p-8 bg-white/20 rounded-full group-hover:scale-110 transition-transform duration-500">
                    <step.icon size={64} strokeWidth={1.5} className="text-white" />
                  </div>
                </div>

                {/* Text Content */}
                <div className="w-full mt-auto">
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-lg md:text-xl font-medium text-white/90 leading-relaxed max-w-[280px] mx-auto">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Step Detail Modal */}
      <AnimatePresence>
        {selectedStep && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setSelectedStep(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className={`relative w-[90vw] max-w-2xl max-h-[85vh] overflow-y-auto ${selectedStep.color} rounded-[2.5rem] shadow-2xl p-10`}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedStep(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
              >
                <X size={24} className="text-white" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-white/20 rounded-full">
                  <selectedStep.icon size={40} strokeWidth={1.5} className="text-white" />
                </div>
                <div>
                  <span className="text-sm font-bold tracking-widest text-white/70 uppercase">
                    Étape {selectedStep.id}
                  </span>
                  <h3 className="text-3xl font-bold text-white tracking-tight">
                    {selectedStep.title}
                  </h3>
                </div>
              </div>

              {/* Body */}
              <div className="space-y-4 text-white/90 text-lg leading-relaxed">
                <p>{selectedStep.description}</p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                  fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                  culpa qui officia deserunt mollit anim id est laborum.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}


