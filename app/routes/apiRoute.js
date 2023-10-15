const route = require('express').Router()
const upload = require('../middleware/uploader')

const isAuth = require('../middleware/isAuth')
const isAdmin = require('../middleware/isAdmin')
const { login, register } = require('../controllers/api/authController')
const { getCategories, getCategoryById, addCategory, updateCategory, deleteCategory } = require('../controllers/api/categoryController')
const { getProducts, getProductById, addProduct, updateProduct, deleteProduct, searchProduct } = require('../controllers/api/productController')
const { getCart, addCart, updateDetailCart, removeProductOnCart } = require('../controllers/api/cartController')
const { addTransaction, getAllTransaction, getDetailTrans, updateTrans, deleteTrans, cancelOrder, sendInvoice } = require('../controllers/api/transactionController')

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
route.get('/api/search-product', searchProduct)

// CART ENDPOINTS
route.get('/api/carts', isAuth, getCart)
route.post('/api/carts', isAuth, addCart)
route.put('/api/carts', isAuth, updateDetailCart)
route.delete('/api/carts/:productId', isAuth, removeProductOnCart)

// TRANSACTION/ORDER PRODUCT ENDPOINTS
route.post('/api/checkout', isAuth, addTransaction)
route.get('/api/transactions', isAuth, getAllTransaction) // berdasarkan user
route.get('/api/transactions/:id', isAuth, getDetailTrans)
route.put('/api/update-status/:id', isAuth, updateTrans)
route.put('/api/cancel-order/:id', isAuth, cancelOrder)
route.delete('/api/transactions/:id', isAuth, isAdmin, deleteTrans)
route.get('/api/send-invoice/:transId', isAuth, sendInvoice)

module.exports = route