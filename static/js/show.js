const question = document.querySelector("#question");
const answers = document.querySelectorAll("button.answer");

// retrieve and reassign innerHTML of the questions so the browser interperts html entities properly
let originalQuestion = question.innerText;
question.innerHTML = originalQuestion;

for (let answer of answers) {
  // retrieve and reassign innerHTML of the answers so the browser interperts html entities properly
  let originalText = answer.innerText;
  answer.innerHTML = originalText;
}
