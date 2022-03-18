const axios = require("axios");
const Quiz = require("./models/quiz");

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

const processResults = function (results) {
  const newResults = [];
  let serialNum = 1;
  for (let result of results) {
    let processed = new Object();
    let answers = [result.correct_answer];
    answers = answers.concat(result.incorrect_answers);
    processed["serialNum"] = serialNum;
    processed["category"] = result.category;
    processed["question"] = result.question;
    processed["answers"] = shuffle(answers);
    processed["correctAnswer"] = result.correct_answer;
    newResults.push(processed);
    serialNum += 1;
  }
  // returns an array of objects with only the serial number, questions and answers
  return newResults;
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

const seedDb = async function (results) {
  await Quiz.deleteMany({});
  for (let result of results) {
    const quiz = new Quiz({
      serialNum: result.serialNum,
      category: result.category,
      question: result.question,
      answers: result.answers,
      correctAnswer: result.correctAnswer,
    });
    await quiz.save();
  }
};

module.exports.getQuestions = getQuestions;
module.exports.seedDb = seedDb;
