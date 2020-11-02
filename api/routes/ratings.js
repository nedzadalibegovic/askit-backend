const router = require("express").Router();

const verifyAccessToken = require("../middlewares/verifyAccessToken");
const AnswerRating = require("../../database/orm/models/AnswerRating");
const QuestionRating = require("../../database/orm/models/QuestionRating");

// protected route, to be used when rating an answer
router.post("/answer", verifyAccessToken, async (req, res, next) => {
  try {
    const rating = await AnswerRating.transaction(async (trx) => {
      // PK of Answer record: QuestionID, AnswerUserID
      // PK of User giving a rating: RatingUserID
      const rating = await AnswerRating.query(trx).insert({
        QuestionID: req.body.QuestionID,
        AnswerUserID: req.body.UserID,
        RatingUserID: res.locals.UserID,
        Rating: req.body.Rating,
      });

      if (rating.Rating === "Like") {
        await rating.$relatedQuery("answer", trx).increment("LikeCount", 1);
      } else {
        await rating.$relatedQuery("answer", trx).increment("DislikeCount", 1);
      }

      return rating;
    });

    res.json(rating);
  } catch (err) {
    next(err);
  }
});

// protected route, to be used when changing answer rating (i.e. from like to dislike)
router.put("/answer", verifyAccessToken, async (req, res, next) => {
  try {
    const rating = await AnswerRating.transaction(async (trx) => {
      const rating = await AnswerRating.query(trx).patchAndFetchById(
        [req.body.QuestionID, req.body.UserID, res.locals.UserID],
        {
          Rating: req.body.Rating,
        }
      );

      if (rating.Rating === "Like") {
        await rating.$relatedQuery("answer", trx).increment("LikeCount", 1);
        await rating.$relatedQuery("answer", trx).decrement("DislikeCount", 1);
      } else {
        await rating.$relatedQuery("answer", trx).increment("DislikeCount", 1);
        await rating.$relatedQuery("answer", trx).decrement("LikeCount", 1);
      }

      return rating;
    });

    res.json(rating);
  } catch (err) {
    next(err);
  }
});

// protected route, to be used when deleting an answer rating
router.delete("/answer", verifyAccessToken, async (req, res, next) => {
  try {
    const deletedRows = await AnswerRating.transaction(async (trx) => {
      // PK of Answer record: req.body.QuestionID, req.body.UserID
      // PK of User giving a rating: res.locals.UserID
      const answerRating = await AnswerRating.query(trx).findById([
        req.body.QuestionID,
        req.body.UserID,
        res.locals.UserID,
      ]);

      if (answerRating.Rating === "Like") {
        await answerRating
          .$relatedQuery("answer", trx)
          .decrement("LikeCount", 1);
      } else {
        await answerRating
          .$relatedQuery("answer", trx)
          .decrement("DislikeCount", 1);
      }

      return answerRating.$query(trx).delete();
    });

    if (deletedRows > 0) {
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
    const rating = await QuestionRating.transaction(async (trx) => {
      const rating = await QuestionRating.query(trx).insert({
        QuestionID: req.body.QuestionID,
        UserID: res.locals.UserID,
        Rating: req.body.Rating,
      });

      if (rating.Rating === "Like") {
        await rating.$relatedQuery("question", trx).increment("LikeCount", 1);
      } else {
        await rating
          .$relatedQuery("question", trx)
          .increment("DislikeCount", 1);
      }

      return rating;
    });

    res.json(rating);
  } catch (err) {
    next(err);
  }
});

// protected route, to be used when changing question rating (i.e. from like to dislike)
router.put("/question", verifyAccessToken, async (req, res, next) => {
  try {
    const rating = await QuestionRating.transaction(async (trx) => {
      const rating = await QuestionRating.query(trx).patchAndFetchById(
        [req.body.QuestionID, res.locals.UserID],
        { Rating: req.body.Rating }
      );

      if (rating.Rating === "Like") {
        await rating.$relatedQuery("question", trx).increment("LikeCount", 1);
        await rating
          .$relatedQuery("question", trx)
          .decrement("DislikeCount", 1);
      } else {
        await rating
          .$relatedQuery("question", trx)
          .increment("DislikeCount", 1);
        await rating.$relatedQuery("question", trx).decrement("LikeCount", 1);
      }

      return rating;
    });

    res.json(rating);
  } catch (err) {
    next(err);
  }
});

// protected route, to be used when deleting a question rating
router.delete("/question", verifyAccessToken, async (req, res, next) => {
  try {
    const deletedRows = await QuestionRating.transaction(async (trx) => {
      const questionRating = await QuestionRating.query(trx).findById([
        req.body.QuestionID,
        res.locals.UserID,
      ]);

      if (questionRating.Rating === "Like") {
        await questionRating
          .$relatedQuery("question", trx)
          .decrement("LikeCount", 1);
      } else {
        await questionRating
          .$relatedQuery("question", trx)
          .decrement("DislikeCount", 1);
      }

      return questionRating.$query(trx).delete();
    });

    if (deletedRows > 0) {
      res.json({ message: "Rating deleted" });
    } else {
      res.status(404).json({ message: "Rating not found" });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
