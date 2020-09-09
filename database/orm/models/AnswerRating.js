const { Model } = require("objection");
const schema = require("../schemas/AnswerRating.json");

class AnswerRating extends Model {
  static get tableName() {
    return "AnswerRatings";
  }

  static get idColumn() {
    return ["QuestionID", "AnswerUserID", "RatingUserID"];
  }

  static get jsonSchema() {
    return schema;
  }

  static get relationMappings() {
    const Answer = require("./Answer");
    const User = require("./User");

    return {
      answer: {
        relation: Model.BelongsToOneRelation,
        modelClass: Answer,
        join: {
          from: "AnswerRatings.AnswerID",
          to: "Answers.AnswerID",
        },
      },

      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "AnswerRatings.UserID",
          to: "Users.UserID",
        },
      },
    };
  }
}

module.exports = AnswerRating;
