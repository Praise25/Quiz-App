const Quiz = require("../models/quiz");
const Choice = require("../models/choice");
const Result = require("../models/result");
const { getQuestions, saveQuestions, generateDate, createChoices, resetChoices } = require("../assets");

module.exports.index = async (req, res) => {
  const quizzes = await Quiz.find({});
  res.render("index", { quizzes });
};

module.exports.renderNewQuizForm = (req, res) => {
  res.render("new");
};

module.exports.createNewQuiz = async (req, res) => {
  await Choice.deleteMany({});
  const { category, difficulty } = req.body;
  const questions = await getQuestions(category, difficulty).then(
    (data) => data
  );
  if (questions.responseCode === 0) {
    await saveQuestions(questions.result);
    await createChoices(questions.result);
    const quiz = await Quiz.findOne({"serialNum": "1"});
    res.redirect(`/quiz/${quiz._id}`);
  } else {
    res.send(
      "No questions could be found. Please adjust your quiz category/type and try again."
    );
  }
};

module.exports.renderQuiz = async (req, res) => {
  const quizzes = await Quiz.find({});
  const numOfQuestions = quizzes.length;
  const { id } = req.params;
  const quiz = await Quiz.findById(id);
  const serialNum = quiz.serialNum;
  const choice = await Choice.findOne({ serialNum: serialNum });
  let prev = await Quiz.findOne({ serialNum: serialNum - 1 });
  let next = await Quiz.findOne({ serialNum: serialNum + 1 });
  if (serialNum === 1) {
    prev = "empty";
  } else if (serialNum === 20) {
    next = "empty";
  }
  res.render("show", { quiz, prev, next, choice, numOfQuestions, quizzes });
};

module.exports.generateResult = async (req, res) => {
  const usrChoices = await Choice.find({});
  let score = 0;
  for (let choice of usrChoices) {
    const serialNumber = choice.serialNum;
    const quiz = await Quiz.findOne({ serialNum: serialNumber });
    if (choice.answer === quiz.correctAnswer) {
      await Choice.findByIdAndUpdate(choice._id, { status: "correct" });
      score += 1;
    } else {
      await Choice.findByIdAndUpdate(choice._id, { status: "incorrect" });
    }
  }

  const date = generateDate();
  const result = new Result({
    score: score,
    day: date[0],
    month: date[1],
    year: date[2],
    choices: usrChoices
  });
  await result.save();
  await resetChoices();
  res.redirect("/quiz/result");
};

module.exports.displayResult = async (req, res) => {
  const result = (await Result.find({})).pop();
  res.render("result", { result });
};

module.exports.saveAnswer = async (req, res) => {
  const selection = req.body;
  const choice = await Choice.findOne({ "serialNum": selection.serialNum });
  if (!choice) {
    const newChoice = new Choice({
      "serialNum": selection.serialNum,
      "answer": selection.answer,
      "status": "",
    });
    await newChoice.save();
  } else {
    await Choice.findByIdAndUpdate(choice._id, { answer: selection.answer });
  }
};

module.exports.resetTest = async (req, res) => {
  await resetChoices();
  const quiz = await Quiz.findOne({"serialNum": "1"});
  res.redirect(`/quiz/${quiz._id}`);
};
