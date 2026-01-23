'use client';

/**
 * Page principale du forum - Liste des categories
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCategoriesWithCounts } from '@/lib/4nk/forum/forum-storage';
import { getForumStats } from '@/lib/4nk/forum/forum-manager';
import type { ForumCategory } from '@/lib/4nk/types';

export default function ForumPage() {
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [stats, setStats] = useState({ totalTopics: 0, totalPosts: 0, totalUsers: 0 });

  useEffect(() => {
    setCategories(getCategoriesWithCounts());
    setStats(getForumStats());
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Forum Agoranodes
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Discussions decentralisees pour la communaute
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              {stats.totalTopics}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Topics</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              {stats.totalPosts}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Reponses</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              {stats.totalUsers}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Membres actifs</div>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/forum/${category.slug}`}
              className="block bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 p-6 border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="text-4xl">{category.icon}</div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                    {category.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {category.description}
                  </p>
                </div>

                {/* Stats */}
                <div className="text-right flex-shrink-0">
                  <div className="text-sm">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {category.topicCount}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 ml-1">topics</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {category.postCount}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 ml-1">posts</span>
                  </div>
                </div>

                {/* Arrow */}
                <div className="text-gray-400 dark:text-gray-500 self-center">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-800">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            Forum Decentralise
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Ce forum fonctionne de maniere decentralisee. Tous les messages sont signes
            cryptographiquement et stockes localement. La synchronisation temps reel
            est assuree par le relay Agoranodes.
          </p>
          <div className="flex gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Local-first
            </div>
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Signatures cryptographiques
            </div>
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Sans censure
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
