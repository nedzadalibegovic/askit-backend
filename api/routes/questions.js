const router = require("express").Router();

const Question = require("../../database/orm/models/Question");
const verifyAccessToken = require("../middlewares/verifyAccessToken");
const addFilterID = require("../middlewares/addFilterID");
const getRatings = require("../helpers/getRatings");

// protected route, used to get user's last 20 questions
router.get("/", verifyAccessToken, async (req, res, next) => {
  const page = req.query.page || 0;
  const size = req.query.size || 20;

  try {
    const questions = Question.query().where("UserID", res.locals.UserID);

    getRatings(questions, res.locals.UserID);
    questions.orderBy("QuestionID", "desc").page(page, size);

    res.json(await questions);
  } catch (err) {
    next(err);
  }
});

// protected route, used to add a new question
router.post("/", verifyAccessToken, async (req, res, next) => {
  try {
    const question = await Question.query().insertAndFetch({
      Title: req.body.Title,
      Body: req.body.Body,
      UserID: res.locals.UserID,
    });

    res.json(question);
  } catch (err) {
    next(err);
  }
});

// public route, used to get a specific question
router.get("/:QuestionID", addFilterID, async (req, res, next) => {
  try {
    const question = Question.query().findById(req.params.QuestionID);

    if (req.query.user == "true") question.withGraphFetched("user");
    if (req.query.answers == "true") question.withGraphFetched("answers");
    if (res.locals.FilterID) getRatings(question, res.locals.FilterID);

    res.json(await question);
  } catch (err) {
    next(err);
  }
});

// protected route, used to edit existing question (not required per spec)
router.put("/:QuestionID", verifyAccessToken, async (req, res, next) => {
  try {
    const question = await Question.query().patchAndFetchById(
      req.params.QuestionID,
      {
        Title: req.body.Title,
        Body: req.body.Body,
      }
    );

    res.json(question);
  } catch (err) {
    next(err);
  }
});

// protected route, used to delete existing question (not required per spec)
router.delete("/:QuestionID", verifyAccessToken, async (req, res, next) => {
  try {
    const deleteRows = await Question.query().deleteById(req.params.QuestionID);

    res.json({ deleteRows });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
