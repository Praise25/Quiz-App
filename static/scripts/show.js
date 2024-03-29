const question = document.querySelector("#question");
const answers = document.querySelectorAll("button.answer");
const serialNum = document.querySelector("#serial-num");
const numBtns = document.querySelectorAll("button.q-btn");

const choice = new Object();

const fixHtmlEntityDisplay = function () {
  // retrieve and reassign innerHTML of the questions so the browser interperts html entities properly
  let originalQuestion = question.innerText;
  question.innerHTML = originalQuestion;

  for (let answer of answers) {
    // retrieve and reassign innerHTML of the answers so the browser interperts html entities properly
    let originalText = answer.innerText;
    answer.innerHTML = originalText;
  }
};

const recordAnswer = function () {
  const num = serialNum.innerText;
  const ans = this.innerText;
  choice[num] = ans;
  // Change the color of the selected answer when the button is clicked
  answers.forEach((el) => {
    if (el.classList.contains("btn-dark")) {
      el.classList.remove("btn-dark");
      el.classList.add("btn-primary");
    }
  })
  this.classList.add("btn-dark");
  
  // eslint-disable-next-line no-undef
  axios.post(
    "/quiz/save-answer",
    { serialNum: num, answer: ans },
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );
};

const showActiveQuestion = function () {
  numBtns.forEach((el) => {
    if (el.innerText === serialNum.innerText) {
      el.classList.remove("btn-outline-secondary")
      el.classList.add("active-question")
    }
  })
}

fixHtmlEntityDisplay();
showActiveQuestion();

for (let answer of answers) {
  answer.addEventListener("click", recordAnswer);
}
