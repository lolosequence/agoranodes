'use client';

/**
 * Composant AuthButton pour l'authentification 4NK
 * Affiche un bouton de connexion ou les infos utilisateur selon l'état
 */

import { useState } from 'react';
import { useAuth } from '@/lib/4nk/hooks/useAuth';
import { truncateAddress } from '@/lib/4nk/crypto-utils';
import Link from 'next/link';

export function AuthButton() {
  const { isAuthenticated, user, loading, createNewIdentity, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [password, setPassword] = useState('');
  const [label, setLabel] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  /**
   * Gère la création d'une nouvelle identité
   */
  const handleCreateIdentity = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || password.length < 8) {
      alert('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setIsCreating(true);
    try {
      await createNewIdentity(password, label || 'Utilisateur Agoranodes');
      setShowModal(false);
      setPassword('');
      setLabel('');
    } catch (error) {
      alert('Erreur lors de la création de l\'identité');
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  /**
   * Gère la déconnexion
   */
  const handleLogout = async () => {
    try {
      await logout();
      setShowUserMenu(false);
    } catch (error) {
      alert('Erreur lors de la déconnexion');
      console.error(error);
    }
  };

  // Bouton de chargement
  if (loading) {
    return (
      <button
        disabled
        className="px-6 py-2 bg-[#000000]/70 text-white rounded-full cursor-not-allowed opacity-70"
      >
        Chargement...
      </button>
    );
  }

  // Utilisateur connecté
  if (isAuthenticated && user) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="px-6 py-2 bg-[#000000]/70 text-white rounded-full hover:bg-white hover:text-black transition-colors cursor-pointer flex items-center gap-2"
        >
          <span>🔐</span>
          <span>{truncateAddress(user.mainAddress, 6, 4)}</span>
        </button>

        {/* Menu déroulant utilisateur */}
        {showUserMenu && (
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {user.label}
              </p>
              <p className="text-xs font-mono text-gray-500 dark:text-gray-500 break-all">
                {user.mainAddress}
              </p>
            </div>
            <div className="p-2">
              <Link
                href="/profile"
                className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition"
                onClick={() => setShowUserMenu(false)}
              >
                Mon Profil
              </Link>
              <Link
                href="/profile/devices"
                className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition"
                onClick={() => setShowUserMenu(false)}
              >
                📱 Mes Appareils
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition mt-2 border-t border-gray-200 dark:border-gray-700"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Utilisateur non connecté
  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-6 py-2 bg-[#000000]/70 text-white rounded-full hover:bg-white hover:text-black transition-colors cursor-pointer"
      >
        Login
      </button>

      {/* Modal de création d'identité */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Créer une Identité 4NK
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Votre identité sera créée localement avec une adresse Silent Payment Bitcoin.
              Aucune donnée personnelle n'est requise.
            </p>

            <form onSubmit={handleCreateIdentity} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nom d'affichage (optionnel)
                </label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="Ex: Alice"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 caractères"
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Ce mot de passe protège vos clés privées stockées localement
                </p>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition"
                >
                  {isCreating ? 'Création...' : 'Créer'}
                </button>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                🔐 Vos clés privées restent sur votre appareil
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
