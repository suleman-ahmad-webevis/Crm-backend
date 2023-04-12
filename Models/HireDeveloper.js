const mongoose = require('mongoose')
const Schema = mongoose.Schema

const hire_developer = new Schema({
    client_name:{
        type: String,
        require: true,
    },
    client_email:{
        type: String,
        require: true,
    },
    developer_stack:{
        type: String,
        require: true,
    },
    developer_name:{
        type: String,
        require: true,
    },
    developer_price:{
        type: Number,
    }
}, { timestamps: true })
const Hire_Developer = mongoose.model('Hire_Developer', hire_developer );

module.exports = Hire_Developer