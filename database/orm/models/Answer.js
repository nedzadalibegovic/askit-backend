const { Model } = require("objection");
const schema = require("../schemas/Answer.json");

class Answer extends Model {
  static get tableName() {
    return "Answers";
  }

  static get idColumn() {
    return ["QuestionID", "UserID"];
  }

  static get jsonSchema() {
    return schema;
  }

  static get relationMappings() {
    const User = require("./User");
    const Question = require("./Question");
    const AnswerRating = require("./AnswerRating");

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "Answers.UserID",
          to: "Users.UserID",
        },
      },

      question: {
        relation: Model.BelongsToOneRelation,
        modelClass: Question,
        join: {
          from: "Answers.QuestionID",
          to: "Questions.QuestionID",
        },
      },

      ratings: {
        relation: Model.HasManyRelation,
        modelClass: AnswerRating,
        join: {
          from: ["Answers.QuestionID", "Answers.UserID"],
          to: ["AnswerRatings.QuestionID", "AnswerRatings.AnswerUserID"],
        },
      },
    };
  }
}

module.exports = Answer;
