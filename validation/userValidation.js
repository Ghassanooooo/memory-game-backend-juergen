const { check, body } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
exports.signup = [
  check("username")
    .isLength({ min: 2, max: 255 })
    .withMessage(
      "User name is reqired min length 2 charctars max length 255 charctars"
    )
    .trim(),
  check("email")
    .isEmail()
    .withMessage("Invalid Email")
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage("Email max length 255")
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then(user => {
        if (user) {
          return Promise.reject("the user alrady exist");
        }
      });
    })
    .trim(),
  body("password")
    .isAlphanumeric()
    .withMessage("password accept numbers and text")
    .isLength({ min: 5, max: 50 })
    .withMessage("password min length 5 and max  length 50")
    .trim(),
  body("confirmPassword")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("the password is not confirmed");
      }
      return true;
    })
    .trim()
];

exports.login = [
  check("email")
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then(user => {
        if (!user) {
          return Promise.reject("the email or password is not valid");
        }
        return bcrypt
          .compare(req.body.password, user.password)
          .then(isMatsh => {
            if (isMatsh) {
              return true;
            }
            return Promise.reject("the email or password is not valid");
          });
      });
    })
    .trim()
];