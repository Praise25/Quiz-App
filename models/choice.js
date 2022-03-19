const mongoose = require("mongoose");

const ChoiceSchema = mongoose.Schema({
  serialNum: Number,
  answer: String,
  status: String,
})

module.exports = mongoose.model("Choice", ChoiceSchema);
