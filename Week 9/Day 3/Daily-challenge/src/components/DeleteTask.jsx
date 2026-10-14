import { useDispatch } from 'react-redux'
import { deleteTask } from '../redux/plannerSlice.js'

function DeleteTask({ day, task }) {
  const dispatch = useDispatch()

  return (
    <button
      className="delete-button"
      type="button"
      onClick={() => dispatch(deleteTask({ day, id: task.id }))}
      aria-label={`Delete ${task.title}`}
      title="Delete task"
    >
      <span aria-hidden="true">×</span>
    </button>
  )
}

export default DeleteTask