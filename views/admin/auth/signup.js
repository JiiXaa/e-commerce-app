const layout = require('../layout');

const getError = (errors, prop) => {
  // prop === 'email' || 'password' || 'passwordConfirmation'
  try {
    return errors.mapped()[prop].msg;
  } catch (err) {
    return '';
  }
};

module.exports = ({ req, errors }) => {
  return layout({
    content: `
      <div>
        Your id is: ${req.session.userId}
        <form method="POST">
          <input name="email" placeholder="email"/>
          ${getError(errors, 'email')}
          <input type="password" name="password" placeholder="password"/>
          ${getError(errors, 'password')}
          <input type="password" name="passwordConfirmation" placeholder="confirm password"/>
          ${getError(errors, 'passwordConfirmation')}
          <button>Sign Up</button>
        </form>
      </div>
    `,
  });
};
