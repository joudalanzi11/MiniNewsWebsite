import { Newspaper } from "lucide-react";
import { NewsFeed } from "@/components/news-feed";

export default function Home() {
  return (
    <main className="container mx-auto max-w-6xl px-4 py-10">
      <header className="mb-10 text-center">
        <div className="mb-3 inline-flex items-center gap-3 rounded-full border border-border bg-secondary/40 px-4 py-1.5 text-sm text-muted-foreground">
          <Newspaper className="size-4 text-primary" />
          مدعوم بـ NewsAPI + تلخيص تلقائي
        </div>
        <h1 className="bg-gradient-to-l from-primary to-foreground bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
          اخبار تقنية
        </h1>
        <p className="mt-3 text-muted-foreground">
          آخر أخبار التقنية، ملخّصة ومرتّبة في مكان واحد.
        </p>
      </header>

      <NewsFeed />

      <footer className="mt-16 border-t border-border pt-6 text-center text-xs text-muted-foreground">
        مشروع تقني مصغّر · Next.js + shadcn/ui
      </footer>
    </main>
  );
}
