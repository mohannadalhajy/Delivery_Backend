'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('clients', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      companyNameEnglish: {
        type: Sequelize.TEXT
      },
      companyNameArabic: {
        type: Sequelize.TEXT
      },
      userName: {
        type: Sequelize.TEXT
      },
      password: {
        type: Sequelize.TEXT
      },
      clientNameEnglish: {
        type: Sequelize.TEXT
      },
      clientNameArabic: {
        type: Sequelize.TEXT
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
      clientPhone: {
        type: Sequelize.TEXT
      },
      companyPhone: {
        type: Sequelize.TEXT
      },
      companyTypeEnglish: {
        type: Sequelize.TEXT
      },
      companyTypeArabic: {
        type: Sequelize.TEXT
      },
      isActive: {
        type: Sequelize.BOOLEAN
      },
      image: {
        type: Sequelize.TEXT
      },
      latitude: {
        type: Sequelize.DOUBLE
      },
      longitude: {
        type: Sequelize.DOUBLE
      },
      contractDate: {
        type: Sequelize.DATEONLY
      },
      serviceStartDate: {
        type: Sequelize.DATEONLY
      },
      serviceEndDate: {
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
    await queryInterface.dropTable('clients');
  }
};