import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticleBySlug as getStrapiArticle, getAllArticleSlugs as getStrapiSlugs, blocksToHtml } from '@/lib/strapi';
import { getArticleBySlug as getMarkdownArticle, getAllArticleSlugs as getMarkdownSlugs } from '@/lib/markdown';

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Permet de générer les pages à la demande si elles n'existent pas au build time
export const dynamicParams = true;

// Revalider la page toutes les 60 secondes
export const revalidate = 60;

export async function generateStaticParams() {
  // Get slugs from both sources
  const strapiSlugs = await getStrapiSlugs();
  const markdownSlugs = getMarkdownSlugs();

  const allSlugs = [...new Set([...strapiSlugs, ...markdownSlugs])];

  return allSlugs.map((slug) => ({
    slug,
  }));
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;

  // Try Strapi first
  const strapiArticle = await getStrapiArticle(slug);

  let article: {
    title: string;
    author: string;
    date: string;
    contentHtml: string;
  } | null = null;

  if (strapiArticle) {
    // Convertir les blocks en HTML
    const blocksHtml = await blocksToHtml(strapiArticle.blocks);

    article = {
      title: strapiArticle.title,
      author: strapiArticle.author?.name || 'Agoranodes',
      date: strapiArticle.publishedAt || strapiArticle.createdAt,
      contentHtml: blocksHtml || strapiArticle.description || '',
    };
  } else {
    // Fallback to markdown
    const markdownArticle = await getMarkdownArticle(slug);
    if (markdownArticle) {
      article = {
        title: markdownArticle.title,
        author: markdownArticle.author,
        date: markdownArticle.date,
        contentHtml: markdownArticle.contentHtml,
      };
    }
  }

  if (!article) {
    notFound();
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
          <div className="space-x-6">
            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              Accueil
            </Link>
            <Link href="/articles" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              Articles
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <article className="max-w-4xl mx-auto">
          {/* Back Link */}
          <Link
            href="/articles"
            className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition mb-8"
          >
            ← Retour aux articles
          </Link>

          {/* Article Header */}
          <div className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-2xl shadow-lg mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {article.title}
            </h1>
            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
              <span className="font-semibold">{article.author}</span>
              <span>•</span>
              <time dateTime={article.date}>
                {new Date(article.date).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
          </div>

          {/* Article Content */}
          <div className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-2xl shadow-lg">
            <div
              className="prose prose-lg prose-indigo dark:prose-invert max-w-none
                prose-headings:text-gray-900 dark:prose-headings:text-white
                prose-p:text-gray-700 dark:prose-p:text-gray-300
                prose-a:text-indigo-600 dark:prose-a:text-indigo-400
                prose-strong:text-gray-900 dark:prose-strong:text-white
                prose-ul:text-gray-700 dark:prose-ul:text-gray-300
                prose-ol:text-gray-700 dark:prose-ol:text-gray-300
                prose-li:text-gray-700 dark:prose-li:text-gray-300"
              dangerouslySetInnerHTML={{ __html: article.contentHtml }}
            />
          </div>

          {/* Back Link Bottom */}
          <div className="mt-12">
            <Link
              href="/articles"
              className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition"
            >
              ← Retour aux articles
            </Link>
          </div>
        </article>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400">
            © 2026 Agoranodes - Propulsé par 4NK & Bitcoin
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
