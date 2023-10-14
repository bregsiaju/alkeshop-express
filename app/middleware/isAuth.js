const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const { User } = require('../models')
dotenv.config()

const isAuth = (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization
    // console.log(bearerToken)
    // const token = bearerToken.split('Bearer')[1]
    if (!bearerToken) {
      return res.status(401).json({
        status: 'failed',
        message: 'Required authorization',
      })
    }
    const payload = jwt.verify(bearerToken, process.env.SECRET_KEY)
    User.findByPk(payload.id).then((instance) => {
      req.user = instance
      next()
    })
  } catch {
    res.status(401).json({
      status: 'failed',
      message: 'Invalid token',
    })
  }
}
module.exports = isAuth
