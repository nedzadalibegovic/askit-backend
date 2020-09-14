const jwt = require("../helpers/jwt");

module.exports = (req, res, next) => {
  try {
    const accessToken = req.headers.authorization.split(" ")[1];
    const { UserID } = jwt.verifyAccessToken(accessToken);

    res.locals.FilterID = UserID;
  } catch {
    // just so we don't throw any errors
  } finally {
    next();
  }
};
