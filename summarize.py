
import json
from transformers import pipeline

# نجهز "موديل" التلخيص
summarizer = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6")

# نفتح ملف الأخبار الخام
with open('news_data.json', 'r', encoding='utf-8') as f:
    articles = json.load(f)

summarized_articles = []

print("جاري تلخيص الأخبار.. اصبري علي شوي!")

for article in articles:
    # نتأكد إن فيه محتوى عشان نلخصه
    content = article.get('description') or article.get('title')
    
    if content:
        # عملية التلخيص
        summary = summarizer(content, max_length=50, min_length=10, do_sample=False)
        article['summary'] = summary[0]['summary_text']
        summarized_articles.append(article)

# نحفظ الأخبار الملخصة في ملف جديد
with open('summarized_news.json', 'w', encoding='utf-8') as f:
    json.dump(summarized_articles, f, ensure_ascii=False, indent=4)

print("تم حفظ الأخبار الملخصة في summarized_news.json بنجاح!")
