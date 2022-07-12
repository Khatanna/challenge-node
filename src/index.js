const app = require('./app');
const { movies_character, Movie, connection } = require('./database/index');

const port = process.env.API_PORT || 5000;

// (async () => {
//   await Movie.create({
//     image: 'https://image.com',
//     title: 'Harry Potter 1',
//     createDate: new Date(),
//     score: 4
//   });
//   await movies_character.bulkCreate([
//     { movie_id: 1, character_id: 1 },
//     { movie_id: 1, character_id: 2 }
//   ]);
// })();

connection
  .sync({ force: false })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server ready in the port: [${port}]`);
    });
  })
  .catch(console.log);
