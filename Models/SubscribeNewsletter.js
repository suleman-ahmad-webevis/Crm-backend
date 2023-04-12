const mongoose = require('mongoose');
const Schema = mongoose.Schema

const emailSchema = new Schema({
    subscriberList:[
        {
            type: Object,
        }
    ]
}, { timestamps: true });

const Email = mongoose.model('Email', emailSchema);

module.exports = Email
