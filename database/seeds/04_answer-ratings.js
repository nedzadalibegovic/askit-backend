exports.seed = function (knex) {
  return knex("AnswerRatings").insert([
    { QuestionID: 1, AnswerUserID: 2, RatingUserID: 1, Rating: "Like" },
  ]);
};
