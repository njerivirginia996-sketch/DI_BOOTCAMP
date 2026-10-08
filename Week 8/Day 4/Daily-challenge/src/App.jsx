import React, { useState } from 'react';

const operations = {
  add: { label: 'Addition', symbol: '+', action: 'Add Them', calculate: (left, right) => left + right },
  subtract: { label: 'Subtraction', symbol: '−', action: 'Subtract', calculate: (left, right) => left - right },
  multiply: { label: 'Multiplication', symbol: '×', action: 'Multiply', calculate: (left, right) => left * right },
  divide: { label: 'Division', symbol: '÷', action: 'Divide', calculate: (left, right) => left / right },
};

function formatResult(value) {
  const rounded = Number(value.toPrecision(12));
  return Object.is(rounded, -0) ? '0' : String(rounded);
}

export default function App() {
  const [firstNumber, setFirstNumber] = useState('');
  const [secondNumber, setSecondNumber] = useState('');
  const [operation, setOperation] = useState('add');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const selectedOperation = operations[operation];

  function calculate(event) {
    event.preventDefault();

    if (firstNumber.trim() === '' || secondNumber.trim() === '') {
      setResult(null);
      setError('Enter both numbers to calculate.');
      return;
    }

    const left = Number(firstNumber);
    const right = Number(secondNumber);

    if (!Number.isFinite(left) || !Number.isFinite(right)) {
      setResult(null);
      setError('Enter valid numbers in both fields.');
      return;
    }

    if (operation === 'divide' && right === 0) {
      setResult(null);
      setError('A number cannot be divided by zero.');
      return;
    }

    setError('');
    setResult(formatResult(selectedOperation.calculate(left, right)));
  }

  function updateOperation(event) {
    setOperation(event.target.value);
    setResult(null);
    setError('');
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <a aria-label="Pocket Math home" className="brand" href="#calculator">
          <span aria-hidden="true" className="brand-mark">pm.</span>
          <span>pocket math</span>
        </a>
        <span className="topbar-label">EVERYDAY ARITHMETIC / 01</span>
      </header>

      <section className="calculator-layout" id="calculator">
        <div className="intro">
          <p className="eyebrow"><span /> THE QUICK CALCULATOR</p>
          <h1>Numbers,<br /><em>made easy.</em></h1>
          <p className="intro-copy">Put two numbers together and let the answer do the talking.</p>
          <div className="operation-key" aria-hidden="true">
            <span>+</span><span>−</span><span>×</span><span>÷</span>
          </div>
        </div>

        <section aria-labelledby="calculator-title" className="calculator-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">YOUR WORKSPACE</p>
              <h2 id="calculator-title">Try a calculation</h2>
            </div>
            <span aria-hidden="true" className="panel-stamp">01</span>
          </div>

          <form onSubmit={calculate}>
            <div className="number-fields">
              <label className="number-field">
                <span>FIRST NUMBER</span>
                <input
                  aria-label="First number"
                  inputMode="decimal"
                  onChange={(event) => { setFirstNumber(event.target.value); setResult(null); setError(''); }}
                  placeholder="0"
                  step="any"
                  type="number"
                  value={firstNumber}
                />
              </label>
              <span aria-hidden="true" className="field-connector">{selectedOperation.symbol}</span>
              <label className="number-field">
                <span>SECOND NUMBER</span>
                <input
                  aria-label="Second number"
                  inputMode="decimal"
                  onChange={(event) => { setSecondNumber(event.target.value); setResult(null); setError(''); }}
                  placeholder="0"
                  step="any"
                  type="number"
                  value={secondNumber}
                />
              </label>
            </div>

            <label className="operation-field">
              <span>OPERATION</span>
              <select aria-label="Operation" onChange={updateOperation} value={operation}>
                {Object.entries(operations).map(([value, item]) => (
                  <option key={value} value={value}>{item.label} ({item.symbol})</option>
                ))}
              </select>
            </label>

            <button className="calculate-button" type="submit">
              <span>{selectedOperation.action}</span>
              <span aria-hidden="true">&#8594;</span>
            </button>
          </form>

          <div aria-live="polite" className={`answer-box${result !== null ? ' has-result' : ''}${error ? ' has-error' : ''}`}>
            <span className="answer-label">ANSWER</span>
            {result !== null ? (
              <output className="answer-value">{result}</output>
            ) : (
              <p className="answer-placeholder">{error || 'Your result will appear here.'}</p>
            )}
          </div>
        </section>
      </section>

      <footer className="page-footer"><span>POCKET MATH / REACT</span><span>Simple sums. Clear answers.</span></footer>
    </main>
  );
}