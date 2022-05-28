'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class charges extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.charges.belongsTo(models.clients, {foreignKey: 'clientId', targetKey: 'id'});
    }
  };
  charges.init({
    clientId: DataTypes.INTEGER,
    amount: DataTypes.DOUBLE,
    points: DataTypes.DOUBLE,
    startDate: DataTypes.DATEONLY,
    endDate: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'charges',
  });
  return charges;
};