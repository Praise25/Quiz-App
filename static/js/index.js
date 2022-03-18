const questions = document.querySelectorAll(".question");
const answers = document.querySelectorAll(".answer")
for (let question of questions) {
  // retrieve and reassign innerHTML of the questions so the browser interperts html entities properly
  let originalText = question.innerText;
  question.innerHTML = originalText;
}

for (let answer of answers) {
  // retrieve and reassign innerHTML of the answers so the browser interperts html entities properly
  let originalText = answer.innerText;
  answer.innerHTML = originalText;
}
