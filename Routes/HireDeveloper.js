const express = require("express");
const router = express.Router();
const HireDeveloper = require("../Models/HireDeveloper");

// Create a new deal
router.post("/", async (req, res) => {
  const deal = new HireDeveloper({
    client_name: req.body.client_name,
    client_email: req.body.client_email,
    developer_stack: req.body.developer_stack,
    developer_name: req.body.developer_name,
    developer_price: req.body.developer_price,
  });

  try {
    deal.save().then(
      () => {
        res
          .status(200)
          .json({
            success: true,
            message: "hireDeveloper is created successfully",
          });
      },
      (err) => next(err)
    );
  } catch (err) {
    next(err);
  }
});

// Get all Hire_Developer
router.get("/", async (req, res, next) => {
  try {
    HireDeveloper.find().then(
      (hireDeveloper) => {
        res.status(200).json({ success: true, data: hireDeveloper });
      },
      (err) => next(err)
    );
  } catch (err) {
    console.log("er", err);
    next(err);
  }
});

// Get a specific deal by ID
router.get("/:id", (req, res, next) => {
  try {
    HireDeveloper.findById(req.params.id).then(
      (hireDeveloper) => {
        res.status(200).json({ success: true, data: hireDeveloper });
      },
      (err) => next(err)
    );
  } catch (err) {
    next(err);
  }
});

// Update a deal
router.patch("/:id", async (req, res, next) => {
  HireDeveloper.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  )
    .then(
      () => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json("hireDeveloper Updated Successfully.");
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

// Delete a deal
router.delete("/:id", async (req, res, next) => {
  HireDeveloper.findByIdAndDelete(req.params.id)
    .then(
      () => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({ success: true, message: "hireDeveloper Deleted" });
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

router.route("/developer/:names").get((req, res, next) => {
  const name = req.body.name;

  HireDeveloper.aggregate([
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
router.route("/developers/:search").get((req, res, next) => {
  const minAmount = req.body.minAmount;
  const maxAmount = req.body.maxAmount;
  const position = req.body.position;
  HireDeveloper.aggregate([
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

module.exports = router;
