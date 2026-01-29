import Link from 'next/link';
import { getArticles, getCategories, StrapiArticle, StrapiCategory } from '@/lib/strapi';
import { getAllArticles } from '@/lib/markdown';
import { ThemeToggle } from '../components/theme-toggle';
import { FeaturedArticles } from '../components/publications/featured-articles';
import { CategorySection } from '../components/publications/category-section';
import { PublicationsFilter } from '../components/publications/publications-filter';
import { HowToPublish } from '../components/publications/how-to-publish';
import { BookOpen, Sparkles } from 'lucide-react';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://api.agoranodes.org';

interface Article {
  slug: string;
  title: string;
  author: string;
  date: string;
  excerpt?: string;
  category?: string;
  cover?: string;
  featured?: boolean;
}

export default async function PublicationsPage() {
  // Fetch articles and categories from Strapi
  const strapiArticles = await getArticles();
  const strapiCategories = await getCategories();

  let articles: Article[] = [];
  let categories: { name: string; slug: string }[] = [];

  if (strapiArticles.length > 0) {
    // Use Strapi articles
    articles = strapiArticles.map((article: StrapiArticle) => {
      let coverUrl: string | undefined;
      if (article.cover?.url) {
        coverUrl = article.cover.url.startsWith('http')
          ? article.cover.url
          : `${STRAPI_URL}${article.cover.url}`;
      }

      return {
        slug: article.slug,
        title: article.title,
        author: article.author?.name || 'Agoranodes',
        date: article.publishedAt || article.createdAt,
        excerpt: article.excerpt || article.description,
        category: article.category?.name,
        cover: coverUrl,
        featured: article.featured || false,
      };
    });

    // Use Strapi categories
    categories = strapiCategories.map((cat: StrapiCategory) => ({
      name: cat.name,
      slug: cat.slug,
    }));
  } else {
    // Fallback to local markdown files
    const markdownArticles = getAllArticles();
    articles = markdownArticles.map((a) => ({
      ...a,
      featured: false,
    }));

    // Extract categories from articles
    const uniqueCategories = [...new Set(articles.map((a) => a.category).filter(Boolean))];
    categories = uniqueCategories.map((name) => ({
      name: name!,
      slug: name!.toLowerCase().replace(/\s+/g, '-'),
    }));
  }

  // Separate featured and regular articles
  const featuredArticles = articles.filter((a) => a.featured);
  const regularArticles = articles.filter((a) => !a.featured);

  // Group articles by category
  const articlesByCategory = categories.map((cat) => ({
    category: cat,
    articles: articles.filter((a) => a.category === cat.name),
  }));

  // Articles without category
  const uncategorizedArticles = articles.filter((a) => !a.category);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center">
          <Link href="/">
            <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition cursor-pointer">
              Agoranodes
            </h1>
          </Link>
          <div className="flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              Accueil
            </Link>
            <Link
              href="/publications"
              className="text-indigo-600 dark:text-indigo-400 font-semibold"
            >
              Publications
            </Link>
            <Link
              href="/forum"
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              Forum
            </Link>
            <ThemeToggle />
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Hub des Publications
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Publications
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Découvrez les dernières réflexions, analyses et contributions de la communauté sur la démocratie décentralisée.
          </p>
        </section>

        {/* Featured Articles */}
        {featuredArticles.length > 0 && (
          <FeaturedArticles articles={featuredArticles} />
        )}

        {/* Filters Section */}
        <PublicationsFilter articles={articles} categories={categories} />

        {/* Category Sections */}
        {articlesByCategory.map(
          ({ category, articles: catArticles }) =>
            catArticles.length > 0 && (
              <CategorySection
                key={category.slug}
                categoryName={category.name}
                categorySlug={category.slug}
                articles={catArticles}
              />
            )
        )}

        {/* Uncategorized Articles */}
        {uncategorizedArticles.length > 0 && (
          <CategorySection
            categoryName="Autres articles"
            articles={uncategorizedArticles}
          />
        )}

        {/* How to Publish Section */}
        <HowToPublish />
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 dark:text-gray-400">
            © 2026 Agoranodes - Propulsé par 4NK & Bitcoin
          </p>
          <div className="flex items-center space-x-6">
            <a
              href="https://github.com/agoranodes"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              GitHub
            </a>
            <a
              href="https://twitter.com/agoranodes"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              Twitter
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
