const mongoose = require('mongoose');
const Schema = mongoose.Schema

const onBoardSchema = new Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true 
    },
    hire_date: { 
        type: String, 
        required: true 
    },
    department: { 
        type: String, 
        required: true 
    },
    manager: { 
        type: String, 
        required: true 
    },
    job_title: { 
        type: String, 
        required: true 
    },
}, { timestamps: true });

const OnBoards = mongoose.model('OnBoards', onBoardSchema);

module.exports = OnBoards
