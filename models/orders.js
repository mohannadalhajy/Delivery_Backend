'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.orders.belongsTo(models.clients, {foreignKey: 'clientId', targetKey: 'id'});
      models.orders.belongsTo(models.drivers, {foreignKey: 'driverId', targetKey: 'id'});
      models.orders.belongsTo(models.customers, {foreignKey: 'customerId', targetKey: 'id'});
      models.orders.hasMany(models.orders_notifications, {foreignKey: 'orderId', targetKey: 'id'})
    }
  };
  orders.init({
    clientId: DataTypes.INTEGER,
    driverId: DataTypes.INTEGER,
    customerId: DataTypes.INTEGER,
    points: DataTypes.DOUBLE,
    emirate: DataTypes.INTEGER,
    addressEnglish: DataTypes.TEXT,
    addressArabic: DataTypes.TEXT,
    amount: DataTypes.DOUBLE,
    amountReceived: DataTypes.DOUBLE,
    notes: DataTypes.TEXT,
    status: DataTypes.INTEGER,
    transportType: DataTypes.INTEGER,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    cancelDate: DataTypes.DATE,
    failedDate: DataTypes.DATE,
    failedReason: DataTypes.TEXT,
    location: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'orders',
  });
  return orders;
};