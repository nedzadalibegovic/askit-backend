const router = require("express").Router();

const Question = require("../../database/orm/models/Question");
const User = require("../../database/orm/models/User");
const verifyAccessToken = require("../middlewares/verifyAccessToken");

// protected route, used to get user's last 20 questions
router.get("/", verifyAccessToken, async (req, res, next) => {
  const page = req.query.page || 0;
  const size = req.query.size || 20;

  try {
    const questions = await User.relatedQuery("questions")
      .for(res.locals.UserID)
      .orderBy("QuestionID", "desc")
      .page(page, size);

    res.json(questions);
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
router.get("/:QuestionID", async (req, res, next) => {
  try {
    const eager = {
      ...(req.query.user == "true" && { user: true }),
      ...(req.query.answers == "true" && { answers: true }),
    };
    const question = await Question.query()
      .findById(req.params.QuestionID)
      .withGraphFetched(eager);

    res.json(question);
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
