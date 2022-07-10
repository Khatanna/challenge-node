const app = require('./app');
const { connection } = require('./database/index');

const port = process.env.API_PORT || 5000;

connection
  .sync({ force: true })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server ready in the port: [${port}]`);
    });
  })
  .catch(console.log);
