const express = require("express");

// connect to db as we spin up the server
require("./database/connection");

const app = express();

app.listen(process.env.PORT);
