"use client";

import { useEffect, useState } from "react";
import { Bookmark, ExternalLink, Trash2, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useReadingList, removeSaved } from "@/lib/reading-list-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ReadingListButton() {
  const saved = useReadingList();
  const [open, setOpen] = useState(false);

  // إغلاق بزر Escape + منع تمرير الخلفية وقت الفتح
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="relative shrink-0"
      >
        <Bookmark className="size-4" />
        للقراءة لاحقًا
        {saved.length > 0 && (
          <span className="absolute -left-2 -top-2 flex size-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {saved.length}
          </span>
        )}
      </Button>

      {/* الخلفية المعتمة */}
      <div
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      {/* اللوح الجانبي */}
      <aside
        className={cn(
          "glass-card fixed left-0 top-0 z-50 flex h-full w-[380px] max-w-[90vw] flex-col border-l-0 border-r transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        aria-hidden={!open}
      >
        <header className="flex items-center justify-between border-b border-border p-4">
          <h2 className="flex items-center gap-2 font-semibold">
            <Bookmark className="size-5 text-primary" />
            للقراءة لاحقًا
            <Badge variant="secondary">{saved.length}</Badge>
          </h2>
          <Button size="icon" variant="ghost" onClick={() => setOpen(false)}>
            <X className="size-5" />
          </Button>
        </header>

        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {saved.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-muted-foreground">
              <Bookmark className="size-10 opacity-40" />
              <p>ما عندك أخبار محفوظة بعد.</p>
              <p className="text-xs">
                اضغط أيقونة الحفظ 🔖 على أي خبر عشان يظهر هنا.
              </p>
            </div>
          ) : (
            saved.map((article) => (
              <div
                key={article.url}
                className="rounded-lg border border-border bg-background/40 p-3"
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <span className="text-xs text-muted-foreground">
                    {article.source?.name || "غير معروف"}
                  </span>
                  <button
                    onClick={() => removeSaved(article.url)}
                    className="text-muted-foreground transition-colors hover:text-destructive"
                    aria-label="حذف"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <h3 className="mb-2 text-sm font-medium leading-snug">
                  {article.title || "بدون عنوان"}
                </h3>
                <Button asChild size="sm" variant="secondary" className="w-full">
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    فتح الخبر
                    <ExternalLink className="size-3.5" />
                  </a>
                </Button>
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  );
}
