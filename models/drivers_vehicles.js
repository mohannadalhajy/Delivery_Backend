'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class drivers_vehicles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.drivers_vehicles.belongsTo(models.drivers, {foreignKey: 'driverId', targetKey: 'id'});
      models.drivers_vehicles.belongsTo(models.vehicles, {foreignKey: 'vehicleId', targetKey: 'id'});
      
    }
  };
  drivers_vehicles.init({
    driverId: DataTypes.INTEGER,
    vehicleId: DataTypes.INTEGER,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'drivers_vehicles',
  });
  return drivers_vehicles;
};