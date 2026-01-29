import { Navbar } from '../components/navbar';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-28 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Comment ça marche ?
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Découvrez le fonctionnement technique d'Agoranodes
            </p>
          </div>

          {/* Overview */}
          <section className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-2xl shadow-lg mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Vue d'ensemble
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Agoranodes combine trois piliers technologiques pour créer un système
              de gouvernance décentralisée transparent et sécurisé :
              <strong className="text-indigo-600 dark:text-indigo-400"> l'identité décentralisée, le tirage au sort vérifiable et le vote transparent</strong>.
            </p>
          </section>

          {/* Step 1: Identity */}
          <section className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-2xl shadow-lg mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-indigo-600 dark:bg-indigo-500 text-white text-2xl font-bold w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                1
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Identité Décentralisée
                </h2>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                  🔐 Création de votre identité
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Lors de votre première connexion, Agoranodes génère automatiquement une
                  <strong> paire de clés cryptographiques</strong> via le protocole 4NK et les
                  Silent Payments Bitcoin (BIP352). Votre identité est représentée par un
                  <strong> pseudonyme permanent</strong> dérivé de votre clé publique.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                  📱 Multi-device
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Grâce au système de <strong>pairing sécurisé</strong> du protocole 4NK,
                  vous pouvez utiliser votre identité sur plusieurs appareils. Chaque appareil
                  est authentifié cryptographiquement sans compromettre votre clé privée principale.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                  🛡️ Vie privée préservée
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  <strong>Aucune donnée personnelle</strong> n'est requise ou stockée.
                  Votre identité est purement cryptographique et vous permet de participer
                  de manière pseudonyme tout en garantissant l'unicité et la non-répudiation.
                </p>
              </div>
            </div>
          </section>

          {/* Step 2: Random Selection */}
          <section className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-2xl shadow-lg mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-indigo-600 dark:bg-indigo-500 text-white text-2xl font-bold w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                2
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Tirage au Sort Vérifiable
                </h2>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                  🎲 Randomness Bitcoin
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Le tirage au sort utilise la <strong>randomness des blocs Bitcoin</strong>
                  comme source d'entropie cryptographique. À chaque période de rotation, un nouveau
                  bloc Bitcoin est utilisé pour générer un nombre aléatoire vérifiable par tous.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                  ✅ Vérifiabilité publique
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Chaque participant peut <strong>vérifier indépendamment</strong> que le tirage
                  au sort a été effectué correctement en vérifiant le hash du bloc Bitcoin utilisé.
                  Le processus est totalement transparent et impossible à manipuler.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                  🔄 Rotation démocratique
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Les responsabilités (proposition de votes, modération, etc.) sont
                  <strong> distribuées équitablement</strong> entre tous les membres actifs
                  via le tirage au sort, reproduisant le système démocratique de l'Athènes antique.
                </p>
              </div>
            </div>
          </section>

          {/* Step 3: Voting */}
          <section className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-2xl shadow-lg mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-indigo-600 dark:bg-indigo-500 text-white text-2xl font-bold w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                3
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Vote Transparent et Sécurisé
                </h2>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                  📝 Proposition
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Les membres tirés au sort peuvent <strong>créer des propositions</strong> de vote.
                  Chaque proposition est signée cryptographiquement avec leur identité 4NK pour
                  garantir son authenticité.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                  🗳️ Vote anonyme
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Chaque vote est signé avec <strong>Schnorr signatures</strong> et chiffré
                  avec AES-256-GCM. Le vote est enregistré sur la blockchain de manière
                  <strong> immuable</strong> tout en préservant l'anonymat du votant.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                  🔍 Traçabilité blockchain
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Tous les votes sont <strong>ancrés sur Bitcoin</strong> via un système de snapshot.
                  N'importe qui peut vérifier l'intégrité du processus de vote et auditer les résultats
                  sans compromettre la confidentialité des votants.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                  ✨ Résultats en temps réel
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Les résultats sont calculés automatiquement et affichés de manière transparente.
                  Une fois la période de vote terminée, les résultats sont
                  <strong> définitivement ancrés sur Bitcoin</strong>.
                </p>
              </div>
            </div>
          </section>

          {/* Technical Stack */}
          <section className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-2xl shadow-lg mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Stack Technique
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border-l-4 border-indigo-600 dark:border-indigo-400 pl-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Blockchain
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• Bitcoin (ancrage & randomness)</li>
                  <li>• Silent Payments (BIP352)</li>
                  <li>• Schnorr Signatures</li>
                </ul>
              </div>

              <div className="border-l-4 border-indigo-600 dark:border-indigo-400 pl-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Cryptographie
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• Protocole 4NK</li>
                  <li>• AES-256-GCM</li>
                  <li>• ECDSA & EdDSA</li>
                </ul>
              </div>

              <div className="border-l-4 border-indigo-600 dark:border-indigo-400 pl-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Frontend
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• Next.js & React</li>
                  <li>• TypeScript</li>
                  <li>• Tailwind CSS</li>
                </ul>
              </div>

              <div className="border-l-4 border-indigo-600 dark:border-indigo-400 pl-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Sécurité
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• Zero-knowledge proofs</li>
                  <li>• End-to-end encryption</li>
                  <li>• Multi-device pairing</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Process Flow */}
          <section className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-2xl shadow-lg mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Flux de Processus
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-full font-bold">
                  Étape 1
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  Inscription avec génération automatique de clés 4NK
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-full font-bold">
                  Étape 2
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  Participation au tirage au sort pour obtenir des responsabilités
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-full font-bold">
                  Étape 3
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  Création de propositions (si tiré au sort) ou consultation
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-full font-bold">
                  Étape 4
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  Vote anonyme et sécurisé sur les propositions actives
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-full font-bold">
                  Étape 5
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  Ancrage des résultats sur Bitcoin et publication transparente
                </p>
              </div>
            </div>
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
