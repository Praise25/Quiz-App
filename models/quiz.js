const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema({
  serialNum: Number,
  category: String,
  question: String,
  answers: Array,
  correctAnswer: String,
});

module.exports = mongoose.model("Quiz", QuizSchema);