# Tech News Summarizer 📰

A mini project that fetches the latest technology news, summarizes each article using an AI model, and displays them in a simple web app.

## How it works

1. `main.py` — fetches technology headlines from [NewsAPI](https://newsapi.org) and saves them to `news_data.json`.
2. `summarize.py` — summarizes each article's description using the `distilbart-cnn-12-6` model and saves the results to `summarized_news.json`.
3. `app.py` — a Streamlit web app that displays the summarized news.

## Setup

1. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
2. Create a `.env` file (copy `.env.example`) and add your NewsAPI key:
   ```
   NEWS_API_KEY=your_newsapi_key_here
   ```
   Get a free key at [newsapi.org](https://newsapi.org/register).

## Usage

Run the steps in order:

```
python main.py
python summarize.py
streamlit run app.py
```

## Tech stack

- Python
- NewsAPI (news source)
- Hugging Face Transformers (summarization model)
- Streamlit (web UI)
