const letters = ['A', 'B', 'C', 'D'];
const difficultyButtons = [...document.querySelectorAll('.difficulty-button')];
const questionCount = document.querySelector('#question-count');
const difficultyChip = document.querySelector('#difficulty-chip');
const questionText = document.querySelector('#question-text');
const optionList = document.querySelector('#option-list');
const progressFill = document.querySelector('#progress-fill');
const feedback = document.querySelector('#feedback');
const feedbackTitle = document.querySelector('#feedback-title');
const feedbackDetail = document.querySelector('#feedback-detail');
const nextButton = document.querySelector('#next-button');
const nextLabel = document.querySelector('#next-label');
const scoreValue = document.querySelector('#score-value');
const accuracyValue = document.querySelector('#accuracy-value');
const streakValue = document.querySelector('#streak-value');
const runAnswered = document.querySelector('#run-answered');
const runTotal = document.querySelector('#run-total');
const runFill = document.querySelector('#run-fill');
const runCaption = document.querySelector('#run-caption');
const gameLayout = document.querySelector('.game-layout');
const resultScreen = document.querySelector('#result-screen');
const resultTitle = document.querySelector('#result-title');
const finalScore = document.querySelector('#final-score');
const finalPercent = document.querySelector('#final-percent');
const restartButton = document.querySelector('#restart-button');

let sessionId = null;
let difficulty = 'medium';
let score = 0;
let streak = 0;
let answered = 0;
let currentQuestion = null;
let isSubmitting = false;

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Quiz request failed.');
  return data;
}

function updateStats(newScore, total = 0) {
  score = newScore;
  scoreValue.textContent = String(score).padStart(2, '0');
  accuracyValue.textContent = answered ? `${Math.round((score / answered) * 100)}%` : '--%';
  streakValue.textContent = String(streak).padStart(2, '0');
  runAnswered.textContent = String(answered).padStart(2, '0');
  if (total) runTotal.textContent = String(total).padStart(2, '0');
  const currentTotal = Number(runTotal.textContent);
  runFill.style.width = `${currentTotal ? (answered / currentTotal) * 100 : 0}%`;
}

function renderQuestion(question, number, total) {
  currentQuestion = question;
  isSubmitting = false;
  questionCount.textContent = `QUESTION ${String(number).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
  difficultyChip.textContent = difficulty.toUpperCase();
  progressFill.style.width = `${((number - 1) / total) * 100}%`;
  questionText.textContent = question.question;
  optionList.replaceChildren();
  feedback.hidden = true;

  question.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.className = 'option-button';
    button.type = 'button';
    button.dataset.optionId = String(option.id);
    const key = document.createElement('span');
    key.className = 'option-key';
    key.textContent = letters[index];
    const text = document.createElement('span');
    text.className = 'option-text';
    text.textContent = option.option;
    const icon = document.createElement('span');
    icon.className = 'option-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = '✓';
    button.append(key, text, icon);
    button.addEventListener('click', () => submitAnswer(option.id));
    optionList.append(button);
  });
}

async function startQuiz(nextDifficulty = difficulty) {
  difficulty = nextDifficulty;
  difficultyButtons.forEach((button) => {
    button.disabled = true;
    button.classList.toggle('is-selected', button.dataset.difficulty === difficulty);
  });
  questionText.textContent = 'Loading question...';
  optionList.replaceChildren();
  feedback.hidden = true;
  resultScreen.hidden = true;
  gameLayout.hidden = false;
  score = 0;
  streak = 0;
  answered = 0;
  updateStats(0);
  runCaption.textContent = 'IN PLAY';

  try {
    const result = await requestJson('/api/quiz', {
      method: 'POST',
      body: JSON.stringify({ difficulty }),
    });
    sessionId = result.sessionId;
    runTotal.textContent = String(result.total).padStart(2, '0');
    updateStats(result.score, result.total);
    renderQuestion(result.question, 1, result.total);
  } catch (error) {
    showError(error);
  } finally {
    difficultyButtons.forEach((button) => { button.disabled = false; });
  }
}

async function submitAnswer(optionId) {
  if (isSubmitting || !sessionId || !currentQuestion) return;
  isSubmitting = true;
  try {
    const result = await requestJson(`/api/quiz/${sessionId}/answer`, {
      method: 'POST',
      body: JSON.stringify({ optionId }),
    });
    answered += 1;
    streak = result.correct ? streak + 1 : 0;
    updateStats(result.score, result.total);
    progressFill.style.width = `${(result.questionNumber / result.total) * 100}%`;

    [...optionList.children].forEach((button) => {
      button.disabled = true;
      if (Number(button.dataset.optionId) === result.correctOptionId) {
        button.classList.add('is-correct');
      } else if (Number(button.dataset.optionId) === optionId) {
        button.classList.add('is-wrong');
      }
    });

    feedbackTitle.textContent = result.correct ? 'Correct.' : 'Not quite.';
    feedbackDetail.textContent = `${result.correctAnswer} / ${result.explanation}`;
    nextLabel.textContent = result.isLast ? 'FINAL SCORE' : 'NEXT QUESTION';
    feedback.hidden = false;
    runCaption.textContent = result.isLast ? 'LAST ANSWER IN' : 'ANSWER RECORDED';
  } catch (error) {
    isSubmitting = false;
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
      renderQuestion(result.question, result.questionNumber, result.total);
      updateStats(result.score, result.total);
      runCaption.textContent = 'IN PLAY';
    }
  } catch (error) {
    showError(error);
  } finally {
    nextButton.disabled = false;
  }
}

function showResults(result) {
  gameLayout.hidden = true;
  resultScreen.hidden = false;
  finalScore.textContent = `${result.score} / ${result.total}`;
  finalPercent.textContent = `${result.percentage}% ACCURACY`;
  resultTitle.textContent = result.percentage === 100
    ? 'Flawless query.'
    : result.percentage >= 60
      ? 'Nice querying.'
      : 'Keep connecting.';
  runCaption.textContent = 'RUN COMPLETE';
  resultScreen.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function showError(error) {
  questionText.textContent = error.message;
  optionList.replaceChildren();
  feedback.hidden = true;
  runCaption.textContent = 'CONNECTION ERROR';
}

difficultyButtons.forEach((button) => {
  button.addEventListener('click', () => startQuiz(button.dataset.difficulty));
});
nextButton.addEventListener('click', continueQuiz);
restartButton.addEventListener('click', () => startQuiz(difficulty));

document.addEventListener('keydown', (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  if (resultScreen.hidden && !feedback.hidden && event.key === 'Enter') continueQuiz();
  if (resultScreen.hidden && feedback.hidden && /^[1-4]$/.test(event.key)) {
    optionList.children[Number(event.key) - 1]?.click();
  }
});

startQuiz();