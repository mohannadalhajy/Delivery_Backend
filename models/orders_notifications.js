'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class orders_notifications extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.orders_notifications.belongsTo(models.orders, {foreignKey: 'orderId', targetKey: 'id'});
      models.orders_notifications.belongsTo(models.drivers, {foreignKey: 'driverId', targetKey: 'id'});
    }
  };
  orders_notifications.init({
    driverId: DataTypes.INTEGER,
    orderId: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    acceptedDate: DataTypes.DATE,
    deliveredDate: DataTypes.DATE,
    receivedDate: DataTypes.DATE,
    rejectedReason: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'orders_notifications',
  });
  return orders_notifications;
};