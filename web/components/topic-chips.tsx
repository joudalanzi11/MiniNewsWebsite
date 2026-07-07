"use client";

import { TOPIC_CHIPS, type Lang } from "@/lib/topics";
import { cn } from "@/lib/utils";

export function TopicChips({
  lang,
  activeQuery,
  onPick,
}: {
  lang: Lang;
  activeQuery: string | null;
  onPick: (query: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {TOPIC_CHIPS.map((chip) => {
        const query = chip.query[lang];
        const active = activeQuery === query;
        return (
          <button
            key={chip.label}
            onClick={() => onPick(query)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
              active
                ? "border-primary bg-primary/15 text-primary"
                : "border-border bg-secondary/40 text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            {chip.label}
          </button>
        );
      })}
    </div>
  );
}
