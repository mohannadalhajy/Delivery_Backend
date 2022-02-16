'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('drivers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      civilId: {
        type: Sequelize.TEXT
      },
      phone: {
        type: Sequelize.TEXT
      },
      firstName: {
        type: Sequelize.TEXT
      },
      middleName: {
        type: Sequelize.TEXT
      },
      lastName: {
        type: Sequelize.TEXT
      },
      nickName: {
        type: Sequelize.TEXT
      },
      userName: {
        type: Sequelize.TEXT
      },
      latitude: {
        type: Sequelize.DOUBLE
      },
      longitude: {
        type: Sequelize.DOUBLE
      },
      password: {
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.INTEGER
      },
      address: {
        type: Sequelize.TEXT
      },
      birthdate: {
        type: Sequelize.DATE
      },
      startDate: {
        type: Sequelize.DATE
      },
      endDate: {
        type: Sequelize.DATE
      },
      visaType: {
        type: Sequelize.INTEGER
      },
      visaExpiryDate: {
        type: Sequelize.DATE
      },
      notes: {
        type: Sequelize.TEXT
      },
      shiftType: {
        type: Sequelize.INTEGER
      },
      workHours: {
        type: Sequelize.INTEGER
      },
      transportType: {
        type: Sequelize.INTEGER
      },
      experienceYears: {
        type: Sequelize.INTEGER
      },
      salary: {
        type: Sequelize.INTEGER
      },
      image: {
        type: Sequelize.TEXT
      },
      firebaseToken: {
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
    await queryInterface.dropTable('drivers');
  }
};