'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class clients_charges extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.clients_charges.belongsTo(models.clients, {foreignKey: 'clientId', targetKey: 'id'});
    }
  };
  clients_charges.init({
    amount: DataTypes.DOUBLE,
    points: DataTypes.DOUBLE,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'clients_charges',
  });
  return clients_charges;
};