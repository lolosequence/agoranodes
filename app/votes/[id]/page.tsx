'use client';

/**
 * Page de détails d'un vote
 * Affiche toutes les informations d'un vote et permet de voter
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/4nk/hooks/useAuth';
import { loadVote, submitVote, hasUserVoted, closeVote } from '@/lib/4nk/votes/vote-manager';
import { generateVoteReport, getWinningOption } from '@/lib/4nk/votes/validation';
import { truncateAddress } from '@/lib/4nk/crypto-utils';
import type { VoteProcess } from '@/lib/4nk/types';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

export default function VoteDetailPage() {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const voteId = params.id as string;

  const [vote, setVote] = useState<VoteProcess | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Rediriger si non authentifié
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/');
    }
  }, [loading, isAuthenticated, router]);

  // Charger le vote
  useEffect(() => {
    if (voteId) {
      loadVoteData();
    }
  }, [voteId]);

  const loadVoteData = () => {
    const voteData = loadVote(voteId);
    if (!voteData) {
      alert('Vote non trouvé');
      router.push('/votes');
      return;
    }
    setVote(voteData);
  };

  const handleVote = async () => {
    if (!user || !vote || !selectedOption) return;

    setIsVoting(true);
    try {
      const updatedVote = await submitVote(voteId, selectedOption, user);
      setVote(updatedVote);
      alert('Vote enregistré avec succès !');
    } catch (error: any) {
      alert(error.message || 'Erreur lors du vote');
      console.error(error);
    } finally {
      setIsVoting(false);
    }
  };

  const handleClose = async () => {
    if (!user || !vote) return;

    if (!confirm('Êtes-vous sûr de vouloir fermer ce vote ?')) {
      return;
    }

    setIsClosing(true);
    try {
      const updatedVote = await closeVote(voteId, user);
      setVote(updatedVote);
      alert('Vote fermé avec succès');
    } catch (error: any) {
      alert(error.message || 'Erreur lors de la fermeture');
      console.error(error);
    } finally {
      setIsClosing(false);
    }
  };

  if (loading || !vote) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userHasVoted = hasUserVoted(voteId, user.mainAddress);
  const isVoter = vote.voters.includes(user.mainAddress);
  const isCreator = vote.creator === user.mainAddress;
  const canVote = vote.status === 'active' && !userHasVoted && isVoter;
  const report = generateVoteReport(vote);
  const winner = getWinningOption(vote);

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
        <div className="max-w-4xl mx-auto">
          {/* Title and Status */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{vote.title}</h1>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  vote.status === 'active'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {vote.status === 'active' ? '🟢 Actif' : '⚫ Fermé'}
              </span>
            </div>
            {vote.description && (
              <p className="text-gray-600 dark:text-gray-400 text-lg">{vote.description}</p>
            )}
          </div>

          {/* Quorum Status */}
          <div
            className={`p-4 rounded-lg mb-6 ${
              vote.quorum_reached
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
            }`}
          >
            <p
              className={`font-semibold ${
                vote.quorum_reached
                  ? 'text-green-800 dark:text-green-200'
                  : 'text-yellow-800 dark:text-yellow-200'
              }`}
            >
              {report.quorum_status}
            </p>
          </div>

          {/* User Status */}
          {userHasVoted && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg mb-6">
              <p className="text-blue-800 dark:text-blue-200 font-semibold">✓ Vous avez déjà voté</p>
            </div>
          )}

          {/* Voting Interface */}
          {canVote && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-6">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
                Votez maintenant
              </h2>

              <div className="space-y-3 mb-6">
                {vote.options.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition ${
                      selectedOption === option.id
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name="vote-option"
                      value={option.id}
                      checked={selectedOption === option.id}
                      onChange={(e) => setSelectedOption(e.target.value)}
                      className="mt-1 w-5 h-5 text-indigo-600"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {option.label}
                      </div>
                      {option.description && (
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {option.description}
                        </div>
                      )}
                    </div>
                  </label>
                ))}
              </div>

              <button
                onClick={handleVote}
                disabled={!selectedOption || isVoting}
                className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-semibold"
              >
                {isVoting ? 'Envoi du vote...' : 'Confirmer mon vote'}
              </button>
            </div>
          )}

          {/* Results */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
              Résultats
            </h2>

            {vote.results ? (
              <div className="space-y-4">
                {vote.options.map((option) => {
                  const result = vote.results![option.id];
                  const isWinner = winner?.option_id === option.id;

                  return (
                    <div key={option.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          {isWinner && <span className="text-yellow-500">👑</span>}
                          {option.label}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {result.count} vote{result.count !== 1 ? 's' : ''} ({result.percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            isWinner
                              ? 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                              : 'bg-gradient-to-r from-indigo-500 to-indigo-600'
                          }`}
                          style={{ width: `${result.percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}

                {winner && vote.status === 'closed' && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                    <p className="text-yellow-900 dark:text-yellow-200 font-semibold text-center">
                      🏆 Gagnant: {winner.option_label} ({winner.percentage.toFixed(1)}%)
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">Aucun vote enregistré pour le moment</p>
            )}
          </div>

          {/* Vote Info */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Informations
            </h2>

            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400 mb-1">Créateur</p>
                <p className="font-mono text-gray-900 dark:text-white">
                  {truncateAddress(vote.creator)}
                </p>
              </div>

              <div>
                <p className="text-gray-500 dark:text-gray-400 mb-1">Participation</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {report.participation.toFixed(1)}% ({vote.total_votes}/{vote.voters.length})
                </p>
              </div>

              <div>
                <p className="text-gray-500 dark:text-gray-400 mb-1">Date de création</p>
                <p className="text-gray-900 dark:text-white">
                  {new Date(vote.created_at).toLocaleString('fr-FR')}
                </p>
              </div>

              {vote.ends_at && (
                <div>
                  <p className="text-gray-500 dark:text-gray-400 mb-1">Date de fin</p>
                  <p className="text-gray-900 dark:text-white">
                    {new Date(vote.ends_at).toLocaleString('fr-FR')}
                  </p>
                </div>
              )}

              <div>
                <p className="text-gray-500 dark:text-gray-400 mb-1">Type</p>
                <p className="text-gray-900 dark:text-white">
                  {vote.is_private ? '🔒 Privé' : '🔓 Public'}
                </p>
              </div>

              <div>
                <p className="text-gray-500 dark:text-gray-400 mb-1">Quorum requis</p>
                <p className="text-gray-900 dark:text-white">
                  {(vote.quorum_required * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          </div>

          {/* Admin Actions */}
          {isCreator && vote.status === 'active' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Actions administrateur
              </h2>
              <button
                onClick={handleClose}
                disabled={isClosing}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition font-semibold"
              >
                {isClosing ? 'Fermeture...' : 'Fermer le vote'}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
