const router = require("express").Router();

const User = require("../../database/orm/models/User");
const verifyAccessToken = require("../middlewares/verifyAccessToken");

// this route should be used to get user's own info
router.get("/", verifyAccessToken, async (req, res, next) => {
  try {
    const user = await User.query().findById(res.locals.UserID);

    res.json(user);
  } catch (err) {
    next(err);
  }
});

// this route should be used to create (register) a new user
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

// this route should be used to modify data of an existing user
router.put("/", verifyAccessToken, async (req, res, next) => {
  try {
    const user = await User.query().findById(res.locals.UserID);

    if (!(await user.verifyPassword(req.body.Password))) {
      res.status(401).json({ message: "Incorrect password" });
      return;
    }

    const result = await user.$query().patchAndFetch({
      FirstName: req.body.FirstName,
      LastName: req.body.LastName,
      Email: req.body.Email,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
});

// this route should be used to change the user's password
router.put("/password", verifyAccessToken, async (req, res, next) => {
  try {
    const user = await User.query().findById(res.locals.UserID);

    if (!(await user.verifyPassword(req.body.OldPassword))) {
      res.status(401).json({ message: "Incorrect password" });
      return;
    }

    const result = await user.$query().patch({
      Password: req.body.NewPassword,
    });

    result > 0
      ? res.json({ message: "Password updated" })
      : res.status(500).json({ message: "Password not updated" });
    return;
  } catch (err) {
    next(err);
  }
});

module.exports = router;
