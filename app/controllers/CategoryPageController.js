const Axios = require('./axiosInterceptor')
const { User } = require('../models')

const getCategory = async (req, res) => {
  try {
    const id = req.session.user
    const user = await User.findOne({ where: { id } })
    
    const categories = await Axios.get('/categories')
    // console.log(categories.data.data);

    res.render('category', {
      user: user.fullName,
      pathname: '/category',
      data: categories.data.data
    });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { getCategory }