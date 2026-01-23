'use client';

/**
 * Dashboard de moderation
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/4nk/hooks/useAuth';
import { getModerationActions, getAllTopics, getAllPosts } from '@/lib/4nk/forum/forum-storage';
import { isModerator } from '@/lib/4nk/forum/forum-moderation';
import { truncateAddress } from '@/lib/4nk/crypto-utils';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { ModerationAction, ForumTopic, ForumPost } from '@/lib/4nk/types';

export default function ModerationPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'actions' | 'reported' | 'stats'>('actions');
  const [actions, setActions] = useState<ModerationAction[]>([]);
  const [stats, setStats] = useState({
    totalTopics: 0,
    deletedTopics: 0,
    totalPosts: 0,
    deletedPosts: 0,
    lockedTopics: 0,
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/forum');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (user && isModerator(user.mainAddress)) {
      loadData();
    }
  }, [user]);

  const loadData = () => {
    // Load moderation actions
    const modActions = getModerationActions();
    setActions(modActions.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));

    // Calculate stats
    const allTopics = getAllTopics();
    const allPosts = getAllPosts();

    setStats({
      totalTopics: allTopics.length,
      deletedTopics: allTopics.filter((t) => t.isDeleted).length,
      totalPosts: allPosts.length,
      deletedPosts: allPosts.filter((p) => p.isDeleted).length,
      lockedTopics: allTopics.filter((t) => t.isLocked).length,
    });
  };

  const getActionIcon = (type: ModerationAction['type']) => {
    switch (type) {
      case 'delete_topic':
      case 'delete_post':
        return '🗑️';
      case 'lock_topic':
        return '🔒';
      case 'unlock_topic':
        return '🔓';
      case 'pin_topic':
        return '📌';
      case 'unpin_topic':
        return '📍';
      case 'ban_user':
        return '🚫';
      default:
        return '⚙️';
    }
  };

  const getActionLabel = (type: ModerationAction['type']) => {
    switch (type) {
      case 'delete_topic':
        return 'Topic supprime';
      case 'delete_post':
        return 'Post supprime';
      case 'lock_topic':
        return 'Topic verrouille';
      case 'unlock_topic':
        return 'Topic deverrouille';
      case 'pin_topic':
        return 'Topic epingle';
      case 'unpin_topic':
        return 'Topic desepingle';
      case 'ban_user':
        return 'Utilisateur banni';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user || !isModerator(user.mainAddress)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">🔐</div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Acces refuse
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Vous devez etre moderateur pour acceder a cette page.
            </p>
            <Link
              href="/forum"
              className="inline-block mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Retour au forum
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Moderation
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestion et historique des actions de moderation
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.totalTopics}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Topics</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.totalPosts}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Posts</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {stats.deletedTopics}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Supprimes</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {stats.lockedTopics}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Verrouilles</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {actions.length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Actions</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('actions')}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition ${
                  activeTab === 'actions'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Historique des actions
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition ${
                  activeTab === 'stats'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Statistiques
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'actions' && (
              <>
                {actions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-5xl mb-4">📋</div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Aucune action de moderation enregistree
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {actions.map((action) => (
                      <div
                        key={action.id}
                        className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                      >
                        {/* Icon */}
                        <div className="text-2xl">{getActionIcon(action.type)}</div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {getActionLabel(action.type)}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {action.reason}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-2">
                            <span>
                              Par: {truncateAddress(action.moderatorAddress)}
                            </span>
                            <span>•</span>
                            <span>
                              {formatDistanceToNow(new Date(action.createdAt), {
                                addSuffix: true,
                                locale: fr,
                              })}
                            </span>
                            <span>•</span>
                            <span className="font-mono text-xs">
                              ID: {action.targetId.substring(0, 15)}...
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'stats' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Activite de moderation
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Topics supprimes
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.deletedTopics}
                        <span className="text-sm font-normal text-gray-500 ml-2">
                          ({stats.totalTopics > 0
                            ? ((stats.deletedTopics / stats.totalTopics) * 100).toFixed(1)
                            : 0}%)
                        </span>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Posts supprimes
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.deletedPosts}
                        <span className="text-sm font-normal text-gray-500 ml-2">
                          ({stats.totalPosts > 0
                            ? ((stats.deletedPosts / stats.totalPosts) * 100).toFixed(1)
                            : 0}%)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                  <h4 className="font-medium text-indigo-900 dark:text-indigo-200 mb-2">
                    Moderation decentralisee
                  </h4>
                  <p className="text-sm text-indigo-700 dark:text-indigo-300">
                    Toutes les actions de moderation sont signees cryptographiquement et
                    enregistrees de maniere permanente. Chaque utilisateur peut verifier
                    l'historique complet des actions.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
