const router = require("express").Router();

const Question = require("../../database/orm/models/Question");
const Answer = require("../../database/orm/models/Answer");
const verifyAccessToken = require("../middlewares/verifyAccessToken");

// protected route, used to give an answer to a question
router.post("/", verifyAccessToken, async (req, res, next) => {
  try {
    const answer = await Answer.query().insertAndFetch({
      QuestionID: req.body.QuestionID,
      UserID: res.locals.UserID,
      Body: req.body.Body,
    });

    res.json(answer);
  } catch (err) {
    next(err);
  }
});

// protected route, used to edit an existing answer
router.put("/", verifyAccessToken, async (req, res, next) => {
  try {
    const answer = await Answer.query().patchAndFetchById(
      [req.body.QuestionID, res.locals.UserID],
      {
        Body: req.body.Body,
      }
    );

    res.json(answer);
  } catch (err) {
    next(err);
  }
});

// protected route, used to delete an answer
router.delete("/:QuestionID", verifyAccessToken, async (req, res, next) => {
  try {
    const deletedRows = await Answer.query().deleteById([
      req.params.QuestionID,
      res.locals.UserID,
    ]);

    if (deletedRows > 0) {
      res.json({ message: "Answer deleted" });
    } else {
      res.status(404).json({ message: "Specified answer not found" });
    }
  } catch (err) {
    next(err);
  }
});

// public route, used to get answers for a given question
router.get("/:QuestionID", async (req, res, next) => {
  const page = req.query.page || 0;
  const size = req.query.size || 20;

  const eager = {
    ...(req.query.user == "true" && { user: true }),
  };

  try {
    const answers = await Question.relatedQuery("answers")
      .withGraphFetched(eager)
      .orderBy("LikeCount")
      .for(req.params.QuestionID)
      .page(page, size);

    res.json(answers);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
