const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema({
  question: String,
  answers: Array,
});

module.exports = mongoose.model("Quiz", QuizSchema);