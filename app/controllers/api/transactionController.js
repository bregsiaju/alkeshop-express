const fs = require('fs');
const sendMail = require('../../../lib/nodemailer');
const generateInvoice = require('../../../lib/pdfkit');
const { Transaction, Product, Payment, OrderDetail, User } = require('../../models')
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
    const trans = await Transaction.findOne({ where: { id } })
    if (!trans) throw new ApiError(404, `Transaksi dengan id ${id} tidak ditemukan`)

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

const sendInvoice = async (req, res) => {
  const userId = req.user.id
  const { transId } = req.params
  try {
    const trans = await Transaction.findOne({ where: { id: transId } })
    if (!trans) throw new ApiError(404, `Transaksi dengan id ${transId} tidak ditemukan`)

    const getUser = await User.findOne({ where: { id: userId } })
    const userEmail = getUser.email
    console.log(userEmail)

    const getProducts = await OrderDetail.findAll({
      where: { transactionId: transId },
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
    // generate pdf
    const generatedPDF = generateInvoice(getProducts, getUser, trans)
    console.log(generatedPDF)

    // buat penyimpanan file sementara
    if (!fs.existsSync('temp_invoice.pdf')) {
      fs.mkdirSync('temp_invoice.pdf');
    }
    const tempFilePath = 'temp_invoice.pdf'
    generatedPDF.pipe(fs.createWriteStream(tempFilePath))
    generatedPDF.end()

    // kirim melalui email
    const email = {
      EMAIL: userEmail,
      subject: 'Invoice Pembelian <Alkeshop>',
      text: 'Terlampir adalah invoice transaksi pembelian Anda.',
      attachments: [
        {
          filename: 'invoice.pdf',
          content: fs.readFileSync(tempFilePath, { encoding: 'base64' }), // Gunakan PDF yang dihasilkan dari generateInvoice()
          encoding: 'base64'
        }
      ]
    }
    sendMail(email)

    // Setelah email terkirim, hapus file sementara PDF
    fs.unlink(tempFilePath, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('File PDF sementara dihapus.');
    });

    res.status(200).json({
      message: 'Selamat, pembelian siap diproses!',
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message,
    })
  }
}

module.exports = {
  addTransaction,
  getAllTransaction,
  getDetailTrans,
  updateTrans,
  deleteTrans,
  cancelOrder,
  sendInvoice
}