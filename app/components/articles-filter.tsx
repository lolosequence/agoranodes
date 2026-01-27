'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronDown, X } from 'lucide-react';

interface Article {
  slug: string;
  title: string;
  author: string;
  date: string;
  excerpt?: string;
  category?: string;
}

interface ArticlesFilterProps {
  articles: Article[];
}

export function ArticlesFilter({ articles }: ArticlesFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showAuthorDropdown, setShowAuthorDropdown] = useState(false);

  // Extract unique categories and authors
  const categories = useMemo(() => {
    const cats = articles
      .map((a) => a.category)
      .filter((c): c is string => !!c);
    return [...new Set(cats)].sort();
  }, [articles]);

  const authors = useMemo(() => {
    const auths = articles.map((a) => a.author).filter(Boolean);
    return [...new Set(auths)].sort();
  }, [articles]);

  // Filter articles
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      if (selectedCategory && article.category !== selectedCategory) {
        return false;
      }
      if (selectedAuthor && article.author !== selectedAuthor) {
        return false;
      }
      return true;
    });
  }, [articles, selectedCategory, selectedAuthor]);

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedAuthor('');
  };

  const hasActiveFilters = selectedCategory || selectedAuthor;

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="relative">
            <button
              onClick={() => {
                setShowCategoryDropdown(!showCategoryDropdown);
                setShowAuthorDropdown(false);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-400 transition"
            >
              <span className="text-gray-700 dark:text-gray-300">
                {selectedCategory || 'Toutes les categories'}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
            {showCategoryDropdown && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setShowCategoryDropdown(false);
                  }}
                  className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  Toutes les categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setShowCategoryDropdown(false);
                    }}
                    className={`w-full px-4 py-2 text-left transition ${
                      selectedCategory === category
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Author Filter */}
        {authors.length > 0 && (
          <div className="relative">
            <button
              onClick={() => {
                setShowAuthorDropdown(!showAuthorDropdown);
                setShowCategoryDropdown(false);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-400 transition"
            >
              <span className="text-gray-700 dark:text-gray-300">
                {selectedAuthor || 'Tous les auteurs'}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
            {showAuthorDropdown && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    setSelectedAuthor('');
                    setShowAuthorDropdown(false);
                  }}
                  className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  Tous les auteurs
                </button>
                {authors.map((author) => (
                  <button
                    key={author}
                    onClick={() => {
                      setSelectedAuthor(author);
                      setShowAuthorDropdown(false);
                    }}
                    className={`w-full px-4 py-2 text-left transition ${
                      selectedAuthor === author
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {author}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition"
          >
            <X className="w-4 h-4" />
            Effacer les filtres
          </button>
        )}

        {/* Results count */}
        <span className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
          {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Articles List */}
      <div className="space-y-8">
        {filteredArticles.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg text-center">
            <p className="text-gray-600 dark:text-gray-300">
              {hasActiveFilters
                ? 'Aucun article ne correspond aux filtres selectionnes.'
                : 'Aucun article disponible pour le moment.'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Effacer les filtres
              </button>
            )}
          </div>
        ) : (
          filteredArticles.map((article) => (
            <article
              key={article.slug}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition"
            >
              <Link href={`/articles/${article.slug}`}>
                <div className="cursor-pointer">
                  {article.category && (
                    <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                      {article.category}
                    </span>
                  )}
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                    {article.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span>{article.author}</span>
                    <span>•</span>
                    <time dateTime={article.date}>
                      {new Date(article.date).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  </div>
                  {article.excerpt && (
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {article.excerpt}
                    </p>
                  )}
                  <div className="mt-4">
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-700 dark:hover:text-indigo-300 transition">
                      Lire la suite →
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
