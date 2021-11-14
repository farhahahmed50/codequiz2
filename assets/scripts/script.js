// Starting page variables
var startBtn = document.querySelector("#start");
var quizStart = document.querySelector("main");
var timeEl = document.querySelector("#timeRemaining");

//Variables for timer, questions list/answers, and for end result
var timeLeft = 0;
var score = 0;
var initialTime = 75;
var questionEl;
var answerSelection;
var output;
var questionList;
var button;

// Quiz questions
var questions = [
  {
    question:
    "Which of the following programming language is commonly confused with JavaScript?",
    choices: ["Java", "Python", "NoJavaScript", "JavaScriptPlus"],
    correctChoice: "Java",
  },

  {
    question: "Inside which HTML element do we put the JavaScript?",
    choices: ["<script>", "<scripting>", "<javascript", "<js>"],
    correctChoice: "<script>",
  },

  {
    question: "What is the file extention is required for JavaScript?",
    choices: [".jspt", ".py", ".json", ".js"],
    correctChoice: ".js",
  },

  {
    question: "What year was JavaScript first released?",
    choices: ["1996", "1994", "1989", "1995"],
    correctChoice: "1995",
  },

  {
    question: "Which of the backend processes does JavaScript deal with?",
    choices: ["Cloud Computing Integration", "API Integration", "Database Creation","None of the above"],
    correctChoice: "None of the above",
  },
];

// Initial function that will begin the timer, set the questions and choices to display, and setting the intial variables for those functions.
function beginQuiz() {
  var questionIndex = 0;
  // When my startTimer functions runs, it will display the questions from my array and it's choices onto the screen.
  startTimer();

  questionEl = document.createElement("h2");
  answerSelection = document.createElement("ol");
  output = document.createElement("p");
  // Function that calls my question arrays.
  makeQuestionsAppear(questionIndex);
}

// Sets the questions to display in the HTML file
function makeQuestionsAppear(questionIndex) {
  quizStart.innerHTML = "";
  questionEl.innerHTML = "";
  answerSelection.innerHTML = "";
  // If the timer reaches zero or the user runs out of questions, the quiz will end
  if (questionIndex >= questions.length || timeLeft <= 0) {
    clearInterval(interval);
    userScore();
    return;
  }
  questionEl.innerText = questions[questionIndex].question;
  quizStart.appendChild(questionEl);

  for (var i = 0; i < 4; i++) {
    questionList = document.createElement("li");
    questionList.setAttribute("data-index", i);

    button = document.createElement("button");
    button.textContent = questions[questionIndex].choices[i];
    questionList.appendChild(button);
    answerSelection.appendChild(questionList);
  }
  quizStart.appendChild(answerSelection);
  outputDisplay = document.createElement("p");
  quizStart.appendChild(outputDisplay);
  // If the user gets the answrer correct, the sceen will say correct!
  // If the user gets the answer wrong, the screen will display 'wrong' and then get deducted 10 seconds.
  // Each of the displays will last for 1 second and then move on to the next question.
  answerSelection.addEventListener(
    "click",
    function (event) {
      event.preventDefault();
      var element = event.target;

      if (element.matches("button") === true) {
        var answer = element.textContent;
        if (answer === questions[questionIndex].correctChoice) {
          outputDisplay.innerText = "Correct!";
          score++;
        } else {
          outputDisplay.innerText = "Wrong!";
          timeLeft -= 10;
        }

        questionIndex++;

        setTimeout(function () {
          makeQuestionsAppear(questionIndex);
        }, 1000);
      }
    },
    { once: true }
  );
}

// Function that makes the timer start ticking down 1 second and then at the end of the time will display the user's score
function startTimer() {
  timeLeft = initialTime;
  interval = setInterval(function () {
    if (timeLeft > 0) {
      timeLeft--;
      changeTime();
    } else {
      clearInterval(interval);
      timeLeft = 0;
      changeTime();
      userScore();
    }
  }, 1000);
}

// Allows the html page to start counting down from initial time of 75 seconds.
function changeTime() {
  timeEl.textContent = timeLeft;
}

//Results page
function userScore() {
  quizStart.innerHTML = "";

  var resultsH1 = document.createElement("h1");
  resultsH1.textContent = "Finished!";
  quizStart.appendChild(resultsH1);

  var resultsP = document.createElement("p");
  var resultsBr = document.createElement("br");
  resultsP.textContent = "Your final score is: " + score + "/5";
  quizStart.appendChild(resultsP, resultsBr);

  var resultForm = document.createElement("FORM");
  var resultLabel = document.createElement("label");
  var resultInput = document.createElement("input");
  var resultBtn = document.createElement("button");
  resultForm.setAttribute("id", "rLabel");
  resultLabel.innerHTML = "Your Initials: ";
  resultInput.setAttribute("type", "text");
  resultInput.setAttribute("name", "initials");
  resultBtn.textContent = "Submit";
  resultBtn.setAttribute("id", "start");
  resultForm.appendChild(resultLabel);
  resultForm.appendChild(resultInput);
  quizStart.appendChild(resultForm);
  quizStart.appendChild(resultBtn);

  //Local Storage
  resultBtn.addEventListener("click", function (e) {
    e.preventDefault();

    var userInitials = resultInput.value;
    const initialObject = {
      initials: userInitials,
      score: score,
    };

    if (localStorage.getItem("High-Scores") === null) {
      localStorage.setItem("High-Scores", JSON.stringify(initialObject));
    } else {
      var HighScoreEL = localStorage.getItem("High-Scores");
      var HighScoreObject = JSON.parse(HighScoreEL);
      var array = [];

      if (HighScoreObject.length) {
        HighScoreObject.map((item) => array.push(item));
      } else {
        array.push(HighScoreObject);
      }
      array.push(initialObject);
      savedString = JSON.stringify(array);
      localStorage.setItem("High-Scores", savedString);
    }
    window.location.href = "highScores.html";
  });
}
startBtn.addEventListener("click", beginQuiz);
