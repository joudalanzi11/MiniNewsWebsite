
import streamlit as st
import json
import os
from datetime import datetime
from dotenv import load_dotenv

from main import get_fresh_news, search_news
from summarize import summarize_articles

load_dotenv()

st.set_page_config(page_title="اخبار تقنية", page_icon="📰")

st.markdown(
    """
    <style>
    div[data-testid="stVerticalBlockBorderWrapper"] {
        background: rgba(255, 255, 255, 0.55);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        border: 1px solid rgba(255, 255, 255, 0.4);
        border-radius: 18px;
        box-shadow: 0 8px 24px rgba(31, 41, 55, 0.12);
    }
    div[data-testid="stImage"] img {
        border-radius: 10px;
        object-fit: cover;
        height: 180px;
        width: 100%;
    }
    .source-badge {
        display: inline-block;
        background: #0EA5B722;
        color: #0EA5B7;
        padding: 2px 10px;
        border-radius: 999px;
        font-size: 0.8rem;
        margin-bottom: 0.4rem;
    }
    </style>
    """,
    unsafe_allow_html=True,
)

# العنوان حق الموقع
st.title("اخبار تقنية 📰")

if "search_results" not in st.session_state:
    st.session_state.search_results = None


def _get_api_key():
    api_key = os.environ.get("NEWS_API_KEY")
    if not api_key or api_key == "your_newsapi_key_here":
        st.error("لازم تحطين مفتاح NewsAPI الصحيح في ملف .env (NEWS_API_KEY=...)")
        return None
    return api_key


if st.button("🔄 جيب أخبار جديدة"):
    api_key = _get_api_key()
    if api_key:
        with st.spinner("جاري جلب أخبار جديدة..."):
            news = get_fresh_news(api_key)

        if not news:
            st.error("ما رجعت لنا أي أخبار، تأكدي من المفتاح أو الاتصال.")
        else:
            with open('news_data.json', 'w', encoding='utf-8') as f:
                json.dump(news, f, ensure_ascii=False, indent=4)

            with st.spinner("جاري تلخيص الأخبار.. قد تاخذ شوي أول مرة!"):
                summarized = summarize_articles(news)

            with open('summarized_news.json', 'w', encoding='utf-8') as f:
                json.dump(summarized, f, ensure_ascii=False, indent=4)

            st.session_state.search_results = None
            st.success(f"تم جلب أخبار جديدة! ({len(summarized)} خبر)")

search_col, button_col = st.columns([4, 1])
with search_col:
    search_query = st.text_input("🔍 دوّري عن أي خبر بكل NewsAPI", placeholder="اكتبي أي موضوع...")
with button_col:
    st.write("")
    search_clicked = st.button("بحث")

if search_clicked:
    query = search_query.strip()
    if not query:
        st.warning("اكتبي كلمة عشان تبحثين.")
    else:
        api_key = _get_api_key()
        if api_key:
            with st.spinner(f'جاري البحث عن "{query}"...'):
                results = search_news(api_key, query)

            if not results:
                st.warning("ما لقيت أخبار تطابق بحثك.")
                st.session_state.search_results = []
            else:
                with st.spinner("جاري تلخيص نتائج البحث.. قد تاخذ شوي أول مرة!"):
                    st.session_state.search_results = summarize_articles(results)

if st.session_state.search_results is not None:
    st.info(f'نتائج البحث عن "{search_query}"')
    if st.button("✖ رجوع للأخبار العادية"):
        st.session_state.search_results = None
        st.rerun()
    articles = st.session_state.search_results
else:
    if not os.path.exists('summarized_news.json'):
        st.info('اضغطي على زر "جيب أخبار جديدة" عشان تبدأين.')
        st.stop()

    last_updated = datetime.fromtimestamp(os.path.getmtime('summarized_news.json'))
    st.caption(f"آخر تحديث: {last_updated.strftime('%Y-%m-%d %H:%M')}")

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
            st.markdown(f'<span class="source-badge">📌 {source_name}</span>', unsafe_allow_html=True)
            st.write(article.get('summary', ''))
            if article.get('url'):
                st.link_button("اقرأ الخبر كامل ↗", article['url'])
