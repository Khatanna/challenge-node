const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define(
    'Genre',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        onDelete: 'CASCADE'
      },
      name: {
        type: DataTypes.STRING,
        unique: true
      },
      image: {
        type: DataTypes.STRING
      }
    },
    {
      timestamps: false
    }
  );
};
