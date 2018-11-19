const express = require("express");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");
const keys = require("../config/keys");

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
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

router.post("/login", async (req, res, next) => {
  const { email } = req.body;
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