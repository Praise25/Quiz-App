const questions = document.querySelectorAll(".question");
for (let question of questions) {
  // retrieve and reassign innerHTML of the questions so the browser interperts html entities properly
  let originalText = question.innerText;
  question.innerHTML = originalText;
}
