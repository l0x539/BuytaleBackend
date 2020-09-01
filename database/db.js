var knex = require('knex');

db = knex({
    client: 'pg',
    connection: {
      host : 'localhost',
      user : 'postgres',
      database : 'buytale',
      password: ''
    }
  });

  module.exports = {
      db
  }