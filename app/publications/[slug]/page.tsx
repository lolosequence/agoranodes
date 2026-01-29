import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticleBySlug as getStrapiArticle, getAllArticleSlugs as getStrapiSlugs, blocksToHtml } from '@/lib/strapi';
import { getArticleBySlug as getMarkdownArticle, getAllArticleSlugs as getMarkdownSlugs } from '@/lib/markdown';
import { Navbar } from '../../components/navbar';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Force le rendu dynamique (pas de cache statique)
export const dynamic = 'force-dynamic';

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
    category?: string;
    excerpt?: string;
  } | null = null;

  if (strapiArticle) {
    // Convertir les blocks en HTML
    const blocksHtml = await blocksToHtml(strapiArticle.blocks);

    article = {
      title: strapiArticle.title,
      author: strapiArticle.author?.name || 'Agoranodes',
      date: strapiArticle.publishedAt || strapiArticle.createdAt,
      contentHtml: blocksHtml || strapiArticle.description || '',
      category: strapiArticle.category?.name,
      excerpt: strapiArticle.excerpt || strapiArticle.description,
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
        category: markdownArticle.category,
        excerpt: markdownArticle.excerpt,
      };
    }
  }

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-28 pb-12">
        <article className="max-w-4xl mx-auto">
          {/* Back Link */}
          <Link
            href="/publications"
            className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux publications
          </Link>

          {/* Article Header */}
          <div className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-2xl shadow-lg mb-8">
            {article.category && (
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-4 h-4 text-indigo-500" />
                <span className="inline-block px-3 py-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                  {article.category}
                </span>
              </div>
            )}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {article.title}
            </h1>
            {article.excerpt && (
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                {article.excerpt}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="font-semibold">{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={article.date}>
                  {new Date(article.date).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
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
                prose-li:text-gray-700 dark:prose-li:text-gray-300
                prose-blockquote:border-indigo-500 prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-300
                prose-img:rounded-lg prose-img:shadow-md"
              dangerouslySetInnerHTML={{ __html: article.contentHtml }}
            />
          </div>

          {/* Back Link Bottom */}
          <div className="mt-12 flex items-center justify-between">
            <Link
              href="/publications"
              className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour aux publications
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
