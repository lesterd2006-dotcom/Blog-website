import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertCircle, ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Bookmark,
  BookmarkCheck, Check, ChevronLeft, ChevronRight, Clock3,
  ExternalLink, Instagram, Linkedin, Mail, Menu, Moon, Search, Send,
  Share2, Sun, TrendingUp, X,
} from 'lucide-react'
import { Link, NavLink, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { articlePath, categories, sampleArticles, type Article } from './data'

type Theme = 'light' | 'dark'
type SharedProps = {
  articles: Article[]
  bookmarks: string[]
  toggleBookmark: (id: string) => void
}

const pageMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.22, ease: 'easeOut' as const },
}

function App() {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('signal-theme') as Theme) || 'light')
  const [bookmarks, setBookmarks] = useState<string[]>(() => JSON.parse(localStorage.getItem('signal-bookmarks') || '[]') as string[])
  const [liveArticles, setLiveArticles] = useState<Article[] | null>(null)
  const [newsError, setNewsError] = useState(false)
  const location = useLocation()
  const articles = liveArticles?.length ? liveArticles : sampleArticles

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('signal-theme', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem('signal-bookmarks', JSON.stringify(bookmarks))
  }, [bookmarks])

  useEffect(() => {
    let active = true
    fetch('/api/news')
      .then(async (response) => {
        if (!response.ok) throw new Error('News provider unavailable')
        return response.json() as Promise<{ configured: boolean; articles?: Article[] }>
      })
      .then((result) => {
        if (active && result.configured && result.articles?.length) setLiveArticles(result.articles)
      })
      .catch(() => {
        if (active) setNewsError(true)
      })
    return () => { active = false }
  }, [])

  useEffect(() => {
    const path = location.pathname
    const title = path.startsWith('/article/') ? 'Story' : path === '/' ? 'The intelligence briefing' : path.split('/').filter(Boolean).at(-1)?.replaceAll('-', ' ') ?? 'Signal'
    document.title = `${title.replace(/\b\w/g, (letter) => letter.toUpperCase())} — Signal`
  }, [location.pathname])

  const toggleBookmark = (id: string) => setBookmarks((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])

  return (
    <div className="app-shell">
      <Header theme={theme} onTheme={() => setTheme((current) => current === 'light' ? 'dark' : 'light')} />
      {newsError && <div className="api-note" role="status">Live news is currently unavailable. Showing clearly labeled editorial concepts.</div>}
      <AnimatePresence mode="wait">
        <motion.main key={location.pathname + location.search} {...pageMotion}>
          <Routes location={location}>
            <Route path="/" element={<HomePage articles={articles} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />} />
            <Route path="/latest" element={<ListingPage mode="latest" articles={articles} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />} />
            <Route path="/trending" element={<ListingPage mode="trending" articles={articles} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />} />
            <Route path="/categories" element={<CategoriesPage articles={articles} />} />
            <Route path="/category/:category" element={<CategoryPage articles={articles} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />} />
            <Route path="/search" element={<SearchPage articles={articles} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />} />
            <Route path="/article/:id" element={<ArticlePage articles={articles} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />} />
            <Route path="/bookmarks" element={<BookmarksPage articles={articles} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  )
}

