// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};
