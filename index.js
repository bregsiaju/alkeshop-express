const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const dotenv = require('dotenv')
const routes = require('./app/routes')

const app = express()

dotenv.config()

const PORT = process.env.PORT || 8000

// EJS
app.use(express.static('public'))
app.set('view engine', 'ejs')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// app.use(morgan('common'))

app.use(cors())
app.use(routes)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
