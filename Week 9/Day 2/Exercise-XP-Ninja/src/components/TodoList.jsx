import { useState } from "react";
import { connect } from "react-redux";
import { addTodo, toggleTodo, removeTodo } from "../redux/todosSlice";

function TodoList({
  currentUser,
  todos,
  addTodo,
  toggleTodo,
  removeTodo,
}) {
  const [text, setText] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!text.trim()) return;

    addTodo({
      userId: currentUser.id,
      text: text.trim(),
    });

    setText("");
  }

  if (!currentUser) {
    return <p>Please log in to manage your todos.</p>;
  }

  return (
    <section className="todo-card">
      <h2>My Todo List</h2>
      <p>Welcome, {currentUser.username}! Manage your tasks below.</p>

      <form onSubmit={handleSubmit} className="todo-form">
        <input
          type="text"
          placeholder="What do you need to do?"
          value={text}
          onChange={(event) => setText(event.target.value)}
          aria-label="New todo"
          required
        />
        <button type="submit">Add Todo</button>
      </form>

      {todos.length === 0 ? (
        <p className="empty-message">No tasks yet. Add your first task!</p>
      ) : (
        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo.id} className={todo.completed ? "completed" : ""}>
              <label className="todo-label">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() =>
                    toggleTodo({
                      userId: currentUser.id,
                      todoId: todo.id,
                    })
                  }
                />
                <span>{todo.text}</span>
              </label>

              <button
                type="button"
                className="delete-button"
                onClick={() =>
                  removeTodo({
                    userId: currentUser.id,
                    todoId: todo.id,
                  })
                }
                aria-label={`Delete ${todo.text}`}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

const mapStateToProps = (state) => {
  const currentUser = state.auth.currentUser;

  return {
    currentUser,
    todos: currentUser
      ? state.todos.todosByUser[currentUser.id] || []
      : [],
  };
};

const mapDispatchToProps = {
  addTodo,
  toggleTodo,
  removeTodo,
};

export default connect(mapStateToProps, mapDispatchToProps)(TodoList);
