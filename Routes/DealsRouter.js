const express = require('express');
const DealsRouter = express.Router();
const Deals = require('../Models/Deal');
const middleware = require("../middleware");

// Get all deals
DealsRouter.get('/', middleware.isAdmin, async (req, res, next) => {
  try {
    Deals.find()
    .then((deals) => {
      res.status(200).json({ success: true, data: deals });
    }, (err) => next(err))
  } catch (err) {
    console.log("er", err)
    next(err)
  }
});

// Get a specific deal by ID
DealsRouter.get('/:id', middleware.isAdmin, (req, res, next) => {
  try {
    Deals.findById(req.params.id)
      .then((deal) => {
        res.status(200).json({ success: true, data: deal });
      }, (err) => next(err))
  } catch (err) {
    next(err)
  }
});

// Create a new deal
DealsRouter.post('/', middleware.isAdmin, async (req, res) => {
  const deal = new Deals({
    client_name: req.body.client_name,
    developer_name: req.body.developer_name,
    title: req.body.title,
    description: req.body.description,
    budget: req.body.budget,
    deadline_date: req.body.deadline_date
  });

  try {
    deal.save()
    .then(() => {
      res.status(200).json({ success: true, message: "Deal is created successfully" });
    }, (err) => next(err))
} catch (err) {
  next(err)
}
});

// Update a deal
DealsRouter.patch('/:id', middleware.isAdmin, async (req, res, next) => {
  Deals.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
    .then(() => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json("Deal Updated Successfully.");
    }, (err) => next(err))
    .catch((err) => next(err));
});

// Delete a deal

DealsRouter.delete('/:id', middleware.isAdmin, async (req, res, next) => {
  Deals.findByIdAndDelete(req.params.id)
    .then(() => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({ success: true, message: "Deal Deleted" });
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = DealsRouter;