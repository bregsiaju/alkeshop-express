const route = require('express').Router()
const upload = require('../middleware/uploader')

const isAuth = require('../middleware/isAuth')
const isAdmin = require('../middleware/isAdmin')
const { login, register } = require('../controllers/api/authController')
const { getCategories, getCategoryById, addCategory, updateCategory, deleteCategory } = require('../controllers/api/categoryController')
const { getProducts, getProductById, addProduct, updateProduct, deleteProduct } = require('../controllers/api/productController')

// AUTH ENDPOINTS
route.post('/api/login', login)
route.post('/api/register', register)

// CATEGORY PRODUCT ENDPOINTS
route.get('/api/categories', getCategories)
route.get('/api/categories/:id', getCategoryById)
route.post('/api/categories', isAuth, isAdmin, addCategory)
route.put('/api/categories/:id', isAuth, isAdmin, updateCategory)
route.delete('/api/categories/:id', isAuth, isAdmin, deleteCategory)

// PRODUCT ENDPOINTS
route.get('/api/products', getProducts)
route.get('/api/products/:id', getProductById)
route.post('/api/products', isAuth, isAdmin, upload.single('image'), addProduct)
route.put('/api/products/:id', isAuth, isAdmin, upload.single('image'), updateProduct)
route.delete('/api/products/:id', isAuth, isAdmin, deleteProduct)

module.exports = route