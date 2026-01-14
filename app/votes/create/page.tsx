'use client';

/**
 * Page de création de vote
 * Permet de configurer et créer un nouveau vote
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/4nk/hooks/useAuth';
import { createVote } from '@/lib/4nk/votes/vote-manager';
import { getPairedDevices } from '@/lib/4nk/pairing/pairing-manager';
import type { CreateVoteParams } from '@/lib/4nk/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreateVotePage() {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState<Array<{ label: string; description?: string }>>([
    { label: 'Pour', description: '' },
    { label: 'Contre', description: '' },
  ]);
  const [voters, setVoters] = useState<string[]>([]);
  const [allAvailableVoters, setAllAvailableVoters] = useState<string[]>([]);
  const [quorum, setQuorum] = useState(50);
  const [allowAbstention, setAllowAbstention] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [endsAt, setEndsAt] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Rediriger si non authentifié
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/');
    }
  }, [loading, isAuthenticated, router]);

  // Charger les votants disponibles (devices pairés)
  useEffect(() => {
    if (user) {
      loadAvailableVoters();
    }
  }, [user]);

  const loadAvailableVoters = async () => {
    if (!user) return;

    try {
      const devices = await getPairedDevices(user);
      setAllAvailableVoters(devices);
      // Sélectionner tous les devices par défaut
      setVoters(devices);
    } catch (error) {
      console.error('Failed to load voters:', error);
    }
  };

  const addOption = () => {
    setOptions([...options, { label: '', description: '' }]);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, field: 'label' | 'description', value: string) => {
    const newOptions = [...options];
    newOptions[index][field] = value;
    setOptions(newOptions);
  };

  const toggleVoter = (address: string) => {
    if (voters.includes(address)) {
      setVoters(voters.filter((v) => v !== address));
    } else {
      setVoters([...voters, address]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!title || title.length < 3) {
      alert('Le titre doit contenir au moins 3 caractères');
      return;
    }

    if (options.length < 2) {
      alert('Au moins 2 options sont requises');
      return;
    }

    if (options.some((opt) => !opt.label)) {
      alert('Toutes les options doivent avoir un libellé');
      return;
    }

    if (voters.length === 0) {
      alert('Au moins un votant doit être sélectionné');
      return;
    }

    setIsCreating(true);

    try {
      const params: CreateVoteParams = {
        title,
        description,
        options: options.map((opt) => ({
          label: opt.label,
          description: opt.description || undefined,
        })),
        voters,
        quorum_required: quorum / 100,
        allow_abstention: allowAbstention,
        is_private: isPrivate,
        ends_at: endsAt || undefined,
      };

      const vote = await createVote(params, user!);
      router.push(`/votes/${vote.id}`);
    } catch (error) {
      alert('Erreur lors de la création du vote');
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
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
          <Link href="/" className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            Agoranodes
          </Link>
          <Link
            href="/votes"
            className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            ← Retour aux votes
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Créer un nouveau vote
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations Générales */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                Informations générales
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Titre du vote *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Vote sur la réforme X"
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Décrivez l'objet du vote..."
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Options de vote */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Options de vote
                </h2>
                <button
                  type="button"
                  onClick={addOption}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
                >
                  ➕ Ajouter une option
                </button>
              </div>

              <div className="space-y-3">
                {options.map((option, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={option.label}
                        onChange={(e) => updateOption(index, 'label', e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white mb-2"
                      />
                      <input
                        type="text"
                        value={option.description}
                        onChange={(e) => updateOption(index, 'description', e.target.value)}
                        placeholder="Description (optionnel)"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white text-sm"
                      />
                    </div>
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Votants */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                Votants autorisés ({voters.length})
              </h2>

              <div className="space-y-2">
                {allAvailableVoters.map((address) => (
                  <label
                    key={address}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                  >
                    <input
                      type="checkbox"
                      checked={voters.includes(address)}
                      onChange={() => toggleVoter(address)}
                      className="w-5 h-5 text-indigo-600 rounded"
                    />
                    <span className="text-gray-900 dark:text-white font-mono text-sm">
                      {address === user.mainAddress ? '💻 Cet appareil' : '📱 Appareil pairé'}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-xs truncate">
                      {address}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Paramètres */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                Paramètres
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quorum requis: {quorum}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={quorum}
                    onChange={(e) => setQuorum(Number(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {((voters.length * quorum) / 100).toFixed(0)} vote(s) minimum requis
                  </p>
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allowAbstention}
                      onChange={(e) => setAllowAbstention(e.target.checked)}
                      className="w-5 h-5 text-indigo-600 rounded"
                    />
                    <span className="text-gray-900 dark:text-white">
                      Autoriser l'abstention
                    </span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPrivate}
                      onChange={(e) => setIsPrivate(e.target.checked)}
                      className="w-5 h-5 text-indigo-600 rounded"
                    />
                    <span className="text-gray-900 dark:text-white">
                      Vote privé (résultats chiffrés)
                    </span>
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-7">
                    Les votes individuels ne seront pas visibles publiquement
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date de fin (optionnel)
                  </label>
                  <input
                    type="datetime-local"
                    value={endsAt}
                    onChange={(e) => setEndsAt(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <Link
                href="/votes"
                className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-center font-semibold"
              >
                Annuler
              </Link>
              <button
                type="submit"
                disabled={isCreating}
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition font-semibold"
              >
                {isCreating ? 'Création...' : 'Créer le vote'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
