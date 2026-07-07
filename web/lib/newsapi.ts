import type { NewsApiResponse } from "./types";
import { FRESH_TOPICS, type Lang } from "./topics";

export class NewsApiError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
  }
}

function getApiKey(): string {
  const key = process.env.NEWS_API_KEY;
  if (!key || key === "your_newsapi_key_here") {
    throw new NewsApiError(
      "لازم تحط مفتاح NewsAPI الصحيح في ملف .env.local (NEWS_API_KEY=...)",
      500,
    );
  }
  return key;
}

type RawArticle = NonNullable<NewsApiResponse["articles"]>[number];

// نحوّل أخطاء NewsAPI لرسائل عربية مفهومة
function messageFor(data: NewsApiResponse): string {
  switch (data.code) {
    case "rateLimited":
      return "تجاوزت حد الطلبات اليومي في NewsAPI. حاول بعد شوي أو بكرة.";
    case "apiKeyInvalid":
    case "apiKeyMissing":
    case "apiKeyDisabled":
      return "مفتاح NewsAPI غير صالح. تأكد من المفتاح في ملف .env.local.";
    default:
      return data.message || "خطأ غير معروف من NewsAPI";
  }
}

// يبحث بكل أخبار NewsAPI (endpoint: everything) عن كلمة معينة
export async function searchNews(
  query: string,
  lang: Lang = "en",
  page = 1,
  pageSize = 20,
): Promise<RawArticle[]> {
  const apiKey = getApiKey();
  const params = new URLSearchParams({
    q: query,
    language: lang,
    sortBy: "publishedAt",
    pageSize: String(pageSize),
    page: String(page),
    apiKey,
  });

  let response: Response;
  try {
    response = await fetch(`https://newsapi.org/v2/everything?${params}`, {
      cache: "no-store",
    });
  } catch {
    throw new NewsApiError("فيه مشكلة في الاتصال بالإنترنت.", 502);
  }

  const data = (await response.json()) as NewsApiResponse;

  if (!response.ok || data.status === "error") {
    throw new NewsApiError(messageFor(data), response.status || 502);
  }

  return data.articles || [];
}

// أخبار تقنية متنوعة من مصدر أوسع (everything) بدل نفس أهم العناوين المكررة
export async function getFreshNews(
  lang: Lang = "en",
  pageSize = 20,
): Promise<RawArticle[]> {
  const topics = FRESH_TOPICS[lang];
  const topic = topics[Math.floor(Math.random() * topics.length)];
  const page = Math.floor(Math.random() * 3) + 1; // 1..3
  return searchNews(topic, lang, page, pageSize);
}
