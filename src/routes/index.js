const { Router } = require('express');
const { readdirSync } = require('fs');
const { OK, BAD_REQUEST } = require('http-status-codes').StatusCodes;

const router = Router();

router.get('/', (req, res) => {
  res.status(OK).json({
    status: OK,
    message: 'Welcome to the API [Disney]'
  });
});

readdirSync(__dirname).forEach((file) => {
  const name = file.slice(0, -3);
  if (name !== 'index') {
    router.use(`/${name}`, require(`./${name}`));
  }
});

router.get('*', (req, res) => {
  res.status(BAD_REQUEST).send({ message: `[${req.url}] not found` });
});

module.exports = router;
