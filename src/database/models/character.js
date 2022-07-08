const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define(
    'Character',
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
      name: {
        type: DataTypes.STRING
      },
      age: {
        type: DataTypes.INTEGER
      },
      weight: {
        type: DataTypes.FLOAT
      },
      history: {
        type: DataTypes.TEXT
      }
    },
    {
      timestamps: false
    }
  );
};
