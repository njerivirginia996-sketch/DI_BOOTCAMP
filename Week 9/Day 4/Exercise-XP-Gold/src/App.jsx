import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodos } from './features/todos/todoThunks';
import AddTodo from './components/AddTodo';
import TodoList from './components/TodoList';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.todos);

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const completedCount = items.filter((todo) => todo.completed).length;

  return (
    <main className="app-container">
      <header className="app-header">
        <p className="eyebrow">REDUX TOOLKIT PROJECT</p>
        <h1>My Todo List</h1>
        <p>Organize your tasks, one step at a time.</p>
      </header>

      <section className="todo-card">
        <AddTodo />

        <div className="todo-summary">
          <span>{items.length} tasks</span>
          <span>{completedCount} completed</span>
        </div>

        <TodoList />

        {loading && items.length > 0 && (
          <p className="refresh-message">Refreshing todos...</p>
        )}
      </section>

      <footer className="app-footer">
        Built with React, Redux Toolkit and Redux Thunk
      </footer>
    </main>
  );
}

export default App;
