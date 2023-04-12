const express = require("express");
const OnBoardsRouter = express.Router();
const OnBoards = require("../Models/OnBoard");

// Create a new onboarding document
OnBoardsRouter.post("/", async (req, res) => {
  try {
    const onBoard = new OnBoards(req.body);
    await onBoard.save();
    res.send(onBoard);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get all onboarding documents
OnBoardsRouter.get("/", async (req, res) => {
  try {
    const onBoards = await OnBoards.find({});
    res.send(onBoards);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get a single onboarding document by ID
OnBoardsRouter.get("/:id", getOnBoard, async (req, res) => {
  try {
    const onBoard = await OnBoards.findById(req.params.id);
    if (!onBoard) {
      return res.status(404).send();
    }
    res.send(onBoard);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update an existing onboarding document by ID
OnBoardsRouter.patch("/:id", getOnBoard, async (req, res) => {
  try {
    const onBoard = await OnBoards.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!onBoard) {
      return res.status(404).send();
    }
    res.send(onBoard);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Delete an onboarding document by ID
OnBoardsRouter.delete("/:id", getOnBoard, async (req, res) => {
  try {
    const onBoard = await OnBoards.findByIdAndDelete(req.params.id);
    if (!onBoard) {
      return res.status(404).send();
    }
    res.send(onBoard);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Middleware function to get a single onBoarding by ID
async function getOnBoard(req, res, next) {
  let onBoarding;
  try {
    onBoarding = await OnBoards.findById(req.params.id);
    if (onBoarding == null) {
      return res.status(404).json({ message: "onBoarding not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.onBoarding = onBoarding;
  next();
}

module.exports = OnBoardsRouter;
