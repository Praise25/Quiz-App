const express = require("express");
const path = require("path");
const ejsMate = require("ejs-mate");
const morgan = require("morgan");
const axios = require("axios").default;
const processResults = require("./assets");

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/quiz", async (req, res) => {
  const results = await axios
    .get(
      "https://opentdb.com/api.php?amount=10&category=15&difficulty=easy&type=multiple"
    )
    .then((res) => {
      return res.data.results;
    })
    .catch((e) => {
      console.log("Error retrieving quiz questions...");
    });
  let quizzes = processResults(results);
  res.render("trivia", { quizzes });
});

app.get("/quiz/:id", (req, res) => {
  
})

app.listen(3000, () => {
  console.log("Listening on port 3000...");
});

