import { useSelector } from 'react-redux';
import ToggleTodo from './ToggleTodo';
import RemoveTodo from './RemoveTodo';

function TodoList() {
  const { items, loading, error } = useSelector(
    (state) => state.todos
  );

  if (loading && items.length === 0) {
    return <p className="status-message">Loading todos...</p>;
  }

  if (error && items.length === 0) {
    return (
      <div className="error-message" role="alert">
        <p>{error}</p>
        <p>Please refresh the page to try again.</p>
      </div>
    );
  }

  if (items.length === 0) {
    return <p className="status-message">No todos yet. Add one above!</p>;
  }

  return (
    <section className="todo-list">
      {error && <p className="error-message">{error}</p>}

      {items.map((todo) => (
        <article
          className={`todo-item ${todo.completed ? 'completed' : ''}`}
          key={todo.id}
        >
          <ToggleTodo id={todo.id} completed={todo.completed} />

          <span className="todo-title">{todo.title}</span>

          <RemoveTodo id={todo.id} />
        </article>
      ))}
    </section>
  );
}

export default TodoList;
