'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class vehicles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.vehicles.hasMany(models.drivers_vehicles, {foreignKey: 'vehicleId', targetKey: 'id'})
    }
  };
  vehicles.init({
    number: DataTypes.TEXT,
    type: DataTypes.INTEGER,
    model: DataTypes.TEXT,
    startCounter: DataTypes.INTEGER,
    endCounter: DataTypes.INTEGER,
    name: DataTypes.TEXT,
    serviceType: DataTypes.INTEGER,
    rentCost: DataTypes.INTEGER,
    startDate: DataTypes.DATEONLY,
    endDate: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'vehicles',
  });
  return vehicles;
};