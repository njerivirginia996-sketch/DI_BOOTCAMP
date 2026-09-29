const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const emojis = [
  { emoji: '😀', name: 'Smile' },
  { emoji: '🐶', name: 'Dog' },
  { emoji: '🌮', name: 'Taco' },
  { emoji: '🐱', name: 'Cat' },
  { emoji: '🍕', name: 'Pizza' },
  { emoji: '🚗', name: 'Car' },
  { emoji: '🌞', name: 'Sun' },
  { emoji: '🍎', name: 'Apple' },
  { emoji: '🎸', name: 'Guitar' },
  { emoji: '🐘', name: 'Elephant' },
  { emoji: '⚽', name: 'Soccer Ball' },
  { emoji: '🏠', name: 'House' },
];

// player name -> score
const scores = new Map();

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

// Get a random emoji with 4 options (1 correct + 3 wrong)
app.get('/api/question', (req, res) => {
  const correct = emojis[Math.floor(Math.random() * emojis.length)];
  const distractors = shuffle(emojis.filter(e => e.name !== correct.name)).slice(0, 3);
  const options = shuffle([correct, ...distractors]).map(e => e.name);

  // The answer is NOT sent to the browser
  res.json({ emoji: correct.emoji, options });
});

// Check a guess and update the score
app.post('/api/guess', (req, res) => {
  const { player, emoji, guess } = req.body;

  if (!player || !emoji || !guess) {
    return res.status(400).json({ message: 'player, emoji and guess are required' });
  }

  const found = emojis.find(e => e.emoji === emoji);
  if (!found) return res.status(404).json({ message: 'Emoji not found' });

  if (!scores.has(player)) scores.set(player, 0);

  const correct = found.name === guess;
  if (correct) scores.set(player, scores.get(player) + 1);

  res.json({
    correct,
    correctAnswer: found.name,
    score: scores.get(player),
  });
});

// Top 5 scores
app.get('/api/leaderboard', (req, res) => {
  const top = [...scores.entries()]
    .map(([player, score]) => ({ player, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
  res.json(top);
});

app.listen(PORT, () => {
  console.log(`Emoji game running on http://localhost:${PORT}`);
});