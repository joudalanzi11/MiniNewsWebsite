
import streamlit as st
import json
import os
from dotenv import load_dotenv

from main import get_news
from summarize import summarize_articles

load_dotenv()

st.set_page_config(page_title="اخبار تقنية", page_icon="📰")

# العنوان حق الموقع
st.title("اخبار تقنية 📰")

if st.button("🔄 جيب أخبار جديدة"):
    api_key = os.environ.get("NEWS_API_KEY")

    if not api_key or api_key == "your_newsapi_key_here":
        st.error("لازم تحطين مفتاح NewsAPI الصحيح في ملف .env (NEWS_API_KEY=...)")
        st.stop()

    with st.spinner("جاري جلب الأخبار..."):
        news = get_news(api_key)

    if not news:
        st.error("ما رجعت لنا أي أخبار، تأكدي من المفتاح أو الاتصال.")
        st.stop()

    with open('news_data.json', 'w', encoding='utf-8') as f:
        json.dump(news, f, ensure_ascii=False, indent=4)

    with st.spinner("جاري تلخيص الأخبار.. قد تاخذ شوي أول مرة!"):
        summarized = summarize_articles(news)

    with open('summarized_news.json', 'w', encoding='utf-8') as f:
        json.dump(summarized, f, ensure_ascii=False, indent=4)

    st.success(f"تم تحديث الأخبار! ({len(summarized)} خبر)")

if not os.path.exists('summarized_news.json'):
    st.info("اضغطي على زر \"جيب أخبار جديدة\" عشان تبدأين.")
    st.stop()

# نقرأ الملف اللي سويناه
with open('summarized_news.json', 'r', encoding='utf-8') as f:
    articles = json.load(f)

if not articles:
    st.warning("ما فيه أخبار حالياً.")
    st.stop()

# نعرض الأخبار في الموقع
for article in articles:
    with st.container(border=True):
        image_url = article.get('urlToImage')
        col_img, col_text = st.columns([1, 2]) if image_url else (None, st.container())

        if image_url:
            with col_img:
                st.image(image_url, use_container_width=True)

        with col_text:
            st.subheader(article.get('title', 'بدون عنوان'))
            source_name = (article.get('source') or {}).get('name', 'غير معروف')
            st.caption(f"📌 {source_name}")
            st.write(article.get('summary', ''))
            if article.get('url'):
                st.link_button("اقرأ الخبر كامل ↗", article['url'])
