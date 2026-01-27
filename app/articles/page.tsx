import Link from 'next/link';
import { getArticles, StrapiArticle } from '@/lib/strapi';
import { getAllArticles } from '@/lib/markdown';
import { ThemeToggle } from '../components/theme-toggle';
import { ArticlesFilter } from '../components/articles-filter';

export default async function ArticlesPage() {
  // Fetch from Strapi first, fallback to local markdown
  let articles: Array<{
    slug: string;
    title: string;
    author: string;
    date: string;
    excerpt?: string;
    category?: string;
  }> = [];

  const strapiArticles = await getArticles();

  if (strapiArticles.length > 0) {
    // Use Strapi articles
    articles = strapiArticles.map((article: StrapiArticle) => ({
      slug: article.slug,
      title: article.title,
      author: article.author?.name || 'Agoranodes',
      date: article.publishedAt || article.createdAt,
      excerpt: article.excerpt || article.description,
      category: article.category?.name,
    }));
  } else {
    // Fallback to local markdown files
    articles = getAllArticles();
  }

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
            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              Accueil
            </Link>
            <Link href="/articles" className="text-indigo-600 dark:text-indigo-400 font-semibold">
              Articles
            </Link>
            <ThemeToggle />
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Articles
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Decouvrez les dernieres actualites et reflexions sur la democratie decentralisee
          </p>

          {/* Articles with Filters */}
          <ArticlesFilter articles={articles} />
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400">
            © 2026 Agoranodes - Propulse par 4NK & Bitcoin
          </p>
          <div className="space-x-6">
            <a href="https://github.com/agoranodes" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              GitHub
            </a>
            <a href="https://twitter.com/agoranodes" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              Twitter
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
