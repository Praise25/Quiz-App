if (process.env.NODE_ENV !==  "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");
const Quiz = require("../models/quiz");
const axios = require("axios");
const { processResults } = require("./assets");
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/game-trivia;"

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const seedDb = async function () {
  await Quiz.deleteMany({});
  let results = await axios
    .get(
      "https://opentdb.com/api.php?amount=10&category=15&difficulty=easy&type=multiple"
    )
    .then((res) => {
      return res.data.results;
    })
    .catch((e) => {
      console.log("Error retrieving quiz questions...");
      console.log(e);
    });

  results = processResults(results);

  for (let result of results) {
    const quiz = new Quiz({
      serialNum: result.serialNum,
      question: result.question,
      answers: result.answers,
    });
    await quiz.save();
  }
};

seedDb().then(() => {
  mongoose.connection.close();
})
