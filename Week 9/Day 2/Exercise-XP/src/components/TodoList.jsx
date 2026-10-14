import { connect } from 'react-redux'
import { removeTodo, toggleTodo } from '../redux/actions.js'

// This component is exported through react-redux connect.
// eslint-disable-next-line react-refresh/only-export-components
function TodoList({ todos, toggleTodo, removeTodo }) {
	const remaining = todos.filter((todo) => !todo.completed).length

	return (
		<section className="list-section" aria-label="Your tasks">
			<div className="list-heading">
				<h2>Today</h2>
				<span className="task-count">
					{remaining} {remaining === 1 ? 'left' : 'left'}
				</span>
			</div>

			{todos.length === 0 ? (
				<p className="empty-state">Your list is clear. Add a task to get started.</p>
			) : (
				<ul className="todo-list">
					{todos.map((todo) => (
						<li className={`todo-item${todo.completed ? ' is-complete' : ''}`} key={todo.id}>
							<button
								className="todo-check"
								type="button"
								onClick={() => toggleTodo(todo.id)}
								aria-label={todo.completed ? `Mark ${todo.text} incomplete` : `Complete ${todo.text}`}
								aria-pressed={todo.completed}
							>
								{todo.completed && <span aria-hidden="true">✓</span>}
							</button>
							<span className="todo-text">{todo.text}</span>
							<button
								className="todo-remove"
								type="button"
								onClick={() => removeTodo(todo.id)}
								aria-label={`Remove ${todo.text}`}
								title="Remove task"
							>
								<span aria-hidden="true">×</span>
							</button>
						</li>
					))}
				</ul>
			)}
		</section>
	)
}

const mapStateToProps = (state) => ({ todos: state.todos })

export default connect(mapStateToProps, { toggleTodo, removeTodo })(TodoList)
