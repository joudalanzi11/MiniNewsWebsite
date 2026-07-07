"use client";

import { useState } from "react";
import { Bookmark, Check, ExternalLink, Newspaper, Share2 } from "lucide-react";

import type { Article } from "@/lib/types";
import { relativeTime } from "@/lib/time";
import { useReadingList, toggleSaved, isSaved } from "@/lib/reading-list-store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export function NewsCard({ article }: { article: Article }) {
  // بعض صور الأخبار محمية أو مكسورة، نخفيها بدل ما تطلع أيقونة مكسورة
  const [imageOk, setImageOk] = useState(Boolean(article.urlToImage));
  const [copied, setCopied] = useState(false);
  const sourceName = article.source?.name || "غير معروف";

  // نشترك في قائمة الحفظ عشان الأيقونة تتحدّث فورًا
  useReadingList();
  const saved = isSaved(article.url);

  async function share() {
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: article.title || "", url: article.url });
      } else {
        await navigator.clipboard.writeText(article.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
    } catch {
      /* المستخدم لغى المشاركة — نتجاهل */
    }
  }

  return (
    <Card className="glass-card group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10">
      {imageOk && article.urlToImage && (
        <div className="relative h-44 w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.urlToImage}
            alt={article.title || ""}
            loading="lazy"
            onError={() => setImageOk(false)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
        </div>
      )}

      <CardContent className="flex flex-1 flex-col gap-3 pt-6">
        <div className="flex items-center justify-between gap-2">
          <Badge>
            <Newspaper className="ml-1 size-3" />
            {sourceName}
          </Badge>
          <span className="text-xs text-muted-foreground" suppressHydrationWarning>
            {relativeTime(article.publishedAt)}
          </span>
        </div>

        <h2 className="text-lg font-semibold leading-snug text-card-foreground">
          {article.title || "بدون عنوان"}
        </h2>

        <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
          {article.summary}
        </p>
      </CardContent>

      <CardFooter className="gap-2">
        <Button asChild variant="secondary" className="flex-1">
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            اقرأ الخبر كامل
            <ExternalLink className="size-4" />
          </a>
        </Button>

        <Button
          size="icon"
          variant={saved ? "default" : "outline"}
          onClick={() => toggleSaved(article)}
          aria-label={saved ? "إزالة من المحفوظات" : "حفظ للقراءة لاحقًا"}
          title={saved ? "محفوظ" : "احفظ للقراءة لاحقًا"}
        >
          <Bookmark className={cn("size-4", saved && "fill-current")} />
        </Button>

        <Button
          size="icon"
          variant="outline"
          onClick={share}
          aria-label="مشاركة"
          title="مشاركة / نسخ الرابط"
        >
          {copied ? (
            <Check className="size-4 text-primary" />
          ) : (
            <Share2 className="size-4" />
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
