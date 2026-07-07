import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "اخبار تقنية 📰",
  description: "ملخّص أخبار تقنية — يجيب آخر الأخبار ويلخّصها لك.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // dir=rtl + الثيم الداكن مثبّت عبر class="dark"
  return (
    <html lang="ar" dir="rtl" className="dark">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
