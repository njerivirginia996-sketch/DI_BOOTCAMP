const fs = require('node:fs')
const path = require('node:path')

function displayFileInfo() {
  const filePath = path.join(__dirname, 'data', 'example.txt')
  const exists = fs.existsSync(filePath)

  console.log(`File exists: ${exists}`)

  if (!exists) {
    return null
  }

  const fileStats = fs.statSync(filePath)
  const fileInfo = {
    size: fileStats.size,
    createdAt: fileStats.birthtime,
  }

  console.log(`File size: ${fileInfo.size} bytes`)
  console.log(`Created at: ${fileInfo.createdAt.toLocaleString()}`)

  return fileInfo
}

module.exports = displayFileInfo