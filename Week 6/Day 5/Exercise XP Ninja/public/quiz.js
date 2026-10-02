const answerLetters = ['A', 'B', 'C', 'D'];
const levelButtons = [...document.querySelectorAll('.level-button')];
const questionCount = document.querySelector('#question-count');
const difficultyTag = document.querySelector('#difficulty-tag');
const progressFill = document.querySelector('#progress-fill');
const questionText = document.querySelector('#question-text');
const answerList = document.querySelector('#answer-list');
const feedback = document.querySelector('#feedback');
const feedbackTitle = document.querySelector('#feedback-title');
const feedbackDetail = document.querySelector('#feedback-detail');
const nextButton = document.querySelector('#next-button');
const nextButtonLabel = document.querySelector('#next-button-label');
const scoreNumber = document.querySelector('#score-number');
const accuracyValue = document.querySelector('#accuracy-value');
const streakValue = document.querySelector('#streak-value');
const timerDial = document.querySelector('#timer-dial');
const timerValue = document.querySelector('#timer-value');
const timerState = document.querySelector('#timer-state');
const quizLayout = document.querySelector('.layout');
const resultScreen = document.querySelector('#result-screen');
const finalScore = document.querySelector('#final-score');
const finalPercent = document.querySelector('#final-percent');
const resultTitle = document.querySelector('#result-title');
const restartButton = document.querySelector('#restart-button');

let sessionId = null;
let currentQuestion = null;
let currentDifficulty = 'medium';
let score = 0;
let streak = 0;
let answeredCount = 0;
let timerId = null;
let answerLocked = false;

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'The quiz request failed.');
  return data;
}

function updateScore(value) {
  score = value;
  scoreNumber.textContent = String(score).padStart(2, '0');
  accuracyValue.textContent = answeredCount > 0
    ? `${Math.round((score / answeredCount) * 100)}%`
    : '--%';
  streakValue.textContent = String(streak).padStart(2, '0');
}

function renderQuestion(question) {
  currentQuestion = question;
  answerLocked = false;
  feedback.hidden = true;
  questionCount.textContent = `QUESTION ${String(question.number).padStart(2, '0')} / ${String(question.total).padStart(2, '0')}`;
  difficultyTag.textContent = currentDifficulty.toUpperCase();
  progressFill.style.width = `${((question.number - 1) / question.total) * 100}%`;
  questionText.textContent = question.prompt;
  answerList.replaceChildren();

  question.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.className = 'answer-button';
    button.type = 'button';
    button.dataset.index = String(index);
    button.innerHTML = `<span class="answer-key">${answerLetters[index]}</span><span class="answer-copy"></span><span class="answer-mark" aria-hidden="true">&#10003;</span>`;
    button.querySelector('.answer-copy').textContent = option;
    button.addEventListener('click', () => submitAnswer(index));
    answerList.append(button);
  });

  startTimer(question.timeLimit);
}

function startTimer(seconds) {
  window.clearInterval(timerId);
  let remaining = seconds;
  timerValue.textContent = String(remaining).padStart(2, '0');
  timerState.textContent = 'IN PLAY';
  timerDial.style.setProperty('--timer-angle', '360deg');
  timerId = window.setInterval(() => {
    remaining -= 1;
    timerValue.textContent = String(Math.max(remaining, 0)).padStart(2, '0');
    timerDial.style.setProperty('--timer-angle', `${Math.max(remaining, 0) / seconds * 360}deg`);
    if (remaining <= 0) {
      window.clearInterval(timerId);
      submitAnswer(null, true);
    }
  }, 1000);
}

async function submitAnswer(answerIndex, timedOut = false) {
  if (answerLocked || !sessionId) return;
  answerLocked = true;
  window.clearInterval(timerId);
  timerState.textContent = timedOut ? 'TIME UP' : 'LOCKED';

  try {
    const result = await requestJson(`/api/quiz/${sessionId}/answer`, {
      method: 'POST',
      body: JSON.stringify(timedOut ? { timedOut: true } : { answerIndex }),
    });

    if (result.correct) streak += 1;
    else streak = 0;
    answeredCount += 1;
    updateScore(result.score);
    progressFill.style.width = `${(result.questionNumber / result.totalQuestions) * 100}%`;

    [...answerList.children].forEach((button, index) => {
      button.disabled = true;
      if (index === result.correctIndex) button.classList.add('is-correct');
      else if (index === answerIndex && !result.correct) button.classList.add('is-wrong');
    });

    feedbackTitle.textContent = result.timedOut ? 'Time is up.' : result.correct ? 'Exactly right.' : 'Not quite.';
    feedbackDetail.textContent = `${result.correctAnswer} — ${result.explanation}`;
    nextButtonLabel.textContent = result.isLast ? 'RESULTS' : 'NEXT';
    feedback.hidden = false;
    timerState.textContent = 'ANSWERED';
  } catch (error) {
    answerLocked = false;
    showError(error);
  }
}

async function continueQuiz() {
  nextButton.disabled = true;
  try {
    const result = await requestJson(`/api/quiz/${sessionId}/next`, { method: 'POST' });
    if (result.complete) {
      showResults(result);
    } else {
      renderQuestion(result.question);
      updateScore(result.score);
    }
  } catch (error) {
    showError(error);
  } finally {
    nextButton.disabled = false;
  }
}

function showResults(result) {
  window.clearInterval(timerId);
  quizLayout.hidden = true;
  resultScreen.hidden = false;
  finalScore.textContent = `${result.score} / ${result.total}`;
  finalPercent.textContent = `${result.percentage}% accuracy`;
  resultTitle.textContent = result.percentage === 100
    ? 'Perfect signal.'
    : result.percentage >= 60
      ? 'Signal received.'
      : 'Good first signal.';
  resultScreen.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function showError(error) {
  questionText.textContent = error.message;
  answerList.replaceChildren();
  feedback.hidden = true;
  timerState.textContent = 'OFFLINE';
}

async function startQuiz(difficulty = currentDifficulty) {
  window.clearInterval(timerId);
  currentDifficulty = difficulty;
  levelButtons.forEach((button) => {
    button.classList.toggle('is-selected', button.dataset.difficulty === difficulty);
    button.disabled = true;
  });
  questionText.textContent = 'Loading your first question...';
  answerList.replaceChildren();
  feedback.hidden = true;
  timerState.textContent = 'READY';
  resultScreen.hidden = true;
  quizLayout.hidden = false;
  streak = 0;
  answeredCount = 0;
  updateScore(0);

  try {
    const result = await requestJson('/api/quiz', {
      method: 'POST',
      body: JSON.stringify({ difficulty }),
    });
    sessionId = result.sessionId;
    renderQuestion(result.question);
  } catch (error) {
    showError(error);
  } finally {
    levelButtons.forEach((button) => { button.disabled = false; });
  }
}

levelButtons.forEach((button) => {
  button.addEventListener('click', () => startQuiz(button.dataset.difficulty));
});
nextButton.addEventListener('click', continueQuiz);
restartButton.addEventListener('click', () => startQuiz(currentDifficulty));

document.addEventListener('keydown', (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  if (resultScreen.hidden && !feedback.hidden && event.key === 'Enter') {
    continueQuiz();
  } else if (resultScreen.hidden && feedback.hidden && /^[1-4]$/.test(event.key)) {
    const button = answerList.children[Number(event.key) - 1];
    button?.click();
  }
});

startQuiz();