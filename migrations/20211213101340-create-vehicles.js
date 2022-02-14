'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('vehicles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      number: {
        type: Sequelize.TEXT
      },
      type: {
        type: Sequelize.INTEGER
      },
      model: {
        type: Sequelize.TEXT
      },
      startCounter: {
        type: Sequelize.INTEGER
      },
      endCounter: {
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.TEXT
      },
      serviceType: {
        type: Sequelize.INTEGER
      },
      rentCost: {
        type: Sequelize.INTEGER
      },
      startDate: {
        type: Sequelize.DATEONLY
      },
      endDate: {
        type: Sequelize.DATEONLY
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
    await queryInterface.dropTable('vehicles');
  }
};