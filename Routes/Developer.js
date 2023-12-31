const express = require("express");
const DeveloperRouter = express.Router();
const Developer = require("../Models/Developer");
const middleware = require("../middlewares/auth");

// Create a new deal
DeveloperRouter.post("/", middleware.isAdmin, async (req, res, next) => {
  const deal = new Developer({
    developer_stack: req.body.developer_stack,
    developer_name: req.body.developer_name,
    developer_price: req.body.developer_price,
  });
  try {
    deal.save().then(
      () => {
        res.status(200).json({
          success: true,
          message: "Developer Created Successfully",
        });
      },
      (err) => next(err)
    );
  } catch (err) {
    next(err);
  }
});

// Get all Developer
DeveloperRouter.get("/", async (req, res, next) => {
  try {
    Developer.find().then(
      (Developer) => {
        res.status(200).json({ success: true, data: Developer });
      },
      (err) => next(err)
    );
  } catch (err) {
    console.log("er", err);
    next(err);
  }
});

// Get a specific deal by ID
DeveloperRouter.get("/:id", (req, res, next) => {
  try {
    Developer.findById(req.params.id).then(
      (Developer) => {
        res.status(200).json({ success: true, data: Developer });
      },
      (err) => next(err)
    );
  } catch (err) {
    next(err);
  }
});

// Update a deal
DeveloperRouter.patch("/:id", async (req, res, next) => {
  Developer.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
    .then(
      () => {
        res.status(200).json("Developer Updated Successfully");
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

// Delete a deal
DeveloperRouter.delete("/:id", async (req, res, next) => {
  Developer.findByIdAndDelete(req.params.id)
    .then(
      () => {
        res.status(200).json({ success: true, message: "Developer Deleted" });
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

DeveloperRouter.route("/developer/:names").get((req, res, next) => {
  const name = req.body.name;
  Developer.aggregate([
    {
      $match: {
        developer: name,
      },
    },
    {
      $project: {
        _id: 0,
        name: 1,
      },
    },
  ])
    .then((data) => {
      res.status(200).json({ success: true, data: data });
    })
    .catch((err) => next(err));
});

DeveloperRouter.route("/developers/:search").get((req, res, next) => {
  const minAmount = req.body.minAmount;
  const maxAmount = req.body.maxAmount;
  const position = req.body.position;
  Developer.aggregate([
    {
      $match: {
        developer: position,
        $and: [
          { quotation: { $lte: maxAmount } },
          { quotation: { $gte: minAmount } },
        ],
      },
    },
    {
      $project: {
        _id: 0,
        name: 1,
        email: 1,
        description: 1,
        developer: 1,
        quotation: 1,
      },
    },
  ])
    .then((data) => {
      res.status(200).json({ success: true, data: data });
    })
    .catch((err) => next(err));
});

module.exports = DeveloperRouter;
