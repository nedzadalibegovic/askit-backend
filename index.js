const express = require("express");
const routes = {
  account: require("./api/routes/account"),
  login: require("./api/routes/login"),
  token: require("./api/routes/token"),
  questions: require("./api/routes/questions"),
  users: require("./api/routes/users"),
  answers: require("./api/routes/answers"),
  ratings: require("./api/routes/ratings"),
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

// account routes
app.use("/account", routes.account);
app.use("/login", routes.login);
app.use("/token", routes.token);

// resource routes
app.use("/questions", routes.questions);
app.use("/users", routes.users);
app.use("/answers", routes.answers);
app.use("/ratings", routes.ratings);

// error handling routes
app.use(middlewares.notFound);
app.use(middlewares.errorResponseCode);
app.use(middlewares.errorHandler);

app.listen(process.env.PORT);
