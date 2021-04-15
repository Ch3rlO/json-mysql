'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InvalidJSON extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  InvalidJSON.init(
    {
      value: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'InvalidJSON',
    }
  );
  return InvalidJSON;
};
