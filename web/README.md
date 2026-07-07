# اخبار تقنية — Tech News Summarizer (Next.js) 📰

نسخة **Next.js + React + shadcn/ui** (ثيم داكن) من مشروع ملخّص الأخبار التقني.
يجيب آخر أخبار التقنية من [NewsAPI](https://newsapi.org)، يلخّصها تلقائيًا، ويعرضها في بطاقات.

## المزايا

- 🌙 واجهة داكنة عربية (RTL) بمكوّنات shadcn/ui.
- 🔄 زر "جيب أخبار جديدة" يجيب مواضيع تقنية متنوعة في كل مرة.
- 🔍 بحث في كل أخبار NewsAPI عن أي موضوع.
- 🏷️ أزرار مواضيع سريعة (ذكاء اصطناعي، آبل، ألعاب، عملات رقمية...).
- 🌍 تبديل لغة الأخبار نفسها (عربي / English).
- 🔖 حفظ الأخبار "للقراءة لاحقًا" (لوح جانبي، محفوظ في المتصفح).
- 🕒 وقت نسبي ("قبل ساعتين") + زر مشاركة/نسخ رابط.
- ✂️ تلخيص استخراجي سريع بدون أي موديل ثقيل أو مفتاح إضافي.
- 🔐 مفتاح NewsAPI يبقى في السيرفر (API routes) وما ينكشف للمتصفح.

## التقنيات

- Next.js 14 (App Router) + React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- NewsAPI (مصدر الأخبار)

## التشغيل

> يتطلب **Node.js 18+**. إذا مو مثبّت، حمّليه من <https://nodejs.org>.

```bash
cd web
npm install          # تثبيت الحزم
npm run dev          # تشغيل بيئة التطوير
```

بعدها افتحي <http://localhost:3000>.

### مفتاح NewsAPI

المفتاح موجود في `web/.env.local`. لو تبين مفتاحك الخاص:

```
NEWS_API_KEY=ضعي_مفتاحك_هنا
```

احصلي على مفتاح مجاني من <https://newsapi.org/register>.

## البنية

```
web/
├─ app/
│  ├─ api/news/route.ts     # يجيب أخبار متنوعة ويلخّصها
│  ├─ api/search/route.ts   # يبحث عن خبر ويلخّص النتائج
│  ├─ layout.tsx            # RTL + ثيم داكن
│  ├─ page.tsx              # الصفحة الرئيسية
│  └─ globals.css           # متغيّرات الثيم (shadcn)
├─ components/
│  ├─ ui/                   # مكوّنات shadcn (button, card, input, badge, skeleton)
│  ├─ news-card.tsx         # بطاقة الخبر (حفظ، مشاركة، وقت نسبي)
│  ├─ news-feed.tsx         # المنطق: جلب/بحث/تحديث/لغة
│  ├─ topic-chips.tsx       # أزرار المواضيع السريعة
│  ├─ language-toggle.tsx   # مبدّل عربي/English
│  └─ reading-list-panel.tsx # لوح "للقراءة لاحقًا"
└─ lib/
   ├─ newsapi.ts            # الاتصال بـ NewsAPI
   ├─ summarize.ts          # التلخيص الاستخراجي
   ├─ topics.ts             # مواضيع البحث بالعربي/الإنجليزي
   ├─ time.ts               # الوقت النسبي بالعربي
   ├─ reading-list-store.ts # تخزين "للقراءة لاحقًا" (localStorage)
   ├─ types.ts
   └─ utils.ts
```
