import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos')
      const data = await response.json()
      setTodos(data)
    } catch (error) {
      console.error('Error fetching todos:', error)
    }
  }

  const addTodo = async () => {
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
    }
  }

  return (
    <div className="App">
      <h1>Todo App</h1>
      <div>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            {todo.title}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App