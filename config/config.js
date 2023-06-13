require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: process.env.DB_PORT,
  },
  test: {
    username: process.env.DB_USERNAME_TESTING,
    password: process.env.DB_PASSWORD_TESTING,
    database: process.env.DB_DATABASE_TESTING,
    host: process.env.DB_HOST_TESTING,
    dialect: "postgres",
    port: process.env.DB_PORT,
  },
  production: {
    username: process.env.DB_USERNAME_PRODUCTION,
    password: process.env.DB_PASSWORD_PRODUCTION,
    database: process.env.DB_DATABASE_PRODUCTION,
    host: process.env.DB_HOST_PRODUCTION,
    dialect: "postgres",
    port: process.env.DB_PORT_PRODUCTION,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
};
