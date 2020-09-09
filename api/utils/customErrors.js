class EmailError extends Error {
  constructor() {
    super("Invalid email or password");
    this.name = "EmailError";
  }
}

class PasswordError extends EmailError {
  constructor() {
    super();
    this.name = "PasswordError";
  }
}

module.exports = { EmailError, PasswordError };
