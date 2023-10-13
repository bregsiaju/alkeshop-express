const route = require('express').Router()
const authRoute = require('./authRoute')
const pagesRoute = require('./pagesRoute')

route.use(authRoute)
route.use(pagesRoute)

module.exports = route