function Header({ theme, onTheme }: { theme: Theme; onTheme: () => void }) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const submitSearch = (event: FormEvent) => {
    event.preventDefault()
    const term = query.trim()
    if (term) navigate(`/search?q=${encodeURIComponent(term)}`)
    setSearchOpen(false)
    setMobileOpen(false)
  }
  const nav = <>
    <NavLink to="/latest" onClick={() => setMobileOpen(false)}>Latest</NavLink>
    <NavLink to="/trending" onClick={() => setMobileOpen(false)}>Trending</NavLink>
    <NavLink to="/categories" onClick={() => setMobileOpen(false)}>Topics</NavLink>
    <NavLink to="/about" onClick={() => setMobileOpen(false)}>About</NavLink>
  </>

  return (
    <header className="site-header">
      <div className="header-topline"><span>Independent intelligence, daily.</span><span className="header-date">VOL. 01 &nbsp; / &nbsp; THE FUTURE, IN FOCUS</span></div>
      <div className="header-main">
        <Link to="/" className="wordmark" aria-label="Signal home"><span className="wordmark-icon">s<span>.</span></span><span>SIGNAL</span></Link>
        <nav className="desktop-nav" aria-label="Main navigation">{nav}</nav>
        <div className="header-actions">
          <Link className="saved-link" to="/bookmarks" aria-label="Saved stories"><Bookmark size={16} /><span>Saved</span></Link>
          <button className="icon-button" type="button" aria-label={searchOpen ? 'Close search' : 'Open search'} onClick={() => setSearchOpen((open) => !open)}>{searchOpen ? <X size={18} /> : <Search size={18} />}</button>
          <button className="icon-button theme-toggle" type="button" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} onClick={onTheme}>{theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}</button>
          <button className="icon-button mobile-menu-button" type="button" aria-expanded={mobileOpen} aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'} onClick={() => setMobileOpen((open) => !open)}>{mobileOpen ? <X size={19} /> : <Menu size={19} />}</button>
        </div>
      </div>
      <AnimatePresence>
        {searchOpen && <motion.form className="search-popover" onSubmit={submitSearch} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
          <Search size={17} /><input autoFocus aria-label="Search stories" placeholder="Search stories, ideas, people…" value={query} onChange={(event) => setQuery(event.target.value)} /><button className="text-button" type="submit">Search <ArrowRight size={15} /></button>
        </motion.form>}
      </AnimatePresence>
      <AnimatePresence>{mobileOpen && <motion.nav className="mobile-nav" aria-label="Mobile navigation" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>{nav}<Link to="/bookmarks" onClick={() => setMobileOpen(false)}>Saved stories</Link></motion.nav>}</AnimatePresence>
    </header>
  )
}

function SampleNotice() {
  return <div className="sample-notice"><span className="sample-dot" /> AI-GENERATED EDITORIAL CONCEPTS <span className="notice-separator">/</span> NOT REAL-TIME NEWS</div>
}

