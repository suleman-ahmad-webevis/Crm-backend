const express = require('express');
const ServiceRouter = express.Router();
const Service = require('../models/Servics');

// Create a service
ServiceRouter.post('/', (req, res, next) => {
  const { name, email, service, price } = req.body;

  const serviceData = new Service({
    name,
    email,
    service,
    price
  });

  serviceData.save()
    .then((service) => {
      res.status(201).json(service);
    })
    .catch((err) => {
      next(err);
    });
});

// Get all services
ServiceRouter.get('/', (req, res, next) => {
  Service.find()
    .then((services) => {
      res.status(200).json(services);
    })
    .catch((err) => {
      next(err);
    });
});

// Get a specific service by ID
ServiceRouter.get('/:id', (req, res, next) => {
  const { id } = req.params;

  Service.findById(id)
    .then((service) => {
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
      res.status(200).json(service);
    })
    .catch((err) => {
      next(err);
    });
});

// Update a service by ID
ServiceRouter.put('/:id', (req, res, next) => {
  const { id } = req.params;
  const { name, email, service, price } = req.body;

  Service.findByIdAndUpdate(id, { name, email, service, price }, { new: true })
    .then((service) => {
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
      res.status(200).json(service);
    })
    .catch((err) => {
      next(err);
    });
});

// Delete a service by ID
ServiceRouter.delete('/:id', (req, res, next) => {
  const { id } = req.params;

  Service.findByIdAndDelete(id)
    .then((service) => {
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
      res.status(200).json(service);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = ServiceRouter;
