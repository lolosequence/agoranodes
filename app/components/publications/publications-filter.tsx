'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronDown, X, Search, Filter } from 'lucide-react';

interface Article {
  slug: string;
  title: string;
  author: string;
  date: string;
  excerpt?: string;
  category?: string;
  cover?: string;
}

interface Category {
  name: string;
  slug: string;
}

interface PublicationsFilterProps {
  articles: Article[];
  categories: Category[];
  initialCategory?: string;
}

export function PublicationsFilter({
  articles,
  categories,
  initialCategory,
}: PublicationsFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || '');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showAuthorDropdown, setShowAuthorDropdown] = useState(false);

  // Extract unique authors
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
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = article.title.toLowerCase().includes(query);
        const matchesExcerpt = article.excerpt?.toLowerCase().includes(query);
        const matchesAuthor = article.author.toLowerCase().includes(query);
        if (!matchesTitle && !matchesExcerpt && !matchesAuthor) {
          return false;
        }
      }
      return true;
    });
  }, [articles, selectedCategory, selectedAuthor, searchQuery]);

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedAuthor('');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedCategory || selectedAuthor || searchQuery;

  // Close dropdowns when clicking outside
  const closeDropdowns = () => {
    setShowCategoryDropdown(false);
    setShowAuthorDropdown(false);
  };

  return (
    <section className="py-8">
      {/* Filters Header */}
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Filtrer les publications
        </h2>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un article..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="relative">
            <button
              onClick={() => {
                setShowCategoryDropdown(!showCategoryDropdown);
                setShowAuthorDropdown(false);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-400 transition"
            >
              <span className="text-gray-700 dark:text-gray-300 text-sm">
                {selectedCategory || 'Toutes les catégories'}
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
                  className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm"
                >
                  Toutes les catégories
                </button>
                {categories.map((category) => (
                  <button
                    key={category.slug}
                    onClick={() => {
                      setSelectedCategory(category.name);
                      setShowCategoryDropdown(false);
                    }}
                    className={`w-full px-4 py-2 text-left transition text-sm ${
                      selectedCategory === category.name
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {category.name}
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
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-400 transition"
            >
              <span className="text-gray-700 dark:text-gray-300 text-sm">
                {selectedAuthor || 'Tous les auteurs'}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
            {showAuthorDropdown && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                <button
                  onClick={() => {
                    setSelectedAuthor('');
                    setShowAuthorDropdown(false);
                  }}
                  className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm"
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
                    className={`w-full px-4 py-2 text-left transition text-sm ${
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
            Effacer
          </button>
        )}

        {/* Results count */}
        <span className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
          {filteredArticles.length} résultat{filteredArticles.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Active Filters Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-6">
          {selectedCategory && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm">
              {selectedCategory}
              <button
                onClick={() => setSelectedCategory('')}
                className="hover:text-indigo-900 dark:hover:text-indigo-100"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedAuthor && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm">
              {selectedAuthor}
              <button
                onClick={() => setSelectedAuthor('')}
                className="hover:text-purple-900 dark:hover:text-purple-100"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
              &quot;{searchQuery}&quot;
              <button
                onClick={() => setSearchQuery('')}
                className="hover:text-gray-900 dark:hover:text-gray-100"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Filtered Articles List */}
      {filteredArticles.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md text-center">
          <p className="text-gray-600 dark:text-gray-300">
            {hasActiveFilters
              ? 'Aucun article ne correspond à vos critères de recherche.'
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <article
              key={article.slug}
              className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden"
            >
              <Link href={`/publications/${article.slug}`}>
                {/* Cover */}
                <div className="relative h-40 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 overflow-hidden">
                  {article.cover ? (
                    <img
                      src={article.cover}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-5xl text-gray-400 dark:text-gray-500 font-bold">
                        {article.title.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  {article.category && (
                    <span className="inline-block px-2 py-0.5 mb-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30 rounded">
                      {article.category}
                    </span>
                  )}
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                      {article.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span className="truncate max-w-[60%]">{article.author}</span>
                    <time dateTime={article.date}>
                      {new Date(article.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </time>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