function SectionKicker({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return <div className="section-kicker"><span>{children}</span>{aside && <span className="kicker-aside">{aside}</span>}</div>
}

function StoryCard({ article, bookmarks, toggleBookmark, compact = false }: SharedProps & { article: Article; compact?: boolean }) {
  const saved = bookmarks.includes(article.id)
  return <article className={`story-card ${compact ? 'story-card-compact' : ''}`}>
    <Link to={articlePath(article)} className="story-image-link" aria-label={`Read ${article.title}`}>
      <img className="story-image" src={article.image} alt={article.imageAlt} loading="lazy" />
      <span className="image-category">{article.category}</span>
    </Link>
    <div className="story-copy">
      <div className="story-meta"><span>{article.author}</span><span className="meta-dot">·</span><span>{article.date}</span></div>
      <h3><Link to={articlePath(article)}>{article.title}</Link></h3>
      <p>{article.excerpt}</p>
      <div className="story-footer"><span><Clock3 size={13} /> {article.readTime}</span><button className={`bookmark-button ${saved ? 'is-saved' : ''}`} aria-label={saved ? 'Remove bookmark' : 'Bookmark story'} aria-pressed={saved} onClick={() => toggleBookmark(article.id)}>{saved ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}</button></div>
    </div>
  </article>
}

function HomePage(props: SharedProps) {
  const featured = props.articles.find((article) => article.featured) ?? props.articles[0]
  const remaining = props.articles.filter((article) => article.id !== featured?.id)
  const trending = props.articles.filter((article) => article.trending).slice(0, 3)
  return <>
    <section className="home-intro page-wrap">
      <SampleNotice />
      <div className="intro-row"><h1>Technology is<br /><em>never just</em> technology.</h1><p>Clear-eyed reporting on artificial intelligence, emerging ideas, and the people shaping what comes next.</p></div>
      <div className="intro-rule"><span>THE SIGNAL BRIEFING</span><span>ISSUE 01 <ArrowDown size={13} /></span></div>
    </section>
    {featured && <section className="feature-layout page-wrap">
      <Link to={articlePath(featured)} className="feature-image-wrap"><img src={featured.image} alt={featured.imageAlt} /><span className="feature-image-index">01 <span>/</span> FEATURE</span><span className="feature-image-arrow"><ArrowUpRight size={21} /></span></Link>
      <div className="feature-copy"><div className="eyebrow"><span className="eyebrow-mark" /> {featured.category}</div><h2><Link to={articlePath(featured)}>{featured.title}</Link></h2><p className="feature-excerpt">{featured.excerpt}</p><div className="feature-byline"><span className="avatar">{featured.author.split(' ').map((part) => part[0]).join('')}</span><span><strong>{featured.author}</strong><small>{featured.date} &nbsp;·&nbsp; {featured.readTime}</small></span></div><div className="feature-actions"><Link className="button button-dark" to={articlePath(featured)}>Read the story <ArrowRight size={16} /></Link><button className={`bookmark-button ${props.bookmarks.includes(featured.id) ? 'is-saved' : ''}`} aria-label="Bookmark featured story" aria-pressed={props.bookmarks.includes(featured.id)} onClick={() => props.toggleBookmark(featured.id)}><Bookmark size={18} /></button></div><div className="concept-caption">Illustrative concept · AI-generated sample, not current news</div></div>
    </section>}
    <section className="trending-band"><div className="page-wrap"><SectionKicker aside={<Link to="/trending">All trending <ArrowUpRight size={13} /></Link>}><TrendingUp size={15} /> In the conversation</SectionKicker><div className="trending-grid">{trending.map((article, index) => <Link className="trending-item" to={articlePath(article)} key={article.id}><span className="trending-number">0{index + 1}</span><span className="trending-content"><small>{article.category}</small><strong>{article.title}</strong><span>{article.readTime} <ArrowRight size={13} /></span></span></Link>)}</div></div></section>
    <section className="latest-section page-wrap"><SectionKicker aside={<Link to="/latest" className="underlined-link">The latest <ArrowRight size={14} /></Link>}>Fresh perspectives</SectionKicker><div className="story-grid">{remaining.slice(0, 6).map((article) => <StoryCard key={article.id} article={article} {...props} />)}</div><div className="load-more-row"><Link to="/latest" className="button button-outline">Explore all stories <ArrowRight size={15} /></Link></div></section>
    <Newsletter />
  </>
}

function ListingPage({ mode, articles, bookmarks, toggleBookmark }: SharedProps & { mode: 'latest' | 'trending' }) {
  const [selected, setSelected] = useState('All')
  const [page, setPage] = useState(1)
  const collection = mode === 'trending' ? articles.filter((article) => article.trending) : articles
  const filtered = collection.filter((article) => selected === 'All' || article.category === selected)
  const pageSize = 6
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const shown = filtered.slice((page - 1) * pageSize, page * pageSize)
  useEffect(() => setPage(1), [selected, mode])
  return <div className="page-wrap listing-page"><div className="listing-heading"><SampleNotice /><div className="listing-title-row"><div><div className="eyebrow"><span className="eyebrow-mark" /> {mode === 'latest' ? 'THE DAILY EDIT' : 'MOST READ, MOST SHARED'}</div><h1>{mode === 'latest' ? 'Latest stories' : 'Trending now'}</h1></div><p>{mode === 'latest' ? 'New ideas and considered perspectives on the technologies changing our world.' : 'The stories our readers are thinking about, saved, and sharing.'}</p></div></div><div className="filter-row" role="group" aria-label="Filter by category">{categories.map((category) => <button key={category} className={`filter-chip ${selected === category ? 'active' : ''}`} onClick={() => setSelected(category)}>{category}</button>)}</div>{shown.length ? <div className="story-grid">{shown.map((article) => <StoryCard key={article.id} article={article} bookmarks={bookmarks} toggleBookmark={toggleBookmark} articles={[]} />)}</div> : <EmptyState title="No stories in this topic yet" text="Try another category or return to all stories." action={<button className="text-button" onClick={() => setSelected('All')}>Clear filters <X size={14} /></button>} />}<Pagination page={page} pageCount={pageCount} onPage={setPage} />{mode === 'latest' && <Newsletter />}</div>
}

function Pagination({ page, pageCount, onPage }: { page: number; pageCount: number; onPage: (page: number) => void }) {
  if (pageCount <= 1) return null
  return <nav className="pagination" aria-label="Pagination"><button aria-label="Previous page" disabled={page === 1} onClick={() => onPage(page - 1)}><ChevronLeft size={17} /></button>{Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => <button key={number} aria-label={`Page ${number}`} aria-current={page === number ? 'page' : undefined} className={page === number ? 'current' : ''} onClick={() => onPage(number)}>{String(number).padStart(2, '0')}</button>)}<button aria-label="Next page" disabled={page === pageCount} onClick={() => onPage(page + 1)}><ChevronRight size={17} /></button></nav>
}

