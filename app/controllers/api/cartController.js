const { Op } = require('sequelize')
const { Cart, CartDetail, Product } = require('../../models')
const ApiError = require('../../utils/ApiError')

const addCart = async (req, res) => {
  const userId = req.user.id
  const { productId } = req.body
  let { quantity = 1 } = req.body
  try {
    const checkCart = await Cart.findOne({ where: { userId } })
    const cartId = checkCart?.id || null
    // console.log(`adfda ${cartId}`)
    if (!checkCart) {
      var createCart = await Cart.create({ userId })
      // console.log(`buat cart ${createCart}`)
    }

    const productExist = await CartDetail.findOne({
      where: {
        [Op.and]: [{ productId }, { cartId }]
      }
    })

    if (productExist) {
      // console.log(`sudah adaa ${productExist}`)
      // console.log(productExist.quantity)
      await CartDetail.update({
        quantity: productExist.quantity + quantity
      }, {
        where: {
          [Op.and]: [{ productId }, { cartId }]
        }
      })
      res.status(200).json({
        message: 'Produk berhasil ditambahkan ke keranjang',
      })
    } else {
      const dataCart = await CartDetail.create({
        productId,
        cartId: cartId || createCart?.id,
        quantity
      })
      res.status(200).json({
        message: 'Produk berhasil ditambahkan ke keranjang',
        data: dataCart
      })
    }
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message,
    })
  }
}

const getCart = async (req, res) => {
  const userId = req.user.id
  // console.log(userId)
  try {
    const cart = await Cart.findOne({ where: { userId } })
    // console.log(cart)
    if (!cart) {
      res.status(200).json({
        message: 'Keranjang masih kosong',
        data: []
      })
    } else {
      const cartId = cart.id
      const detailCart = await CartDetail.findAll({
        where: { cartId },
        include: [
          { model: Product }
        ]
      })
      res.status(200).json({
        data: detailCart
      })
    }
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message,
    })
  }
}

const updateDetailCart = async (req, res) => {
  const userId = req.user.id
  const { productId, quantity } = req.body
  try {
    const checkCart = await Cart.findOne({ where: { userId } })
    const cartId = checkCart?.id
    // console.log(cartId)
    const productOnCart = await CartDetail.findOne({
      where: {
        [Op.and]: [{ productId }, { cartId }]
      }
    })
    if (!productOnCart) throw new ApiError(404, `Produk tidak ditemukan dalam keranjang`)

    await CartDetail.update({
      quantity
    }, {
      where: {
        [Op.and]: [{ productId }, { cartId }]
      }
    })
    res.status(200).json({
      message: 'Keranjang berhasil diupdate',
    })
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message,
    })
  }
}

const removeProductOnCart = async (req, res) => {
  const userId = req.user.id
  const { productId } = req.params
  try {
    const checkCart = await Cart.findOne({ where: { userId } })
    const cartId = checkCart?.id

    const productOnCart = await CartDetail.findOne({
      where: {
        [Op.and]: [{ productId }, { cartId }]
      }
    })
    if (!productOnCart) throw new ApiError(404, `Produk tidak ditemukan dalam keranjang`)

    await CartDetail.destroy({
      where: {
        [Op.and]: [{ productId }, { cartId }]
      }
    })
    res.status(200).json({
      message: 'Produk berhasil dihapus dari keranjang',
    })
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message,
    })
  }
}

module.exports = { addCart, getCart, updateDetailCart, removeProductOnCart }