'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [{
      fullName: 'Bregsi',
      username: 'admin',
      email: 'bregsia@gmail.com',
      password: bcrypt.hashSync('admin456', 10),
      phone: '085784934926',
      birthDate: '2002-03-17',
      gender: 'Wanita',
      address: 'rumah kos',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
