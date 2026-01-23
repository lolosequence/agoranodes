'use client';

/**
 * Page de recherche du forum
 */

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { searchForum } from '@/lib/4nk/forum/forum-manager';
import { truncateAddress } from '@/lib/4nk/crypto-utils';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { ForumTopic, ForumPost } from '@/lib/4nk/types';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<{ topics: ForumTopic[]; posts: ForumPost[] }>({
    topics: [],
    posts: [],
  });
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setHasSearched(true);

    // Simulate async search
    setTimeout(() => {
      const searchResults = searchForum(searchQuery);
      setResults(searchResults);
      setIsSearching(false);
    }, 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);

    // Update URL
    const params = new URLSearchParams();
    params.set('q', query);
    window.history.replaceState({}, '', `/forum/search?${params.toString()}`);
  };

  const totalResults = results.topics.length + results.posts.length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Recherche
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Recherchez dans les topics et reponses du forum
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher..."
                className="w-full px-4 py-3 pl-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition font-medium"
            >
              {isSearching ? 'Recherche...' : 'Rechercher'}
            </button>
          </div>
        </form>

        {/* Results */}
        {hasSearched && (
          <>
            {/* Results count */}
            <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
              {totalResults} resultat{totalResults !== 1 ? 's' : ''} pour "{query}"
            </div>

            {totalResults === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Aucun resultat trouve
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Essayez avec d'autres mots-cles
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Topics */}
                {results.topics.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Topics ({results.topics.length})
                    </h2>
                    <div className="space-y-3">
                      {results.topics.map((topic) => (
                        <Link
                          key={topic.id}
                          href={`/forum/topic/${topic.id}`}
                          className="block bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 hover:shadow-md transition"
                        >
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {topic.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                            {topic.contentRaw.substring(0, 200)}...
                          </p>
                          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                            <span>
                              {topic.authorLabel || truncateAddress(topic.authorAddress)}
                            </span>
                            <span>•</span>
                            <span>
                              {formatDistanceToNow(new Date(topic.createdAt), {
                                addSuffix: true,
                                locale: fr,
                              })}
                            </span>
                            <span>•</span>
                            <span>{topic.replyCount} reponses</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Posts */}
                {results.posts.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Reponses ({results.posts.length})
                    </h2>
                    <div className="space-y-3">
                      {results.posts.map((post) => (
                        <Link
                          key={post.id}
                          href={`/forum/topic/${post.topicId}#post-${post.id}`}
                          className="block bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 hover:shadow-md transition"
                        >
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                            {post.contentRaw.substring(0, 200)}...
                          </p>
                          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                            <span>
                              {post.authorLabel || truncateAddress(post.authorAddress)}
                            </span>
                            <span>•</span>
                            <span>
                              {formatDistanceToNow(new Date(post.createdAt), {
                                addSuffix: true,
                                locale: fr,
                              })}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Initial state */}
        {!hasSearched && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Recherchez dans le forum
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Entrez des mots-cles pour trouver des topics et reponses
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
