
import os
import sys
import json
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

if not os.path.exists('news_data.json'):
    print("ملف news_data.json غير موجود. شغّلي main.py أول عشان تجيبين الأخبار.")
    sys.exit(1)

# نفتح ملف الأخبار الخام
with open('news_data.json', 'r', encoding='utf-8') as f:
    articles = json.load(f)

if not articles:
    print("ملف news_data.json فاضي، ما فيه أخبار نلخصها.")
    sys.exit(1)

# نجهز "موديل" التلخيص
# ملاحظة: إصدار transformers الجديد (v5) حذف pipeline("summarization")
# فنستخدم الموديل مباشرة بدل الـ pipeline
MODEL_NAME = "sshleifer/distilbart-cnn-12-6"
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME)


def summarize_text(text, max_length=50, min_length=10):
    inputs = tokenizer(text, return_tensors="pt", truncation=True)
    output_ids = model.generate(
        **inputs,
        max_length=max_length,
        min_length=min_length,
        do_sample=False,
    )
    return tokenizer.decode(output_ids[0], skip_special_tokens=True)

summarized_articles = []

print("جاري تلخيص الأخبار.. اصبري علي شوي!")

for article in articles:
    # نتأكد إن فيه محتوى عشان نلخصه
    content = article.get('description') or article.get('title')

    if not content:
        continue

    # الموديل يحتاج نص أطول من الملخص المطلوب عشان يشتغل صح
    words = len(content.split())
    if words < 10:
        article['summary'] = content
        summarized_articles.append(article)
        continue

    try:
        max_len = min(50, words)
        article['summary'] = summarize_text(content, max_length=max_len, min_length=min(10, max_len))
        summarized_articles.append(article)
    except Exception as e:
        print(f"تعذر تلخيص خبر '{article.get('title', '')}': {e}")

# نحفظ الأخبار الملخصة في ملف جديد
with open('summarized_news.json', 'w', encoding='utf-8') as f:
    json.dump(summarized_articles, f, ensure_ascii=False, indent=4)

print(f"تم حفظ {len(summarized_articles)} خبر ملخص في summarized_news.json بنجاح!")
