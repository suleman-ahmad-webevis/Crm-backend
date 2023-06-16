const express = require('express');
const permissionRouter = express.Router();
const mongoose = require('mongoose');
const middleware = require('../middleware')
const Permissions = require('../Models/Permission');

permissionRouter.get("/", (req, res, next) => {
  console.log("user3", req.user)
    Permissions.find({})
      .then((permisssions) => {
        res.status(200).json(permisssions)
      },(err) => next(err))
      .catch(err =>
        next(new Error("Couldn't get all Permissions"))
      )
  })
  permissionRouter.post("/",(req, res, next) => {
    const newPermission = new Permissions({
      title: req.body.title,
      route: req.body.route
    })
    Permissions.create(newPermission)
      .then((permisssions) => {
        res.status(200).json(permisssions)
      },(err) => next(err))
      .catch(err =>
        next(new Error("Couldn't Create Premission"))
      )
  });

permissionRouter.route("/:id",middleware.isAdmin)
  .patch((req,res,next)=>{
    Permissions.findByIdAndUpdate( req.params.id,{ $set: req.body}, { new: true })
    .then((permission) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(permission);
    }, (err) => next(err))
    .catch((err) => next(err));
  })
  .delete((req,res,next)=>{
    Permissions.findByIdAndDelete(req.params.id)
    .then((permission) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(permission);
  }, (err) => next(err))
  .catch((err) => next(err));
  })
module.exports = permissionRouter;
