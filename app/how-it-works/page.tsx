import { Navbar } from '../components/navbar';
import { BookOpen, BrainCircuit, Vote } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />

      <main className="container mx-auto px-4 pt-28 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Comment ça marche ?
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Découvrez les trois étapes clés du fonctionnement d'Agoranodes
            </p>
          </div>

          {/* Bloc 1 - Formation */}
          <section className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-2xl shadow-lg mb-8">
            <div className="flex items-center gap-4 mb-4">
              <BookOpen className="w-8 h-8 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                01 — Formation
              </h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
              dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
          </section>

          {/* Bloc 2 - Quizz */}
          <section className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-2xl shadow-lg mb-8">
            <div className="flex items-center gap-4 mb-4">
              <BrainCircuit className="w-8 h-8 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                02 — Quizz
              </h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
              dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
          </section>

          {/* Bloc 3 - Vote */}
          <section className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-2xl shadow-lg mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Vote className="w-8 h-8 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                03 — Vote
              </h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
              dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
          </section>

          {/* CTA */}
          <section className="text-center bg-gradient-to-r from-indigo-600 to-purple-600 p-8 md:p-12 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold text-white mb-4">
              Prêt à expérimenter ?
            </h2>
            <p className="text-lg text-indigo-100 mb-6">
              Rejoignez notre programme beta et testez Agoranodes
            </p>
            <a
              href="mailto:beta@agoranodes.com"
              className="inline-block px-8 py-4 bg-white text-indigo-600 text-lg font-semibold rounded-full hover:bg-indigo-50 transition shadow-lg"
            >
              Demander un Accès Beta
            </a>
          </section>
        </div>
      </main>
    </div>
  );
}
