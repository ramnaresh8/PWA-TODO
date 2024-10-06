import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  // Function to handle background sync
  const registerBackgroundSync = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register("sync-todos");
    } catch (error) {
      console.error("Background sync registration failed:", error);
    }
  };

  useEffect(() => {
    // Register background sync
    registerBackgroundSync();
  }, []);

  useEffect(() => {
    // Handle online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Load todos from local storage
    const storedTodos = JSON.parse(localStorage.getItem("todos") || "[]");
    setTodos(storedTodos);

    // Request notification permission
    if ("Notification" in window) {
      Notification.requestPermission();
    }

    // Register background sync
    registerBackgroundSync();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    // Save todos to local storage
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
      setNewTodo("");
    }
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>TODO Web App</h1>
        {!isOnline && (
          <div className="offline-message">
            You are offline. Your changes will be synced when you're back
            online.
          </div>
        )}
      </header>
      <main>
        <form onSubmit={addTodo} className="todo-form">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo"
            className="todo-input"
          />
          <button type="submit" className="add-button">
            Add Todo
          </button>
        </form>
        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo.id} className="todo-item">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="todo-checkbox"
              />
              <span
                className={`todo-text ${todo.completed ? "completed" : ""}`}
              >
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="delete-button"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
