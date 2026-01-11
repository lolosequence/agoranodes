import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center">
          <Link href="/">
            <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition cursor-pointer">
              Agoranodes
            </h1>
          </Link>
          <div className="space-x-6">
            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              Accueil
            </Link>
            <Link href="/articles" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              Articles
            </Link>
            <Link href="/about" className="text-indigo-600 dark:text-indigo-400 font-semibold">
              À propos
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              À propos d'Agoranodes
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Réinventer la démocratie avec Bitcoin et le tirage au sort
            </p>
          </div>

          {/* Mission */}
          <section className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-2xl shadow-lg mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Notre Mission
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              Agoranodes est un système de <strong>gouvernance décentralisée</strong> qui combine
              la sagesse antique du tirage au sort avec la sécurité moderne de la blockchain Bitcoin.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Notre objectif est de créer un framework réutilisable pour la démocratie participative,
              accessible aux associations, coopératives, collectivités et organisations décentralisées.
            </p>
          </section>

          {/* Principles */}
          <section className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-2xl shadow-lg mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Nos Principes
            </h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="text-3xl">🔐</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Identité Décentralisée
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Authentification via Silent Payments Bitcoin (4NK). Chaque utilisateur possède
                    un pseudonyme permanent et sécurisé, sans avoir à fournir de données personnelles.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="text-3xl">🎲</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Tirage au Sort Vérifiable
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Rotation démocratique des responsabilités basée sur la randomness Bitcoin.
                    Un système impossible à manipuler et vérifiable par tous les participants.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="text-3xl">🗳️</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Votes Transparents
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Traçabilité blockchain avec anonymat préservé. Chaque vote est enregistré
                    de manière immuable tout en protégeant la vie privée des votants.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="text-3xl">📱</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Accessibilité Multi-Device
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Gérez votre identité et participez depuis n'importe quel appareil grâce
                    au système de pairing sécurisé du protocole 4NK.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Vision */}
          <section className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-2xl shadow-lg mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Notre Vision
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              Agoranodes vise à devenir un <strong>framework réutilisable</strong> pour
              différents types d'organisations:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="border-l-4 border-indigo-600 dark:border-indigo-400 pl-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🏛️</span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Mairies & Collectivités
                  </h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  Démocratie participative locale avec participation citoyenne directe
                </p>
              </div>

              <div className="border-l-4 border-indigo-600 dark:border-indigo-400 pl-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🤝</span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Associations
                  </h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  Gouvernance transparente et inclusive pour organisations à but non lucratif
                </p>
              </div>

              <div className="border-l-4 border-indigo-600 dark:border-indigo-400 pl-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🏢</span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Coopératives
                  </h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  Décisions collectives sécurisées pour organisations coopératives
                </p>
              </div>

              <div className="border-l-4 border-indigo-600 dark:border-indigo-400 pl-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">⚡</span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    DAOs
                  </h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  Organisations autonomes décentralisées avec gouvernance on-chain
                </p>
              </div>
            </div>
          </section>

          {/* Technology */}
          <section className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-2xl shadow-lg mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Technologie
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              Agoranodes s'appuie sur des technologies éprouvées et décentralisées:
            </p>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">→</span>
                <span><strong>Bitcoin:</strong> Pour l'ancrage cryptographique, la randomness et l'immuabilité</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">→</span>
                <span><strong>4NK Protocol:</strong> Pour l'identité décentralisée via Silent Payments (BIP352)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">→</span>
                <span><strong>Schnorr Signatures:</strong> Pour la validation cryptographique des votes</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">→</span>
                <span><strong>AES-256-GCM:</strong> Pour le chiffrement des données sensibles</span>
              </li>
            </ul>
          </section>

          {/* CTA */}
          <section className="text-center bg-gradient-to-r from-indigo-600 to-purple-600 p-8 md:p-12 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold text-white mb-4">
              Rejoignez la Révolution Démocratique
            </h2>
            <p className="text-lg text-indigo-100 mb-6">
              Nous recherchons 10 beta-testeurs pour valider le concept
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

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400">
            © 2026 Agoranodes - Propulsé par 4NK & Bitcoin
          </p>
          <div className="space-x-6">
            <a href="https://github.com/agoranodes" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              GitHub
            </a>
            <a href="https://twitter.com/agoranodes" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              Twitter
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
