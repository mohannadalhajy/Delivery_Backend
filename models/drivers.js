'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class drivers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.drivers.hasMany(models.orders, {foreignKey: 'driverId', targetKey: 'id'})
      models.drivers.hasMany(models.orders_notifications, {foreignKey: 'driverId', targetKey: 'id'})
      models.drivers.hasMany(models.drivers_statuses, {foreignKey: 'driverId', targetKey: 'id'})
      models.drivers.hasMany(models.drivers_vehicles, {foreignKey: 'driverId', targetKey: 'id'})
    
    }
  };
  drivers.init({
    civilId: DataTypes.TEXT,
    phone: DataTypes.TEXT,
    firstName: DataTypes.TEXT,
    middleName: DataTypes.TEXT,
    lastName: DataTypes.TEXT,
    nickName: DataTypes.TEXT,
    userName: DataTypes.TEXT,
    password: DataTypes.TEXT,
    status: DataTypes.INTEGER,
    address: DataTypes.TEXT,
    birthdate: DataTypes.DATE,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    visaType: DataTypes.INTEGER,
    visaExpiryDate: DataTypes.DATE,
    notes: DataTypes.TEXT,
    shiftType: DataTypes.INTEGER,
    workHours: DataTypes.INTEGER,
    transportType: DataTypes.INTEGER,
    experienceYears: DataTypes.INTEGER,
    salary: DataTypes.INTEGER,
    image: DataTypes.TEXT,
    firebaseToken: DataTypes.TEXT,
    latitude: DataTypes.DOUBLE,
    longitude: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'drivers',
  });
  return drivers;
};