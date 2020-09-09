const bcrypt = require("bcrypt");

exports.seed = function (knex) {
  return knex("Users").insert([
    {
      UserID: 1,
      FirstName: "John",
      LastName: "Doe",
      Email: "john.doe@gmail.com",
      Password: bcrypt.hashSync("P@ssw0rd!", 12),
    },
    {
      UserID: 2,
      FirstName: "Jane",
      LastName: "Doe",
      Email: "jane.doe@yahoo.com",
      Password: bcrypt.hashSync("P@ssw0rd!", 12),
    },
  ]);
};
