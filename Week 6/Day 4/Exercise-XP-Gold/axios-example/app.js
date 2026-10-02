const fetchAndDisplayTitles = require('./fetch-data')

fetchAndDisplayTitles().catch((error) => {
  console.error(`Unable to fetch posts: ${error.message}`)
  process.exitCode = 1
})