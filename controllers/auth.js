const User = require("../models/user");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const { errorHandler } = require("../helpers/dbErrorHandler");

// Sign-Up Route is checking where the USER exist or not.
// If it doesn't then get the New name, email and password from req.body and make a NEW User.
// If every details of Sign-Up is alright then Send me message in JSON "Signup success! Please signin."
exports.signup = (req, res) => {
  User.findOne({ email: req.body.email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({
        error: "Email is taken",
      });
    }

    const { name, email, password } = req.body;

    let newUser = new User({ name, email, password });
    newUser.save((err, success) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      res.json({
        message: "Signup success! Please signin.",
      });
    });
  });
};

// Sign-In Route is checking where the USER already exist or not in the Database (MongoDB).
// If the Email only doesn't exist then send an error message "User with that email does not exist. Please signup."
// But if the Email or Password is Wrong hen send an error message "Email and password do not match."
// Else using JWT authetication Sign-In the Correct User by getting there details. 
exports.signin = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with that email does not exist. Please signup.",
      });
    }

    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: "Email and password do not match.",
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "876543567687987675645657898765455687980978675643465768798d",
    });

    res.cookie("token", token, {
      expiresIn: "876543567687987675645657898765455687980978675643465768798d",
    });
    const { _id, name, email } = user;
    return res.json({
      token,
      user: { _id, name, email },
    });
  });
};

// Sign-Out Route is signing out the User by clearing the Cookie associated with that Token in the Browser.
// And also giveing a message "Signout success".
exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "Signout success",
  });
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
});

exports.authMiddleware = (req, res, next) => {
  const authUserId = req.user._id;
  User.findById({ _id: authUserId }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    req.profile = user;
    next();
  });
};
