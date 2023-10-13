const express = require('express')
const session = require('express-session');
const flash = require('connect-flash');
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

// setup session
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000 },
}));

// alert message
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.use(cors())
app.use(routes)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
