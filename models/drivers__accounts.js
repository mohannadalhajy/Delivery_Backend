'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class drivers__accounts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  drivers__accounts.init({
    driverId: DataTypes.INTEGER,
    amount: DataTypes.DOUBLE,
    date: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'drivers__accounts',
  });
  return drivers__accounts;
};