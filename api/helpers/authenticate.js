const User = require("../../database/orm/models/User");
const { EmailError, PasswordError } = require("../utils/customErrors");

module.exports = async (email, plaintext) => {
  const user = await User.query().findOne("Email", email);

  if (user === undefined) {
    throw new EmailError();
  }

  if (!(await user.verifyPassword(plaintext))) {
    throw new PasswordError();
  }

  return user;
};
