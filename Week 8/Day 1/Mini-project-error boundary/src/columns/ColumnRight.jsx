import React, { useState } from 'react'
import ErrorBoundary from '../ErrorBoundary.jsx'

function CrashingParagraph({ text }) {
  return (
    <p className="description-copy">
      Clicking this button replaces the <code>stringified</code> object, <code>{text}</code>, with the original object. React cannot render a plain object, so this paragraph will throw during rendering.
    </p>
  )
}

export function ColumnRight() {
  const crasher = { function: 'I live to crash' }
  const [text, setText] = useState(JSON.stringify(crasher))

  const eventHandler = () => {
    throw new Error('Event handler error')
  }

  return (
    <section className="column column-right" aria-labelledby="errors-heading">
      <div className="column-heading">
        <span className="column-index">02 / BOUNDARY</span>
        <h2 id="errors-heading">Catch the render.<br />Not the event.</h2>
        <p>Error boundaries catch errors while rendering child components. They do not catch errors thrown inside event handlers.</p>
      </div>

      <div className="error-demo-block">
        <div className="demo-label"><span className="step-number">A</span><span>RENDERING ERROR</span></div>
        <ErrorBoundary>
          <CrashingParagraph text={text} />
        </ErrorBoundary>
        <button className="danger-button" onClick={() => setText(crasher)}>
          Replace string with object <span aria-hidden="true">↗</span>
        </button>
      </div>

      <div className="error-demo-block event-block">
        <div className="demo-label"><span className="step-number">B</span><span>EVENT HANDLER ERROR</span></div>
        <p className="description-copy">This button throws from its click handler. The boundary will not catch it; check the developer console for the error.</p>
        <button className="outline-button" onClick={eventHandler}>
          Invoke event handler <span aria-hidden="true">↗</span>
        </button>
      </div>

      <div className="boundary-note"><span aria-hidden="true">↳</span><p>The page shell, this column, and the image request remain available when the paragraph boundary catches its error.</p></div>
    </section>
  )
}