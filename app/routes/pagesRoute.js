const route = require('express').Router()
const { getCategory } = require('../controllers/CategoryPageController')
const { login, logout, loadDashboard } = require('../controllers/dashboardController')
const { getAllProduct, addProductForm, uploadProduct, deleteProduct } = require('../controllers/productPageController')
const { getAllSales, getDetailTransaction, confirmShipping } = require('../controllers/salesPageController')
const isLoggedin = require('../middleware/isLoggedin')
const upload = require('../middleware/uploader')

// MAIN ROUTE
route.get('/', (req, res) => {
  res.render('index')
})

// AUTH ROUTE
route.post('/login', login)
route.get('/dashboard', isLoggedin, loadDashboard)
route.get('/logout', isLoggedin, logout)

// CATEGORY PRODUCT
route.get('/category', isLoggedin, getCategory)
route.get('/products', isLoggedin, getAllProduct)
route.get('/products/add', isLoggedin, addProductForm)
route.post('/upload-product', isLoggedin, upload.single('image'), uploadProduct)
route.get('/delete-product/:id', isLoggedin, deleteProduct)

// SALES / TRANSACTION
route.get('/sales', isLoggedin, getAllSales)
route.get('/sales/detail/:id', isLoggedin, getDetailTransaction)
route.post('/confirm-shipping/:id', isLoggedin, confirmShipping)

module.exports = route