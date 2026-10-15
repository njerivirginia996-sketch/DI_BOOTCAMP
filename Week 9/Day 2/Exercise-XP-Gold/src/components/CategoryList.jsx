import React, { useState } from "react";
import TodoItem from "./TodoItem";

function CategoryList({
  category,
  onAdd,
  onToggle,
  onRemove,
}) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!text.trim()) {
      setError("Please enter a todo.");
      return;
    }

    onAdd(category.id, text);
    setText("");
    setError("");
  };

  const completedCount = category.todos.filter(
    (todo) => todo.completed
  ).length;

  return (
    <section className="category-card">
      <div className="category-heading">
        <h2>{category.name}</h2>
        <span className="todo-count">
          {completedCount}/{category.todos.length} completed
        </span>
      </div>

      <form onSubmit={handleSubmit} className="todo-form">
        <input
          type="text"
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            setError("");
          }}
          placeholder={`Add a ${category.name.toLowerCase()} todo...`}
          aria-label={`New todo for ${category.name}`}
        />
        <button type="submit">Add</button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {category.todos.length === 0 ? (
        <p className="empty-message">No todos yet. Add one above!</p>
      ) : (
        <ul className="todo-list">
          {category.todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              categoryId={category.id}
              onToggle={onToggle}
              onRemove={onRemove}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

export default CategoryList;
