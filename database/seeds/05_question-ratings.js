exports.seed = function (knex) {
  return knex("QuestionRatings").insert([
    { QuestionID: 1, UserID: 2, Rating: "Like" },
  ]);
};
