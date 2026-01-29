'use client';

import Link from 'next/link';
import { ChevronRight, Folder } from 'lucide-react';

interface Article {
  slug: string;
  title: string;
  author: string;
  date: string;
  excerpt?: string;
  category?: string;
  cover?: string;
}

interface CategorySectionProps {
  categoryName: string;
  categorySlug?: string;
  articles: Article[];
  maxArticles?: number;
}

export function CategorySection({
  categoryName,
  categorySlug,
  articles,
  maxArticles = 4,
}: CategorySectionProps) {
  const displayedArticles = articles.slice(0, maxArticles);
  const hasMore = articles.length > maxArticles;

  if (articles.length === 0) return null;

  return (
    <section className="py-8">
      {/* Category Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 border-l-4 border-indigo-500 pl-4">
          <Folder className="w-5 h-5 text-indigo-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {categoryName}
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            ({articles.length} article{articles.length > 1 ? 's' : ''})
          </span>
        </div>
        {hasMore && (
          <Link
            href={`/publications?category=${categorySlug || categoryName}`}
            className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition font-medium text-sm"
          >
            Voir tout
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayedArticles.map((article) => (
          <article
            key={article.slug}
            className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden"
          >
            <Link href={`/publications/${article.slug}`}>
              {/* Cover */}
              <div className="relative h-32 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 overflow-hidden">
                {article.cover ? (
                  <img
                    src={article.cover}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl text-gray-400 dark:text-gray-500 font-bold">
                      {article.title.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 text-sm">
                  {article.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span className="truncate max-w-[60%]">{article.author}</span>
                  <time dateTime={article.date}>
                    {new Date(article.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </time>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
