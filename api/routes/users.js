const router = require("express").Router();

const User = require("../../database/orm/models/User");

router.get("/top", async (req, res, next) => {
  const page = req.query.page || 0;
  const size = req.query.size || 20;

  try {
    const users = await User.query()
      .orderBy("AnswerCount", "desc")
      .page(page, size);

    res.json(users);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
