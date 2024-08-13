// knexfile.cjs
module.exports = {
  client: 'mysql',
  connection: {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employeems'
  },
  migrations: {
    directory: './migrations',
  },
  seeds: {
    directory: './seeds',
  }
};
