const mongoose = require('mongoose')
const Schema = mongoose.Schema

const hire_developer = new Schema({
    client_name:{
        type: String,
        required: true 
    },
    client_email:{
        type: String,
        required: true 
    },
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
const Hire_Developer = mongoose.model('Hire_Developer', hire_developer );

module.exports = Hire_Developer