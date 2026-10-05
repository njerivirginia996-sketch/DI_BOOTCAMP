const path = require('node:path')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')
const Parser = require('rss-parser')

const app = express()
const parser = new Parser({
  customFields: {
    item: [['dc:creator', 'creator'], ['content:encoded', 'encodedContent']],
  },
})
const port = Number(process.env.PORT) || 3000
const feedUrl = process.env.RSS_FEED_URL || 'https://thefactfile.org/feed/'
const cacheDuration = 5 * 60 * 1000
let cachedFeed
let cachedAt = 0

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'public', 'pages'))
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false, limit: '10kb' }))
app.use(bodyParser.json({ limit: '10kb' }))

function normalizeCategories(item) {
  const values = Array.isArray(item.categories)
    ? item.categories
    : item.categories || item.category
      ? [item.categories || item.category]
      : []

  return values
    .flatMap((value) => String(value).split(/[;,]/))
    .map((value) => value.trim())
    .filter(Boolean)
}

function getCategories(posts) {
  return [...new Set(posts.flatMap((post) => post.categories))]
    .sort((left, right) => left.localeCompare(right))
}

async function getFeed() {
  if (cachedFeed && Date.now() - cachedAt < cacheDuration) {
    return cachedFeed
  }

  const response = await axios.get(feedUrl, {
    timeout: 15000,
    headers: { Accept: 'application/rss+xml, application/xml, text/xml', 'User-Agent': 'FactsFeedReader/1.0' },
    responseType: 'text',
  })
  const feed = await parser.parseString(response.data)
  const posts = feed.items.map((item) => ({
    title: item.title || 'Untitled fact',
    link: item.link || 'https://thefactfile.org/',
    publicationDate: item.isoDate || item.pubDate || '',
    creator: item.creator || item.author || '',
    categories: normalizeCategories(item),
    content: item.contentSnippet || item.summary || item.content || item.encodedContent || '',
  }))

  cachedFeed = { title: feed.title || 'The Fact File', posts }
  cachedAt = Date.now()
  console.log(`Loaded ${cachedFeed.posts.length} posts from ${cachedFeed.title}`)
  return cachedFeed
}

function renderSearch(response, values = {}) {
  return response.render('search', {
    title: 'Search facts',
    posts: values.posts || [],
    categories: values.categories || [],
    selectedTitle: values.selectedTitle || '',
    selectedCategory: values.selectedCategory || '',
    errorMessage: values.errorMessage || '',
    emptyMessage: values.emptyMessage || 'Choose a title or category to find facts.',
  })
}

app.get('/', async (_request, response) => {
  try {
    const feed = await getFeed()
    response.render('index', {
      title: 'Latest facts',
      feedTitle: feed.title,
      posts: feed.posts,
      errorMessage: '',
      emptyMessage: 'The feed has no posts yet.',
    })
  } catch (error) {
    console.error('Unable to load the RSS feed:', error.message)
    response.status(502).render('index', {
      title: 'Latest facts',
      feedTitle: 'The Fact File',
      posts: [],
      errorMessage: 'The fact feed is temporarily unavailable. Please try again shortly.',
      emptyMessage: '',
    })
  }
})

app.get('/search', async (_request, response) => {
  try {
    const feed = await getFeed()
    renderSearch(response, { categories: getCategories(feed.posts) })
  } catch (error) {
    console.error('Unable to load RSS categories:', error.message)
    response.status(502)
    renderSearch(response, {
      errorMessage: 'The fact feed is temporarily unavailable, so search options could not be loaded.',
      emptyMessage: '',
    })
  }
})

app.post('/search/title', async (request, response) => {
  const selectedTitle = String(request.body.title || '').trim()

  try {
    const feed = await getFeed()
    const posts = selectedTitle
      ? feed.posts.filter((post) => post.title.toLocaleLowerCase().includes(selectedTitle.toLocaleLowerCase()))
      : []

    renderSearch(response, {
      categories: getCategories(feed.posts),
      posts,
      selectedTitle,
      errorMessage: selectedTitle ? '' : 'Enter a title or a few words from it.',
      emptyMessage: selectedTitle ? 'No facts match that title.' : '',
    })
  } catch (error) {
    console.error('Unable to search RSS titles:', error.message)
    response.status(502)
    renderSearch(response, {
      selectedTitle,
      errorMessage: 'The fact feed is temporarily unavailable. Please try again shortly.',
      emptyMessage: '',
    })
  }
})

app.post('/search/category', async (request, response) => {
  const selectedCategory = String(request.body.category || '').trim()

  try {
    const feed = await getFeed()
    const posts = selectedCategory
      ? feed.posts.filter((post) => post.categories.some(
        (category) => category.toLocaleLowerCase() === selectedCategory.toLocaleLowerCase(),
      ))
      : []

    renderSearch(response, {
      categories: getCategories(feed.posts),
      posts,
      selectedCategory,
      errorMessage: selectedCategory ? '' : 'Choose a category to search.',
      emptyMessage: selectedCategory ? 'No facts are listed in that category.' : '',
    })
  } catch (error) {
    console.error('Unable to search RSS categories:', error.message)
    response.status(502)
    renderSearch(response, {
      selectedCategory,
      errorMessage: 'The fact feed is temporarily unavailable. Please try again shortly.',
      emptyMessage: '',
    })
  }
})

app.use((_request, response) => {
  response.status(404).send('Page not found.')
})

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Facts RSS reader listening at http://localhost:${port}`)
  })
}

module.exports = app
