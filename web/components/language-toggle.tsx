"use client";

import type { Lang } from "@/lib/topics";
import { cn } from "@/lib/utils";

const OPTIONS: { value: Lang; label: string }[] = [
  { value: "ar", label: "عربي" },
  { value: "en", label: "English" },
];

// مبدّل لغة الأخبار (يغيّر المحتوى نفسه، مو الواجهة)
export function LanguageToggle({
  value,
  onChange,
}: {
  value: Lang;
  onChange: (lang: Lang) => void;
}) {
  return (
    <div className="inline-flex shrink-0 items-center rounded-md border border-border bg-secondary/40 p-0.5">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "rounded px-3 py-1.5 text-sm font-medium transition-colors",
            value === opt.value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
