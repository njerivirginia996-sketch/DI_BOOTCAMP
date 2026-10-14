import {
  ADD_TASK,
  DELETE_TASK,
  EDIT_TASK,
  SELECT_DAY,
  TOGGLE_TASK,
} from './actions.js'

function todayKey() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const createInitialState = (selectedDay = todayKey()) => ({
  selectedDay,
  tasksByDay: {},
})

export default function plannerReducer(state = createInitialState(), action) {
  switch (action.type) {
    case SELECT_DAY:
      return { ...state, selectedDay: action.payload }

    case ADD_TASK: {
      const { day, task } = action.payload
      return {
        ...state,
        tasksByDay: {
          ...state.tasksByDay,
          [day]: [...(state.tasksByDay[day] ?? []), task],
        },
      }
    }

    case EDIT_TASK: {
      const { day, id, updates } = action.payload
      return {
        ...state,
        tasksByDay: {
          ...state.tasksByDay,
          [day]: (state.tasksByDay[day] ?? []).map((task) =>
            task.id === id ? { ...task, ...updates } : task,
          ),
        },
      }
    }

    case DELETE_TASK: {
      const { day, id } = action.payload
      return {
        ...state,
        tasksByDay: {
          ...state.tasksByDay,
          [day]: (state.tasksByDay[day] ?? []).filter((task) => task.id !== id),
        },
      }
    }

    case TOGGLE_TASK: {
      const { day, id } = action.payload
      return {
        ...state,
        tasksByDay: {
          ...state.tasksByDay,
          [day]: (state.tasksByDay[day] ?? []).map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task,
          ),
        },
      }
    }

    default:
      return state
  }
}