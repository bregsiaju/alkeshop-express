const Axios = require('./axiosInterceptor')
const { User, Transaction } = require('../models')
const helper = require('../utils/helper')
const { Op } = require('sequelize')

const login = async (req, res) => {
  try {
    const { username = '', password = '' } = req.body

    const login = await Axios.post('/login', { username, password })
    // console.log(login)

    if (login.status === 200) {
      // generate session
      req.session.regenerate(function (err) {
        if (err) next(err)

        // store user information in session, typically a user id
        req.session.user = login.data.user
        req.session.token = login.data.token
        req.session.save(function (err) {
          if (err) return next(err)
          req.flash('success_msg', 'Login berhasil')
          res.status(200).redirect('/dashboard')
        })
      })
    }
  } catch (error) {
    req.flash('error_msg', 'Username atau password salah');
    // console.log(error)
    res.redirect('/');
  }
}

const loadDashboard = async (req, res) => {
  try {
    const id = req.session.user
    const user = await User.findOne({ where: { id } })
    const transactions = await Transaction.findAll({
      where: {
        [Op.not]: [{ statusOrder: ['Dibatalkan'] }]
      },
      limit: 10
    })

    // Mendapatkan total item yang terjual hari ini
    const TODAY_START = new Date().setHours(0, 0, 0, 0);
    const NOW = new Date();

    const todaySales = await Transaction.sum('totalItems', {
      where: {
        [Op.and]: [
          {
            createdAt: {
              [Op.gt]: TODAY_START,
              [Op.lt]: NOW
            }
          },
          {
            [Op.not]: [{ statusOrder: ['Dibatalkan'] }]
          }
        ]
      }
    })

    // mendapatkan total penjualan keseluruhan
    const totalSales = await Transaction.sum('totalItems', {
      where: {
        [Op.not]: [{ statusOrder: ['Dibatalkan'] }]
      }
    })

    // mendapatkan total pendapatan hari ini
    const todayRevenue = await Transaction.sum('totalPrice', {
      where: {
        [Op.and]: [
          {
            createdAt: {
              [Op.gt]: TODAY_START,
              [Op.lt]: NOW
            }
          },
          {
            [Op.not]: [{ statusOrder: ['Dibatalkan'] }]
          }
        ]
      }
    })

    // mendapatkan total pendapatan keseluruhan
    const totalRevenue = await Transaction.sum('totalPrice', {
      where: {
        [Op.not]: [{ statusOrder: ['Dibatalkan'] }]
      }
    })

    res.render('dashboard', {
      user: user.fullName,
      pathname: '/dashboard',
      data: {
        transactions,
        todaySales,
        totalSales,
        todayRevenue,
        totalRevenue
      },
      helper
    });
  } catch (error) {
    console.log(error.message);
  }
};

const logout = (req, res) => {
  req.flash('success_msg', 'Logout berhasil');
  req.session.user = null
  req.session.save(function (err) {
    if (err) next(err)

    req.session.regenerate(function (err) {
      if (err) next(err)
      res.redirect('/')
    })
  })
}

module.exports = { login, loadDashboard, logout }