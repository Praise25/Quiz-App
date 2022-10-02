const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ResultSchema = new Schema({
  score: Number,
  day: String,
  month: String,
  year: String,
  choices: [{
    type: Schema.Types.ObjectId,
    ref: "Choice"
  }]
})

module.exports = mongoose.model("Result", ResultSchema);
