import { useEffect, useRef, useState } from 'react';
import './App.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const statusTimeout = useRef(null);

  const pushStatus = (type, message) => {
    if (statusTimeout.current) {
      clearTimeout(statusTimeout.current);
    }
    setStatus({ type, message });
    statusTimeout.current = setTimeout(() => setStatus(null), 4000);
  };

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/todos`);
      if (!response.ok) {
        throw new Error('Unable to load todos.');
      }
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      pushStatus('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
    return () => {
      if (statusTimeout.current) {
        clearTimeout(statusTimeout.current);
      }
    };
  }, []);

  const createTodo = async (event) => {
    event.preventDefault();
    const trimmed = newTodo.trim();
    if (!trimmed) {
      pushStatus('info', 'Please enter a todo.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: trimmed }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Failed to add todo.');
      }
      setTodos((prev) => [...prev, result]);
      setNewTodo('');
      pushStatus('success', 'Todo added.');
    } catch (error) {
      pushStatus('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleTodo = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/todos/${id}/toggle`, { method: 'PUT' });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Failed to update todo.');
      }
      setTodos((prev) => prev.map((todo) => (todo.id === id ? result : todo)));
    } catch (error) {
      pushStatus('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeTodo = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/todos/${id}`, { method: 'DELETE' });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete todo.');
      }
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
      pushStatus('success', 'Todo removed.');
    } catch (error) {
      pushStatus('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <header>
        <h1>Simple Todo List</h1>
        <p>Track your tasks and mark them done with as little friction as possible.</p>
      </header>
      <section className="todo-form">
        <form onSubmit={createTodo}>
          <input
            type="text"
            placeholder="What needs to be done?"
            value={newTodo}
            onChange={(event) => setNewTodo(event.target.value)}
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            Add
          </button>
        </form>
        {status && (
          <p className={`status ${status.type}`}>
            {status.message}
          </p>
        )}
      </section>
      <section className="todo-list">
        {loading && todos.length === 0 ? (
          <p className="empty-state">Loading todos…</p>
        ) : todos.length === 0 ? (
          <p className="empty-state">No todos yet. Add one to get started.</p>
        ) : (
          <ul>
            {todos.map((todo) => (
              <li key={todo.id} className={todo.completed ? 'completed' : ''}>
                <span className="text">{todo.text}</span>
                <span className="actions">
                  <button type="button" onClick={() => toggleTodo(todo.id)} disabled={loading}>
                    {todo.completed ? 'Undo' : 'Done'}
                  </button>
                  <button type="button" onClick={() => removeTodo(todo.id)} disabled={loading}>
                    Delete
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default App;
