const route = require('express').Router()
const apiRoute = require('./apiRoute')
const pagesRoute = require('./pagesRoute')

route.use(apiRoute)
route.use(pagesRoute)

module.exports = route