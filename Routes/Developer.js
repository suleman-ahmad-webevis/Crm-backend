const express = require('express')
const Developer = require('../Models/Developer')
const DeveloperRouter = express.Router()
const middleware = require("../middleware");

DeveloperRouter.route("/", middleware.isAdmin)
.post( async (req, res, next) => {
    const user = (req.body)
    try {
      Developer.create(user).then((newUser) => {
        res.status(201).json({ success: true, data: newUser })
      }, (err) => next(err))
        .catch((err) => next(err))
    } catch (err) {
      next(err)
    }
  })
.get((req,res,next)=>{
    Developer.find()
    .then((data)=>{
        res.status(200).json({success:true, data:data})
    }, (err)=>next(err))
    .catch((err)=>next(err))
})
DeveloperRouter.route("/:id", middleware.isAdmin)
.get((req, res, next)=>{
    Developer.findById(req.params.id)
    .then((data)=>{
        res.status(200).json({success:true, data:data})
    }, (err)=>next(err))
    .catch((err)=>next(err))
})
.patch((req,res,next)=>{
    Developer.findByIdAndUpdate(req.params.id,{ $set: req.body}, { new: true })
    .then((data)=>{
        res.status(200).json({success:true, data:data})
    }, (err)=>next(err))
    .catch((err)=>next(err))
})
.delete((req,res,next)=>{
    Developer.findByIdAndDelete(req.params.id)
    .then((data)=>{
        res.status(200).json({success:true, message:"Successfully Deleted."})
    }, (err)=>next(err))
    .catch((err)=>next(err))
})

// DeveloperRouter.route("/developer/:names", middleware.isAdmin)
// .get((req, res, next) => {
//     const name = req.body.name;
  
//     Developer.aggregate([
//       {
//         $match: {
//           developer: name,
//         }
//       },
//       {
//         $project: {
//           _id: 0,
//           name: 1
//         }
//       }
//     ]).then((data) => {
//       res.status(200).json({ success: true, data: data });
//     }).catch((err) => next(err));
// });
// DeveloperRouter.route("/developers/:search", middleware.isAdmin)
// .get((req, res, next) => {
//     const minAmount = req.body.minAmount;
//     const maxAmount = req.body.maxAmount;
//     const position = req.body.position;
  
//     Developer.aggregate([
//       {
//         $match: {
//           developer: position,
//           $and: [
//             { quotation: { $lte: maxAmount } },
//             { quotation: { $gte: minAmount } }
//           ]
//         }
//       },
//       {
//         $project: {
//           _id: 0,
//           name: 1,
//           email: 1,
//           description: 1,
//           developer: 1,
//           quotation: 1
//         }
//       }
//     ]).then((data) => {
//       res.status(200).json({ success: true, data: data });
//     }).catch((err) => next(err));
// });

module.exports = DeveloperRouter;

