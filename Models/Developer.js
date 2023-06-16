const mongoose = require('mongoose')
const Schema = mongoose.Schema

const developer = new Schema({
    developer_stack:{
        type: String,
        required: true 
    },
    developer_name:{
        type: String,
        required: true 
    },
    developer_price:{
        type: Number,
        required: true 
    }
}, { timestamps: true })
const Developer = mongoose.model('Developer', developer );

module.exports = Developer