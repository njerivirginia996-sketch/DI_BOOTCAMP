import React, { useState } from 'react';
import quotes from './quotes.js';

const palettes = [
  { background: '#f4eee4', foreground: '#28362f', button: '#b84d36', buttonText: '#fffaf4', accent: '#be5c43' },
  { background: '#dcebe2', foreground: '#153e37', button: '#153e37', buttonText: '#f1f6ef', accent: '#35766a' },
  { background: '#28342f', foreground: '#f2e9d9', button: '#df795d', buttonText: '#202a25', accent: '#efa18a' },
  { background: '#dce9ee', foreground: '#173f58', button: '#d65d34', buttonText: '#fffaf4', accent: '#34728e' },
  { background: '#f2e0df', foreground: '#49333c', button: '#385d54', buttonText: '#f5f0e6', accent: '#a24f59' },
  { background: '#e9e5c9', foreground: '#393d2d', button: '#9b4e36', buttonText: '#fff8ed', accent: '#687047' },
];

function shuffle(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function createDrawState() {
  const firstIndex = Math.floor(Math.random() * quotes.length);
  const remaining = shuffle(quotes.map((_, index) => index).filter((index) => index !== firstIndex));
  return { currentIndex: firstIndex, remaining };
}

function randomDifferentIndex(length, currentIndex) {
  if (length < 2) return 0;
  return (currentIndex + 1 + Math.floor(Math.random() * (length - 1))) % length;
}

export default function App() {
  const [drawState, setDrawState] = useState(createDrawState);
  const [paletteIndex, setPaletteIndex] = useState(() => Math.floor(Math.random() * palettes.length));
  const quote = quotes[drawState.currentIndex];
  const palette = palettes[paletteIndex];
  const quoteNumber = quotes.length - drawState.remaining.length;

  function showNextQuote() {
    setDrawState((current) => {
      const remaining = current.remaining.length
        ? current.remaining
        : shuffle(quotes.map((_, index) => index).filter((index) => index !== current.currentIndex));
      const [nextIndex, ...nextRemaining] = remaining;
      return { currentIndex: nextIndex, remaining: nextRemaining };
    });
    setPaletteIndex((current) => randomDifferentIndex(palettes.length, current));
  }

  return (
    <main
      className="quote-page"
      style={{
        '--page-color': palette.background,
        '--ink-color': palette.foreground,
        '--action-color': palette.button,
        '--action-ink': palette.buttonText,
        '--accent-color': palette.accent,
      }}
    >
      <header className="masthead">
        <a className="wordmark" href="#top" aria-label="A Thought to Carry home">
          <span className="wordmark-icon" aria-hidden="true">q.</span>
          <span>good words</span>
        </a>
        <span className="masthead-note">A THOUGHT TO CARRY</span>
        <span className="issue-number">REACT / 08</span>
      </header>

      <section className="quote-layout" id="top">
        <div className="intro-column">
          <p className="eyebrow"><span /> A MOMENT FOR YOURSELF</p>
          <h1>Keep a good<br />thought <em>close.</em></h1>
          <p className="intro-copy">A few words can shift the shape of a day. Find one that stays with you.</p>
          <div className="draw-progress" aria-live="polite">
            <span className="progress-count">{String(quoteNumber).padStart(2, '0')}</span>
            <span className="progress-line" />
            <span className="progress-total">{String(quotes.length).padStart(2, '0')} WORDS TO FIND</span>
          </div>
        </div>

        <article aria-live="polite" className="quote-card" key={drawState.currentIndex}>
          <div className="card-topline">
            <span>THE DAILY COLLECTION</span>
            <span className="orbit-mark" aria-hidden="true">✳</span>
          </div>
          <blockquote>
            <p>{quote.quote}</p>
          </blockquote>
          <p className="quote-author"><span />{quote.author || 'Unknown author'}</p>
          <button className="next-button" onClick={showNextQuote} type="button">
            <span>Find another thought</span>
            <span aria-hidden="true" className="button-arrow">&#8594;</span>
          </button>
          <p className="card-footnote">NO REPEATS UNTIL THE COLLECTION IS COMPLETE</p>
        </article>
      </section>

      <footer className="page-footer">
        <span>TAKE WHAT YOU NEED.</span>
        <span>ONE QUOTE AT A TIME</span>
      </footer>
    </main>
  );
}