const { DataTypes } = require('sequelize');
const fs = require('fs');
const path = require('path');

//   fs.writeFileSync(path.join(__dirname, './image.png'), newCharacter.image);
// })();

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
        type: DataTypes.STRING,

        unique: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      weight: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      history: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    },
    {
      timestamps: false
    }
  );
};
