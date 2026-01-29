'use client';

import Link from 'next/link';
import { PenLine, LogIn, FileText, Send, CheckCircle, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: LogIn,
    title: 'Se connecter',
    description: 'Connectez-vous avec votre compte 4NK pour commencer.',
  },
  {
    icon: PenLine,
    title: 'Rédiger',
    description: 'Écrivez votre article via notre formulaire de soumission intuitif.',
  },
  {
    icon: Send,
    title: 'Soumettre',
    description: 'Envoyez votre article pour validation par la communauté.',
  },
  {
    icon: CheckCircle,
    title: 'Publication',
    description: 'Après approbation, votre article est publié et accessible à tous.',
  },
];

export function HowToPublish() {
  return (
    <section className="py-12">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 md:p-12 text-white overflow-hidden relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <FileText className="w-8 h-8" />
            <h2 className="text-3xl font-bold">Comment publier un article ?</h2>
          </div>

          <p className="text-lg text-white/80 mb-10 max-w-2xl">
            Partagez vos idées et contributions avec la communauté Agoranodes.
            Suivez ces étapes simples pour proposer votre article.
          </p>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-colors"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
                    <span className="text-lg font-bold">{index + 1}</span>
                  </div>
                  <step.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-white/70">{step.description}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/publications/soumettre"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-semibold rounded-full hover:bg-gray-100 transition-colors shadow-lg"
            >
              Proposer un article
              <ArrowRight className="w-5 h-5" />
            </Link>
            <span className="text-white/60 text-sm">
              Déjà inscrit ? Connectez-vous pour soumettre directement.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
