'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class offers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  offers.init({
    type: DataTypes.TEXT,
    city: DataTypes.TEXT,
    description: DataTypes.TEXT,
    details: DataTypes.TEXT,
    price: DataTypes.DOUBLE,
    photo: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'offers',
  });
  return offers;
};