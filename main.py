import requests
import json

def get_news(api_key):
    url = f"https://newsapi.org/v2/top-headlines?category=technology&language=en&apiKey={api_key}"
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        # نأخذ بس قائمة الأخبار
        articles = data.get('articles', [])
        return articles
    else:
        print("فيه مشكلة في الاتصال!")
        return []

# استبدلي هذا بمفتاحك
api_key = "e61be3e4fe2346de8f0013976316ce0b"
news = get_news(api_key)

# الحين نحفظ الأخبار في ملف عشان نستخدمه للواجهة بعدين
with open('news_data.json', 'w', encoding='utf-8') as f:
    json.dump(news, f, ensure_ascii=False, indent=4)

print("تم حفظ الأخبار في ملف news_data.json بنجاح!")