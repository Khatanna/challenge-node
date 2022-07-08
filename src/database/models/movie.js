const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define(
    'Movie',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        onDelete: 'CASCADE'
      },
      image: {
        type: DataTypes.STRING
      },
      title: {
        type: DataTypes.STRING
      },
      createDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true
        }
      },
      score: {
        type: DataTypes.FLOAT,
        validate: {
          min: 1,
          max: 5
        }
      }
    },
    {
      timestamps: false
    }
  );
};
