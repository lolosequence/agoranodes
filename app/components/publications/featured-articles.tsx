'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface Article {
  slug: string;
  title: string;
  author: string;
  date: string;
  excerpt?: string;
  category?: string;
  cover?: string;
}

interface FeaturedArticlesProps {
  articles: Article[];
}

export function FeaturedArticles({ articles }: FeaturedArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <section className="py-12">
      <div className="flex items-center gap-3 mb-8">
        <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          À la une
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <motion.article
            key={article.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            <Link href={`/publications/${article.slug}`}>
              {/* Cover Image */}
              <div className="relative h-48 bg-gradient-to-br from-indigo-500 to-purple-600 overflow-hidden">
                {article.cover ? (
                  <img
                    src={article.cover}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-6xl text-white/30 font-bold">
                      {article.title.charAt(0)}
                    </span>
                  </div>
                )}
                {/* Featured Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1 px-3 py-1 bg-yellow-500 text-yellow-900 text-xs font-bold rounded-full">
                  <Star className="w-3 h-3 fill-current" />
                  À la une
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {article.category && (
                  <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                    {article.category}
                  </span>
                )}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>
                )}
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>{article.author}</span>
                  <time dateTime={article.date}>
                    {new Date(article.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </time>
                </div>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
