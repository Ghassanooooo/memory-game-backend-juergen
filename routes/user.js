const express = require("express");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");
const keys = require("../config/keys");
const { validationResult } = require("express-validator/check");
const validation = require("../validation/userValidation");

router.post("/signup",validation.signup, async (req, res) => {
  const { username, email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array() });
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  if (hashedPassword) {
    return new User({
      username,
      email,
      password: hashedPassword
    }).save((err, userdata) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      
      return res.status(201).json(userdata);
    });
  }
});

router.post("/login",validation.login, async (req, res, next) => {
    const { email } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array() });
  }
  try {
    const user = await User.findOne({ email });
    if (user) {
      const expirationDate = 2592000000;
      const token = jwt.sign(
        { email: user.email, id: user._id.toString(), admin: user.admin },
        keys.jwtToken,
        { expiresIn: expirationDate }
      );
      return res
        .status(200)
        .json({ token, userId: user._id.toString(), expirationDate });
    }
  } catch (e) {
    const error = new Error(e);
    error.httpStateCode = 500;
    return next(error);
  }
});


module.exports = router;