import { connect } from 'react-redux'
import { selectDay } from '../redux/actions.js'

function formatDateInput(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// This component is exported through react-redux connect.
// eslint-disable-next-line react-refresh/only-export-components
function DatePicker({ selectedDay, selectDay }) {
  function changeDay(offset) {
    const nextDay = new Date(`${selectedDay}T12:00:00`)
    nextDay.setDate(nextDay.getDate() + offset)
    selectDay(formatDateInput(nextDay))
  }

  return (
    <div className="date-picker">
      <label className="date-label" htmlFor="selected-day">SELECT A DAY</label>
      <input
        id="selected-day"
        type="date"
        value={selectedDay}
        onChange={(event) => {
          if (event.target.value) selectDay(event.target.value)
        }}
      />
      <div className="date-controls">
        <button type="button" onClick={() => changeDay(-1)} aria-label="Previous day">←</button>
        <button type="button" className="today-button" onClick={() => selectDay(formatDateInput(new Date()))}>Today</button>
        <button type="button" onClick={() => changeDay(1)} aria-label="Next day">→</button>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({ selectedDay: state.selectedDay })

export default connect(mapStateToProps, { selectDay })(DatePicker)