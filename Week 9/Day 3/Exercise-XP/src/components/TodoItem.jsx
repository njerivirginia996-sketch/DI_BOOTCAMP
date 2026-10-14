import { useDispatch } from 'react-redux'
import { removeTodo, toggleTodo } from '../redux/todoSlice.js'

function TodoItem({ todo }) {
  const dispatch = useDispatch()

  return (
    <li className={`todo-row${todo.completed ? ' is-complete' : ''}`}>
      <button
        className="todo-check"
        type="button"
        onClick={() => dispatch(toggleTodo(todo.id))}
        aria-label={todo.completed ? `Mark ${todo.text} incomplete` : `Complete ${todo.text}`}
        aria-pressed={todo.completed}
      >
        {todo.completed && <span aria-hidden="true">✓</span>}
      </button>
      <span className="todo-text">{todo.text}</span>
      <button
        className="remove-button"
        type="button"
        onClick={() => dispatch(removeTodo(todo.id))}
        aria-label={`Remove ${todo.text}`}
        title="Remove task"
      >
        <span aria-hidden="true">×</span>
      </button>
    </li>
  )
}

export default TodoItem