import { useSelector } from 'react-redux'
import TodoItem from './TodoItem.jsx'

function TodoList() {
  const todos = useSelector((state) => state.todos)

  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-mark" aria-hidden="true">01</span>
        <p>Your list is clear.</p>
        <span>Add a task above to get started.</span>
      </div>
    )
  }

  return (
    <ul className="todo-list" aria-label="Todo list">
      {todos.map((todo) => <TodoItem key={todo.id} todo={todo} />)}
    </ul>
  )
}

export default TodoList