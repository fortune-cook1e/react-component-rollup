const express = require('express')
const app = express()

const port = 8888

app.use(express.static('dist'))
app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})
