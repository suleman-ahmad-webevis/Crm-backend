const express = require("express");
const permissionRouter = express.Router();
const middleware = require("../middlewares/auth");
const Permissions = require("../models/Permission");

permissionRouter.get("/", (req, res, next) => {
  Permissions.find({})
    .then(
      (permissions) => {
        res.status(200).json(permissions);
      },
      (err) => next(err)
    )
    .catch((err) => next(new Error("Couldn't get all Permissions")));
});

permissionRouter.post("/", (req, res, next) => {
  const newPermission = new Permissions({
    title: req.body.title,
    route: req.body.route,
  });
  Permissions.create(newPermission)
    .then(
      (permissions) => {
        res.status(200).json(permissions);
      },
      (err) => next(err)
    )
    .catch((err) => next(new Error("Couldn't Create Permission")));
});

permissionRouter
  .route("/:id", middleware.isAdmin)
  .patch((req, res, next) => {
    Permissions.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    )
      .then(
        (permission) => {
          res.status(200).res.json(permission);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    Permissions.findByIdAndDelete(req.params.id)
      .then(
        (permission) => {
          res.status(200).res.json(permission);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

module.exports = permissionRouter;
