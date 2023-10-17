const route = require('express').Router()
const { getCategory } = require('../controllers/CategoryPageController')
const { login, logout, loadDashboard } = require('../controllers/dashboardController')
const isLoggedin = require('../middleware/isLoggedin')

// GENERAL ROUTE
route.get('/', (req, res) => {
  res.render('index')
})
route.post('/login', login)
route.get('/dashboard', isLoggedin, loadDashboard)
route.get('/logout', isLoggedin, logout)

// CATEGORY PRODUCT
route.get('/category', isLoggedin, getCategory)

module.exports = route