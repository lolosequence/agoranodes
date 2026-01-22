const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://api.agoranodes.org';

// Types pour les blocks de contenu dynamique
export interface RichTextBlock {
  __component: 'shared.rich-text';
  id: number;
  body: string;
}

export interface MediaBlock {
  __component: 'shared.media';
  id: number;
  file?: {
    url: string;
    alternativeText?: string;
  };
}

export interface QuoteBlock {
  __component: 'shared.quote';
  id: number;
  title?: string;
  body?: string;
}

export interface SliderBlock {
  __component: 'shared.slider';
  id: number;
  files?: Array<{
    url: string;
    alternativeText?: string;
  }>;
}

export type ContentBlock = RichTextBlock | MediaBlock | QuoteBlock | SliderBlock;

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
  blocks?: ContentBlock[];
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
    // Populate deep pour récupérer les blocks et leurs contenus
    const response = await fetchAPI<StrapiResponse<StrapiArticle[]>>(
      `/articles?filters[slug][$eq]=${slug}&populate[author]=*&populate[cover]=*&populate[blocks][populate]=*`
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

// Convertit les blocks Strapi en HTML
export async function blocksToHtml(blocks: ContentBlock[] | undefined): Promise<string> {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
    return '';
  }

  try {
    const { remark } = await import('remark');
    const remarkHtml = (await import('remark-html')).default;

    const htmlParts: string[] = [];

    for (const block of blocks) {
      if (!block || !block.__component) continue;

      switch (block.__component) {
        case 'shared.rich-text':
          if (block.body) {
            const result = await remark().use(remarkHtml).process(block.body);
            htmlParts.push(result.toString());
          }
          break;

        case 'shared.quote':
          if (block.body || block.title) {
            htmlParts.push(`
              <blockquote>
                ${block.title ? `<strong>${block.title}</strong>` : ''}
                ${block.body ? `<p>${block.body}</p>` : ''}
              </blockquote>
            `);
          }
          break;

        case 'shared.media':
          if (block.file?.url) {
            const imageUrl = block.file.url.startsWith('http')
              ? block.file.url
              : `${STRAPI_URL}${block.file.url}`;
            htmlParts.push(`
              <figure>
                <img src="${imageUrl}" alt="${block.file.alternativeText || ''}" />
              </figure>
            `);
          }
          break;

        case 'shared.slider':
          if (block.files && block.files.length > 0) {
            const images = block.files.map(file => {
              const imageUrl = file.url.startsWith('http') ? file.url : `${STRAPI_URL}${file.url}`;
              return `<img src="${imageUrl}" alt="${file.alternativeText || ''}" />`;
            }).join('');
            htmlParts.push(`<div class="slider">${images}</div>`);
          }
          break;
      }
    }

    return htmlParts.join('');
  } catch (error) {
    console.error('Error converting blocks to HTML:', error);
    return '';
  }
}
