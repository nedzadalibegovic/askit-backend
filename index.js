const express = require("express");
const middlewares = {
  notFound: require("./api/middlewares/notFound"),
  errorHandler: require("./api/middlewares/errorHandler"),
  errorResponseCode: require("./api/middlewares/errorResponseCode"),
};

// connect to db as we spin up the server
require("./database/connection");

const app = express();

app.use(express.json());

// error handling routes
app.use(middlewares.notFound);
app.use(middlewares.errorResponseCode);
app.use(middlewares.errorHandler);

app.listen(process.env.PORT);
