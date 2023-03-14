const express = require('express');
const UserRouter = express.Router();
const mongoose = require('mongoose');
const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const middleware = require("../middleware");
const { authenticate } = require('passport');

UserRouter.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    user = new User({
      username,
      password,
      role: null,
      status: 'active',
      token: '',
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.salt = salt;

    await user.save()

    res.status(201).json({ message: 'User created successfully' });

  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
});
UserRouter.post('/login',
  middleware.isLocalAuthenticated,
  async (req, res, next) => {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
      const payload = {
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      };
      const token = middleware.getToken({ user: payload.user })

      user.token = token;
      await user.save();

      res.status(200).json({ token: token });
    } catch (err) {
      next(err)
    }
  });
UserRouter.delete("/logout", middleware.checkLogin, (req, res, next) => {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.json({ message: "successfully logout." })
  });
})

UserRouter.get('/', middleware.isAdmin, async (req, res, next) => {
  try {
    User.find().populate("role")
      .populate({
        path: "role",
        populate: {
          path: "permissions",
          model: "Permissions"
        }
      })
      .then((users) => {
        res.status(200).json(users);
      }, (err) => next(err))
  } catch (err) {
    next(err)
  }
});

UserRouter.get('/:id', middleware.isAdmin, (req, res,next) => {
  try {
    User.findById(req.params.id).populate("role")
      .populate({
        path: "role",
        populate: {
          path: "permissions",
          model: "Permissions"
        }
      })
      .then((user) => {
        res.status(200).json(user);
      }, (err) => next(err))
  } catch (err) {
    next(err)
  }
});

UserRouter.post('/', middleware.isAdmin, async (req, res,next) => {
  const user = new User({
    email: req.body.email,
    password: req.body.password,
    old_password: req.body.old_password,
    token: req.body.token,
    status: req.body.status,
    role: req.body.role
  });

  try {
    User.create(user).then((newUser)=>{
      res.status(201).json(newUser)
    }, (err)=>next(err))
    .catch((err)=>next(err))
  } catch (err) {
    next(err)
  }
});

UserRouter.patch('/:id', async (req, res, next) => {
  User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
    .then((user) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json("User Updated Successfully.");
    }, (err) => next(err))
    .catch((err) => next(err));
});

UserRouter.delete('/:id', middleware.isAdmin, async (req, res,next) => {
  User.findByIdAndDelete(req.params.id)
    .then((user) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json("User Deleted");
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = UserRouter;
