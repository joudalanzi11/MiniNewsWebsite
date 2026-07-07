import { NextRequest, NextResponse } from "next/server";
import { searchNews, NewsApiError } from "@/lib/newsapi";
import { summarizeArticles } from "@/lib/summarize";
import { isLang } from "@/lib/topics";

export const dynamic = "force-dynamic";

// GET /api/search?q=...&lang=ar — يبحث عن خبر معين ويلخّص النتائج
export async function GET(request: NextRequest) {
  const query = (request.nextUrl.searchParams.get("q") || "").trim();
  const langParam = request.nextUrl.searchParams.get("lang");
  const lang = isLang(langParam) ? langParam : "en";

  if (!query) {
    return NextResponse.json(
      { error: "اكتبي كلمة عشان تبحثين." },
      { status: 400 },
    );
  }

  try {
    const raw = await searchNews(query, lang);
    const articles = summarizeArticles(raw);
    return NextResponse.json({ articles });
  } catch (error) {
    const status = error instanceof NewsApiError ? error.status : 500;
    const message =
      error instanceof Error ? error.message : "صار خطأ غير متوقع";
    return NextResponse.json({ error: message }, { status });
  }
}
