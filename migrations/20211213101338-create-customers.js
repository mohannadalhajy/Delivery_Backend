'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('customers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      clientId: {
        type: Sequelize.INTEGER
      },
      emirate: {
        type: Sequelize.INTEGER
      },
      addressArabic: {
        type: Sequelize.TEXT
      },
      addressEnglish: {
        type: Sequelize.TEXT
      },
      nameEnglish: {
        type: Sequelize.TEXT
      },
      nameArabic: {
        type: Sequelize.TEXT
      },
      phone: {
        type: Sequelize.TEXT
      },
      location: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('customers');
  }
};