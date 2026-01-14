'use client';

/**
 * Page de profil utilisateur 4NK
 * Affiche les informations de l'identité et permet d'accéder à la gestion des devices
 */

import { useAuth } from '@/lib/4nk/hooks/useAuth';
import { truncateAddress } from '@/lib/4nk/crypto-utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  // Rediriger vers l'accueil si non authentifié
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center">
          <Link
            href="/"
            className="text-3xl font-bold text-indigo-600 dark:text-indigo-400"
          >
            Agoranodes
          </Link>
          <Link
            href="/"
            className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            ← Retour à l'accueil
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Mon Profil 4NK
          </h1>

          {/* User Info Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
              <span>🔐</span>
              <span>Identité</span>
            </h2>

            <div className="space-y-4">
              {/* Label */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Nom d'affichage
                </label>
                <p className="text-lg text-gray-900 dark:text-white font-semibold">
                  {user.label}
                </p>
              </div>

              {/* Main Address */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Adresse principale (Silent Payment)
                </label>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-mono text-gray-900 dark:text-white break-all bg-gray-50 dark:bg-gray-700 p-3 rounded-lg flex-1">
                    {user.mainAddress}
                  </p>
                  <button
                    onClick={() => navigator.clipboard.writeText(user.mainAddress)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm whitespace-nowrap"
                    title="Copier l'adresse"
                  >
                    📋 Copier
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Adresse tronquée : {truncateAddress(user.mainAddress)}
                </p>
              </div>

              {/* Recovery Address */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Adresse de récupération
                </label>
                <p className="text-sm font-mono text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg break-all">
                  {user.recoverAddress}
                </p>
              </div>

              {/* Recovery Phrase */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  ⚠️ Phrase de récupération (à conserver en sécurité)
                </label>
                <p className="text-sm font-mono text-gray-900 dark:text-white bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border-2 border-yellow-300 dark:border-yellow-700">
                  {user.recoveryPhrase}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  Cette phrase permet de restaurer votre identité. Ne la partagez jamais !
                </p>
              </div>

              {/* Created At */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Date de création
                </label>
                <p className="text-gray-900 dark:text-white">
                  {new Date(user.createdAt).toLocaleString('fr-FR', {
                    dateStyle: 'full',
                    timeStyle: 'short',
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Multi-Device Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <span>📱</span>
              <span>Appareils Pairés</span>
            </h2>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Gérez les appareils connectés à votre identité 4NK. Vous pouvez pairer plusieurs
              appareils (smartphone, tablette, ordinateur) pour accéder à votre compte partout.
            </p>

            <Link
              href="/profile/devices"
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
            >
              Gérer mes appareils →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
