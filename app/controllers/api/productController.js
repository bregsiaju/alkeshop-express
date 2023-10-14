const { Product, Category } = require('../../models')
const imagekit = require('../../../lib/imageKit')
const ApiError = require('../../utils/ApiError')

const addProduct = async (req, res) => {
  const { file } = req
  const { price, productCategory, stock } = req.body
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
    // console.log(img)

    const newProduct = await Product.create({
      ...req.body,
      productImage: img.url,
      price: parseInt(price),
      productCategory: parseInt(productCategory),
      stock: parseInt(stock),
    })

    res.status(200).json({
      message: 'Produk baru berhasil ditambahkan',
      data: newProduct
    })
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message,
    })
  }
}

const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Category }
      ]
    })
    res.status(200).json({
      data: products
    })
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message,
    })
  }
}

const getProductById = async (req, res) => {
  try {
    const { id } = req.params
    const product = await Product.findOne({
      where: { id },
      include: [
        { model: Category }
      ]
    })
    if (!product) throw new ApiError(404, `Category dengan id ${id} tidak ditemukan`)

    res.status(200).json({
      data: product,
    })
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message,
    })
  }
}

const updateProduct = async (req, res) => {
  const { id } = req.params
  const { file } = req
  const { price, productCategory, stock } = req.body
  try {
    const product = await Product.findOne({ where: { id } })
    if (!product) throw new ApiError(404, `Category dengan id ${id} tidak ditemukan`)

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
    // console.log(img)
    // console.log(req.body)

    await Product.update({
      ...req.body,
      productImage: img.url,
      price: parseInt(price),
      productCategory: parseInt(productCategory),
      stock: parseInt(stock),
    }, {
      where: { id }
    })
    res.status(200).json({
      message: 'Produk berhasil diperbarui',
    })
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message,
    })
  }
}

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params

    const product = await Product.findOne({ where: { id } })
    if (!product) throw new ApiError(404, `Category dengan id ${id} tidak ditemukan`)

    await Product.destroy({
      where: { id }
    })
    res.status(200).json({
      message: 'Produk berhasil dihapus',
    })
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message,
    })
  }
}

module.exports = { addProduct, getProducts, getProductById, updateProduct, deleteProduct }