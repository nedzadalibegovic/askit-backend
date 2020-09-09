module.exports = (req, res, next) => {
  const err = new Error(`Route not found`);

  res.status(404);
  next(err);
};
