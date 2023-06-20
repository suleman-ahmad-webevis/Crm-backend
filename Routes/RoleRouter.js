const express = require("express");
const RoleRouter = express.Router();
const Role = require("../Models/Role");
const middleware = require("../middlewares/auth");

RoleRouter.route("/").get((req, res, next) => {
  Role.find({})
    .populate("permissions")
    .then(
      (roles) => {
        res.status(200).json(roles);
      },
      (err) => next(err)
    )
    .catch((err) => next(new Error("Cannot get all Role")));
});

RoleRouter.post("/", middleware.isAdmin, (req, res, next) => {
  const newRole = new Role({
    title: req.body.title,
    permissions: req.body.permissions,
  });
  Role.create(newRole)
    .then(
      (role) => {
        res.status(200).json(role);
      },
      (err) => next(err)
    )
    .catch((err) => next(new Error("Couldnot Create Role")));
});

RoleRouter.route("/:id")
  .patch(middleware.isAdmin, (req, res, next) => {
    Role.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
      .then(
        (role) => {
          res.status(200).res.json(role);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete(middleware.isAdmin, (req, res, next) => {
    Role.findByIdAndDelete(req.params.id)
      .then(
        (role) => {
          res.status(200).res.json(role);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

module.exports = RoleRouter;
