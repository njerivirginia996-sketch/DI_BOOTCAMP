const { createInterface } = require('node:readline/promises')
const { stdin, stdout } = require('node:process')
const displayWeather = require('./weather')

async function startDashboard() {
  const prompt = createInterface({ input: stdin, output: stdout })

  try {
    const city = (await prompt.question('Enter a city: ')).trim()
    if (!city) {
      throw new Error('City name cannot be empty.')
    }

    await displayWeather(city)
  } finally {
    prompt.close()
  }
}

module.exports = startDashboard