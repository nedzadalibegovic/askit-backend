const router = require("express").Router();

const Answer = require("../../database/orm/models/Answer");
const verifyAccessToken = require("../middlewares/verifyAccessToken");
const addFilterID = require("../middlewares/addFilterID");

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
router.get("/:QuestionID", addFilterID, async (req, res, next) => {
  const page = req.query.page || 0;
  const size = req.query.size || 20;

  try {
    const query = Answer.query().where("QuestionID", req.params.QuestionID);

    if (req.query.user == "true") query.withGraphFetched("user");
    if (res.locals.FilterID) {
      query.withGraphFetched("ratings").modifyGraph("ratings", (builder) => {
        builder.where("AnswerUserID", res.locals.FilterID);
      });
    }

    const answers = await query.orderBy("LikeCount", "desc").page(page, size);

    if (req.query.user == "true" && res.locals.FilterID) {
      const my = answers.results.find(
        (answer) => answer.user.UserID === res.locals.FilterID
      );

      if (my) {
        answers.my = my;
        answers.results = answers.results.filter(
          (answer) => answer.user.UserID !== res.locals.FilterID
        );
        answers.total -= 1;
      }
    }

    res.json(answers);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
