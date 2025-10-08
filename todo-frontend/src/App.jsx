import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import axios from "axios";
import { useEffect, useMemo, useState, useCallback } from "react";
import Modal from "./components/Modal";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: { Accept: "application/json" },
});

function normalizeTodos(payload) {
  if (typeof payload === "string" && payload.toLowerCase().includes("<!doctype html")) {
    throw new Error("API returned HTML (likely Vite index.html). Check VITE_API_URL or dev proxy.");
  }
  if (Array.isArray(payload)) return payload;
  if (payload?.results && Array.isArray(payload.results)) return payload.results;
  if (payload?.items && Array.isArray(payload.items)) return payload.items;
  if (payload && typeof payload === "object") {
    const vals = Object.values(payload);
    if (vals.every(v => v && typeof v === "object")) return vals;
  }
  return [];
}

function App() {
  const [viewCompleted, setViewCompleted] = useState(false);
  const [todoList, setTodoList] = useState([]);
  const [modal, setModal] = useState(false);
  const [activeItem, setActiveItem] = useState({ title: "", description: "", completed: false });
  const [apiError, setApiError] = useState("");

  const refreshList = useCallback(async () => {
    try {
      setApiError("");
      const res = await api.get("/api/todos/");
      setTodoList(normalizeTodos(res.data));
    } catch (err) {
      console.error(err);
      setTodoList([]);
      setApiError(
        "Could not load todos. Check VITE_API_URL and that your backend is running and exposes /api/todos/."
      );
    }
  }, []);

  useEffect(() => { refreshList(); }, [refreshList]);

  const toggle = () => setModal(m => !m);

  const handleSubmit = async (item) => {
    toggle();
    try {
      if (item.id) await api.put(`/api/todos/${item.id}/`, item);
      else await api.post("/api/todos/", item);
      await refreshList();
    } catch (err) {
      console.error(err);
      setApiError("Save failed. See console for details.");
    }
  };

  const handleDelete = async (item) => {
    try {
      await api.delete(`/api/todos/${item.id}/`);
      await refreshList();
    } catch (err) {
      console.error(err);
      setApiError("Delete failed. See console for details.");
    }
  };

  const createItem = () => { setActiveItem({ title: "", description: "", completed: false }); setModal(true); };
  const editItem = (item) => { setActiveItem({ ...item }); setModal(true); };

  const itemsToShow = useMemo(() => {
    const list = Array.isArray(todoList) ? todoList : [];
    return list.filter((t) => Boolean(t?.completed) === viewCompleted);
  }, [todoList, viewCompleted]);

  return (
    <main className="py-5">
      <div className="app-width mx-auto">
        <h1 className="text-uppercase text-center fw-bold mb-4">Todo app</h1>

        <div className="card shadow-sm border-0 p-4 w-100">
          {apiError && (
            <div className="alert alert-warning mb-3" role="alert">
              {apiError}
            </div>
          )}

          <div className="d-flex justify-content-between align-items-center mb-3">
            <button className="btn btn-primary" onClick={createItem}>Add task</button>
          </div>

          <div className="nav nav-tabs mb-3" role="tablist">
            <button type="button" onClick={() => setViewCompleted(true)}  className={`nav-link ${viewCompleted ? "active" : ""}`}>Complete</button>
            <button type="button" onClick={() => setViewCompleted(false)} className={`nav-link ${viewCompleted ? "" : "active"}`}>Incomplete</button>
          </div>

          <ul className="list-group list-group-flush">
            {itemsToShow.map((item) => (
              <li key={item.id ?? item._id ?? item.key ?? `${item.title}-${Math.random()}`}
                  className="list-group-item d-flex justify-content-between align-items-center py-3">
                <span className={`todo-title me-2 ${viewCompleted ? "completed-todo" : ""}`}>{item.title}</span>
                <span className="d-flex align-items-center">
                  <button className="btn btn-secondary me-2" onClick={() => editItem(item)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(item)}>Delete</button>
                </span>
              </li>
            ))}
            {itemsToShow.length === 0 && (
              <li className="list-group-item text-muted py-3">No tasks here yet.</li>
            )}
          </ul>
        </div>
      </div>

      {modal && <Modal activeItem={activeItem} toggle={toggle} onSave={handleSubmit} />}
    </main>
  );
}

export default App; // Export the app
