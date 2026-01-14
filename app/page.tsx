export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            Agoranodes
          </h1>
          <div className="space-x-6">
            <a href="/articles" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              Articles
            </a>
            <a href="/about" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              À propos
            </a>
            <a href="/how-it-works" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              Comment ça marche
            </a>
            <a href="#contact" className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition">
              Rejoindre la Beta
            </a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4">
        <section className="text-center py-20">
          <h2 className="text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Démocratie Directe
            <span className="block text-indigo-600 dark:text-indigo-400">Décentralisée</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Agoranodes combine la sagesse du tirage au sort antique avec la sécurité de la blockchain Bitcoin
            pour créer un nouveau système de gouvernance participative.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="#features"
              className="px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-full hover:bg-indigo-700 transition shadow-lg"
            >
              Découvrir
            </a>
            <a
              href="https://github.com/lolosequence/agoranodes"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white text-indigo-600 text-lg font-semibold rounded-full hover:bg-gray-50 transition shadow-lg"
            >
              GitHub
            </a>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <h3 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
            Fonctionnalités Innovantes
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="text-4xl mb-4">🔐</div>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Identité Décentralisée
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Authentification via Silent Payments Bitcoin. Pseudonyme permanent,
                aucune donnée personnelle requise.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="text-4xl mb-4">🎲</div>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Tirage au Sort Vérifiable
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Rotation démocratique basée sur la randomness Bitcoin.
                Impossible à manipuler, vérifiable par tous.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="text-4xl mb-4">🗳️</div>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Votes Transparents
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Traçabilité blockchain avec anonymat préservé.
                Chaque vote est vérifiable et immuable.
              </p>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section id="vision" className="py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-xl my-20 px-8">
          <h3 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Notre Vision
          </h3>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
              Agoranodes vise à devenir un <strong>framework réutilisable</strong> pour
              la gouvernance décentralisée.
            </p>
            <div className="grid md:grid-cols-2 gap-6 text-left mt-12">
              <div className="flex items-start gap-4">
                <span className="text-2xl">🏛️</span>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">Mairies & Collectivités</h4>
                  <p className="text-gray-600 dark:text-gray-300">Démocratie participative locale</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-2xl">🤝</span>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">Associations</h4>
                  <p className="text-gray-600 dark:text-gray-300">Gouvernance transparente et inclusive</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-2xl">🏢</span>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">Coopératives</h4>
                  <p className="text-gray-600 dark:text-gray-300">Décisions collectives sécurisées</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-2xl">⚡</span>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">DAOs</h4>
                  <p className="text-gray-600 dark:text-gray-300">Organisations décentralisées</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="py-20 text-center">
          <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Rejoignez la Révolution Démocratique
          </h3>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Nous recherchons 10 beta-testeurs pour valider le concept.
            Soyez parmi les premiers à expérimenter la démocratie directe 2.0.
          </p>
          <a
            href="mailto:beta@agoranodes.com"
            className="inline-block px-10 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-full hover:bg-indigo-700 transition shadow-lg"
          >
            Demander un Accès Beta
          </a>
        </section>
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
            <a href="/how-it-works" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              Documentation
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
