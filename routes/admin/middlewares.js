const { validationResult } = require('express-validator');

module.exports = {
  // custom error handlers depending on template function passed as parameter
  handleErrors(templateFn, dataCb) {
    return async (req, res, next) => {
      // check() passes information to the req
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        // to prevent spreading undefined in the ...data, assign data to {}
        let data = {};
        if (dataCb) {
          data = await dataCb(req);
        }
        // errors comes from validation process / validators.js
        return res.send(templateFn({ errors, ...data }));
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
