const axios = require('axios')

async function fetchAndDisplayTitles() {
  const response = await axios.get('https://jsonplaceholder.typicode.com/posts')

  for (const post of response.data) {
    console.log(post.title)
  }

  return response.data
}

module.exports = fetchAndDisplayTitles