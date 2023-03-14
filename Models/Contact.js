const mongoose = require('mongoose');
const Schema = mongoose.Schema
const contactSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    require:true,
    ref:'User'
  },
});



const Contact = mongoose.model('Contact', contactSchema);

module.exports = {
    Contact
};
