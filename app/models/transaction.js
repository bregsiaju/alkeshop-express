'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'UserId' })
      this.belongsTo(models.Payment, { foreignKey: 'paymentMethod' })
      this.hasMany(models.OrderDetail, { foreignKey: 'transactionId' })
    }
  }
  Transaction.init({
    transNo: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    paymentMethod: DataTypes.INTEGER,
    totalPrice: DataTypes.INTEGER,
    totalItems: DataTypes.INTEGER,
    statusOrder: DataTypes.ENUM('Menunggu Pembayaran', 'Diproses', 'Dikirim', 'Selesai', 'Dibatalkan'),
    recipient: DataTypes.STRING,
    address: DataTypes.TEXT,
    zipCode: DataTypes.STRING,
    city: DataTypes.STRING,
    country: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};