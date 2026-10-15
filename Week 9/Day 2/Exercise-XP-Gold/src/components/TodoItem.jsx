import React from "react";

function TodoItem({ todo, categoryId, onToggle, onRemove }) {
  return (
    <li className={`todo-item ${todo.completed ? "completed" : ""}`}>
      <label className="todo-label">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(categoryId, todo.id)}
        />
        <span>{todo.text}</span>
      </label>

      <button
        className="delete-button"
        onClick={() => onRemove(categoryId, todo.id)}
        aria-label={`Delete ${todo.text}`}
      >
        Delete
      </button>
    </li>
  );
}

export default TodoItem;
