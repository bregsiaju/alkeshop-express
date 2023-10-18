const Axios = require('./axiosInterceptor')
const { User, Transaction, Category, Product } = require('../models')
const helper = require('../utils/helper');
const imagekit = require('../../lib/imageKit');

const getAllProduct = async (req, res) => {
  try {
    const id = req.session.user
    const user = await User.findOne({ where: { id } })

    const products = await Axios.get('/products')

    res.render('products', {
      user: user.fullName,
      pathname: '/products',
      data: products.data.data,
      helper
    });
  } catch (error) {
    console.log(error.message);
  }
};

const addProductForm = async (req, res) => {
  try {
    const id = req.session.user
    const user = await User.findOne({ where: { id } })

    const categories = await Category.findAll()

    res.render('products/add', {
      user: user.fullName,
      pathname: '/products',
      categories
    });
  } catch (error) {
    console.log(error.message);
  }
}

const uploadProduct = async (req, res) => {
  const { file } = req
  const { price, productCategory, stock } = req.body
  console.log(req.body)
  console.log(req.file)
  try {
    // upload image
    if (file) {
      const validFormat =
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
      if (!validFormat) {
        res.status(400).json({
          status: 'failed',
          message: 'Wrong Image Format',
        })
      }
      const split = file.originalname.split('.')
      const ext = split[split.length - 1]

      // upload file ke imagekit
      var img = await imagekit.upload({
        file: file.buffer,
        fileName: `IMG-${Date.now()}.${ext}`,
      })
    }
    console.log(img)

    await Product.create({
      ...req.body,
      productImage: img.url,
      price: parseInt(price),
      productCategory: parseInt(productCategory),
      stock: parseInt(stock),
    })

    req.flash('success_msg', 'Produk berhasil di-upload');
    res.redirect('/products');
  } catch (error) {
    console.log(error)
    res.status(error.statusCode || 500).json({
      message: error.message,
    })
  }
}

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.session.token

    const response = await Axios.delete(`/products/${id}`, {
      headers: {
        authorization: token
      }
    });

    req.flash('success_msg', response.data.message);
    res.redirect('/products');
  } catch (error) {
    req.flash('error_msg', 'hapus gagal');
    res.redirect('/products');
  }
};

module.exports = { getAllProduct, addProductForm, uploadProduct, deleteProduct }