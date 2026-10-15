import React from "react";

function TodoList({ todos, dispatch }) {
  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <li key={todo.id}>
          <span>{todo.text}</span>

          <button
            onClick={() =>
              dispatch({
                type: "REMOVE_TODO",
                payload: todo.id,
              })
            }
          >
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
}

export default TodoList;