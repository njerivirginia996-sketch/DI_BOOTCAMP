import React from "react";
import { connect } from "react-redux";
import { addTodo, toggleTodo, removeTodo } from "../redux/actions";
import CategoryList from "./CategoryList";

function TodoApp({ categories, addTodo, toggleTodo, removeTodo }) {
  const totalTodos = categories.reduce(
    (total, category) => total + category.todos.length,
    0
  );

  const completedTodos = categories.reduce(
    (total, category) =>
      total + category.todos.filter((todo) => todo.completed).length,
    0
  );

  return (
    <main className="app-container">
      <header className="app-header">
        <p className="eyebrow">PLAN YOUR DAY</p>
        <h1>My Todo List</h1>
        <p className="subtitle">
          Keep your personal, study, and work tasks organized.
        </p>

        <div className="summary">
          <span>{totalTodos} total tasks</span>
          <span>{completedTodos} completed</span>
          <span>
            {totalTodos - completedTodos} remaining
          </span>
        </div>
      </header>

      <div className="category-grid">
        {categories.map((category) => (
          <CategoryList
            key={category.id}
            category={category}
            onAdd={addTodo}
            onToggle={toggleTodo}
            onRemove={removeTodo}
          />
        ))}
      </div>

      <footer className="app-footer">
        Powered by React and Redux
      </footer>
    </main>
  );
}

const mapStateToProps = (state) => ({
  categories: state.categories,
});

const mapDispatchToProps = {
  addTodo,
  toggleTodo,
  removeTodo,
};

export default connect(mapStateToProps, mapDispatchToProps)(TodoApp);
