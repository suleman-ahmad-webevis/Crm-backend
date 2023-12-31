const express = require("express");
const UserRouter = express.Router();
const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const middleware = require("../middlewares/auth");
const { body, validationResult } = require("express-validator");
// const sessionStorage = require("sessiom")
UserRouter.post(
  "/signup",
  body("email").isEmail().withMessage("Email is incorrect."),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  async (req, res, next) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }
    try {
      console.log("The req.body", req.body);
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: "Email already exists" });
      }
      user = new User({
        ...req.body,
        status: "active",
      });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      user.salt = salt;
      await user.save();
      console.log("The req.session", req.session);
      res
        .status(201)
        .json({ success: true, message: "User created successfully" });
    } catch (err) {
      res.status(500).json({ message: "Server error", err });
    }
  }
);

UserRouter.post(
  "/login",
  // middleware.isLocalAuthenticated,
  // body("email").isEmail().withMessage("Email is incorrect"),
  passport.authenticate("local"),
  async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid email" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid password" });
      }
      // const payload = {
      //   user: {
      //     id: user.id,
      //     username: user.username,
      //     role: user.role,
      //   },
      // };
      // const token = middleware.getToken({ user: payload.user });
      // user.token = token;
      await user.save();
      console.log("The req", req.user);
      console.log("The req.session", req.session);
      // sessionStorage.setItem("user", req.user);
      console.log("The req", req.isAuthenticated());
      res.status(200).json({ message: "Login Successfully", data: user });
    } catch (err) {
      next(err);
    }
  }
);

UserRouter.delete("/logout", (req, res, next) => {
  // console.log("The req.user", req.user, sessionStorage.getItem("user"));
  req.logOut(function (err) {
    if (err) next(err);
    else {
      console.log("the req.user", req.user);
      res.json({ success: true, message: "Successfully logout." });
    }
  });
});

UserRouter.get("/", async (req, res, next) => {
  try {
    User.find()
      .populate("role")
      .populate({
        path: "role",
        populate: {
          path: "permissions",
          model: "Permissions",
        },
      })
      .then(
        (users) => {
          res.status(200).json({ success: true, data: users });
        },
        (err) => next(err)
      );
  } catch (err) {
    console.log("er", err);
    next(err);
  }
});

UserRouter.get("/:id", middleware.isAdmin, (req, res, next) => {
  try {
    User.findById(req.params.id)
      .populate("role")
      .populate({
        path: "role",
        populate: {
          path: "permissions",
          model: "Permissions",
        },
      })
      .then(
        (user) => {
          res.status(200).json({ success: true, data: user });
        },
        (err) => next(err)
      );
  } catch (err) {
    next(err);
  }
});

UserRouter.post("/", middleware.isAdmin, async (req, res, next) => {
  const user = new User({
    email: req.body.email,
    password: req.body.password,
    old_password: req.body.old_password,
    token: req.body.token,
    status: req.body.status,
    role: req.body.role,
  });

  try {
    User.create(user)
      .then(
        (newUser) => {
          res.status(201).json({ success: true, data: newUser });
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  } catch (err) {
    next(err);
  }
});

UserRouter.patch("/:id", async (req, res, next) => {
  User.findByIdAndUpdate(req.params.id, { $push: req.body }, { new: true })
    .then(
      (user) => {
        res.status(200).res.json("User Updated Successfully");
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

UserRouter.delete("/:id", middleware.isAdmin, async (req, res, next) => {
  User.findByIdAndDelete(req.params.id)
    .then(
      (user) => {
        res.status(200).res.json({ success: true, message: "User Deleted" });
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

module.exports = UserRouter;
