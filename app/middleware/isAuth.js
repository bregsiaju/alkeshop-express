const isAuth = (req, res, next) => {
  // console.log(req.session.user)
  const session = req.session.user
  if (!session) {
    // console.log(session)
    req.flash('error_msg', 'Sesi Anda berakhir. Silakan login kembali');
    res.redirect('/');
  } else {
    next();
  }
};

module.exports = isAuth;