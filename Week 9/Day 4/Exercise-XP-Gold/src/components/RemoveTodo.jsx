import { useDispatch } from 'react-redux';
import { removeTodo } from '../features/todos/todoSlice';

function RemoveTodo({ id }) {
  const dispatch = useDispatch();

  return (
    <button
      className="remove-button"
      onClick={() => dispatch(removeTodo(id))}
      aria-label="Remove todo"
    >
      Remove
    </button>
  );
}

export default RemoveTodo;
