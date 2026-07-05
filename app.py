
import streamlit as st
import json
import os

st.set_page_config(page_title="اخبار تقنية", page_icon="📰")

# العنوان حق الموقع
st.title("اخبار تقنية 📰")

if not os.path.exists('summarized_news.json'):
    st.error(
        "ملف summarized_news.json غير موجود.\n\n"
        "شغّلي `python main.py` ثم `python summarize.py` أول عشان تجهزين الأخبار الملخصة."
    )
    st.stop()

# نقرأ الملف اللي سويناه
with open('summarized_news.json', 'r', encoding='utf-8') as f:
    articles = json.load(f)

if not articles:
    st.warning("ما فيه أخبار حالياً.")
    st.stop()

# نعرض الأخبار في الموقع
for article in articles:
    st.subheader(article.get('title', 'بدون عنوان'))
    source_name = (article.get('source') or {}).get('name', 'غير معروف')
    st.write(f"**المصدر:** {source_name}")
    st.info(f"**الملخص:** {article.get('summary', '')}")
    st.divider()  # خط فاصل بين الأخبار
