const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const { User } = require('../../models')
const ApiError = require('../../utils/ApiError')
dotenv.config();

// login
const login = async (req, res) => {
  try {
    const { username = '', password = '', } = req.body
    const user = await User.findOne({ where: { username } })
    // console.log(user)
    // validasi
    if (!user) throw new ApiError(400, 'Username tidak terdaftar.')
    if (!bcrypt.compareSync(password, user.password)) {
      throw new ApiError(400, 'Password salah.')
    }

    if (bcrypt.compareSync(password, user.password)) {
      // generate token utk user yg success login
      const token = jwt.sign(
        {
          id: user.id,
        },
        process.env.SECRET_KEY
      );
      res.status(200).json({
        message: 'Login berhasil.',
        token,
        user: user.id,
      });
    }
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
}

// Daftar Akun
const register = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
    } = req.body;

    const checkUsername = await User.findOne({ where: { username } });
    const checkEmail = await User.findOne({ where: { email } })

    // validasi data form
    if (!password) throw new ApiError(400, 'Password tidak boleh kosong.');
    if (!username) throw new ApiError(400, 'Username tidak boleh kosong.');
    if (checkUsername) throw new ApiError(400, 'Username telah digunakan.');
    if (checkEmail) throw new ApiError(400, 'Email telah terdaftar.');

    // hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // buat user baru
    const newUser = await User.create({
      ...req.body,
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      {
        id: newUser.id,
      },
      process.env.SECRET_KEY
    );
    res.status(200).json({
      message: 'Registrasi akun berhasil.',
      token,
      user: newUser.id,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
};

// mendapatkan data user yang sedang login
const getProfile = async (req, res) => {
  const userId = req.user.id
  try {
    const getUser = await User.findByPk(userId)
    res.status(200).json({
      data: getUser
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message,
    })
  }
}

module.exports = { login, register, getProfile }