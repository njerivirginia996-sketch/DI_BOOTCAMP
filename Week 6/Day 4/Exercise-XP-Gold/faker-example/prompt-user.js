const { createInterface } = require('node:readline/promises')
const { stdin, stdout } = require('node:process')
const { users, addUser } = require('./users')

async function promptForUser() {
  const prompt = createInterface({ input: stdin, output: stdout })

  try {
    const name = await prompt.question('Full name: ')
    const addressStreet = await prompt.question('Street address: ')
    const country = await prompt.question('Country: ')

    addUser(name.trim(), addressStreet.trim(), country.trim())
    console.log(users)
  } finally {
    prompt.close()
  }
}

promptForUser().catch((error) => {
  console.error(`Unable to add user: ${error.message}`)
  process.exitCode = 1
})