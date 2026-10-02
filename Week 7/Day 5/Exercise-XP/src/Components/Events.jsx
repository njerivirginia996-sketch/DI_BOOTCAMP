import { useState } from 'react'

function Events() {
  const [isToggleOn, setIsToggleOn] = useState(true)

  const clickMe = () => window.alert('I was clicked')

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      window.alert(event.currentTarget.value)
    }
  }

  const toggleState = () => {
    setIsToggleOn((previousValue) => !previousValue)
  }

  return (
    <div className="component-output">
      <div className="control-row">
        <button className="action-button" type="button" onClick={clickMe}>
          Click me
        </button>
        <button
          className={`action-button${isToggleOn ? ' is-on' : ''}`}
          type="button"
          aria-pressed={isToggleOn}
          onClick={toggleState}
        >
          {isToggleOn ? 'ON' : 'OFF'}
        </button>
      </div>
      <label className="control-label">
        Press Enter to show your text
        <input
          className="text-input"
          type="text"
          onKeyDown={handleKeyDown}
          placeholder="Type something"
        />
      </label>
    </div>
  )
}

export default Events