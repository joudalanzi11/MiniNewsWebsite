
import os
import re
import sys
import json
import requests
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

# نجهز "موديل" التلخيص
# ملاحظة: إصدار transformers الجديد (v5) حذف pipeline("summarization")
# فنستخدم الموديل مباشرة بدل الـ pipeline
MODEL_NAME = "sshleifer/distilbart-cnn-12-6"
_tokenizer = None
_model = None


def _load_model():
    global _tokenizer, _model
    if _model is None:
        _tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
        _model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME)
    return _tokenizer, _model


def summarize_text(text, max_length=50, min_length=10):
    tokenizer, model = _load_model()
    inputs = tokenizer(text, return_tensors="pt", truncation=True)
    output_ids = model.generate(
        **inputs,
        max_length=max_length,
        min_length=min_length,
        do_sample=False,
    )
    return tokenizer.decode(output_ids[0], skip_special_tokens=True)


def _article_text(article):
    description = (article.get('description') or '').strip()
    # نظّف "[+123 chars]" اللي تحطها NewsAPI بآخر حقل content المقصوص
    content = re.sub(r'\s*\[\+\d+ chars\]$', '', (article.get('content') or '').strip())

    # ناخذ الأطول من الاثنين (content عادة يكرر description بأوله، فما نلزقهم مع بعض)
    text = content if len(content) > len(description) else description
    return text or (article.get('title') or '').strip()


def _is_image_reachable(url):
    if not url:
        return False
    headers = {"User-Agent": "Mozilla/5.0"}
    try:
        response = requests.head(url, headers=headers, timeout=3, allow_redirects=True)
        if response.status_code == 405:
            # بعض المواقع ما تدعم HEAD، نجرب GET بدلها
            response = requests.get(url, headers=headers, timeout=3, stream=True)
        return response.status_code == 200 and response.headers.get('content-type', '').startswith('image')
    except requests.exceptions.RequestException:
        return False


def summarize_articles(articles):
    summarized_articles = []

    for article in articles:
        text = _article_text(article)

        if not text:
            continue

        words = len(text.split())
        if words < 15:
            # نص قصير أصلاً، ما يحتاج تلخيص
            article['summary'] = text
            summarized_articles.append(article)
        else:
            try:
                max_len = min(120, words)
                min_len = min(40, max_len - 10) if max_len > 20 else 15
                article['summary'] = summarize_text(text, max_length=max_len, min_length=min_len)
                summarized_articles.append(article)
            except Exception as e:
                print(f"تعذر تلخيص خبر '{article.get('title', '')}': {e}")
                continue

        # بعض الصور محمية من الموقع المصدر وما تفتح، نشيلها بدل ما تطلع مكسورة
        if not _is_image_reachable(article.get('urlToImage')):
            article['urlToImage'] = None

    return summarized_articles


if __name__ == "__main__":
    if not os.path.exists('news_data.json'):
        print("ملف news_data.json غير موجود. شغّلي main.py أول عشان تجيبين الأخبار.")
        sys.exit(1)

    # نفتح ملف الأخبار الخام
    with open('news_data.json', 'r', encoding='utf-8') as f:
        articles = json.load(f)

    if not articles:
        print("ملف news_data.json فاضي، ما فيه أخبار نلخصها.")
        sys.exit(1)

    print("جاري تلخيص الأخبار.. اصبري علي شوي!")

    summarized_articles = summarize_articles(articles)

    # نحفظ الأخبار الملخصة في ملف جديد
    with open('summarized_news.json', 'w', encoding='utf-8') as f:
        json.dump(summarized_articles, f, ensure_ascii=False, indent=4)

    print(f"تم حفظ {len(summarized_articles)} خبر ملخص في summarized_news.json بنجاح!")
