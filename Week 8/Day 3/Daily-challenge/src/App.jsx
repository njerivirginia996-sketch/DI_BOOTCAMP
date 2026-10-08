import React, { createContext, useContext, useEffect, useReducer, useRef, useState } from 'react';

const TaskContext = createContext(null);

const initialTasks = [
  { id: 'task-1', text: 'Review the React hooks notes', completed: true },
  { id: 'task-2', text: 'Build the task manager layout', completed: false },
  { id: 'task-3', text: 'Test edit and filter behavior', completed: false },
  { id: 'task-4', text: 'Take a short screen break', completed: true },
];

const initialState = { tasks: initialTasks, filter: 'all' };

function taskReducer(state, action) {
  switch (action.type) {
    case 'ADD_TASK':
      return { ...state, tasks: [{ id: action.id, text: action.text, completed: false }, ...state.tasks] };
    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) => task.id === action.id ? { ...task, completed: !task.completed } : task),
      };
    case 'EDIT_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) => task.id === action.id ? { ...task, text: action.text } : task),
      };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter((task) => task.id !== action.id) };
    case 'FILTER_TASKS':
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

function TaskRow({ task, index }) {
  const { dispatch } = useContext(TaskContext);
  const [isEditing, setIsEditing] = useState(false);
  const editInputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }
  }, [isEditing]);

  function saveEdit(event) {
    event.preventDefault();
    const text = editInputRef.current?.value.trim();
    if (text) {
      dispatch({ type: 'EDIT_TASK', id: task.id, text });
      setIsEditing(false);
    }
  }

  function cancelEdit() {
    setIsEditing(false);
  }

  return (
    <li className={`task-row${task.completed ? ' is-complete' : ''}`} style={{ '--row-index': index }}>
      <input
        aria-label={`${task.completed ? 'Mark active' : 'Complete'}: ${task.text}`}
        checked={task.completed}
        className="task-check"
        onChange={() => dispatch({ type: 'TOGGLE_TASK', id: task.id })}
        type="checkbox"
      />
      {isEditing ? (
        <form className="edit-form" onSubmit={saveEdit}>
          <input aria-label="Edit task text" className="edit-input" defaultValue={task.text} ref={editInputRef} />
          <button aria-label="Save task" className="icon-button save-button" title="Save" type="submit">✓</button>
          <button aria-label="Cancel editing" className="icon-button" onClick={cancelEdit} title="Cancel" type="button">×</button>
        </form>
      ) : (
        <>
          <button className="task-title" onClick={() => setIsEditing(true)} type="button">{task.text}</button>
          <div className="task-actions">
            <button aria-label={`Edit ${task.text}`} className="icon-button edit-button" onClick={() => setIsEditing(true)} title="Edit task" type="button">✎</button>
            <button aria-label={`Delete ${task.text}`} className="icon-button delete-button" onClick={() => dispatch({ type: 'DELETE_TASK', id: task.id })} title="Delete task" type="button">×</button>
          </div>
        </>
      )}
    </li>
  );
}

function TaskManager() {
  const { state, dispatch } = useContext(TaskContext);
  const [newTask, setNewTask] = useState('');
  const addInputRef = useRef(null);
  const completedCount = state.tasks.filter((task) => task.completed).length;
  const activeCount = state.tasks.length - completedCount;
  const filteredTasks = state.tasks.filter((task) => {
    if (state.filter === 'active') return !task.completed;
    if (state.filter === 'completed') return task.completed;
    return true;
  });
  const filters = [
    { id: 'all', label: 'All tasks', count: state.tasks.length },
    { id: 'active', label: 'To do', count: activeCount },
    { id: 'completed', label: 'Completed', count: completedCount },
  ];

  function addTask(event) {
    event.preventDefault();
    const text = newTask.trim();
    if (!text) {
      addInputRef.current?.focus();
      return;
    }
    dispatch({ type: 'ADD_TASK', id: crypto.randomUUID(), text });
    setNewTask('');
    addInputRef.current?.focus();
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a aria-label="Daymark home" className="brand" href="#top">
          <span className="brand-symbol" aria-hidden="true">d.</span>
          <span>daymark</span>
        </a>
        <span className="topbar-note">A little more room to think.</span>
        <span className="date-label">{new Intl.DateTimeFormat('en', { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date())}</span>
      </header>

      <section className="workspace" id="top">
        <aside className="overview">
          <p className="eyebrow">YOUR SPACE</p>
          <h1>Make today<br />count.</h1>
          <p className="overview-copy">Small steps add up. Keep the next one in view.</p>
          <div className="progress-block">
            <div className="progress-heading"><span>Today's progress</span><strong>{state.tasks.length ? Math.round((completedCount / state.tasks.length) * 100) : 0}%</strong></div>
            <div aria-label={`${completedCount} of ${state.tasks.length} tasks completed`} className="progress-track" role="img">
              <span style={{ width: `${state.tasks.length ? (completedCount / state.tasks.length) * 100 : 0}%` }} />
            </div>
            <p>{completedCount} of {state.tasks.length} tasks done</p>
          </div>
          <div className="focus-note">
            <span className="focus-mark" aria-hidden="true">✳</span>
            <p><strong>Keep it simple.</strong><br />One task at a time is enough.</p>
          </div>
        </aside>

        <section aria-labelledby="tasks-heading" className="task-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">THE LIST</p>
              <h2 id="tasks-heading">Your tasks<span className="task-total">{state.tasks.length}</span></h2>
            </div>
            <span className="active-summary">{activeCount} left to do</span>
          </div>

          <form className="add-form" onSubmit={addTask}>
            <span aria-hidden="true" className="add-symbol">+</span>
            <input
              aria-label="New task"
              onChange={(event) => setNewTask(event.target.value)}
              placeholder="Add a task to your list..."
              ref={addInputRef}
              value={newTask}
            />
            <button disabled={!newTask.trim()} type="submit">Add task</button>
          </form>

          <div aria-label="Filter tasks" className="filter-bar" role="group">
            {filters.map((filter) => (
              <button
                aria-pressed={state.filter === filter.id}
                className={`filter-button${state.filter === filter.id ? ' is-selected' : ''}`}
                key={filter.id}
                onClick={() => dispatch({ type: 'FILTER_TASKS', filter: filter.id })}
                type="button"
              >
                {filter.label}<span>{filter.count}</span>
              </button>
            ))}
          </div>

          {filteredTasks.length ? (
            <ul className="task-list">
              {filteredTasks.map((task, index) => <TaskRow index={index} key={task.id} task={task} />)}
            </ul>
          ) : (
            <div className="empty-state">
              <span aria-hidden="true">✓</span>
              <p>{state.tasks.length ? 'Nothing in this view.' : 'Your list is clear.'}</p>
              <small>{state.tasks.length ? 'Choose another filter to see your tasks.' : 'Add a task whenever you are ready.'}</small>
            </div>
          )}
          <p className="list-footnote">Click a task or use the pencil to make an edit.</p>
        </section>
      </section>
      <footer className="page-footer"><span>DAYMARK / TASK MANAGER</span><span>useContext <i>+</i> useReducer <i>+</i> useRef</span></footer>
    </main>
  );
}

export default function App() {
  return (
    <TaskProvider>
      <TaskManager />
    </TaskProvider>
  );
}