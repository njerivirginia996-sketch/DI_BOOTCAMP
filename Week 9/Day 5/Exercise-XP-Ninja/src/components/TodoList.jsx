
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addTodo,
  toggleTodo,
  removeTodo,
  setVisibilityFilter,
} from "../features/todos/todosSlice";
import {
  selectTodos,
  selectVisibilityFilter,
  selectFilteredTodosCount,
} from "../features/todos/todosSelectors";

const filters = ["All", "Active", "Completed"];

export default function TodoList() {
  const [text, setText] = useState("");
  const dispatch = useDispatch();

  const todos = useSelector(selectTodos);
  const filter = useSelector(selectVisibilityFilter);
  const count = useSelector(selectFilteredTodosCount);

  const handleAdd = useCallback(
    (event) => {
      event.preventDefault();
      const value = text.trim();

      if (!value) return;

      dispatch(addTodo(value));
      setText("");
    },
    [dispatch, text]
  );

  const handleToggle = useCallback(
    (id) => dispatch(toggleTodo(id)),
    [dispatch]
  );

  const handleDelete = useCallback(
    (id) => dispatch(removeTodo(id)),
    [dispatch]
  );

  const handleFilter = useCallback(
    (value) => dispatch(setVisibilityFilter(value)),
    [dispatch]
  );

  return (
    <main className="todo-container">
      <h1>My Todo List</h1>

      <form className="todo-form" onSubmit={handleAdd}>
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Enter a task..."
          aria-label="New todo"
        />
        <button type="submit">Add Todo</button>
      </form>

      <nav className="filters" aria-label="Todo filters">
        {filters.map((value) => (
          <button
            type="button"
            key={value}
            className={filter === value ? "filter active" : "filter"}
            aria-pressed={filter === value}
            onClick={() => handleFilter(value)}
          >
            {value}
          </button>
        ))}
      </nav>

      <p>
        {count} {count === 1 ? "todo" : "todos"}
      </p>

      {todos.length === 0 ? (
        <p>No todos in this filter.</p>
      ) : (
        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo.id} className="todo-item">
              <label className={todo.completed ? "completed" : ""}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggle(todo.id)}
                />
                {todo.text}
              </label>

              <button
                type="button"
                className="delete-button"
                onClick={() => handleDelete(todo.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
