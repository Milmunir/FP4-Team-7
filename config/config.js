require("dotenv").config();

module.exports = {
  development: {
    username: "postgres",
    password: "YYOsqKmQa3TnnctDbbcn",
    database: "railway",
    host: "containers-us-west-32.railway.app",
    dialect: "postgres",
    port: 6779,
  },
  test: {
    username: "postgres",
    password: "YYOsqKmQa3TnnctDbbcn",
    database: "railway",
    host: "containers-us-west-32.railway.app",
    dialect: "postgres",
    port: 6779,
  },
  production: {
    username: "postgres",
    password: "YYOsqKmQa3TnnctDbbcn",
    database: "railway",
    host: "containers-us-west-32.railway.app",
    dialect: "postgres",
    port: 6779,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
};
