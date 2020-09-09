const { Model } = require("objection");
const schema = require("../schemas/QuestionRating.json");
const User = require("./User");

class QuestionRating extends Model {
  static get tableName() {
    return "QuestionRatings";
  }

  static get idColumn() {
    return ["QuestionID", "UserID"];
  }

  static get jsonSchema() {
    return schema;
  }

  static get relationMappings() {
    const Question = require("./Question");

    return {
      question: {
        relation: Model.BelongsToOneRelation,
        modelClass: Question,
        join: {
          from: "QuestionRatings.QuestionID",
          to: "Questions.QuestionID",
        },
      },

      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "QuestionRatings.UserID",
          to: "Users.UserID",
        },
      },
    };
  }
}

module.exports = QuestionRating;
