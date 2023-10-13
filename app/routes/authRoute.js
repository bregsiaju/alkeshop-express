const route = require('express').Router()
const { login, register, } = require('../controllers/api/authController')

route.post('/api/login', login)
route.post('/api/register', register)

module.exports = route