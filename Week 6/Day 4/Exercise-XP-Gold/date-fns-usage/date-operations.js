const { addDays, format } = require('date-fns')

function displayDateOperations() {
  const currentDate = new Date()
  const dateInFiveDays = addDays(currentDate, 5)
  const formattedDate = format(dateInFiveDays, 'MMMM d, yyyy h:mm a')

  console.log(`Current date: ${format(currentDate, 'MMMM d, yyyy h:mm a')}`)
  console.log(`In five days: ${formattedDate}`)

  return formattedDate
}

module.exports = displayDateOperations