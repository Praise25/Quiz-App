const express = require("express");
const path = require("path");
const ejsMate = require("ejs-mate");
const morgan = require("morgan");
const Quiz = require("./models/quiz");
const Choice = require("./models/choice");
const Result = require("./models/result");
const mongoose = require("mongoose");
const { getQuestions, seedDb, getDate, createChoices } = require("./assets");

mongoose.connect("mongodb://localhost:27017/game-trivia");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "static")));

// =============================================================================================
// ==========================================ROUTES=============================================
// =============================================================================================
app.get("/quiz", async (req, res) => {
  const quizzes = await Quiz.find({});
  res.render("index", { quizzes });
});

app.get("/quiz/new", (req, res) => {
  res.render("new");
});

app.post("/quiz/new", async (req, res) => {
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
});

app.post("/quiz/result", async (req, res) => {
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
});

app.get("/quiz/result", async (req, res) => {
  const result = (await Result.find({})).pop();
  res.render("result", { result });
});

app.post("/quiz/save-answer", async (req, res) => {
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
});

app.get("/quiz/:id", async (req, res) => {
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
});

app.listen(3000, () => {
  console.log("Listening on port 3000...");
});
