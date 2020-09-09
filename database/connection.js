const knex = require("knex");
const { Model } = require("objection");
const config = require("../knexfile");

const connection = knex(config[process.env.NODE_ENV || "development"]);
Model.knex(connection);

module.exports = connection;
