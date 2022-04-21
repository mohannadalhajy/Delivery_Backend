'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      clientId: {
        type: Sequelize.INTEGER
      },
      driverId: {
        type: Sequelize.INTEGER
      },
      customerId: {
        type: Sequelize.INTEGER
      },
      points: {
        type: Sequelize.DOUBLE
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
      notes: {
        type: Sequelize.TEXT
      },
      amount: {
        type: Sequelize.DOUBLE
      },
      amountReceived: {
        type: Sequelize.DOUBLE
      },
      distance: {
        type: Sequelize.DOUBLE
      },
      status: {
        type: Sequelize.INTEGER
      },
      transportType: {
        type: Sequelize.INTEGER
      },
      startDate: {
        type: Sequelize.DATE
      },
      endDate: {
        type: Sequelize.DATE
      },
      failedReason: {
        type: Sequelize.TEXT
      },
      location: {
        type: Sequelize.TEXT
      },
      editedReason: {
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
    await queryInterface.dropTable('orders');
  }
};