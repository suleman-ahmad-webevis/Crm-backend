const express = require('express')
const router = express.Router()
const Hire_Developer = require('../Models/HireDeveloper')

router.route("/") 
.get((req,res,next)=>{
    Hire_Developer.find()
    .then((data)=>{
        res.status(200).json({success:true, data:data})
    }, (err)=>next(err))
    .catch((err)=>next(err))
})
.post((req,res,next)=>{
    Hire_Developer.create(req.body)
    .then((data)=>{
        res.json(201).json({success:true, message:"Succcesfully Added."})
    }, (err)=>next(err))
    .catch((err)=>next(err))
})
router.route("/:id")
.get((req, res, next)=>{
    Hire_Developer.findById(req.params.id)
    .then((data)=>{
        res.status(200).json({success:true, data:data})
    }, (err)=>next(err))
    .catch((err)=>next(err))
})
.put((req,res,next)=>{
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

module.exports = router;

