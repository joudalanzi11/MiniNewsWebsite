import os
import sys
import requests
import json
from dotenv import load_dotenv

load_dotenv()


def get_news(api_key):
    url = "https://newsapi.org/v2/top-headlines"
    params = {
        "category": "technology",
        "language": "en",
        "apiKey": api_key,
    }

    try:
        response = requests.get(url, params=params, timeout=10)
    except requests.exceptions.RequestException as e:
        print(f"فيه مشكلة في الاتصال بالإنترنت: {e}")
        return []

    if response.status_code == 200:
        data = response.json()
        # نأخذ بس قائمة الأخبار
        return data.get('articles', [])
    else:
        message = response.json().get('message', 'خطأ غير معروف')
        print(f"فيه مشكلة في الاتصال! ({response.status_code}): {message}")
        return []


if __name__ == "__main__":
    api_key = os.environ.get("NEWS_API_KEY")

    if not api_key or api_key == "your_newsapi_key_here":
        print("لازم تحطين مفتاح NewsAPI الصحيح في ملف .env (NEWS_API_KEY=...)")
        sys.exit(1)

    news = get_news(api_key)

    if not news:
        print("ما رجعت لنا أي أخبار، تأكدي من المفتاح أو الاتصال.")
        sys.exit(1)

    # الحين نحفظ الأخبار في ملف عشان نستخدمه للواجهة بعدين
    with open('news_data.json', 'w', encoding='utf-8') as f:
        json.dump(news, f, ensure_ascii=False, indent=4)

    print(f"تم حفظ {len(news)} خبر في ملف news_data.json بنجاح!")
