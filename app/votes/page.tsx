'use client';

/**
 * Page de liste des votes
 * Affiche tous les votes disponibles et permet de naviguer vers les détails
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/4nk/hooks/useAuth';
import { getAllVotes, getVotesForUser, hasUserVoted } from '@/lib/4nk/votes/vote-manager';
import { calculateParticipationRate } from '@/lib/4nk/votes/validation';
import type { VoteProcess } from '@/lib/4nk/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function VotesPage() {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();
  const [votes, setVotes] = useState<VoteProcess[]>([]);
  const [filter, setFilter] = useState<'all' | 'my' | 'created'>('all');

  // Rediriger si non authentifié
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/');
    }
  }, [loading, isAuthenticated, router]);

  // Charger les votes
  useEffect(() => {
    if (user) {
      loadVotes();
    }
  }, [user, filter]);

  const loadVotes = () => {
    if (!user) return;

    let loadedVotes: VoteProcess[] = [];

    if (filter === 'all') {
      loadedVotes = getAllVotes();
    } else if (filter === 'my') {
      loadedVotes = getVotesForUser(user.mainAddress);
    } else if (filter === 'created') {
      loadedVotes = getAllVotes().filter((v) => v.creator === user.mainAddress);
    }

    // Trier par date de création (plus récent en premier)
    loadedVotes.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    setVotes(loadedVotes);
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
            href="/"
            className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            ← Retour à l'accueil
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Title and Create Button */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <span>🗳️</span>
              <span>Votes</span>
            </h1>
            <Link
              href="/votes/create"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
            >
              ➕ Créer un vote
            </Link>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex gap-4">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Tous les votes
              </button>
              <button
                onClick={() => setFilter('my')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'my'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Mes votes
              </button>
              <button
                onClick={() => setFilter('created')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'created'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Mes créations
              </button>
            </div>
          </div>

          {/* Votes List */}
          {votes.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">🗳️</div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                Aucun vote disponible
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {filter === 'created'
                  ? "Vous n'avez pas encore créé de vote"
                  : filter === 'my'
                  ? "Aucun vote ne vous est assigné pour le moment"
                  : "Il n'y a pas encore de votes dans le système"}
              </p>
              {filter !== 'created' && (
                <Link
                  href="/votes/create"
                  className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
                >
                  Créer le premier vote
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {votes.map((vote) => {
                const participation = calculateParticipationRate(vote);
                const userHasVoted = hasUserVoted(vote.id, user.mainAddress);

                return (
                  <Link
                    key={vote.id}
                    href={`/votes/${vote.id}`}
                    className="block bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition p-6"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {vote.title}
                          </h3>
                          {/* Status Badge */}
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              vote.status === 'active'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : vote.status === 'closed'
                                ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            }`}
                          >
                            {vote.status === 'active'
                              ? '🟢 Actif'
                              : vote.status === 'closed'
                              ? '⚫ Fermé'
                              : '📋 ' + vote.status}
                          </span>
                          {userHasVoted && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              ✓ Vous avez voté
                            </span>
                          )}
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                          {vote.description}
                        </p>

                        <div className="flex gap-6 text-sm">
                          <div>
                            <span className="text-gray-500 dark:text-gray-500">Options: </span>
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {vote.options.length}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-500">Votants: </span>
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {vote.voters.length}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-500">Participation: </span>
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {participation.toFixed(0)}%
                            </span>
                          </div>
                          {vote.quorum_reached && (
                            <div>
                              <span className="text-green-600 dark:text-green-400 font-semibold">
                                ✓ Quorum atteint
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm text-gray-500 dark:text-gray-500">
                          {new Date(vote.created_at).toLocaleDateString('fr-FR')}
                        </div>
                        {vote.ends_at && (
                          <div className="text-xs text-gray-400 dark:text-gray-600 mt-1">
                            Fin: {new Date(vote.ends_at).toLocaleDateString('fr-FR')}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
