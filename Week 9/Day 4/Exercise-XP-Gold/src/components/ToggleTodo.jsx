import { useDispatch } from 'react-redux';
import { toggleTodo } from '../features/todos/todoSlice';

function ToggleTodo({ id, completed }) {
  const dispatch = useDispatch();

  return (
    <input
      className="todo-checkbox"
      type="checkbox"
      checked={completed}
      onChange={() => dispatch(toggleTodo(id))}
      aria-label={completed ? 'Mark as incomplete' : 'Mark as complete'}
    />
  );
}

export default ToggleTodo;
