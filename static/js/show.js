const question = document.querySelector("#question");
// retrieve and reassign innerHTML of the questions so the browser interperts html entities properly
let originalQuestion = question.innerText;
question.innerHTML = originalQuestion;
