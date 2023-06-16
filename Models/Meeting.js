const mongoose = require('mongoose');
const Schema = mongoose.Schema

const meetingSchema = new Schema({
    client_name: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Queries',
        }], 
    developer_name: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Hire_Developer',
        }], 
    date: { 
        type: String, 
        required: true 
    },
    start_time: { 
        type: String, 
        required: true 
    },
    end_time: { 
        type: String, 
        required: true 
    },
}, { timestamps: true });

const Meetings = mongoose.model('Meetings', meetingSchema);

module.exports = Meetings
