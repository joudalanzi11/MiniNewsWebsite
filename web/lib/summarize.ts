import type { Article } from "./types";

type RawArticle = Omit<Article, "summary">;

// نشيل علامة "[+123 chars]" اللي تحطها NewsAPI بآخر حقل content المقصوص
function cleanContent(text: string): string {
  return text.replace(/\s*\[\+\d+\s*chars\]\s*$/i, "").trim();
}

// نختار النص الأنسب للتلخيص: الأطول بين description و content، ثم العنوان كاحتياط
// (مطابق لمنطق _article_text في نسخة بايثون)
function articleText(article: RawArticle): string {
  const description = (article.description || "").trim();
  const content = cleanContent(article.content || "");
  const text = content.length > description.length ? content : description;
  return text || (article.title || "").trim();
}

// تلخيص استخراجي: ناخذ أول جملتين، وإذا طال نقص عند أقرب حد منطقي
function extractiveSummary(text: string, maxChars = 240): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return "";

  // نقسم على نهايات الجمل (نقطة/سؤال/تعجب) — يشمل علامة الاستفهام العربية ؟
  const sentences = normalized.match(/[^.!?؟]+[.!?؟]+|\S+$/g) || [normalized];

  let summary = "";
  for (const sentence of sentences) {
    const candidate = (summary + " " + sentence).trim();
    if (candidate.length > maxChars && summary) break;
    summary = candidate;
    if (summary.length >= maxChars) break;
    // نكتفي بأول جملتين إذا كانتا كافيتين
    if (summary.split(/[.!?؟]/).filter((s) => s.trim()).length >= 2) break;
  }

  if (summary.length > maxChars) {
    const cut = summary.slice(0, maxChars);
    const lastSpace = cut.lastIndexOf(" ");
    summary = (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trim() + "…";
  }

  return summary;
}

// نلخّص قائمة أخبار ونرجّعها مع حقل summary
export function summarizeArticles(articles: RawArticle[]): Article[] {
  const result: Article[] = [];

  for (const article of articles) {
    const text = articleText(article);
    if (!text) continue;

    const wordCount = text.split(/\s+/).filter(Boolean).length;
    // نص قصير أصلاً ما يحتاج تلخيص
    const summary = wordCount < 15 ? text : extractiveSummary(text);

    result.push({ ...article, summary });
  }

  return result;
}
