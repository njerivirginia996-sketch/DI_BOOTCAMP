import React from "react";

function TodoForm({ input, setInput, addTodo }) {
  return (
    <form onSubmit={addTodo} className="todo-form">
      <input
        type="text"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder="Enter a todo"
      />

      <button type="submit">Add Todo</button>
    </form>
  );
}

export default TodoForm;