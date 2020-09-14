const { Model } = require("objection");
const schema = require("../schemas/Question.json");

class Question extends Model {
  static get tableName() {
    return "Questions";
  }

  static get idColumn() {
    return "QuestionID";
  }

  static get jsonSchema() {
    return schema;
  }

  static get relationMappings() {
    const User = require("./User");
    const Answer = require("./Answer");
    const QuestionRating = require("./QuestionRating");

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "Questions.UserID",
          to: "Users.UserID",
        },
      },

      answers: {
        relation: Model.HasManyRelation,
        modelClass: Answer,
        join: {
          from: "Questions.QuestionID",
          to: "Answers.QuestionID",
        },
      },

      ratings: {
        relation: Model.HasManyRelation,
        modelClass: QuestionRating,
        join: {
          from: "Questions.QuestionID",
          to: "QuestionRatings.QuestionID",
        },
      },
    };
  }
}

module.exports = Question;
