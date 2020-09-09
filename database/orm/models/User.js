const { Model } = require("objection");
const Password = require("objection-password")({
  passwordField: "Password",
});
const schema = require("../schemas/User.json");

class User extends Password(Model) {
  static get tableName() {
    return "Users";
  }

  static get idColumn() {
    return "UserID";
  }

  static get jsonSchema() {
    return schema;
  }

  static get relationMappings() {
    const Question = require("./Question");
    const Answer = require("./Answer");
    const QuestionRating = require("./QuestionRating");
    const AnswerRating = require("./AnswerRating");

    return {
      questions: {
        relation: Model.HasManyRelation,
        modelClass: Question,
        join: {
          from: "Users.UserID",
          to: "Questions.UserID",
        },
      },

      answers: {
        relation: Model.HasManyRelation,
        modelClass: Answer,
        join: {
          from: "Users.UserID",
          to: "Answers.UserID",
        },
      },

      question_ratings: {
        relation: Model.HasManyRelation,
        modelClass: QuestionRating,
        join: {
          from: "Users.UserID",
          to: "QuestionRatings.UserID",
        },
      },

      answer_ratings: {
        relation: Model.HasManyRelation,
        modelClass: AnswerRating,
        join: {
          from: "Users.UserID",
          to: "AnswerRatings.UserID",
        },
      },
    };
  }
}

module.exports = User;
