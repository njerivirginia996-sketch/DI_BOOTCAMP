import React, { useReducer, useState } from "react";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import "./App.css";

const initialState = [];

function reducer(state, action) {
  switch (action.type) {
    case "ADD_TODO":
      return [
        ...state,
        {
          id: Date.now(),
          text: action.payload,
        },
      ];

    case "REMOVE_TODO":
      return state.filter((todo) => todo.id !== action.payload);

    default:
      return state;
  }
}

function App() {
  const [todos, dispatch] = useReducer(reducer, initialState);
  const [input, setInput] = useState("");

  const addTodo = (event) => {
    event.preventDefault();

    if (!input.trim()) {
      return;
    }

    dispatch({
      type: "ADD_TODO",
      payload: input,
    });

    setInput("");
  };

  return (
    <div className="app">
      <h1>Todo List</h1>

      <TodoForm
        input={input}
        setInput={setInput}
        addTodo={addTodo}
      />

      <TodoList
        todos={todos}
        dispatch={dispatch}
      />
    </div>
  );
}

export default App;