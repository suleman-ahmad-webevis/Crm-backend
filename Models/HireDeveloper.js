const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hireDeveloperSchema = new Schema(
  {
    client_name: {
      type: String,
      required: true,
    },
    client_email: {
      type: String,
      required: true,
    },
    developer_stack: {
      type: String,
      required: true,
    },
    developer_name: {
      type: String,
      required: true,
    },
    developer_price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const HireDeveloper = mongoose.model("HireDeveloper", hireDeveloperSchema);

module.exports = HireDeveloper;
