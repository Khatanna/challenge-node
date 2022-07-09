require('dotenv').config();
const { readdirSync } = require('fs');
const path = require('path');
const { Sequelize, Op } = require('sequelize');

const { DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_DATABASE_HOST } = process.env;

const sequelize = new Sequelize(DB_DATABASE, DB_USERNAME, DB_PASSWORD, {
  host: DB_DATABASE_HOST,
  dialect: 'postgres',
  logging: false,
  native: false
});

readdirSync(path.join(__dirname, '/models'))
  .map((model) => require(`./models/${model.replace('.js', '')}`))
  .forEach((model) => model(sequelize));

sequelize.models = Object.entries(sequelize.models).reduce(
  (acc, [key, value]) => {
    acc[key[0].toUpperCase() + key.slice(1)] = value;
    return acc;
  },
  {}
);

const { Character, Genre, Movie } = sequelize.models;

Character.belongsToMany(Movie, {
  through: 'movie_has_character',
  timestamps: false
});
Movie.belongsToMany(Character, {
  through: 'movie_has_character',
  timestamps: false
});

Genre.belongsToMany(Movie, {
  through: 'movie_has_gen',
  timestamps: false
});
Movie.hasMany(Genre);

module.exports = {
  connection: sequelize,
  ...sequelize.models,
  Op
};
