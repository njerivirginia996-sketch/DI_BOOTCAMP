
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addTask,
  editTask,
  deleteTask,
  updateTaskProgress,
} from "../features/productivity/productivitySlice";
import {
  selectTasksByCategory,
  selectCompletedTasks,
  selectCategories,
} from "../features/productivity/productivitySelectors";

export default function TaskList({ selectedCategory }) {
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("study");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  const dispatch = useDispatch();
  const tasks = useSelector((state) =>
    selectTasksByCategory(state, selectedCategory)
  );
  const completedCount = useSelector(selectCompletedTasks);
  const categories = useSelector(selectCategories);

  const handleAdd = useCallback(
    (event) => {
      event.preventDefault();
      const cleanTitle = title.trim();

      if (!cleanTitle) return;

      dispatch(addTask({ title: cleanTitle, categoryId }));
      setTitle("");
    },
    [dispatch, title, categoryId]
  );

  const handleToggle = useCallback(
    (id) => dispatch(updateTaskProgress(id)),
    [dispatch]
  );

  const handleDelete = useCallback(
    (id) => dispatch(deleteTask(id)),
    [dispatch]
  );

  const handleEdit = useCallback(
    (task) => {
      const cleanTitle = editingTitle.trim();
      if (!cleanTitle) return;

      dispatch(editTask({ id: task.id, title: cleanTitle }));
      setEditingId(null);
      setEditingTitle("");
    },
    [dispatch, editingTitle]
  );

  return (
    <section>
      <h2>Tasks</h2>
      <p>Completed tasks overall: {completedCount}</p>

      <form className="task-form" onSubmit={handleAdd}>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Enter a task"
          aria-label="Task title"
        />

        <select
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
          aria-label="New task category"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <button type="submit">Add Task</button>
      </form>

      {tasks.length === 0 ? (
        <p>No tasks in this category.</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => {
            const category = categories.find(
              (item) => item.id === task.categoryId
            );

            return (
              <li className="task-item" key={task.id}>
                <label className={task.completed ? "completed" : ""}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggle(task.id)}
                  />
                  {editingId === task.id ? (
                    <input
                      value={editingTitle}
                      onChange={(event) =>
                        setEditingTitle(event.target.value)
                      }
                      aria-label="Edit task title"
                    />
                  ) : (
                    task.title
                  )}
                </label>

                <small>{category?.name ?? "Uncategorized"}</small>

                {editingId === task.id ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleEdit(task)}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(task.id);
                      setEditingTitle(task.title);
                    }}
                  >
                    Edit
                  </button>
                )}

                <button
                  type="button"
                  className="delete-button"
                  onClick={() => handleDelete(task.id)}
                >
                  Delete
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
