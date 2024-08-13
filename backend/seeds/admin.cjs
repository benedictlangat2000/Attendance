const bcrypt = require('bcrypt');

module.exports = {
  async seed(knex) {
    await knex('admin').insert([
      {
        email: 'admin@example.com',
        password: bcrypt.hashSync('12345', 10),
      },
      {
        email: 'admin1@example.com',
        password: bcrypt.hashSync('123456', 10),
      },
      {
        email: 'admin2@example.com',
        password: bcrypt.hashSync('1234567', 10),
      },
    ]);
  },
};