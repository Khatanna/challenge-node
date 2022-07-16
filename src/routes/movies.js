const { Router } = require('express');
const { getAllMovies } = require('../controllers/movie');
const router = Router();

router.get('/', getAllMovies);

module.exports = router;
