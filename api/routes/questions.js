const router = require("express").Router();

const Question = require("../../database/orm/models/Question");

router.get("/latest", async (req, res, next) => {
  const page = req.query.page || 0;
  const size = req.query.size || 20;

  try {
    const questions = await Question.query()
      .orderBy("QuestionID", "desc")
      .page(page, size);

    res.json(questions);
  } catch (err) {
    next(err);
  }
});

router.get("/popular", async (req, res, next) => {
  const page = req.query.page || 0;
  const size = req.query.size || 20;

  try {
    const questions = await Question.query()
      .orderBy("RatingCount", "desc")
      .page(page, size);

    res.json(questions);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
