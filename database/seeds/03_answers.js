exports.seed = function (knex) {
  return knex("Answers").insert([
    { QuestionID: 1, UserID: 2, Body: "It's 42.", RatingCount: 1 },
  ]);
};
