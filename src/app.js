require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const { router, paths } = require('./routes');
const { StatusCodes } = require('http-status-codes');
const { INTERNAL_SERVER_ERROR } = StatusCodes;
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger');
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');
const multer = require('multer');

const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    );
  }
});

app.set('name', 'disney API');
app.use(express.json());
app.use(morgan('dev'));
app.use(
  multer({
    storage
  }).single('image')
);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

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
  res
    .status(INTERNAL_SERVER_ERROR)
    .send({ code: INTERNAL_SERVER_ERROR, message });
});

module.exports = app;
