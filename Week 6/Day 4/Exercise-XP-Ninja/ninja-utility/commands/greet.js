const chalk = require('chalk')

function greet(name) {
  console.log(chalk.cyan.bold(`Hello, ${name}! Welcome to the Ninja Utility.`))
}

module.exports = greet