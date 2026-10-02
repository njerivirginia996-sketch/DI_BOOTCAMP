const fs = require('node:fs')
const path = require('node:path')

function readFile(file) {
  const filePath = path.resolve(process.cwd(), file)
  const contents = fs.readFileSync(filePath, 'utf8')
  console.log(contents)
}

module.exports = readFile