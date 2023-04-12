const express = require('express');
const DealsRouter = express.Router();
const Deals = require('../Models/Deal');

// Get all deals
DealsRouter.get('/', async (req, res) => {
  try {
    const deals = await Deals.find();
    res.json(deals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific deal by ID
DealsRouter.get('/:id', getDeal, (req, res) => {
  res.json(res.deal);
});

// Create a new deal
DealsRouter.post('/', async (req, res) => {
  const deal = new Deals({
    client_name: req.body.client_name,
    developer_name: req.body.developer_name,
    title: req.body.title,
    description: req.body.description,
    budget: req.body.budget,
    deadline_date: req.body.deadline_date
  });

  try {
    const newDeal = await deal.save();
    res.status(201).json(newDeal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a deal
DealsRouter.patch('/:id', getDeal, async (req, res) => {
  if (req.body.client_name != null) {
    res.deal.client_name = req.body.client_name;
  }

  if (req.body.developer_name != null) {
    res.deal.developer_name = req.body.developer_name;
  }

  if (req.body.title != null) {
    res.deal.title = req.body.title;
  }

  if (req.body.description != null) {
    res.deal.description = req.body.description;
  }

  if (req.body.budget != null) {
    res.deal.budget = req.body.budget;
  }

  if (req.body.deadline_date != null) {
    res.deal.deadline_date = req.body.deadline_date;
  }

  try {
    const updatedDeal = await res.deal.save();
    res.json(updatedDeal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a deal
DealsRouter.delete('/:id', getDeal, async (req, res) => {
  try {
    await res.deal.remove();
    res.json({ message: 'Deleted deal' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getDeal(req, res, next) {
  let deal;
  try {
    deal = await Deals.findById(req.params.id);
    if (deal == null) {
      return res.status(404).json({ message: 'Cannot find deal' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.deal = deal;
  next();
}

module.exports = DealsRouter;