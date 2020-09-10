const router = require("express").Router();

const User = require("../../database/orm/models/User");
const verifyAccessToken = require("../middlewares/verifyAccessToken");

// This route should be used to create (register) a new user
router.post("/", async (req, res, next) => {
  try {
    const user = await User.query().insertAndFetch({
      FirstName: req.body.FirstName,
      LastName: req.body.LastName,
      Email: req.body.Email,
      Password: req.body.Password,
    });

    res.json(user);
  } catch (err) {
    next(err);
  }
});

// This route should be used to modify data of an existing user
router.put("/", verifyAccessToken, async (req, res, next) => {
  try {
    const user = await User.query().patchAndFetchById(res.locals.UserID, {
      FirstName: req.body.FirstName,
      LastName: req.body.LastName,
      Email: req.body.Email,
      Password: req.body.Password,
    });

    res.json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
