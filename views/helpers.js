module.exports = {
  getError(errors, prop) {
    // for a signup.js:
    // prop === 'email' || 'password' || 'passwordConfirmation'
    // for a signin.js:
    // prop === 'email' || 'password'
    try {
      return errors.mapped()[prop].msg;
    } catch (err) {
      return '';
    }
  },
};
