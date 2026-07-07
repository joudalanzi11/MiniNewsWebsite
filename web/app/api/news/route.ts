import { NextRequest, NextResponse } from "next/server";
import { getFreshNews, NewsApiError } from "@/lib/newsapi";
import { summarizeArticles } from "@/lib/summarize";
import { isLang } from "@/lib/topics";

export const dynamic = "force-dynamic";

// GET /api/news?lang=ar — يجيب أخبار تقنية متنوعة ويلخّصها
export async function GET(request: NextRequest) {
  const langParam = request.nextUrl.searchParams.get("lang");
  const lang = isLang(langParam) ? langParam : "en";

  try {
    const raw = await getFreshNews(lang);
    const articles = summarizeArticles(raw);
    return NextResponse.json({ articles });
  } catch (error) {
    const status = error instanceof NewsApiError ? error.status : 500;
    const message =
      error instanceof Error ? error.message : "صار خطأ غير متوقع";
    return NextResponse.json({ error: message }, { status });
  }
}
