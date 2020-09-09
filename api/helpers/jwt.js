const jwt = require("jsonwebtoken");

/** @param {Number} UserID */
const getRefreshToken = (UserID) => {
  return jwt.sign({ UserID }, process.env.JWT_REFRESH, { expiresIn: "30d" });
};

/** @param {String} refreshToken */
const verifyRefreshToken = (refreshToken) => {
  return jwt.verify(refreshToken, process.env.JWT_REFRESH);
};

/** @param {Number} UserID */
const getAccessToken = (UserID) => {
  return jwt.sign({ UserID }, process.env.JWT_ACCESS, { expiresIn: "15min" });
};

/** @param {String} accessToken */
const verifyAccessToken = (accessToken) => {
  return jwt.verify(accessToken, process.env.JWT_ACCESS);
};

module.exports = {
  getRefreshToken,
  verifyRefreshToken,
  getAccessToken,
  verifyAccessToken,
};
