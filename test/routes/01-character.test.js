const { assert } = require('chai');
const request = require('supertest');
const { OK, CREATED, BAD_REQUEST, NOT_FOUND } =
  require('http-status-codes').StatusCodes;
const app = require('../../src/app');
const {
  Character,
  Movie,
  movies_character,
  connection
} = require('../../src/database');
const path = require('path');
const fs = require('fs');

describe('GET /characters', () => {
  before(async () => {
    await connection.sync({ force: true });
    const movie = await Movie.create({
      image: 'https://image.com',
      title: 'Harry Potter and the philosopher`s stone',
      createDate: new Date(),
      score: 4
    });
    const character = await Character.create({
      image: 'https://image.com',
      name: 'Harry Potter',
      age: 23,
      weight: 70.5,
      history:
        'Harry Potter, fictional character, a boy wizard created by British author J.K. Rowling. His coming-of-age exploits were the subject of seven enormously popular novels (1997-2007), which were adapted into eight films (2001-11); a play and a book of its script appeared in 2016.'
    });

    await movies_character.create({
      movie_id: movie.id,
      character_id: character.id
    });
  });
  it('return status 200 - (OK)', async () => {
    const { status } = await request(app).get('/characters');

    assert.equal(status, OK, 'status code is 200');
  });
  it('the charactersof type array', async () => {
    const {
      body: { characters }
    } = await request(app).get('/characters');
    assert.isArray(characters);
  });
  it('the characters length equal the database length', async () => {
    const {
      body: { characters }
    } = await request(app).get('/characters');
    const count = await Character.count();

    assert.equal(characters.length, count);
  });
  it('return a message if name of character not exist', async () => {
    const { body: message } = await request(app).get('/characters').query({
      name: 'Draco Malfoy'
    });
    assert.deepEqual(message, {
      message: 'character not found'
    });
  });
  it('get character by name passed for query params', async () => {
    const { body } = await request(app).get('/characters').query({
      name: 'harry potter'
    });
    const character = await Character.findByPk(1, {
      include: {
        as: 'associated_movies',
        model: Movie,
        attributes: ['id', 'title'],
        through: {
          attributes: []
        }
      }
    });

    assert.deepEqual(body, character.toJSON());
  });
  it('return a array of characters if query param (age) and length is 1', async () => {
    const {
      body: { characters }
    } = await request(app).get('/characters').query({
      age: 23
    });
    assert.isArray(characters);
    assert.equal(characters.length, 1);
  });
  it('return a array empty if (movieId) not exist', async () => {
    const {
      body: { characters }
    } = await request(app).get('/characters').query({
      movies: 10
    });

    assert.isArray(characters);
    assert.equal(characters.length, 0);
  });
  it('return a array of characters if movie is associated with characters', async () => {
    const {
      body: { characters }
    } = await request(app).get('/characters').query({
      movies: 1
    });

    assert.isArray(characters);
    assert.equal(characters.length, 1);
  });
  after(async () => {
    await connection.sync({ force: true });
  });
});

describe('GET /characters/detail/:id', () => {
  before(async () => {
    await connection.sync({ force: true });
    await Character.create({
      image: 'https://image.com',
      name: 'Harry Potter',
      age: 23,
      weight: 70.5,
      history:
        'Harry Potter, fictional character, a boy wizard created by British author J.K. Rowling. His coming-of-age exploits were the subject of seven enormously popular novels (1997-2007), which were adapted into eight films (2001-11); a play and a book of its script appeared in 2016.'
    });
  });
  it('return status 200 - (OK)', async () => {
    const { status } = await request(app).get('/characters/detail/1');

    assert.equal(status, OK, 'status code is 200');
  });
  it('give error if "id" does not exist', async () => {
    const { body } = await request(app).get('/characters/detail/2');

    assert.deepEqual(body, {
      message: 'character not found'
    });
  });
  it('the characterof type object', async () => {
    const { body: character } = await request(app).get('/characters/detail/1');

    assert.isObject(character);
  });
  it('the character equal the character in the database', async () => {
    const { body: character } = await request(app).get('/characters/detail/1');
    const dbCharacter = await Character.findByPk(1, {
      include: {
        as: 'associated_movies',
        model: Movie,
        through: {
          attributes: []
        }
      }
    });
    assert.deepEqual(character, dbCharacter.toJSON());
  });
  after(async () => {
    await connection.sync({ force: true });
  });
});

describe('POST /characters', () => {
  let newCharacter = {};
  beforeEach(async () => {
    await connection.sync({ force: true });
    newCharacter = {
      name: 'Harry Potter',
      age: 23,
      weight: 70.5,
      history:
        'Harry Potter, fictional character, a boy wizard created by British author J.K. Rowling. His coming-of-age exploits were the subject of seven enormously popular novels (1997-2007), which were adapted into eight films (2001-11); a play and a book of its script appeared in 2016.'
    };
  });
  it('return status 201 - (CREATED)', async () => {
    const { status } = await request(app)
      .post('/characters')
      .send(newCharacter);

    assert.equal(status, CREATED, 'status code is 201');
  });
  it('return the new character', async () => {
    const { body: character } = await request(app)
      .post('/characters')
      .send(newCharacter);

    assert.isObject(character);
  });
  it('create character correctly', async () => {
    const { body: character } = await request(app)
      .post('/characters')
      .send(newCharacter);
    const dbCharacter = await Character.findByPk(1);
    assert.deepEqual(character, dbCharacter.toJSON());
  });
});

