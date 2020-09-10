const router = require("express").Router();

const User = require("../../database/orm/models/User");
const verifyAccessToken = require("../middlewares/verifyAccessToken");

// This route should be used to create (register) a new user
router.post("/", async (req, res, next) => {
  try {
    const user = await User.query().insertAndFetch(req.body);

    res.json(user);
  } catch (err) {
    next(err);
  }
});

// This route should be used to modify data of an existing user
router.put("/", verifyAccessToken, async (req, res, next) => {
  try {
    const user = await User.query().patchAndFetchById(
      res.locals.UserID,
      req.body
    );

    res.json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
