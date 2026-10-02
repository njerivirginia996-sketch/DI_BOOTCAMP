const { Command } = require('commander')
const greet = require('./commands/greet')
const fetchPosts = require('./commands/fetch')
const readFile = require('./commands/read')

const program = new Command()

program
  .name('ninja-utility')
  .description('A small command-line utility for greetings, posts, and files')
  .version('1.0.0')

program
  .command('greet')
  .description('Print a colorful greeting')
  .argument('[name]', 'name to greet', 'there')
  .action(greet)

program
  .command('fetch')
  .description('Fetch a few posts and print their titles')
  .action(async () => fetchPosts())

program
  .command('read')
  .description('Read and display a text file')
  .argument('<file>', 'path to a file')
  .action(readFile)

program.parseAsync(process.argv).catch((error) => {
  console.error(chalkError(error.message))
  process.exitCode = 1
})

function chalkError(message) {
  return `Error: ${message}`
}