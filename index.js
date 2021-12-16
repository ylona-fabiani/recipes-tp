const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000 // this is very important

const axios = require('axios')

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(PORT, function () {
  console.log('Example app listening on port ' + PORT)
})