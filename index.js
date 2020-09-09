const express = require("express");
const routes = {
  user: require("./api/routes/user"),
  login: require("./api/routes/login"),
  token: require("./api/routes/token"),
};
const middlewares = {
  notFound: require("./api/middlewares/notFound"),
  errorHandler: require("./api/middlewares/errorHandler"),
  errorResponseCode: require("./api/middlewares/errorResponseCode"),
};

// connect to db as we spin up the server
require("./database/connection");

const app = express();

app.use(express.json());

// resource routes
app.use("/user", routes.user);
app.use("/login", routes.login);
app.use("/token", routes.token);

// error handling routes
app.use(middlewares.notFound);
app.use(middlewares.errorResponseCode);
app.use(middlewares.errorHandler);

app.listen(process.env.PORT);
