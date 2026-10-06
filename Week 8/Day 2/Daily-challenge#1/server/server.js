import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const app = express()
const port = Number(process.env.PORT) || 5194
const clientBuild = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../client/dist')

app.use(express.json())

app.get('/api/hello', (request, response) => {
  response.send('Hello From Express')
})

app.post('/api/world', (request, response) => {
  console.log(request.body)
  const value = typeof request.body?.value === 'string' ? request.body.value : ''
  response.json({
    message: `I received your POST request. This is what you sent me: ${value}`,
  })
})

app.use(express.static(clientBuild))

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`)
})