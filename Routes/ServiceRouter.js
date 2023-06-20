const express = require("express");
const ServiceRouter = express.Router();
const Service = require("../models/Service");
const middleware = require("../middlewares/auth");

// Get all Service
ServiceRouter.get("/", middleware.isAdmin, async (req, res, next) => {
  try {
    Service.find().then(
      (Service) => {
        res.status(200).json({ success: true, data: Service });
      },
      (err) => next(err)
    );
  } catch (err) {
    console.log("er", err);
    next(err);
  }
});

// Get a specific deal by ID
ServiceRouter.get("/:id", middleware.isAdmin, async (req, res, next) => {
  try {
    Service.findById(req.params.id).then(
      (Service) => {
        res.status(200).json({ success: true, data: Service });
      },
      (err) => next(err)
    );
  } catch (err) {
    next(err);
  }
});

// Create a new deal
ServiceRouter.post("/", middleware.isAdmin, async (req, res, next) => {
  const deal = new Service({
    name: req.body.name,
    email: req.body.email,
    service: req.body.service,
    price: req.body.price,
  });

  try {
    deal.save().then(
      () => {
        res
          .status(200)
          .json({ success: true, message: "Service created successfully" });
      },
      (err) => next(err)
    );
  } catch (err) {
    next(err);
  }
});

// Update a deal
ServiceRouter.patch("/:id", middleware.isAdmin, async (req, res, next) => {
  Service.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
    .then(
      () => {
        res.status(200).res.json({ message: "Service Updated Successfully" });
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

// Delete a deal

ServiceRouter.delete("/:id", middleware.isAdmin, async (req, res, next) => {
  Service.findByIdAndDelete(req.params.id)
    .then(
      () => {
        res.status(200).res.json({ success: true, message: "Service Deleted" });
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

module.exports = ServiceRouter;
