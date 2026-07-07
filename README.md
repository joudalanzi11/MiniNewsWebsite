# اخبار تقنية 📰 — Tech News Summarizer

مشروع يجيب آخر أخبار التقنية، يلخّصها تلقائيًا، ويعرضها بواجهة داكنة أنيقة.
فيه نسختين: نسخة **Next.js** الحديثة (الموصى بها)، ونسخة **Python/Streamlit** الأصلية.

## 🌐 النسخة الحديثة — Next.js + shadcn/ui (مجلد `web/`)

واجهة React كاملة بثيم داكن، عربية (RTL)، مبنية بـ Next.js 14 و shadcn/ui.

### المزايا
- 🌙 واجهة داكنة عربية بمكوّنات shadcn/ui وبطاقات زجاجية.
- 🔄 زر "جيب أخبار جديدة" — مواضيع تقنية متنوعة في كل مرة.
- 🔍 بحث في كل أخبار NewsAPI عن أي موضوع.
- 🏷️ أزرار مواضيع سريعة (ذكاء اصطناعي، آبل، ألعاب، عملات رقمية...).
- 🌍 تبديل لغة الأخبار نفسها (عربي / English).
- 🔖 حفظ الأخبار "للقراءة لاحقًا" (لوح جانبي، يبقى محفوظ في المتصفح).
- 🕒 وقت نسبي ("قبل ساعتين") + زر مشاركة/نسخ رابط.
- 🔐 مفتاح NewsAPI يبقى بالسيرفر (API routes)، ما ينكشف للمتصفح.

### التشغيل محليًا

يتطلب **Node.js 18+** (نزّليه من [nodejs.org](https://nodejs.org) إذا مو مثبّت).

```bash
cd web
npm install
npm run dev
```

افتحي <http://localhost:3000>.

انسخي `web/.env.local.example` إلى `web/.env.local` وحطي مفتاحك:
```
NEWS_API_KEY=مفتاحك_هنا
```
احصلي على مفتاح مجاني من <https://newsapi.org/register>.

### 🚀 نشر الموقع أونلاين (يشتغل لأي حد، من أي جهاز)

أسهل طريقة هي **Vercel** (الشركة المطوّرة لـ Next.js، عندها خطة مجانية):

1. ادخلي [vercel.com](https://vercel.com) وسجّلي حساب بـ GitHub.
2. اضغطي **Add New → Project** واختاري الريبو `miniprojectSJ`.
3. في **Root Directory** اختاري `web` (لأن مشروع Next.js داخل مجلد فرعي).
4. في **Environment Variables** ضيفي:
   - Name: `NEWS_API_KEY`
   - Value: مفتاحك من newsapi.org
5. اضغطي **Deploy**.

بعد دقيقة أو دقيقتين بتحصلين رابط عام زي:
```
https://miniprojectsj.vercel.app
```
أي حد يفتح هذا الرابط من أي جهاز/جوال بيشوف الموقع ويستخدمه — بدون ما يحتاج يثبّت أي شي.

> كل مرة ترفعين تحديث جديد على `main`، فيرسل يعيد النشر تلقائيًا.

مزيد من التفاصيل في [web/README.md](web/README.md).

---

## 🐍 النسخة الأصلية — Python + Streamlit

نسخة أبسط، تعتمد على موديل ذكاء اصطناعي محلي (`distilbart-cnn-12-6`) للتلخيص.

### كيف تشتغل
1. [main.py](main.py) — يجيب عناوين تقنية من [NewsAPI](https://newsapi.org) ويحفظها في `news_data.json`.
2. [summarize.py](summarize.py) — يلخّص كل خبر بموديل `distilbart-cnn-12-6` ويحفظ النتيجة في `summarized_news.json`.
3. [app.py](app.py) — واجهة Streamlit تعرض الأخبار الملخّصة.

### الإعداد
```bash
pip install -r requirements.txt
```
انسخي `.env.example` إلى `.env` وحطي مفتاحك:
```
NEWS_API_KEY=مفتاحك_هنا
```

### التشغيل
```bash
python main.py
python summarize.py
streamlit run app.py
```

### التقنيات
- Python · NewsAPI · Hugging Face Transformers · Streamlit
