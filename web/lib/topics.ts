// لغة الأخبار: عربي أو إنجليزي (نمرّرها لـ NewsAPI)
export type Lang = "en" | "ar";

// مواضيع نجيب منها أخبار متنوعة في زر "جيب أخبار جديدة"
export const FRESH_TOPICS: Record<Lang, string[]> = {
  en: [
    "technology",
    "artificial intelligence",
    "software",
    "gadgets",
    "startup",
    "cybersecurity",
    "apps",
  ],
  ar: [
    "تقنية",
    "ذكاء اصطناعي",
    "تطبيقات",
    "هواتف",
    "شركات ناشئة",
    "أمن سيبراني",
    "برمجة",
  ],
};

// أزرار المواضيع السريعة (اللابل عربي دايم، والبحث يتغيّر حسب اللغة)
export interface Chip {
  label: string;
  query: Record<Lang, string>;
}

export const TOPIC_CHIPS: Chip[] = [
  { label: "ذكاء اصطناعي", query: { en: "artificial intelligence", ar: "ذكاء اصطناعي" } },
  { label: "آبل", query: { en: "apple", ar: "آبل" } },
  { label: "ألعاب", query: { en: "gaming", ar: "ألعاب" } },
  { label: "عملات رقمية", query: { en: "crypto", ar: "عملات رقمية" } },
  { label: "أمن سيبراني", query: { en: "cybersecurity", ar: "أمن سيبراني" } },
  { label: "هواتف", query: { en: "smartphone", ar: "هواتف" } },
  { label: "سيارات", query: { en: "electric cars", ar: "سيارات كهربائية" } },
];

export function isLang(value: string | null): value is Lang {
  return value === "en" || value === "ar";
}
