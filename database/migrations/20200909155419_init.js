exports.up = function (knex) {
  return knex.schema
    .createTable("Users", (table) => {
      table.increments("UserID");
      table.string("FirstName");
      table.string("LastName");
      table.string("Email").unique().notNullable();
      table.string("Password").notNullable();
      table.integer("AnswerCount").defaultTo(0);
    })
    .createTable("Tokens", (table) => {
      table.integer("UserID").unsigned();
      table.string("Token").notNullable();
      table.primary("UserID");
      table.foreign("UserID").references("Users.UserID");
    })
    .createTable("Questions", (table) => {
      table.increments("QuestionID");
      table.string("Title").notNullable();
      table.text("Body");
      table.integer("UserID").unsigned().notNullable();
      table.integer("AnswerCount").defaultTo(0);
      table.integer("RatingCount").defaultTo(0);
      table.foreign("UserID").references("Users.UserID");
    })
    .createTable("Answers", (table) => {
      table.integer("QuestionID").unsigned();
      table.integer("UserID").unsigned();
      table.text("Body").notNullable();
      table.integer("RatingCount").defaultTo(0);
      table.primary(["QuestionID", "UserID"]);
      table.foreign("QuestionID").references("Questions.QuestionID");
      table.foreign("UserID").references("Users.UserID");
    })
    .createTable("QuestionRatings", (table) => {
      table.integer("QuestionID").unsigned();
      table.integer("UserID").unsigned();
      table.enu("Rating", ["Like", "Dislike"]).notNullable();
      table.primary(["QuestionID", "UserID"]);
      table.foreign("QuestionID").references("Questions.QuestionID");
      table.foreign("UserID").references("Users.UserID");
    })
    .createTable("AnswerRatings", (table) => {
      table.integer("QuestionID").unsigned();
      table.integer("AnswerUserID").unsigned();
      table.integer("RatingUserID").unsigned();
      table.enu("Rating", ["Like", "Dislike"]).notNullable();
      table.primary(["QuestionID", "AnswerUserID", "RatingUserID"]);
      table.foreign("QuestionID").references("Answers.QuestionID");
      table.foreign("AnswerUserID").references("Answers.UserID");
      table.foreign("RatingUserID").references("Users.UserID");
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTable("AnswerRatings")
    .dropTable("QuestionRatings")
    .dropTable("Answers")
    .dropTable("Questions")
    .dropTable("Tokens")
    .dropTable("Users");
};