function CategoriesPage({ articles }: { articles: Article[] }) {
  return <div className="page-wrap listing-page"><div className="listing-heading"><SampleNotice /><div className="listing-title-row"><div><div className="eyebrow"><span className="eyebrow-mark" /> EXPLORE THE JOURNAL</div><h1>Follow a thread.</h1></div><p>Big questions don’t fit in one discipline. Start with a topic and see where it leads.</p></div></div><div className="category-grid">{categories.slice(1).map((category, index) => {const count = articles.filter((article) => article.category === category).length; return <Link key={category} to={`/category/${encodeURIComponent(category.toLowerCase().replaceAll(' ', '-').replaceAll('&', 'and'))}`} className={`category-tile category-tone-${index + 1}`}><span className="category-number">0{index + 1} / TOPIC</span><span className="category-tile-title">{category}</span><span className="category-tile-bottom">{count} {count === 1 ? 'story' : 'stories'} <ArrowUpRight size={17} /></span></Link>})}</div><Newsletter /></div>
}

function CategoryPage({ articles, bookmarks, toggleBookmark }: SharedProps) {
  const { category = '' } = useParams()
  const selected = categories.slice(1).find((item) => item.toLowerCase().replaceAll(' ', '-').replaceAll('&', 'and') === category) ?? category.replaceAll('-', ' ')
  const matching = articles.filter((article) => article.category.toLowerCase() === selected.toLowerCase())
  return <div className="page-wrap listing-page"><Link to="/categories" className="back-link"><ArrowLeft size={14} /> All topics</Link><div className="listing-heading"><SampleNotice /><div className="listing-title-row"><div><div className="eyebrow"><span className="eyebrow-mark" /> TOPIC</div><h1>{selected}</h1></div><p>Ideas and perspectives from across the {selected.toLowerCase()} conversation.</p></div></div>{matching.length ? <div className="story-grid">{matching.map((article) => <StoryCard key={article.id} article={article} bookmarks={bookmarks} toggleBookmark={toggleBookmark} articles={[]} />)}</div> : <EmptyState title="This topic is still taking shape" text="There are no stories in this category just yet." action={<Link className="text-button" to="/categories">Browse other topics <ArrowRight size={14} /></Link>} />}</div>
}

function SearchPage({ articles, bookmarks, toggleBookmark }: SharedProps) {
  const [params, setParams] = useSearchParams()
  const initialQuery = params.get('q') ?? ''
  const [query, setQuery] = useState(initialQuery)
  useEffect(() => setQuery(initialQuery), [initialQuery])
  const results = articles.filter((article) => `${article.title} ${article.excerpt} ${article.category} ${article.author}`.toLowerCase().includes(initialQuery.toLowerCase()))
  const submit = (event: FormEvent) => { event.preventDefault(); setParams(query.trim() ? { q: query.trim() } : {}) }
  return <div className="page-wrap listing-page search-page"><div className="eyebrow"><span className="eyebrow-mark" /> SEARCH THE JOURNAL</div><h1>Find your next<br /><em>rabbit hole.</em></h1><form className="large-search" onSubmit={submit}><Search size={20} /><input aria-label="Search all stories" placeholder="Try ‘responsible AI’ or ‘robotics’" value={query} onChange={(event) => setQuery(event.target.value)} /><button className="button button-dark" type="submit">Search <ArrowRight size={15} /></button></form>{initialQuery && <SectionKicker>{results.length} {results.length === 1 ? 'result' : 'results'} for “{initialQuery}”</SectionKicker>}{initialQuery ? results.length ? <div className="story-grid">{results.map((article) => <StoryCard key={article.id} article={article} bookmarks={bookmarks} toggleBookmark={toggleBookmark} articles={[]} />)}</div> : <EmptyState title="Nothing surfaced this time" text="Try a broader phrase or explore a topic instead." action={<Link className="text-button" to="/categories">Browse topics <ArrowRight size={14} /></Link>} /> : <div className="popular-searches"><span>TRY A TOPIC</span>{categories.slice(1).map((category) => <button key={category} className="filter-chip" onClick={() => {setQuery(category); setParams({ q: category })}}>{category}</button>)}</div>}</div>
}

