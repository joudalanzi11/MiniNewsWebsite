// نفس شكل الخبر اللي يرجع من NewsAPI + حقل summary اللي نضيفه إحنا
export interface NewsSource {
  id: string | null;
  name: string;
}

export interface Article {
  source: NewsSource;
  author: string | null;
  title: string | null;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
  summary: string;
}

export interface NewsApiResponse {
  status: string;
  totalResults?: number;
  articles?: Omit<Article, "summary">[];
  code?: string;
  message?: string;
}
