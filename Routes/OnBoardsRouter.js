const express = require("express");
const onBoardRouter = express.Router();
const OnBoard = require("../Models/OnBoard");

// Create a new onBoard
onBoardRouter.post("/", async (req, res, next) => {
  const onBoard = new OnBoard({
    name: req.body.name,
    email: req.body.email,
    hire_date: req.body.hire_date,
    department: req.body.department,
    manager: req.body.manager,
    job_title: req.body.job_title,
  });

  try {
    onBoard.save().then(
      () => {
        res
          .status(200)
          .json({ success: true, message: "onBoard is created successfully" });
      },
      (err) => next(err)
    );
  } catch (err) {
    next(err);
  }
});

// Update a onBoard
onBoardRouter.patch("/:id", async (req, res, next) => {
  OnBoard.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
    .then(
      () => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json("onBoard Updated Successfully.");
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

// Get all OnBoard
onBoardRouter.get("/", async (req, res, next) => {
  try {
    OnBoard.find().then(
      (onBoard) => {
        res.status(200).json({ success: true, data: onBoard });
      },
      (err) => next(err)
    );
  } catch (err) {
    console.log("er", err);
    next(err);
  }
});

// Get a specific onBoard by ID
onBoardRouter.get("/:id", async (req, res, next) => {
  try {
    OnBoard.findById(req.params.id).then(
      (onBoard) => {
        res.status(200).json({ success: true, data: onBoard });
      },
      (err) => next(err)
    );
  } catch (err) {
    next(err);
  }
});

// Delete a onBoard
onBoardRouter.delete("/:id", async (req, res, next) => {
  OnBoard.findByIdAndDelete(req.params.id)
    .then(
      () => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({ success: true, message: "onBoard Deleted" });
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

module.exports = onBoardRouter;