function ArticlePage({ articles, bookmarks, toggleBookmark }: SharedProps) {
  const { id = '' } = useParams()
  const article = articles.find((item) => item.id === id)
  if (!article) return <div className="page-wrap article-not-found"><EmptyState title="We couldn’t find that story" text="It may have moved, or the link may be out of date." action={<Link className="text-button" to="/latest">Back to the latest <ArrowRight size={14} /></Link>} /></div>
  const related = articles.filter((item) => item.id !== article.id && item.category === article.category).slice(0, 3)
  const share = async () => {
    if (navigator.share) await navigator.share({ title: article.title, url: window.location.href })
    else { await navigator.clipboard.writeText(window.location.href); window.dispatchEvent(new CustomEvent('signal-toast', { detail: 'Link copied to clipboard' })) }
  }
  return <article className="article-page"><div className="article-shell"><Link to="/latest" className="back-link"><ArrowLeft size={14} /> Back to the journal</Link><div className="article-head"><div className="eyebrow"><span className="eyebrow-mark" /> {article.category}</div><h1>{article.title}</h1><p className="article-deck">{article.excerpt}</p><div className="article-byline"><span className="avatar">{article.author.split(' ').map((part) => part[0]).join('')}</span><span><strong>{article.author}</strong><small>{article.date} &nbsp;·&nbsp; {article.readTime}</small></span><div className="article-tools"><button className="icon-button" aria-label="Share story" onClick={() => void share()}><Share2 size={17} /></button><button className={`icon-button ${bookmarks.includes(article.id) ? 'is-saved' : ''}`} aria-label={bookmarks.includes(article.id) ? 'Remove bookmark' : 'Bookmark story'} aria-pressed={bookmarks.includes(article.id)} onClick={() => toggleBookmark(article.id)}><Bookmark size={17} /></button></div></div></div><figure className="article-hero-image"><img src={article.image} alt={article.imageAlt} /><figcaption>{article.isSample ? 'AI-generated editorial concept image · Sample article, not real-time news' : `${article.source ?? 'Source'}${article.url ? ' · ' : ''}`}{article.url && <a href={article.url} target="_blank" rel="noreferrer">Read original <ExternalLink size={12} /></a>}</figcaption></figure><div className="article-body-layout"><aside className="article-aside"><span>IN THIS STORY</span><a href="#perspective">The perspective</a><a href="#related">Related reading</a><button onClick={() => void share()}><Share2 size={14} /> Share</button></aside><div className="article-body" id="perspective">{article.isSample && <div className="article-sample-callout"><AlertCircle size={16} /><span><strong>Illustrative concept</strong>This AI-generated sample is not a report of real events or current news.</span></div>}{article.body.map((paragraph, index) => <p key={index}>{paragraph}</p>)}<div className="article-endmark"><span /> END OF STORY <span /></div></div></div></div>{related.length > 0 && <section className="related-section page-wrap" id="related"><SectionKicker aside={<Link to="/latest">All stories <ArrowRight size={14} /></Link>}>Keep exploring</SectionKicker><div className="story-grid">{related.map((item) => <StoryCard key={item.id} article={item} bookmarks={bookmarks} toggleBookmark={toggleBookmark} articles={[]} />)}</div></section>}</article>
}

function BookmarksPage({ articles, bookmarks, toggleBookmark }: SharedProps) {
  const saved = articles.filter((article) => bookmarks.includes(article.id))
  return <div className="page-wrap listing-page"><div className="listing-heading"><div className="eyebrow"><span className="eyebrow-mark" /> YOUR READING LIST</div><div className="listing-title-row"><div><h1>Saved for later.</h1></div><p>Your bookmarked stories stay on this device, ready when you are.</p></div></div>{saved.length ? <div className="story-grid">{saved.map((article) => <StoryCard key={article.id} article={article} bookmarks={bookmarks} toggleBookmark={toggleBookmark} articles={[]} />)}</div> : <EmptyState title="A little room for a good read" text="Save stories with the bookmark icon and they’ll find a place here." action={<Link className="text-button" to="/latest">Browse the latest <ArrowRight size={14} /></Link>} />}</div>
}

function AboutPage() {
  return <div className="page-wrap about-page"><SampleNotice /><div className="about-hero"><div className="eyebrow"><span className="eyebrow-mark" /> OUR POINT OF VIEW</div><h1>Curiosity, with<br /><em>a little more context.</em></h1><p>Signal is an independent journal for people who want to understand the technology changing our lives, not just keep up with the headlines.</p></div><div className="about-columns"><div className="about-stat"><span>01</span><strong>Less noise.<br />More signal.</strong></div><div><h2>Make room for the nuance.</h2><p>AI and emerging technology deserve more than hype cycles and hot takes. We make space for useful questions, thoughtful perspectives, and the human choices behind technical change.</p><p>This demo publication uses clearly labeled AI-generated editorial concepts. No sample story on this site should be mistaken for real-time news or independently verified reporting.</p><Link className="text-button" to="/latest">Explore the journal <ArrowRight size={15} /></Link></div></div><Newsletter /></div>
}

