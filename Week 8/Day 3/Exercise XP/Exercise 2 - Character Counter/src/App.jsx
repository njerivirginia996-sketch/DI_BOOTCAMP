import React, { useRef, useState } from 'react';

function CharacterCounter() {
  const inputRef = useRef(null);
  const [count, setCount] = useState(0);

  function handleInput() {
    setCount(inputRef.current.value.length);
  }

  function clearInput() {
    inputRef.current.value = '';
    setCount(0);
    inputRef.current.focus();
  }

  return (
    <main className="layout">
      <header>
        <p className="eyebrow">REACT HOOKS LAB / 02</p>
        <h1>Every character<br /><em>counts.</em></h1>
        <p className="intro">A small live tally, reading straight from the input as you type.</p>
      </header>
      <section className="counter-board" aria-label="Character counter">
        <label htmlFor="message">YOUR MESSAGE</label>
        <input id="message" onInput={handleInput} placeholder="Start typing here..." ref={inputRef} type="text" />
        <div className="count-line" aria-live="polite">
          <span>CHARACTER COUNT</span>
          <strong>{count}</strong>
        </div>
        <button className="clear-button" disabled={count === 0} onClick={clearInput} type="button">Clear input <span aria-hidden="true">↺</span></button>
      </section>
      <footer>useRef <span>+</span> useState</footer>
    </main>
  );
}

export default function App() {
  return <CharacterCounter />;
}