import 'dotenv/config'
import express from 'express'
import cors from 'cors'

const app = express()
const port = Number(process.env.API_PORT ?? 4174)
app.use(cors())
app.use(express.json())

app.get('/api/news', async (_request, response) => {
  const apiKey = process.env.NEWS_API_KEY
  if (!apiKey) {
    response.json({ configured: false, articles: [] })
    return
  }

  try {
    const url = new URL('https://newsapi.org/v2/everything')
    url.searchParams.set('q', 'artificial intelligence OR technology')
    url.searchParams.set('language', 'en')
    url.searchParams.set('sortBy', 'publishedAt')
    url.searchParams.set('pageSize', '20')
    const result = await fetch(url, { headers: { 'X-Api-Key': apiKey } })
    if (!result.ok) {
      response.status(result.status).json({ configured: true, error: 'The news provider rejected the request.' })
      return
    }

    const data = await result.json() as { articles?: Array<Record<string, string | null>> }
    const articles = (data.articles ?? []).map((article, index) => {
      const title = article.title ?? 'Untitled report'
      return {
        id: `live-${index}-${Buffer.from(title).toString('base64url').slice(0, 20)}`,
        title,
        excerpt: article.description ?? 'Open the source for the full report.',
        category: 'Artificial Intelligence',
        author: article.author || article.source || 'News source',
        date: article.publishedAt ?? new Date().toISOString(),
        readTime: 'External report',
        image: article.urlToImage ?? '',
        imageAlt: `Image accompanying ${title}`,
        source: article.source ?? 'NewsAPI',
        url: article.url ?? undefined,
        body: [article.description ?? 'Read the original report at its source.'],
        isSample: false,
      }
    })
    response.json({ configured: true, articles })
  } catch {
    response.status(502).json({ configured: true, error: 'Could not reach the news provider.' })
  }
})

app.post('/api/newsletter', (request, response) => {
  const email = String(request.body?.email ?? '').trim()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    response.status(400).json({ error: 'Enter a valid email address.' })
    return
  }
  response.status(202).json({ ok: true, message: 'Subscription received for this session.' })
})

app.listen(port, () => console.log(`Signal API listening on http://localhost:${port}`))
