module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host: "localhost",
      user: "root",
      password: "P@ssw0rd!",
      database: "askit",
    },
    migrations: {
      directory: "./database/migrations",
    },
    seeds: {
      directory: "./database/seeds",
    },
  },

  production: {
    client: "mysql2",
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: "./database/migrations",
    },
  },
};