describe('PUT /characters/:id', () => {
  let updateCharacter = {};
  beforeEach(async () => {
    await connection.sync({ force: true });
    await Character.create({
      image: 'https://image.com',
      name: 'Harry Potter',
      age: 13,
      weight: 55.5,
      history:
        'Harry Potter, fictional character, a boy wizard created by British author J.K. Rowling.'
    });
    updateCharacter = {
      image: 'https://image.com',
      name: 'Harry Potter',
      age: 23,
      weight: 70.5,
      history:
        'Harry Potter, fictional character, a boy wizard created by British author J.K. Rowling. His coming-of-age exploits were the subject of seven enormously popular novels (1997-2007), which were adapted into eight films (2001-11); a play and a book of its script appeared in 2016.'
    };
  });
  it('return status 200 - (OK) if character is updated correctly', async () => {
    const { status } = await request(app)
      .put('/characters/1')
      .send(updateCharacter);

    assert.equal(status, OK, 'status code is 200');
  });
  it('give error if "id" does not exist', async () => {
    const { body } = await request(app)
      .put('/characters/2')
      .send(updateCharacter);

    assert.deepEqual(body, {
      message: 'character not found'
    });
  });
  it('return the character updated', async () => {
    const { body } = await request(app)
      .put('/characters/1')
      .send(updateCharacter);

    assert.isObject(body);
  });

  it('return error if some attribute not exist and return message error', async () => {
    const { status, body } = await request(app).put('/characters/1');

    assert.equal(status, BAD_REQUEST);
    assert.deepEqual(body, {
      message: 'the attributes is necessary for create a new character'
    });
  });
  it('create character correctly', async () => {
    await request(app).put('/characters/1').send(updateCharacter);
    const dbCharacter = await Character.findByPk(1);
    assert.deepEqual({ id: 1, ...updateCharacter }, dbCharacter.toJSON());
  });
  after(async () => {
    await connection.sync({ force: true });
  });
});

describe('PATCH /characters', () => {
  before(async () => {
    await Character.create({
      image: 'https://image.com',
      name: 'Harry Potter',
      age: 13,
      weight: 55.5,
      history:
        'Harry Potter, fictional character, a boy wizard created by British author J.K. Rowling.'
    });
  });
  it('return status 200 - (OK) if character is updated', async () => {
    const { status } = await request(app).patch('/characters/1').send({
      age: 19
    });

    assert.equal(status, OK, 'status code is 200');
  });
  it('return message if character is updated correctly', async () => {
    const { body } = await request(app).patch('/characters/1').send({
      name: 'Draco Malfoy'
    });

    assert.deepEqual(body, {
      message: 'character updated successfully'
    });
  });
  it('return status 404 - (NOT FOUND) if character "id" no exist', async () => {
    const { status } = await request(app).patch('/characters/2').send({
      weight: 80
    });

    assert.equal(status, NOT_FOUND);
  });
  it('give error if "id" does not exist', async () => {
    const { body } = await request(app).patch('/characters/2').send({
      name: 'Draco Malfoy'
    });

    assert.deepEqual(body, {
      message: 'character not found'
    });
  });
  it('updated attribute "name" correctly', async () => {
    const character = await Character.findByPk(1);

    assert.equal(character.name, 'Draco Malfoy');
  });
  after(async () => {
    await connection.sync({ force: true });
  });
});

describe('DELETE /characters', () => {
  beforeEach(async () => {
    await Character.create({
      image: 'https://image.com',
      name: 'Harry Potter',
      age: 13,
      weight: 55.5,
      history:
        'Harry Potter, fictional character, a boy wizard created by British author J.K. Rowling.'
    });
  });
  it('return status 200 - (OK) if character is deleted correctly', async () => {
    const { status } = await request(app).delete('/characters/1');

    assert.equal(status, OK, 'status code is 200');
  });
  it('return a message if character is deleted correctly', async () => {
    const { body } = await request(app).delete('/characters/1');
    assert.deepEqual(body, {
      message: 'character deleted successfully'
    });
  });
  it('return status 404 - (NOT FOUND) if character "id" no exist', async () => {
    const { status } = await request(app).delete('/characters/2');

    assert.equal(status, NOT_FOUND);
  });
  it('return a message of error if character "id" no exist', async () => {
    const { body } = await request(app).delete('/characters/2');

    assert.deepEqual(body, {
      message: 'character not found'
    });
  });
  it('deleted character correctly', async () => {
    await request(app).delete('/characters/1');
    const character = await Character.findByPk(1);

    assert.isNull(character, 'character is null');
  });
  afterEach(async () => {
    await connection.sync({ force: true });
  });
  after(async () => {
    await connection.close();
  });
});
