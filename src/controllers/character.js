const { OK, CREATED, NOT_FOUND, BAD_REQUEST } =
  require('http-status-codes').StatusCodes;
const { Character, Movie } = require('../database/index');

const API_URL = process.env.API_URL + '/characters';

exports.getAllCharacters = async (req, res, next) => {
  const { page = 1, offset = 10, limit = 10 } = req.query;

  const nextPage = `${API_URL}?page=${
    +page + 1
  }&limit=${limit}&offset=${offset}`;
  const previousPage = `${API_URL}?page=${
    +page - 1
  }&limit=${limit}&offset=${offset}`;

  try {
    const { count, rows: characters } = await Character.findAndCountAll({
      attributes: ['image', 'name'],
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
      characters
    });
  } catch (error) {
    next(error);
  }
};

exports.createCharacter = async (req, res, next) => {
  try {
    const { image, name, age, weight, history } = req.body;

    if (!image || !name || !age || !weight || !history) {
      res.status(BAD_REQUEST).send({
        message: 'the attributes is necessary for create a new character'
      });
    } else {
      const newCharacter = await Character.create({
        image,
        name,
        age,
        weight,
        history
      });

      res.status(CREATED).json(newCharacter);
    }
  } catch (error) {
    next(error);
  }
};

exports.getCharacterById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const character = await Character.findByPk(id, {
      include: {
        model: Movie
      }
    });

    if (character) {
      res.status(OK).json(character);
    } else {
      res.status(NOT_FOUND).send({
        message: 'character not found'
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.updateAllCharacter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { image, name, age, weight, history } = req.body;

    if (!image || !name || !age || !weight || !history) {
      res.status(BAD_REQUEST).send({
        message: 'the attributes is necessary for create a new character'
      });
    } else {
      const character = await Character.findByPk(id);
      if (character) {
        await character.update({
          image,
          name,
          age,
          weight,
          history
        });

        res.status(OK).send(character);
      } else {
        res.send({
          message: 'character not found'
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

exports.updateAttributeOfCharacter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { image, name, age, weight, history } = req.body;

    const character = await Character.findByPk(id);

    if (character) {
      await character.update({
        image,
        name,
        age,
        weight,
        history
      });

      res.status(OK).send({
        message: 'character updated successfully'
      });
    } else {
      res.status(NOT_FOUND).send({
        message: 'character not found'
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.deleteCharacter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const character = await Character.findByPk(id);

    if (character) {
      await character.destroy();
      res.status(OK).send({
        message: 'character deleted successfully'
      });
    } else {
      res.status(NOT_FOUND).send({
        message: 'character not found'
      });
    }
  } catch (error) {
    next(error);
  }
};
