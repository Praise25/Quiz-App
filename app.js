if (process.env.NODE_ENV !==  "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const ejsMate = require("ejs-mate");
const morgan = require("morgan");
const mongoose = require("mongoose");
const quizRoutes = require("./routes/quiz");
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/game-trivia";

const app = express();
mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "static")));

app.use("/quiz", quizRoutes);

app.get("/", (req, res) => {
  res.render("home");
})


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
