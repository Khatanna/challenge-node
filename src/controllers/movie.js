const { OK, CREATED, NOT_FOUND, BAD_REQUEST } =
  require('http-status-codes').StatusCodes;
const { Character, Movie } = require('../database/index');
const API_URL = process.env.API_URL + '/movies';
const path = require('path');

exports.getAllMovies = async (req, res, next) => {
  const { page = 1, offset = 10, limit = 10 } = req.query;
  const nextPage = `${API_URL}?page=${
    +page + 1
  }&limit=${limit}&offset=${offset}`;
  const previousPage = `${API_URL}?page=${
    +page - 1
  }&limit=${limit}&offset=${offset}`;

  try {
    const { count, rows: movies } = await Movie.findAndCountAll({
      attributes: ['image', 'title', 'createDate'],
      order: [['id', 'ASC']],
      offset: (+page - 1) * +limit,
      limit: +limit
    });
    const next = page < Math.ceil(count / +limit) ? nextPage : null;
    const previous = page > 1 ? previousPage : null;

    res.status(OK).json({
      page: +page,
      next,
      previous,
      count,
      movies
    });
  } catch (error) {
    next(error);
  }
};
