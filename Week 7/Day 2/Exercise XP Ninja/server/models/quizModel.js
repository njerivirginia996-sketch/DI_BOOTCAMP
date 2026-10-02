const database = require('../config/database');

async function getQuestionIds(difficulty) {
  const rows = await database('questions')
    .select('id')
    .where({ difficulty })
    .orderBy('id');
  return rows.map((row) => row.id);
}

async function getQuestionById(id) {
  const question = await database('questions')
    .select('id', 'question', 'difficulty')
    .where({ id })
    .first();
  if (!question) return null;

  const options = await database('questions_options')
    .join('options', 'questions_options.option_id', 'options.id')
    .select('options.id', 'options.option')
    .where('questions_options.question_id', id)
    .orderBy('options.id');

  return { ...question, options };
}

async function checkAnswer(questionId, optionId) {
  const row = await database('questions_options')
    .join('questions', 'questions_options.question_id', 'questions.id')
    .join('options as selected_options', 'questions_options.option_id', 'selected_options.id')
    .join('options as correct_options', 'questions.correct_option_id', 'correct_options.id')
    .select(
      'questions.correct_option_id',
      'questions.explanation',
      'correct_options.option as correct_answer',
    )
    .where('questions_options.question_id', questionId)
    .where('questions_options.option_id', optionId)
    .first();

  if (!row) return { valid: false };
  return {
    valid: true,
    correct: Number(row.correct_option_id) === optionId,
    correctOptionId: Number(row.correct_option_id),
    correctAnswer: row.correct_answer,
    explanation: row.explanation,
  };
}

module.exports = { getQuestionIds, getQuestionById, checkAnswer };