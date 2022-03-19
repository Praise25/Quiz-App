const mongoose = require("mongoose");

const ResultSchema = new mongoose.Schema({
  score: Number,
  date: String,
})

module.exports = mongoose.model("Result", ResultSchema);
