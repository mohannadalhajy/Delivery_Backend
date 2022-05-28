'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class drivers_accounts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.drivers_accounts.belongsTo(models.drivers, {foreignKey: 'driverId', targetKey: 'id'});
    }
  };
  drivers_accounts.init({
    driverId: DataTypes.INTEGER,
    amount: DataTypes.DOUBLE,
    date: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'drivers_accounts',
  });
  return drivers_accounts;
};