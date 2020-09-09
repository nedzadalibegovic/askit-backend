const router = require("express").Router();
const sha256 = require("crypto-js/sha256");

const authenticate = require("../helpers/authenticate");
const jwt = require("../helpers/jwt");
const User = require("../../database/orm/models/User");

// This route should be used to acquire new refreshTokens
router.post("/", async (req, res, next) => {
  try {
    const user = await authenticate(req.body.Email, req.body.Password);
    const refreshToken = jwt.getRefreshToken(user.UserID);
    const hash = sha256(refreshToken).toString();

    await User.query().findById(user.UserID).patch({ Token: hash });

    const accessToken = jwt.getAccessToken(user.UserID);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
    });
    res.json({ accessToken });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
