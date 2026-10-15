import { createContext, useContext, useReducer, useState } from 'react';
import './App.css';

const TaskContext = createContext(null);

const initialState = {
  tasks: [],
  filter: 'all',
};

function taskReducer(state, action) {
  switch (action.type) {
    case 'add':
      return { ...state, tasks: [...state.tasks, action.task] };
    case 'toggle':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.id ? { ...task, completed: !task.completed } : task
        ),
      };
    case 'remove':
      return { ...state, tasks: state.tasks.filter((task) => task.id !== action.id) };
    case 'filter':
      return { ...state, filter: action.filter };
    default:
      return state;
  }
}

function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
}

function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('Task components must be rendered inside TaskProvider.');
  }
  return context;
}

function AddTaskForm() {
  const { dispatch } = useTasks();
  const [text, setText] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const trimmedText = text.trim();
    if (!trimmedText) return;

    dispatch({
      type: 'add',
      task: {
        id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`,
        text: trimmedText,
        completed: false,
      },
    });
    setText('');
  }

  return (
    <form className="add-task" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="new-task">New task</label>
      <input
        id="new-task"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="What needs doing?"
        autoComplete="off"
      />
      <button type="submit" className="add-button">Add task <span aria-hidden="true">+</span></button>
    </form>
  );
}

function TaskItem({ task, index }) {
  const { dispatch } = useTasks();

  return (
    <li className={`task-row${task.completed ? ' is-complete' : ''}`}>
      <span className="task-index">{String(index + 1).padStart(2, '0')}</span>
      <label className="task-label">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => dispatch({ type: 'toggle', id: task.id })}
          aria-label={`Mark ${task.text} ${task.completed ? 'incomplete' : 'complete'}`}
        />
        <span className="checkmark" aria-hidden="true" />
        <span className="task-text">{task.text}</span>
      </label>
      <button
        className="remove-button"
        type="button"
        onClick={() => dispatch({ type: 'remove', id: task.id })}
        aria-label={`Remove ${task.text}`}
      >
        Remove
      </button>
    </li>
  );
}

function TaskList() {
  const { state, dispatch } = useTasks();
  const filters = ['all', 'active', 'completed'];
  const visibleTasks = state.tasks.filter((task) => {
    if (state.filter === 'active') return !task.completed;
    if (state.filter === 'completed') return task.completed;
    return true;
  });
  const completedCount = state.tasks.filter((task) => task.completed).length;

  return (
    <section className="task-section" aria-labelledby="tasks-heading">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Your list</p>
          <h2 id="tasks-heading">Tasks <span>{String(state.tasks.length).padStart(2, '0')}</span></h2>
        </div>
        <p className="progress-copy">{completedCount} of {state.tasks.length} done</p>
      </div>
      <div className="task-toolbar">
        <div className="filter-group" role="group" aria-label="Filter tasks">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              className={state.filter === filter ? 'filter-button is-selected' : 'filter-button'}
              aria-pressed={state.filter === filter}
              onClick={() => dispatch({ type: 'filter', filter })}
            >
              {filter[0].toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
        {state.tasks.length > 0 && (
          <span className="remaining-count">{state.tasks.length - completedCount} remaining</span>
        )}
      </div>
      {visibleTasks.length > 0 ? (
        <ul className="task-list">
          {visibleTasks.map((task, index) => (
            <TaskItem key={task.id} task={task} index={index} />
          ))}
        </ul>
      ) : (
        <div className="empty-state">
          <span className="empty-mark" aria-hidden="true">{state.tasks.length ? '—' : '＋'}</span>
          <p>{state.tasks.length ? 'Nothing in this view.' : 'A clear page. A good place to begin.'}</p>
        </div>
      )}
    </section>
  );
}

function TaskManager() {
  const { state } = useTasks();
  const completedCount = state.tasks.filter((task) => task.completed).length;

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="Daymark home"><span>D</span>AYMARK</a>
        <span className="topbar-note">A little more intentional</span>
        <span className="today-label">TASKS / 01</span>
      </header>

      <section className="intro" id="top">
        <div className="intro-copy">
          <p className="eyebrow">Make room for what matters</p>
          <h1>Today,<br /><em>in focus.</em></h1>
          <p className="intro-description">One thing at a time. Put it on the list, then give it your attention.</p>
        </div>
        <div className="summary" aria-live="polite">
          <span className="summary-number">{String(state.tasks.length - completedCount).padStart(2, '0')}</span>
          <span className="summary-label">still to do</span>
          <span className="summary-rule" />
          <span className="summary-meta">{String(completedCount).padStart(2, '0')} completed</span>
        </div>
        <span className="intro-index" aria-hidden="true">01 — 03</span>
      </section>

      <div className="workspace">
        <section className="capture-section" aria-labelledby="capture-heading">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Get it out of your head</p>
              <h2 id="capture-heading">Add a task</h2>
            </div>
            <span className="capture-icon" aria-hidden="true">↳</span>
          </div>
          <AddTaskForm />
        </section>
        <TaskList />
      </div>

      <footer className="page-footer">
        <span>DAYMARK / TASK MANAGER</span>
        <span>useContext <i>+</i> useReducer</span>
      </footer>
    </main>
  );
}

function App() {
  return (
    <TaskProvider>
      <TaskManager />
    </TaskProvider>
  );
}

export default App;
