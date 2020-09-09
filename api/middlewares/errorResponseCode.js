const { EmailError, PasswordError } = require("../utils/customErrors");

const errorResponseCodes = new Map([
  [EmailError.name, 400],
  [PasswordError.name, 400],
  ["ValidationError", 400],
  ["UniqueViolationError", 400],
  ["TokenExpiredError", 401],
  ["JsonWebTokenError", 401],
]);

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  if (errorResponseCodes.has(err.name)) {
    res.status(errorResponseCodes.get(err.name));
  } else {
    res.status(500);
  }

  next(err);
};
