const route = require('express').Router()
const pagesRoute = require('./pagesRoute')

route.use(pagesRoute)

module.exports = route