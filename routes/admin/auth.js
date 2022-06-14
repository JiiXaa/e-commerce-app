const express = require('express');

const { handleErrors } = require('./middlewares');
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const {
  requireEmail,
  requirePassword,
  requirePasswordConfirmation,
  requireEmailExists,
  requireValidPasswordForUser,
} = require('./validators');

const router = express.Router();

router.get('/signup', (req, res) => {
  res.send(signupTemplate({ req }));
});

router.post(
  '/signup',
  [requireEmail, requirePassword, requirePasswordConfirmation],
  handleErrors(signupTemplate),
  async (req, res) => {
    // info from form
    const { email, password } = req.body;

    // Create a user in our user repo to represent this person
    // / create method returns object with user email, password and create an id.
    const user = await usersRepo.create({ email, password });

    // Store the id of that user inside the users cookie
    // / req.session is an {} added by cookie-session and we can add anything to it.
    // / we creating userId and assign param with user.id created by UsersRepo.create()
    req.session.userId = user.id;

    res.send('Account created!');
  }
);

router.get('/signout', (req, res) => {
  req.session = null;
  res.send('You are logged out');
});

router.get('/signin', (req, res) => {
  // have to pass at least {} to avoid getting error, because signinTemplate has a destructuring inside it
  res.send(signinTemplate({}));
});

router.post(
  '/signin',
  [requireEmailExists, requireValidPasswordForUser],
  handleErrors(signinTemplate),
  async (req, res) => {
    const { email, password } = req.body;

    const user = await usersRepo.getOneBy({ email });

    req.session.userId = user.id;

    res.send('You are signed in!');
  }
);

module.exports = router;
