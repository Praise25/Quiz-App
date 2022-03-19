const question = document.querySelector("#question");
const answers = document.querySelectorAll("button.answer");
const serialNum = document.querySelector("#serial-num");

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

const recordAnswer = async function () {
  const num = serialNum.innerText;
  const ans = this.innerText;
  choice[num] = ans;
  // eslint-disable-next-line no-undef
  axios.post(
    "/quiz/save-answer",
    { serialNum: num, answer: ans },
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );
};

fixHtmlEntityDisplay();

for (let answer of answers) {
  answer.addEventListener("click", recordAnswer);
}
