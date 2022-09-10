const express = require("express");
const router = express.Router();
const quiz = require("../controllers/quiz");

router.get("/", quiz.index)

router.route("/new")
  .get(quiz.renderNewQuizForm)
  .post(quiz.createNewQuiz)

router.route("/result")
  .get(quiz.displayResult)
  .post(quiz.generateResult)

router.post("/save-answer", quiz.saveAnswer);

router.post("/reset-test", quiz.resetTest)

router.get("/:id", quiz.renderQuiz);

module.exports = router;