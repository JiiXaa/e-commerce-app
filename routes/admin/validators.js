const { check } = require('express-validator');
const usersRepo = require('../../repositories/users');

module.exports = {
  requireTitle: check('title')
    .trim()
    .isLength({ min: 5, max: 40 })
    .withMessage('Must be between 5 and 40 characters'),
  requirePrice: check('price')
    .trim()
    .toFloat() // convert to a float number
    .isFloat({ min: 1 }) // checks if passed/converted value is a float and set to minimum 1
    .withMessage('Number must be greater than 1'),
  requireEmail: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .custom(async (email) => {
      const existingUser = await usersRepo.getOneBy({ email });
      if (existingUser) {
        throw new Error(`${email} is already taken.`);
      }
    }),
  requirePassword: check('password')
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage('Must be between 6 and 20 characters'),
  requirePasswordConfirmation: check('passwordConfirmation')
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage('Must be between 6 and 20 characters')
    .custom((passwordConfirmation, { req }) => {
      // The  callback function that you pass to your custom validator is synchronous. Synchronous callbacks require  to return explicit boolean flags, in order to indicate whether the  validation step has succeeded or not. (if you throw an exception, it becomes obvious that the operation has failed)
      if (passwordConfirmation !== req.body.password) {
        throw new Error('Passwords must match!');
      } else {
        return true;
      }
    }),
  requireEmailExists: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must provide a valid email')
    .custom(async (email) => {
      const user = await usersRepo.getOneBy({ email });
      if (!user) {
        throw new Error('Email not found');
      }
    }),
  requireValidPasswordForUser: check('password')
    .trim()
    .custom(async (password, { req }) => {
      const user = await usersRepo.getOneBy({ email: req.body.email });
      if (!user) {
        throw new Error('User does not exist.');
      }

      const validPassword = await usersRepo.comparePasswords(
        user.password,
        password
      );

      if (!validPassword) {
        throw new Error('Invalid password');
      }
    }),
};
