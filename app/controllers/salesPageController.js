const Axios = require('./axiosInterceptor')
const { User, Transaction } = require('../models')
const helper = require('../utils/helper')

const getAllSales = async (req, res) => {
  try {
    const id = req.session.user
    const user = await User.findOne({ where: { id } })

    const transactions = await Transaction.findAll()

    res.render('sales', {
      user: user.fullName,
      pathname: '/sales',
      data: transactions,
      helper
    });
  } catch (error) {
    console.log(error.message);
  }
};

const getDetailTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.session.user
    const token = req.session.token

    const user = await User.findOne({ where: { id: userId } })

    const selected = await Axios.get(`/transactions/${id}`, {
      headers: {
        authorization: token
      }
    });

    res.render('sales/detail', {
      data: selected.data.data,
      user: user.fullName,
      pathname: '/sales',
      helper
    });
  } catch (error) {
    console.log(error.message);
  }
};

const confirmShipping = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body

    await Transaction.update({
      statusOrder: status
    }, {
      where: { id }
    })

    req.flash('success_msg', 'Status pesanan berhasil diperbarui');
    res.redirect('/sales');
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { getAllSales, getDetailTransaction, confirmShipping }