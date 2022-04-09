'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class clients_accounts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  clients_accounts.init({
    clientId: DataTypes.INTEGER,
    amount: DataTypes.DOUBLE,
    date: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'clients_accounts',
  });
  return clients_accounts;
};