
import streamlit as st
import json

# العنوان حق الموقع
st.title("اخبار تقنية 📰")

# نقرأ الملف اللي سويناه
with open('summarized_news.json', 'r', encoding='utf-8') as f:
    articles = json.load(f)

# نعرض الأخبار في الموقع
for article in articles:
    st.subheader(article['title'])
    st.write(f"**المصدر:** {article['source']['name']}")
    st.info(f"**الملخص:** {article['summary']}")
    st.divider() # خط فاصل بين الأخبار
