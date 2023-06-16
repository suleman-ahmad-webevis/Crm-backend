const mongoose = require('mongoose');
const Schema = mongoose.Schema

const queriesSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    company:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
    },
    developer: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Hire_Developer',
        }], 
}, { timestamps: true });

const Queries = mongoose.model('Queries', queriesSchema);

module.exports = Queries
