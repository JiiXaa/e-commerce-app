const { validationResult } = require('express-validator');

module.exports = {
  // custom error handlers depending on template function passed as parameter
  handleErrors(templateFn) {
    return (req, res, next) => {
      // check() passes information to the req
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.send(templateFn({ errors }));
      }

      next();
    };
  },
  requireAuth(req, res, next) {
    // check if user is logged in, if not redirects to sign in page
    if (!req.session.userId) {
      return res.redirect('/signin');
    }

    next();
  },
};
