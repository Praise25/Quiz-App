const Quiz = require("../models/quiz");
const Choice = require("../models/choice");
const Result = require("../models/result");
const { getQuestions, seedDb, getDate, createChoices } = require("../assets");

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
    await seedDb(questions.result);
    await createChoices(questions.result);
    res.redirect("/quiz");
  } else {
    res.send(
      "No questions could be found. Please adjust your quiz category/type and try again."
    );
  }
};

module.exports.generateResult = async (req, res) => {
  const choices = await Choice.find({});
  let score = 0;
  for (let choice of choices) {
    const serialNumber = choice.serialNum;
    const quiz = await Quiz.findOne({ serialNum: serialNumber });
    if (choice.answer === quiz.correctAnswer) {
      await Choice.findByIdAndUpdate(choice._id, { status: "correct" });
      score += 1;
    } else {
      await Choice.findByIdAndUpdate(choice._id, { status: "incorrect" });
    }
  }

  const result = new Result({
    score: score,
    date: getDate(),
  });
  await result.save();
  res.redirect("/quiz/result");
};

module.exports.displayResult = async (req, res) => {
  const result = (await Result.find({})).pop();
  res.render("result", { result });
};

module.exports.saveAnswer = async (req, res) => {
  const selection = JSON.parse(Object.keys(req.body)[0]);
  const choice = await Choice.findOne({ serialNum: selection.serialNum });
  if (!choice) {
    const newChoice = new Choice({
      serialNum: selection.serialNum,
      answer: selection.answer,
      status: "",
    });
    await newChoice.save();
  } else {
    await Choice.findByIdAndUpdate(choice._id, { answer: selection.answer });
  }
};

module.exports.resetTest = async (req, res) => {
  await Choice.deleteMany({});
  const quizzes = await Quiz.find({});
  await createChoices(quizzes);
  const quiz = quizzes[0];
  res.redirect(`/quiz/${quiz._id}`);
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
