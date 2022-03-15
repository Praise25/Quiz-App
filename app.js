const express = require("express");
const path = require("path");
const ejsMate = require("ejs-mate");
const morgan = require("morgan");
const Quiz = require("./models/quiz");
const mongoose = require("mongoose");

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

app.get("/quiz", async (req, res) => {
  const quizzes = await Quiz.find({});
  res.render("index", { quizzes });
});

app.get("/quiz/:id", async (req, res) => {
  const { id } = req.params;
  const quiz = await Quiz.findById(id);
  res.render("show", { quiz });
});

app.listen(3000, () => {
  console.log("Listening on port 3000...");
});
