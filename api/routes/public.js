const router = require("express").Router();

const Question = require("../../database/orm/models/Question");
const User = require("../../database/orm/models/User");

// public route, used to get the latest 20 questions
router.get("/latest-questions", async (req, res, next) => {
  const page = req.query.page || 0;
  const size = req.query.size || 20;

  try {
    const questions = await Question.query()
      .withGraphFetched("user")
      .orderBy("QuestionID", "desc")
      .page(page, size);

    res.json(questions);
  } catch (err) {
    next(err);
  }
});

// public route, used to get the 20 most-liked questions
router.get("/popular-questions", async (req, res, next) => {
  const page = req.query.page || 0;
  const size = req.query.size || 20;

  try {
    const questions = await Question.query()
      .withGraphFetched("user")
      .orderBy("LikeCount", "desc")
      .page(page, size);

    res.json(questions);
  } catch (err) {
    next(err);
  }
});

// public route, used to get 20 users with the most answers
router.get("/top-users", async (req, res, next) => {
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
