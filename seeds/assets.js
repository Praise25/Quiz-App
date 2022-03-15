function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function processResults(results) {
  const newResults = [];
  for (let result of results) {
    let processed = new Object();
    let answers = [result.correct_answer]
    answers = answers.concat(result.incorrect_answers);
    processed["question"] = result.question;
    processed["answers"] = shuffle(answers);
    newResults.push(processed);
  }
  // returns an array of objects with only the questions and answers
  return newResults;
}


module.exports.processResults = processResults;