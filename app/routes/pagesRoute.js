const route = require('express').Router();

// GENERAL ROUTE
route.get('/', (req, res) => {
  res.render('index');
});

module.exports = route