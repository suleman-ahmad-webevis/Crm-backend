const express = require('express')
const Hire_Developer = require('../Models/HireDeveloper')
const router = express.Router()
const middleware = require("../middleware");

router.route("/", middleware.isAdmin)
.post( async (req, res, next) => {
    const user = (req.body)
    try {
      Hire_Developer.create(user).then((newUser) => {
        res.status(201).json({ success: true, data: newUser })
      }, (err) => next(err))
        .catch((err) => next(err))
    } catch (err) {
      next(err)
    }
  })
.get((req,res,next)=>{
    Hire_Developer.find()
    .then((data)=>{
        res.status(200).json({success:true, data:data})
    }, (err)=>next(err))
    .catch((err)=>next(err))
})
router.route("/:id", middleware.isAdmin)
.get((req, res, next)=>{
    Hire_Developer.findById(req.params.id)
    .then((data)=>{
        res.status(200).json({success:true, data:data})
    }, (err)=>next(err))
    .catch((err)=>next(err))
})
.patch((req,res,next)=>{
    Hire_Developer.findByIdAndUpdate(req.params.id,{ $set: req.body}, { new: true })
    .then((data)=>{
        res.status(200).json({success:true, data:data})
    }, (err)=>next(err))
    .catch((err)=>next(err))
})
.delete((req,res,next)=>{
    Hire_Developer.findByIdAndDelete(req.params.id)
    .then((data)=>{
        res.status(200).json({success:true, message:"Successfully Deleted."})
    }, (err)=>next(err))
    .catch((err)=>next(err))
})

router.route("/developer/:names", middleware.isAdmin)
.get((req, res, next) => {
    const name = req.body.name;
  
    Hire_Developer.aggregate([
      {
        $match: {
          developer: name,
        }
      },
      {
        $project: {
          _id: 0,
          name: 1
        }
      }
    ]).then((data) => {
      res.status(200).json({ success: true, data: data });
    }).catch((err) => next(err));
});
router.route("/developers/:search", middleware.isAdmin)
.get((req, res, next) => {
    const minAmount = req.body.minAmount;
    const maxAmount = req.body.maxAmount;
    const position = req.body.position;
  
    Hire_Developer.aggregate([
      {
        $match: {
          developer: position,
          $and: [
            { quotation: { $lte: maxAmount } },
            { quotation: { $gte: minAmount } }
          ]
        }
      },
      {
        $project: {
          _id: 0,
          name: 1,
          email: 1,
          description: 1,
          developer: 1,
          quotation: 1
        }
      }
    ]).then((data) => {
      res.status(200).json({ success: true, data: data });
    }).catch((err) => next(err));
});

module.exports = router;

