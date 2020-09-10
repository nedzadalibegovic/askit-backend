exports.seed = function (knex) {
  return knex("Questions").insert([
    {
      QuestionID: 1,
      Title: "What is the meaning of life?",
      Body:
        "This question pertains to the significance of living or existence in general.",
      UserID: 1,
    },
  ]);
};
