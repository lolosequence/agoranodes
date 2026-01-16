const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://api.agoranodes.org';

export interface StrapiArticle {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  content?: string;
  description?: string;
  excerpt?: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  author?: {
    name: string;
    email?: string;
  };
  cover?: {
    url: string;
    alternativeText?: string;
  };
}

interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

async function fetchAPI<T>(endpoint: string): Promise<T> {
  const url = `${STRAPI_URL}/api${endpoint}`;

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  });

  if (!res.ok) {
    throw new Error(`Strapi API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function getArticles(): Promise<StrapiArticle[]> {
  try {
    const response = await fetchAPI<StrapiResponse<StrapiArticle[]>>(
      '/articles?populate=*&sort=publishedAt:desc'
    );
    return response.data || [];
  } catch (error) {
    console.error('Error fetching articles from Strapi:', error);
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<StrapiArticle | null> {
  try {
    const response = await fetchAPI<StrapiResponse<StrapiArticle[]>>(
      `/articles?filters[slug][$eq]=${slug}&populate=*`
    );
    return response.data?.[0] || null;
  } catch (error) {
    console.error(`Error fetching article "${slug}" from Strapi:`, error);
    return null;
  }
}

export async function getAllArticleSlugs(): Promise<string[]> {
  try {
    const articles = await getArticles();
    return articles.map((article) => article.slug).filter(Boolean);
  } catch (error) {
    console.error('Error fetching article slugs from Strapi:', error);
    return [];
  }
}
