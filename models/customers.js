'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class customers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.customers.belongsTo(models.clients, {foreignKey: 'clientId', targetKey: 'id'});
      models.customers.hasMany(models.orders, {foreignKey: 'customerId', targetKey: 'id'})
    }
  };
  customers.init({
    clientId: DataTypes.INTEGER,
    emirate: DataTypes.INTEGER,
    addressArabic: DataTypes.TEXT,
    addressEnglish: DataTypes.TEXT,
    nameEnglish: DataTypes.TEXT,
    nameArabic: DataTypes.TEXT,
    phone: DataTypes.TEXT,
    latitude: DataTypes.DOUBLE,
    longitude: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'customers',
  });
  return customers;
};