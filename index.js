const express = require("express");
const cors = require("cors");
const http = require("http");
const socketio = require("socket.io");

const { verifyAccessToken } = require("./api/helpers/jwt");
const routes = {
  account: require("./api/routes/account"),
  login: require("./api/routes/login"),
  token: require("./api/routes/token"),
  questions: require("./api/routes/questions"),
  answers: require("./api/routes/answers"),
  ratings: require("./api/routes/ratings"),
  public: require("./api/routes/public"),
};
const middlewares = {
  notFound: require("./api/middlewares/notFound"),
  errorHandler: require("./api/middlewares/errorHandler"),
  errorResponseCode: require("./api/middlewares/errorResponseCode"),
};

// connect to db as we spin up the server
require("./database/connection");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// each user shall have a room under his own id
io.on("connection", (socket) => {
  socket.on("join", (token) => {
    try {
      const { UserID } = verifyAccessToken(token);

      socket.join(UserID);
    } catch {
      socket.disconnect();
    }
  });
});

// add to app.locals so we can use in other parts of server
app.locals.io = io;

app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// account routes
app.use("/account", routes.account);
app.use("/login", routes.login);
app.use("/token", routes.token);

// resource routes
app.use("/public", routes.public);
app.use("/questions", routes.questions);
app.use("/answers", routes.answers);
app.use("/ratings", routes.ratings);

// error handling routes
app.use(middlewares.notFound);
app.use(middlewares.errorResponseCode);
app.use(middlewares.errorHandler);

server.listen(process.env.PORT);
