const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dealSchema = new Schema(
  {
    client_name: [
      {
        type: Schema.Types.ObjectId,
        ref: "Queries",
      },
    ],
    developer_name: [
      {
        type: Schema.Types.ObjectId,
        ref: "HireDeveloper",
      },
    ],
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    budget: {
      type: String,
      required: true,
    },
    deadline_date: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Deals = mongoose.model("Deal", dealSchema);

module.exports = Deals;
