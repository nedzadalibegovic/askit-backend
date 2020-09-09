const cookieParser = require("cookie-parser");
const router = require("express").Router();
const sha256 = require("crypto-js/sha256");

const jwt = require("../helpers/jwt");
const User = require("../../database/orm/models/User");

router.get("/", cookieParser(), async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    const { UserID } = jwt.verifyRefreshToken(refreshToken);
    const { Token: hash } = await User.query().findById(UserID);

    if (hash === sha256(refreshToken).toString()) {
      res.json({ accessToken: jwt.getAccessToken(UserID) });
    } else {
      res.status(401); // Unauthorized
      res.json({ message: "Please login again" });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
