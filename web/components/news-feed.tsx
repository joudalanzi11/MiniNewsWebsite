"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw, Search, X, AlertCircle } from "lucide-react";

import type { Article } from "@/lib/types";
import { isLang, type Lang } from "@/lib/topics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { NewsCard } from "@/components/news-card";
import { TopicChips } from "@/components/topic-chips";
import { LanguageToggle } from "@/components/language-toggle";
import { ReadingListButton } from "@/components/reading-list-panel";

type Mode = { kind: "feed" } | { kind: "search"; query: string };

const LANG_KEY = "news-lang";

async function fetchArticles(url: string): Promise<Article[]> {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "صار خطأ غير متوقع");
  return (data.articles as Article[]) ?? [];
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="glass-card space-y-4 rounded-xl p-4">
          <Skeleton className="h-44 w-full" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  );
}

export function NewsFeed() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<Mode>({ kind: "feed" });
  const [lang, setLang] = useState<Lang>("en");

  const loadFeed = useCallback(async (useLang: Lang) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchArticles(`/api/news?lang=${useLang}`);
      setArticles(data);
      setMode({ kind: "feed" });
      setQuery("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "صار خطأ غير متوقع");
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const runSearch = useCallback(
    async (rawQuery: string, useLang: Lang) => {
      const q = rawQuery.trim();
      if (!q) return;
      setQuery(q);
      setLoading(true);
      setError(null);
      try {
        const data = await fetchArticles(
          `/api/search?q=${encodeURIComponent(q)}&lang=${useLang}`,
        );
        setArticles(data);
        setMode({ kind: "search", query: q });
      } catch (e) {
        setError(e instanceof Error ? e.message : "صار خطأ غير متوقع");
        setArticles([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // نقرأ اللغة المحفوظة ونجيب الأخبار أول ما تفتح الصفحة
  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(LANG_KEY) : null;
    const initial: Lang = isLang(stored) ? stored : "en";
    setLang(initial);
    loadFeed(initial);
  }, [loadFeed]);

  function changeLang(next: Lang) {
    if (next === lang) return;
    setLang(next);
    if (typeof window !== "undefined") localStorage.setItem(LANG_KEY, next);
    // نعيد التحميل باللغة الجديدة (بحث أو feed حسب الحالة الحالية)
    if (mode.kind === "search") runSearch(mode.query, next);
    else loadFeed(next);
  }

  const activeQuery = mode.kind === "search" ? mode.query : null;

  return (
    <div className="space-y-6">
      {/* الصف العلوي: الحفظ + مبدّل اللغة */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ReadingListButton />
        <LanguageToggle value={lang} onChange={changeLang} />
      </div>

      {/* أزرار المواضيع السريعة */}
      <TopicChips
        lang={lang}
        activeQuery={activeQuery}
        onPick={(q) => runSearch(q, lang)}
      />

      {/* شريط التحكم: تحديث + بحث */}
      <div className="glass-card flex flex-col gap-3 rounded-xl p-4 sm:flex-row sm:items-center">
        <Button
          onClick={() => loadFeed(lang)}
          disabled={loading}
          className="shrink-0"
        >
          <RefreshCw className={loading ? "animate-spin" : ""} />
          جيب أخبار جديدة
        </Button>

        <div className="flex flex-1 gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && runSearch(query, lang)}
            placeholder="🔍 دوّري عن أي خبر..."
          />
          <Button
            onClick={() => runSearch(query, lang)}
            variant="secondary"
            disabled={loading || !query.trim()}
          >
            <Search />
            بحث
          </Button>
        </div>
      </div>

      {/* حالة البحث */}
      {mode.kind === "search" && (
        <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/40 px-4 py-2 text-sm">
          <span>
            نتائج البحث عن: <span className="font-semibold">{mode.query}</span>
          </span>
          <Button size="sm" variant="ghost" onClick={() => loadFeed(lang)}>
            <X className="size-4" />
            رجوع للأخبار
          </Button>
        </div>
      )}

      {/* رسالة خطأ */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* المحتوى */}
      {loading ? (
        <LoadingGrid />
      ) : articles.length === 0 && !error ? (
        <p className="py-16 text-center text-muted-foreground">
          ما فيه أخبار حالياً. جرّبي كلمة بحث ثانية أو حدّثي الأخبار.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, i) => (
            <NewsCard key={`${article.url}-${i}`} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
