const express = require('express');
const morgan = require('morgan');
const { router, paths } = require('./routes');
const { StatusCodes } = require('http-status-codes');
const { INTERNAL_SERVER_ERROR } = StatusCodes;
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger');
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const app = express();

app.set('name', 'disney API');
app.use(express.json());
app.use(morgan('dev'));

swaggerDocument.apis = [`${path.join(__dirname, './routes/*.js')}`];
swaggerDocument.definition.paths = paths.reduce((acc, path) => {
  acc[`/${path}`] = require(`./docs/${path.slice(0, -1)}.json`);
  return acc;
}, {});

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerJsdoc(swaggerDocument), { explorer: true })
);

app.use('/', router);

// Headers
app.use((_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );
  next();
});

// Endware
app.use(({ message }, _, res) => {
  console.log(`index error[review the 'server.js' file]: ${message}`);
  res.status(INTERNAL_SERVER_ERROR).send({ message, endware: true });
});

module.exports = app;
