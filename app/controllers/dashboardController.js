const Axios = require('./axiosInterceptor')
const { User } = require('../models')

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
    // console.log(req.session)
    res.render('dashboard', {
      user: user.fullName,
      pathname: '/dashboard',
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