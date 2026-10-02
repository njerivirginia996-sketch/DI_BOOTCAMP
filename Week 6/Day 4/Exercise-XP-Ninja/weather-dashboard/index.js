const startDashboard = require('./dashboard')

startDashboard().catch((error) => {
  console.error(`Unable to get weather: ${error.message}`)
  process.exitCode = 1
})