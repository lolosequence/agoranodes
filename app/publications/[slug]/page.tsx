import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticleBySlug as getStrapiArticle, getArticles as getStrapiArticles, getAllArticleSlugs as getStrapiSlugs, blocksToHtml } from '@/lib/strapi';
import { getArticleBySlug as getMarkdownArticle, getAllArticleSlugs as getMarkdownSlugs, getAllArticles as getMarkdownArticles } from '@/lib/markdown';
import { Navbar } from '../../components/navbar';
import { ArrowRight } from 'lucide-react';

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface RecentArticle {
  slug: string;
  title: string;
  date: string;
  category?: string;
  cover?: string;
}

// Force le rendu dynamique (pas de cache statique)
export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const strapiSlugs = await getStrapiSlugs();
  const markdownSlugs = getMarkdownSlugs();
  const allSlugs = [...new Set([...strapiSlugs, ...markdownSlugs])];
  return allSlugs.map((slug) => ({ slug }));
}

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://api.agoranodes.org';

async function getRecentArticles(currentSlug: string, limit = 4): Promise<RecentArticle[]> {
  const strapiArticles = await getStrapiArticles();
  const markdownArticles = getMarkdownArticles();

  const allArticles: (RecentArticle & { dateRaw: string })[] = [
    ...strapiArticles.map(a => ({
      slug: a.slug,
      title: a.title,
      date: a.publishedAt || a.createdAt,
      dateRaw: a.publishedAt || a.createdAt,
      category: a.category?.name,
      cover: a.cover?.url
        ? (a.cover.url.startsWith('http') ? a.cover.url : `${STRAPI_URL}${a.cover.url}`)
        : undefined,
    })),
    ...markdownArticles.map(a => ({
      slug: a.slug,
      title: a.title,
      date: a.date,
      dateRaw: a.date,
      category: a.category,
      cover: undefined,
    })),
  ];

  const uniqueMap = new Map<string, typeof allArticles[0]>();
  for (const a of allArticles) {
    if (!uniqueMap.has(a.slug)) uniqueMap.set(a.slug, a);
  }

  return Array.from(uniqueMap.values())
    .filter(a => a.slug !== currentSlug && a.title)
    .sort((a, b) => (a.dateRaw < b.dateRaw ? 1 : -1))
    .slice(0, limit)
    .map(({ dateRaw, ...rest }) => rest);
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
    cover?: string;
  } | null = null;

  if (strapiArticle) {
    const blocksHtml = await blocksToHtml(strapiArticle.blocks);
    const coverUrl = strapiArticle.cover?.url
      ? (strapiArticle.cover.url.startsWith('http') ? strapiArticle.cover.url : `https://api.agoranodes.org${strapiArticle.cover.url}`)
      : undefined;

    article = {
      title: strapiArticle.title,
      author: strapiArticle.author?.name || 'Agoranodes',
      date: strapiArticle.publishedAt || strapiArticle.createdAt,
      contentHtml: blocksHtml || strapiArticle.description || '',
      category: strapiArticle.category?.name,
      excerpt: strapiArticle.excerpt || strapiArticle.description,
      cover: coverUrl,
    };
  } else {
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

  const recentArticles = await getRecentArticles(slug, 4);

  return (
    <div className="min-h-screen bg-white dark:bg-[#111111]">
      <Navbar />

      <main className="w-[90%] lg:w-[70%] mx-auto">
        {/* Article Header */}
        <header className="pt-32 pb-8 md:pt-40 md:pb-12 text-center">
          {article.category && (
            <span className="inline-block text-xs font-medium tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-500 mb-6">
              {article.category}
            </span>
          )}
          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-light leading-tight text-neutral-900 dark:text-neutral-100 tracking-tight">
            {article.title}
          </h1>
          <time
            dateTime={article.date}
            className="block mt-6 text-sm text-neutral-400 dark:text-neutral-500 tracking-wide"
          >
            {new Date(article.date).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </header>

        {/* Cover Image */}
        {article.cover && (
          <figure className="mb-12">
            <img
              src={article.cover}
              alt={article.title}
              className="w-full h-auto"
            />
          </figure>
        )}

        {/* Article Content */}
        <div className="pb-16">
          <div
            className="article-prose"
            dangerouslySetInnerHTML={{ __html: article.contentHtml }}
          />

          {/* Author Attribution */}
          <div className="mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-800">
            <p className="text-sm text-neutral-400 dark:text-neutral-500">
              Par <span className="text-neutral-600 dark:text-neutral-300 font-medium">{article.author}</span>
            </p>
          </div>
        </div>
      </main>

      {/* Dernières Publications */}
      {recentArticles.length > 0 && (
        <section className="bg-[#0B1121] mt-12">
          <div className="w-[90%] lg:w-[85%] mx-auto py-16 lg:py-24">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                Nos dernières<br />publications
              </h2>
              <Link
                href="/publications"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium transition-colors whitespace-nowrap"
              >
                Toutes les publications
              </Link>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border-t border-white/10">
              {recentArticles.map((item) => (
                <Link
                  key={item.slug}
                  href={`/publications/${item.slug}`}
                  className="group flex flex-col justify-between bg-[#0B1121] p-6 lg:p-8 min-h-[220px] hover:bg-[#111b33] transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2 text-xs text-neutral-400 mb-4">
                      <span>
                        {new Date(item.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      {item.category && (
                        <>
                          <span className="text-neutral-600">|</span>
                          <span>{item.category}</span>
                        </>
                      )}
                    </div>
                    <h3 className="text-white text-base lg:text-lg font-medium leading-snug group-hover:text-indigo-300 transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  <div className="mt-6">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/20 group-hover:border-indigo-400 group-hover:text-indigo-400 text-white/60 transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Cover Images Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 mt-0">
              {recentArticles.map((item) => (
                <Link key={`cover-${item.slug}`} href={`/publications/${item.slug}`} className="block overflow-hidden">
                  {item.cover ? (
                    <img
                      src={item.cover}
                      alt={item.title}
                      className="w-full h-48 lg:h-56 object-cover hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-48 lg:h-56 bg-gradient-to-br from-indigo-900 to-indigo-700 flex items-center justify-center">
                      <span className="text-4xl font-bold text-white/10">{item.title.charAt(0)}</span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>

        </section>
      )}
    </div>
  );
}
