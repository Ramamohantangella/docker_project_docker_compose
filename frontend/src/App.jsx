import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos')
      const data = await response.json()
      setTodos(data || [])
    } catch (error) {
      console.error('Error fetching todos:', error)
      setError('Failed to load todos')
    }
  }

  const addTodo = async (e) => {
    e.preventDefault()
    if (newTodo.trim()) {
      try {
        const response = await fetch('/api/todos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: newTodo, completed: false })
        })
        const todo = await response.json()
        setTodos([...todos, todo])
        setNewTodo('')
      } catch (error) {
        console.error('Error adding todo:', error)
        setError('Failed to add todo')
      }
    }
  }

  const toggleTodo = async (id) => {
    try {
      const todo = todos.find(t => t.id === id)
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...todo, completed: !todo.completed })
      })
      const updatedTodo = await response.json()
      setTodos(todos.map(t => t.id === id ? updatedTodo : t))
    } catch (error) {
      console.error('Error updating todo:', error)
      setError('Failed to update todo')
    }
  }

  return (
    <div className="App">
      <h1>📝 Todo App</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={addTodo}>
        <div>
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo..."
          />
          <button type="submit">Add Todo</button>
        </div>
      </form>
      <ul>
        {todos && todos.length > 0 ? (
          todos.map(todo => (
            <li key={todo.id} className={todo.completed ? 'completed' : ''}>
              <input
                type="checkbox"
                checked={todo.completed || false}
                onChange={() => toggleTodo(todo.id)}
              />
              <span>{todo.title}</span>
            </li>
          ))
        ) : (
          <li>No todos yet. Add one to get started!</li>
        )}
      </ul>
    </div>
  )
}

export default App