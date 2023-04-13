const mongoose = require('mongoose');
const Schema = mongoose.Schema

const serviceSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
    },
    service:{
        type: String,
    },
    price:{
        type:Number
    }
}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service
