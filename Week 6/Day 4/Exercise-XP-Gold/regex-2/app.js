const { createInterface } = require('node:readline/promises')
const { stdin, stdout } = require('node:process')
const isValidFullName = require('./validate-name')

async function main() {
  const prompt = createInterface({ input: stdin, output: stdout })

  try {
    const fullName = await prompt.question('Enter your full name (First Last): ')
    console.log(isValidFullName(fullName) ? 'Valid name.' : 'Invalid name.')
  } finally {
    prompt.close()
  }
}

main().catch((error) => {
  console.error(`Unable to validate name: ${error.message}`)
  process.exitCode = 1
})