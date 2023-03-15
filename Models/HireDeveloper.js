const mongoose = require('mongoose')
const Schema = mongoose.Schema

const hire_developer = new Schema({
    name:{
        type: String,
        require: true,
    },
    email:{
        type: String,
        require: true,
    },
    developer:{
        type: String,
        require: true,
    },
    description:{
        type: String,
        require: true,
    },
    quotation:{
        type: Number,
    }
}, { timestamps: true })
const Hire_Developer = mongoose.model('Hire_Developer', hire_developer);

module.exports = Hire_Developer