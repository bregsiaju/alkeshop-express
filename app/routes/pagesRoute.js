const route = require('express').Router()
const { login, logout, loadDashboard } = require('../controllers/dashboardController')
const isAuth = require('../middleware/isAuth')

// GENERAL ROUTE
route.get('/', (req, res) => {
  res.render('index')
})
route.post('/login', login)
route.get('/dashboard', isAuth, loadDashboard)
route.get('/logout', isAuth, logout)

// CATEGORY PRODUCT
route.get('/kategori', isAuth, (req, res) => {
  res.render('category', {
    user: 2
  })
})

module.exports = route