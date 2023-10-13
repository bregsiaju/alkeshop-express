'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Category, { foreignKey: 'productCategory' })
      this.hasMany(models.OrderDetail, { foreignKey: 'productId' })
      this.hasMany(models.Feedback, { foreignKey: 'productId' })
    }
  }
  Product.init({
    productName: DataTypes.STRING,
    productImage: DataTypes.STRING,
    price: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    productCategory: DataTypes.INTEGER,
    stock: DataTypes.INTEGER,
    status: DataTypes.ENUM('active', 'archived')
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};