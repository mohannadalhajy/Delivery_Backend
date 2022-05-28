'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class drivers_statuses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.drivers_statuses.belongsTo(models.drivers, {foreignKey: 'driverId', targetKey: 'id'});
    }
  };
  drivers_statuses.init({
    driverId: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'drivers_statuses',
  });
  return drivers_statuses;
};