require('dotenv').config();
const knex = require('knex');

const app = require('./app');
const { PORT, DB_URL } = require('./config');

const db = knex({
  client: 'pg',
  connection: DB_URL,
});

app.set('db', db);

app.listen(PORT, () => {
  console.log(`server listening at http://localhost:${PORT}`);
});