function ContactPage() {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.reportValidity()) return
    setError('')
    setSent(true)
    form.reset()
  }
  return <div className="page-wrap contact-page"><div className="contact-copy"><div className="eyebrow"><span className="eyebrow-mark" /> GET IN TOUCH</div><h1>Good ideas<br /><em>start somewhere.</em></h1><p>Have a question, a thoughtful disagreement, or a story worth exploring? We’d like to hear from you.</p><a className="contact-email" href="mailto:hello@signaljournal.example"><Mail size={17} /> hello@signaljournal.example <ArrowUpRight size={15} /></a><div className="contact-hours">PRESS & PARTNERSHIPS<br /><span>Usually back within two working days.</span></div></div><form className="contact-form" onSubmit={submit}><label>Your name<input name="name" autoComplete="name" required placeholder="Name" /></label><label>Email address<input name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></label><label>What’s on your mind?<textarea name="message" required rows={5} placeholder="A few details go a long way…" /></label>{error && <p className="form-error">{error}</p>}{sent && <p className="form-success"><Check size={16} /> Thanks for writing. Your note is ready to send through your email client.</p>}<button className="button button-dark" type="submit">Send a note <Send size={15} /></button><small>This demo form confirms locally and does not transmit messages.</small></form></div>
}

function Newsletter() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setState('error'); setMessage('Enter a valid email address.'); return }
    try {
      const response = await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
      if (!response.ok) throw new Error('Newsletter endpoint unavailable')
      setState('success'); setMessage('You’re on the list. Watch your inbox.')
    } catch {
      const current = JSON.parse(localStorage.getItem('signal-newsletter') || '[]') as string[]
      if (!current.includes(email.trim())) localStorage.setItem('signal-newsletter', JSON.stringify([...current, email.trim()]))
      setState('success'); setMessage('Saved on this device. Newsletter delivery is not connected in this demo.')
    }
  }
  return <section className="newsletter-band"><div className="newsletter-inner"><div><div className="eyebrow"><span className="eyebrow-mark" /> THE SIGNAL LETTER</div><h2>A little clarity,<br /><em>delivered weekly.</em></h2><p>Thoughtful reads on AI and technology. No noise, no daily firehose.</p></div><form className="newsletter-form" onSubmit={(event) => void submit(event)}><label htmlFor="newsletter-email">YOUR EMAIL ADDRESS</label><div className="newsletter-input"><input id="newsletter-email" type="email" autoComplete="email" placeholder="you@example.com" required value={email} onChange={(event) => {setEmail(event.target.value); setState('idle')}} /><button type="submit" aria-label="Subscribe to newsletter"><ArrowRight size={18} /></button></div><small className={state === 'error' ? 'form-error' : state === 'success' ? 'form-success' : ''}>{message || 'By subscribing, you agree to occasional notes from Signal.'}</small></form></div></section>
}

function EmptyState({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return <div className="empty-state"><span className="empty-symbol">∅</span><h2>{title}</h2><p>{text}</p>{action}</div>
}

function NotFoundPage() {
  return <div className="page-wrap not-found"><span>404 / OFF THE MAP</span><h1>This page took<br /><em>a different path.</em></h1><Link className="button button-dark" to="/">Back to the briefing <ArrowRight size={15} /></Link></div>
}

function Footer() {
  return <footer className="site-footer"><div className="footer-top page-wrap"><Link to="/" className="wordmark"><span className="wordmark-icon">s<span>.</span></span><span>SIGNAL</span></Link><p>Independent intelligence<br />for a changing world.</p><div className="footer-links"><div><span>READ</span><Link to="/latest">Latest stories</Link><Link to="/trending">Trending</Link><Link to="/categories">Topics</Link></div><div><span>SIGNAL</span><Link to="/about">About us</Link><Link to="/contact">Contact</Link><Link to="/bookmarks">Saved stories</Link></div></div><div className="footer-social"><a href="https://www.linkedin.com" aria-label="LinkedIn"><Linkedin size={17} /></a><a href="https://www.instagram.com" aria-label="Instagram"><Instagram size={17} /></a></div></div><div className="footer-bottom page-wrap"><span>© 2026 SIGNAL JOURNAL</span><span>AI-GENERATED SAMPLE CONTENT · NOT LIVE NEWS</span><Link to="/">BACK TO TOP ↑</Link></div></footer>
}

export default App
