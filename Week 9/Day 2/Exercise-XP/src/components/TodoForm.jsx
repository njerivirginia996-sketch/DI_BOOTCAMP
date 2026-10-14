import { useState } from 'react'
import { connect } from 'react-redux'
import { addTodo } from '../redux/actions.js'

// This component is exported through react-redux connect.
// eslint-disable-next-line react-refresh/only-export-components
function TodoForm({ addTodo }) {
	const [text, setText] = useState('')

	function handleSubmit(event) {
		event.preventDefault()
		const trimmedText = text.trim()

		if (!trimmedText) return

		addTodo(trimmedText)
		setText('')
	}

	return (
		<form className="todo-form" onSubmit={handleSubmit}>
			<label className="visually-hidden" htmlFor="new-todo">Add a task</label>
			<input
				id="new-todo"
				type="text"
				value={text}
				onChange={(event) => setText(event.target.value)}
				placeholder="What needs doing?"
				autoComplete="off"
			/>
			<button type="submit" aria-label="Add task" disabled={!text.trim()}>
				<span aria-hidden="true">+</span>
			</button>
		</form>
	)
}

export default connect(null, { addTodo })(TodoForm)
