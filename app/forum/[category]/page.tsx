'use client';

/**
 * Page des topics d'une categorie
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAuth } from '@/lib/4nk/hooks/useAuth';
import { getCategoryBySlug, getTopicsByCategory } from '@/lib/4nk/forum/forum-storage';
import { truncateAddress } from '@/lib/4nk/crypto-utils';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { ForumCategory, ForumTopic } from '@/lib/4nk/types';

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.category as string;
  const { isAuthenticated } = useAuth();

  const [category, setCategory] = useState<ForumCategory | null>(null);
  const [topics, setTopics] = useState<ForumTopic[]>([]);

  useEffect(() => {
    const cat = getCategoryBySlug(categorySlug);
    setCategory(cat);

    if (cat) {
      setTopics(getTopicsByCategory(cat.id));
    }
  }, [categorySlug]);

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Categorie non trouvee
          </h1>
          <Link href="/forum" className="text-indigo-600 hover:underline mt-4 inline-block">
            Retour au forum
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link href="/forum" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            Forum
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600 dark:text-gray-400">{category.name}</span>
        </nav>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{category.icon}</span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {category.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{category.description}</p>
            </div>
          </div>

          {isAuthenticated && (
            <Link
              href={`/forum/create?category=${category.id}`}
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              Nouveau Topic
            </Link>
          )}
        </div>

        {/* Topics List */}
        {topics.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">💬</div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Aucun topic dans cette categorie
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Soyez le premier a lancer une discussion!
            </p>
            {isAuthenticated && (
              <Link
                href={`/forum/create?category=${category.id}`}
                className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
              >
                Creer un topic
              </Link>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 dark:bg-gray-700/50 text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
              <div className="col-span-7">Topic</div>
              <div className="col-span-2 text-center">Reponses</div>
              <div className="col-span-3 text-right">Derniere activite</div>
            </div>

            {/* Topics */}
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {topics.map((topic) => (
                <Link
                  key={topic.id}
                  href={`/forum/topic/${topic.id}`}
                  className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition"
                >
                  {/* Topic Info */}
                  <div className="col-span-7">
                    <div className="flex items-start gap-3">
                      {/* Status Icons */}
                      <div className="flex flex-col gap-1 pt-1">
                        {topic.isPinned && (
                          <span title="Epingle" className="text-amber-500">
                            📌
                          </span>
                        )}
                        {topic.isLocked && (
                          <span title="Verrouille" className="text-gray-400">
                            🔒
                          </span>
                        )}
                        {topic.isSolved && (
                          <span title="Resolu" className="text-green-500">
                            ✓
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {topic.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                          <span>{topic.authorLabel || truncateAddress(topic.authorAddress)}</span>
                          <span>•</span>
                          <span>
                            {formatDistanceToNow(new Date(topic.createdAt), {
                              addSuffix: true,
                              locale: fr,
                            })}
                          </span>
                        </div>

                        {/* Tags */}
                        {topic.tags.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {topic.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Reply Count */}
                  <div className="col-span-2 flex items-center justify-center">
                    <div className="text-center">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {topic.replyCount}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        reponses
                      </div>
                    </div>
                  </div>

                  {/* Last Activity */}
                  <div className="col-span-3 flex items-center justify-end text-sm text-gray-500 dark:text-gray-400">
                    {topic.lastReplyAt ? (
                      <span>
                        {formatDistanceToNow(new Date(topic.lastReplyAt), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </span>
                    ) : (
                      <span>-</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
