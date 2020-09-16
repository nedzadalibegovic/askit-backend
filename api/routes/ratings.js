const router = require("express").Router();

const verifyAccessToken = require("../middlewares/verifyAccessToken");
const AnswerRating = require("../../database/orm/models/AnswerRating");
const QuestionRating = require("../../database/orm/models/QuestionRating");

// protected route, to be used when rating an answer
router.post("/answer", verifyAccessToken, async (req, res, next) => {
  try {
    // PK of Answer record: QuestionID, AnswerUserID
    // PK of User giving a rating: RatingUserID
    const rating = await AnswerRating.query().insert({
      QuestionID: req.body.QuestionID,
      AnswerUserID: req.body.UserID,
      RatingUserID: res.locals.UserID,
      Rating: req.body.Rating,
    });

    res.json(rating);
  } catch (err) {
    next(err);
  }
});

// protected route, to be used when changing answer rating (i.e. from like to dislike)
router.put("/answer", verifyAccessToken, async (req, res, next) => {
  try {
    const rating = await AnswerRating.query().patchAndFetchById(
      [req.body.QuestionID, req.body.UserID, res.locals.UserID],
      {
        Rating: req.body.Rating,
      }
    );

    res.json(rating);
  } catch (err) {
    next(err);
  }
});

// protected route, to be used when deleting an answer rating
router.delete("/answer", verifyAccessToken, async (req, res, next) => {
  try {
    // PK of Answer record: req.body.QuestionID, req.body.UserID
    // PK of User giving a rating: res.locals.UserID
    const deleteRows = await AnswerRating.query().deleteById([
      req.body.QuestionID,
      req.body.UserID,
      res.locals.UserID,
    ]);

    if (deleteRows > 0) {
      res.json({ message: "Rating deleted" });
    } else {
      res.status(404).json({ message: "Rating not found" });
    }
  } catch (err) {
    next(err);
  }
});

// protected route, to be used when rating a question
router.post("/question", verifyAccessToken, async (req, res, next) => {
  try {
    const rating = await QuestionRating.query().insert({
      QuestionID: req.body.QuestionID,
      UserID: res.locals.UserID,
      Rating: req.body.Rating,
    });

    res.json(rating);
  } catch (err) {
    next(err);
  }
});

// protected route, to be used when changing question rating (i.e. from like to dislike)
router.put("/question", verifyAccessToken, async (req, res, next) => {
  try {
    const rating = await QuestionRating.query().patchAndFetchById(
      [req.body.QuestionID, res.locals.UserID],
      { Rating: req.body.Rating }
    );

    res.json(rating);
  } catch (err) {
    next(err);
  }
});

// protected route, to be used when deleting a question rating
router.delete("/question", verifyAccessToken, async (req, res, next) => {
  try {
    const deleteRows = await QuestionRating.query().deleteById([
      req.body.QuestionID,
      res.locals.UserID,
    ]);

    if (deleteRows > 0) {
      res.json({ message: "Rating deleted" });
    } else {
      res.status(404).json({ message: "Rating not found" });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
