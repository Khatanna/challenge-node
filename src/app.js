const express = require('express');
const morgan = require('morgan');
const router = require('./routes');
const { StatusCodes } = require('http-status-codes');
const { INTERNAL_SERVER_ERROR } = StatusCodes;

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.use('/', router);

app.use((_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

app.use(({ message }, _, res) => {
  console.log(`index error[review the 'server.js' file]: ${message}`);
  res.status(INTERNAL_SERVER_ERROR).send({ message, endware: true });
});

module.exports = app;
