const router = require("express").Router();

const Question = require("../../database/orm/models/Question");
const User = require("../../database/orm/models/User");
const addFilterID = require("../middlewares/addFilterID");
const getRatings = require("../helpers/getRatings");

// add FilterID for any authenticated requests
router.use(addFilterID);

// public route, used to get the latest 20 questions
router.get("/latest-questions", async (req, res, next) => {
  const page = req.query.page || 0;
  const size = req.query.size || 20;

  try {
    const questions = Question.query().withGraphFetched("user");

    if (res.locals.FilterID) getRatings(questions, res.locals.FilterID);

    questions.orderBy("QuestionID", "desc").page(page, size);

    res.json(await questions);
  } catch (err) {
    next(err);
  }
});

// public route, used to get the 20 most-liked questions
router.get("/popular-questions", async (req, res, next) => {
  const page = req.query.page || 0;
  const size = req.query.size || 20;

  try {
    const questions = Question.query().withGraphFetched("user");

    if (res.locals.FilterID) getRatings(questions, res.locals.FilterID);

    questions.orderBy("LikeCount", "desc").page(page, size);

    res.json(await questions);
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
