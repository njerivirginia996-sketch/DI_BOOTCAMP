const axios = require('axios')

async function fetchPosts() {
  const response = await axios.get('https://jsonplaceholder.typicode.com/posts', {
    params: { _limit: 5 },
    timeout: 10000,
  })

  for (const post of response.data) {
    console.log(post.title)
  }
}

module.exports = fetchPosts