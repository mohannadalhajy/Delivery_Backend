'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class clients extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.clients.hasMany(models.orders, {foreignKey: 'clientId', targetKey: 'id'})
      models.clients.hasMany(models.clients_charges, {foreignKey: 'clientId', targetKey: 'id'})
      models.clients.hasMany(models.customers, {foreignKey: 'clientId', targetKey: 'id'})
      
    }
  };
  clients.init({
    companyNameEnglish: DataTypes.TEXT,
    companyNameArabic: DataTypes.TEXT,
    userName: DataTypes.TEXT,
    password: DataTypes.TEXT,
    clientNameEnglish: DataTypes.TEXT,
    clientNameArabic: DataTypes.TEXT,
    emirate: DataTypes.INTEGER,
    addressArabic: DataTypes.TEXT,
    addressEnglish: DataTypes.TEXT,
    clientPhone: DataTypes.TEXT,
    companyPhone: DataTypes.TEXT,
    companyTypeEnglish: DataTypes.TEXT,
    companyTypeArabic: DataTypes.TEXT,
    isActive: DataTypes.BOOLEAN,
    image: DataTypes.TEXT,
    latitude: DataTypes.DOUBLE,
    longitude: DataTypes.DOUBLE,
    contractDate: DataTypes.DATEONLY,
    serviceStartDate: DataTypes.DATEONLY,
    serviceEndDate: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'clients',
  });
  return clients;
};