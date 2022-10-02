const axios = require("axios").default;
const Quiz = require("./models/quiz");
const Choice = require("./models/choice");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const shuffle = function (array) {
  let currentIndex = array.length,
    randomIndex;
  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
};

const capitalize = function (word) {
  return word[0].toUpperCase() + word.slice(1);
};

const processResults = function (results) {
  const newResults = [];
  let serialNum = 1;
  for (let result of results) {
    let processed = new Object();
    let answers = [result.correct_answer];
    answers = answers.concat(result.incorrect_answers);
    processed["serialNum"] = serialNum;
    processed["category"] = result.category;
    processed["difficulty"] = capitalize(result.difficulty);
    processed["question"] = result.question;
    processed["answers"] = shuffle(answers);
    processed["correctAnswer"] = result.correct_answer;
    newResults.push(processed);
    serialNum += 1;
  }
  return newResults;
};

const fixHtmlEntityDisplay = function (string) {
  const dom = new JSDOM(
    `<!DOCTYPE html><body><p id="main">${string}</p></body>`
  );
  return dom.window.document.getElementById("main").textContent;
};

const getQuestions = async function (category, difficulty) {
  let response = await axios
    .get(
      `https://opentdb.com/api.php?amount=20&category=${category}&difficulty=${difficulty}&type=multiple`
    )
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      console.log("Error retrieving quiz questions...");
      console.log(e);
    });
  return {
    responseCode: response.response_code,
    result: processResults(response.results),
  };
};

const saveQuestions = async function (results) {
  await Quiz.deleteMany({});
  for (let result of results) {
    for (let i = 0; i < result.answers.length; i++) {
      result.answers[i] = fixHtmlEntityDisplay(result.answers[i]);
    }
    const quiz = new Quiz({
      serialNum: result.serialNum,
      category: result.category,
      difficulty: result.difficulty,
      question: fixHtmlEntityDisplay(result.question),
      answers: result.answers,
      correctAnswer: result.correctAnswer,
    });
    await quiz.save();
  }
};

const formatDate = (date) => {
  date = String(date);
  if (date.endsWith("1")) {return `${date}st`};
  if (date.endsWith("2")) {return `${date}nd`};
  if (date.endsWith("3")) {return `${date}rd`};
}

const generateDate = function (date) {
  const today = new Date();
  const day = formatDate(today.getDate());
  const month = months[today.getMonth()]
  const year = today.getFullYear();

  const processedDate = [day, month, year];
  return processedDate;
};

const resetChoices = async function () {
  await Choice.deleteMany({});
  const quizzes = await Quiz.find({});
  await createChoices(quizzes);
};

const createChoices = async function (quizzes) {
  for (let quiz of quizzes) {
    const choice = new Choice({
      serialNum: quiz.serialNum,
      answer: "",
      status: "",
    });
    await choice.save();
  }
};

module.exports = {
  getQuestions,
  saveQuestions,
  generateDate,
  resetChoices,
  createChoices,
};
