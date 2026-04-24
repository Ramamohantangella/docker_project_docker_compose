import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('todos')
  const [todos, setTodos] = useState([])
  const [users, setUsers] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [newUsername, setNewUsername] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [editingTodoId, setEditingTodoId] = useState(null)
  const [editTodoTitle, setEditTodoTitle] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTodos()
    fetchUsers()
  }, [])

  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos')
      const data = await response.json()
      setTodos(data || [])
    } catch (err) {
      console.error(err)
      setError('Failed to load todos')
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      const data = await response.json()
      setUsers(data || [])
    } catch (err) {
      console.error(err)
      setError('Failed to load users')
    }
  }

  const addTodo = async (e) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTodo, completed: false })
      })
      const todo = await response.json()
      setTodos([...todos, todo])
      setNewTodo('')
      setError(null)
    } catch (err) {
      console.error(err)
      setError('Unable to add todo')
    }
  }

  const addUser = async (e) => {
    e.preventDefault()
    if (!newUsername.trim() || !newEmail.trim()) return

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newUsername, email: newEmail })
      })
      const user = await response.json()
      setUsers([...users, user])
      setNewUsername('')
      setNewEmail('')
      setError(null)
    } catch (err) {
      console.error(err)
      setError('Unable to add user')
    }
  }

  const toggleTodo = async (id) => {
    try {
      const todo = todos.find((item) => item.id === id)
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...todo, completed: !todo.completed })
      })
      const updatedTodo = await response.json()
      setTodos(todos.map((item) => (item.id === id ? updatedTodo : item)))
      setError(null)
    } catch (err) {
      console.error(err)
      setError('Unable to update todo')
    }
  }

  const deleteTodo = async (id) => {
    try {
      await fetch(`/api/todos/${id}`, { method: 'DELETE' })
      setTodos(todos.filter((item) => item.id !== id))
      setError(null)
    } catch (err) {
      console.error(err)
      setError('Unable to delete todo')
    }
  }

  const startEditTodo = (todo) => {
    setEditingTodoId(todo.id)
    setEditTodoTitle(todo.title)
  }

  const saveEditTodo = async (id) => {
    if (!editTodoTitle.trim()) return
    try {
      const todo = todos.find((item) => item.id === id)
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...todo, title: editTodoTitle })
      })
      const updatedTodo = await response.json()
      setTodos(todos.map((item) => (item.id === id ? updatedTodo : item)))
      setEditingTodoId(null)
      setEditTodoTitle('')
      setError(null)
    } catch (err) {
      console.error(err)
      setError('Unable to save todo changes')
    }
  }

  return (
    <div className="App">
      <h1>Microservices Todo + User Manager</h1>
      <div className="tabs">
        <button
          className={activeTab === 'todos' ? 'active' : ''}
          onClick={() => setActiveTab('todos')}
        >
          Todos
        </button>
        <button
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {activeTab === 'todos' ? (
        <section className="panel">
          <h2>Todo List</h2>
          <form onSubmit={addTodo} className="form-row">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new todo"
            />
            <button type="submit">Add Todo</button>
          </form>

          <ul>
            {todos.length > 0 ? (
              todos.map((todo) => (
                <li key={todo.id} className={todo.completed ? 'completed' : ''}>
                  <div className="todo-left">
                    <input
                      type="checkbox"
                      checked={todo.completed || false}
                      onChange={() => toggleTodo(todo.id)}
                    />
                    {editingTodoId === todo.id ? (
                      <input
                        className="edit-input"
                        value={editTodoTitle}
                        onChange={(e) => setEditTodoTitle(e.target.value)}
                      />
                    ) : (
                      <span>{todo.title}</span>
                    )}
                  </div>

                  <div className="todo-actions">
                    {editingTodoId === todo.id ? (
                      <>
                        <button onClick={() => saveEditTodo(todo.id)}>Save</button>
                        <button className="secondary" onClick={() => setEditingTodoId(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button className="secondary" onClick={() => startEditTodo(todo)}>Edit</button>
                        <button className="danger" onClick={() => deleteTodo(todo.id)}>Delete</button>
                      </>
                    )}
                  </div>
                </li>
              ))
            ) : (
              <li>No todos found. Add one to get started.</li>
            )}
          </ul>
        </section>
      ) : (
        <section className="panel">
          <h2>User Management</h2>
          <form onSubmit={addUser} className="form-row">
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Username"
            />
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Email"
            />
            <button type="submit">Add User</button>
          </form>

          <ul>
            {users.length > 0 ? (
              users.map((user) => (
                <li key={user.id}>
                  <div>
                    <strong>{user.username}</strong>
                    <span>{user.email}</span>
                  </div>
                </li>
              ))
            ) : (
              <li>No users found. Create the first user.</li>
            )}
          </ul>
        </section>
      )}
    </div>
  )
}

export default App