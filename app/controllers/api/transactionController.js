const { Transaction, Product, Payment, OrderDetail } = require('../../models')
const ApiError = require('../../utils/ApiError')

const generateTransNo = () => {
  const randomThreeDigits = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');

  return `AST${randomThreeDigits}${currentDate}`;
}

const addTransaction = async (req, res) => {
  const userId = req.user.id
  try {
    const { paymentMethod, totalPrice, products } = req.body

    const getStatus = paymentMethod === 1 ? 'Diproses' : 'Menunggu Pembayaran'

    const transNo = generateTransNo()
    const newTransaction = await Transaction.create({
      userId,
      transNo,
      paymentMethod,
      totalPrice,
      statusOrder: getStatus
    })

    // input ke tabel detail order/transaksi
    products.map(async (product) => {
      await OrderDetail.create({
        transactionId: newTransaction.id,
        productId: product.id,
        quantity: product.quantity
      })
    })

    res.status(200).json({
      message: 'Transaksi baru berhasil ditambahkan',
      data: newTransaction
    })
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message,
    })
  }
}

const getAllTransaction = async (req, res) => {
  const userId = req.user.id
  try {
    const getTrans = await Transaction.findAll({ where: { userId } })
    res.status(200).json({
      data: getTrans
    })
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message,
    })
  }
}

const getDetailTrans = async (req, res) => {
  const { id } = req.params
  try {
    const detailTrans = await OrderDetail.findAll({
      where: { transactionId: id },
      include: [
        { model: Product },
        {
          model: Transaction,
          include: [{
            model: Payment
          }]
        }
      ]
    })
    if (detailTrans.length === 0) throw new ApiError(404, `Transaksi dengan id ${id} tidak ditemukan`)

    res.status(200).json({
      data: detailTrans,
    })
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message,
    })
  }
}

const updateTrans = async (req, res) => {
  const { id } = req.params
  const { status } = req.body
  try {
    const category = await Transaction.findOne({ where: { id } })
    if (!category) throw new ApiError(404, `Transaksi dengan id ${id} tidak ditemukan`)

    await Transaction.update({
      statusOrder: status
    }, {
      where: { id }
    })
    res.status(200).json({
      message: 'Status pesanan berhasil diubah',
    })
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message,
    })
  }
}

const deleteTrans = async (req, res) => {
  try {
    const { id } = req.params

    const category = await Transaction.findOne({ where: { id } })
    if (!category) throw new ApiError(404, `Transaksi dengan id ${id} tidak ditemukan`)

    await Transaction.destroy({
      where: { id }
    })
    res.status(200).json({
      message: 'Transaksi berhasil dihapus',
    })
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message,
    })
  }
}

const cancelOrder = async (req, res) => {
  const { id } = req.params
  try {
    const getTrans = await Transaction.findOne({ where: { id } })
    if (!getTrans) throw new ApiError(404, `Transaksi dengan id ${id} tidak ditemukan`)
    if (getTrans.statusOrder === 'Dikirim') {
      throw new ApiError(403, 'Pesanan yang sudah dikirim tidak bisa dibatalkan')
    }

    await Transaction.update({
      statusOrder: 'Dibatalkan'
    }, {
      where: { id }
    })
    res.status(200).json({
      message: 'Pesanan berhasil dibatalkan',
    })
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message,
    })
  }
}

module.exports = { addTransaction, getAllTransaction, getDetailTrans, updateTrans, deleteTrans, cancelOrder }