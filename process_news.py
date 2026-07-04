
import json

# نفتح الملف اللي حفظناه
with open('news_data.json', 'r', encoding='utf-8') as f:
    articles = json.load(f)

# الحين بنمر على كل خبر ونطبع العنوان بس
print("--- أخبار اليوم ---")
for i, article in enumerate(articles, 1):
    print(f"{i}. {article['title']}")
