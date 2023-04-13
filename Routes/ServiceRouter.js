const express = require('express');
const ServiceRouter = express.Router();
const Service = require('../Models/Service');

// Get all Service
ServiceRouter.get('/',  async (req, res, next) => {
  try {
    Service.find()
    .then((Service) => {
      res.status(200).json({ success: true, data: Service });
    }, (err) => next(err))
  } catch (err) {
    console.log("er", err)
    next(err)
  }
});

// Get a specific deal by ID
ServiceRouter.get('/:id',  async (req, res, next) => {
  try {
    Service.findById(req.params.id)
      .then((Service) => {
        res.status(200).json({ success: true, data: Service });
      }, (err) => next(err))
  } catch (err) {
    next(err)
  }
});

// Create a new deal
ServiceRouter.post('/',  async (req, res, next) => {
  const deal = new Service({
    name: req.body.name,
    email: req.body.email,
    service: req.body.service,
    price: req.body.price,
  });

  try {
    deal.save()
    .then(() => {
      res.status(200).json({ success: true, message: "Service is created successfully" });
    }, (err) => next(err))
} catch (err) {
  next(err)
}
});

// Update a deal
ServiceRouter.patch('/:id',  async (req, res, next) => {
  Service.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
    .then(() => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json("Service Updated Successfully.");
    }, (err) => next(err))
    .catch((err) => next(err));
});

// Delete a deal

ServiceRouter.delete('/:id',  async (req, res, next) => {
  Service.findByIdAndDelete(req.params.id)
    .then(() => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({ success: true, message: "Service Deleted" });
    }, (err) => next(err))
    .catch((err) => next(err));
});


module.exports = ServiceRouter;