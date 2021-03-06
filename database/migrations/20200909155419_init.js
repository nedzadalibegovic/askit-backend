exports.up = function (knex) {
  return knex.schema
    .createTable("Users", (table) => {
      table.increments("UserID");
      table.string("FirstName");
      table.string("LastName");
      table.string("Email").unique().notNullable();
      table.string("Password").notNullable();
      table.string("Token");
      table.integer("AnswerCount").unsigned().defaultTo(0);
    })
    .createTable("Questions", (table) => {
      table.increments("QuestionID");
      table.string("Title").notNullable();
      table.text("Body");
      table.integer("UserID").unsigned().notNullable();
      table.integer("AnswerCount").unsigned().defaultTo(0);
      table.integer("LikeCount").unsigned().defaultTo(0);
      table.integer("DislikeCount").unsigned().defaultTo(0);
      table.foreign("UserID").references("Users.UserID").onDelete("CASCADE");
    })
    .createTable("Answers", (table) => {
      table.integer("QuestionID").unsigned();
      table.integer("UserID").unsigned();
      table.text("Body").notNullable();
      table.integer("LikeCount").unsigned().defaultTo(0);
      table.integer("DislikeCount").unsigned().defaultTo(0);
      table.primary(["QuestionID", "UserID"]);
      table
        .foreign("QuestionID")
        .references("Questions.QuestionID")
        .onDelete("CASCADE");
      table.foreign("UserID").references("Users.UserID").onDelete("CASCADE");
    })
    .createTable("QuestionRatings", (table) => {
      table.integer("QuestionID").unsigned();
      table.integer("UserID").unsigned();
      table.enu("Rating", ["Like", "Dislike"]).notNullable();
      table.primary(["QuestionID", "UserID"]);
      table
        .foreign("QuestionID")
        .references("Questions.QuestionID")
        .onDelete("CASCADE");
      table.foreign("UserID").references("Users.UserID").onDelete("CASCADE");
    })
    .createTable("AnswerRatings", (table) => {
      table.integer("QuestionID").unsigned();
      table.integer("AnswerUserID").unsigned();
      table.integer("RatingUserID").unsigned();
      table.enu("Rating", ["Like", "Dislike"]).notNullable();
      table.primary(["QuestionID", "AnswerUserID", "RatingUserID"]);
      table
        .foreign(["QuestionID", "AnswerUserID"])
        .references(["QuestionID", "UserID"])
        .inTable("Answers")
        .onDelete("CASCADE");
      table
        .foreign("RatingUserID")
        .references("Users.UserID")
        .onDelete("CASCADE");
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTable("AnswerRatings")
    .dropTable("QuestionRatings")
    .dropTable("Answers")
    .dropTable("Questions")
    .dropTable("Users");
};
