const questions = [
  {
    difficulty: 'easy',
    question: 'Which HTML element represents the largest standard heading?',
    options: ['<head>', '<h1>', '<title>', '<header>'],
    correctIndex: 1,
    explanation: '<h1> is the top-level heading element.',
  },
  {
    difficulty: 'easy',
    question: 'Which JavaScript keyword declares a block-scoped variable that can be reassigned?',
    options: ['const', 'let', 'static', 'final'],
    correctIndex: 1,
    explanation: 'let is block-scoped and allows reassignment.',
  },
  {
    difficulty: 'easy',
    question: 'Which CSS property changes the color of text?',
    options: ['font-style', 'background', 'color', 'text-decoration'],
    correctIndex: 2,
    explanation: 'The color property sets an element’s text color.',
  },
  {
    difficulty: 'medium',
    question: 'What does express.json() middleware do?',
    options: ['Formats JSON responses', 'Parses incoming JSON request bodies', 'Stores JSON in a database', 'Checks JavaScript syntax'],
    correctIndex: 1,
    explanation: 'express.json() parses JSON request bodies into req.body.',
  },
  {
    difficulty: 'medium',
    question: 'Which SQL clause filters rows before they are returned?',
    options: ['ORDER BY', 'GROUP BY', 'WHERE', 'SELECT'],
    correctIndex: 2,
    explanation: 'WHERE applies a condition to rows in a query.',
  },
  {
    difficulty: 'medium',
    question: 'Which HTTP status code normally means a resource was not found?',
    options: ['201', '301', '404', '500'],
    correctIndex: 2,
    explanation: '404 Not Found means the requested resource could not be found.',
  },
  {
    difficulty: 'hard',
    question: 'What does a foreign key primarily enforce?',
    options: ['A column is always unique', 'A relationship references an existing row', 'A query is automatically indexed', 'A table cannot contain null values'],
    correctIndex: 1,
    explanation: 'Foreign keys enforce referential integrity between related tables.',
  },
  {
    difficulty: 'hard',
    question: 'What is the result of Promise.all() when one input promise rejects?',
    options: ['It fulfills with the other values', 'It retries the rejected promise', 'It rejects with that reason', 'It waits for a timeout'],
    correctIndex: 2,
    explanation: 'Promise.all() rejects if any input promise rejects.',
  },
  {
    difficulty: 'hard',
    question: 'Which Knex method rolls back a transaction?',
    options: ['trx.abort()', 'trx.rollback()', 'trx.cancel()', 'trx.undo()'],
    correctIndex: 1,
    explanation: 'Calling rollback() aborts the current Knex transaction.',
  },
];

exports.seed = async function (knex) {
  const [{ count }] = await knex('questions').count({ count: '*' });
  if (Number(count) > 0) return;

  for (const item of questions) {
    const optionIds = [];
    for (const option of item.options) {
      const [optionId] = await knex('options').insert({ option });
      optionIds.push(optionId);
    }

    const [questionId] = await knex('questions').insert({
      question: item.question,
      difficulty: item.difficulty,
      correct_option_id: optionIds[item.correctIndex],
      explanation: item.explanation,
    });

    await knex('questions_options').insert(optionIds.map((optionId) => ({
      question_id: questionId,
      option_id: optionId,
    })));
  }
};