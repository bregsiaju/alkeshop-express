'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Feedback, { foreignKey: 'userId' })
      this.hasMany(models.Transaction, { foreignKey: 'userId' })
    }
  }
  User.init({
    fullName: DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phone: DataTypes.STRING,
    birthDate: DataTypes.DATEONLY,
    gender: DataTypes.ENUM('Wanita', 'Pria'),
    address: DataTypes.TEXT,
    role: DataTypes.ENUM('admin', 'customer')
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};