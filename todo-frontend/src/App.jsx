import { useEffect, useMemo, useState, useCallback } from "react";
import Modal from "./components/Modal";
import axios from "axios";

function normalizeTodos(payload) {
  if (Array.isArray(payload)) return payload;                     // straight array
  if (payload?.results && Array.isArray(payload.results)) return payload.results; // DRF paginated
  if (payload?.items && Array.isArray(payload.items)) return payload.items;       // generic "items"
  if (payload && typeof payload === "object") {
    const vals = Object.values(payload);
    if (vals.every(v => v && typeof v === "object")) return vals; // keyed object -> array
  }
  console.warn("Unexpected todos payload shape:", payload);
  return [];
}

function App() {
  const [viewCompleted, setViewCompleted] = useState(false);
  const [todoList, setTodoList] = useState([]);
  const [modal, setModal] = useState(false);
  const [activeItem, setActiveItem] = useState({
    title: "",
    description: "",
    completed: false,
  });

  const refreshList = useCallback(async () => {
    try {
      const res = await axios.get("/api/todos/");
      setTodoList(normalizeTodos(res.data));
    } catch (err) {
      console.error(err);
      setTodoList([]); // keep it an array so UI doesn't crash
    }
  }, []);

  useEffect(() => {
    refreshList();
  }, [refreshList]);

  const toggle = () => setModal(m => !m);

  const handleSubmit = async (item) => {
    toggle();
    try {
      if (item.id) {
        await axios.put(`/api/todos/${item.id}/`, item);
      } else {
        await axios.post("/api/todos/", item);
      }
      await refreshList();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (item) => {
    try {
      await axios.delete(`/api/todos/${item.id}/`);
      await refreshList();
    } catch (err) {
      console.error(err);
    }
  };

  const createItem = () => {
    setActiveItem({ title: "", description: "", completed: false });
    setModal(true);
  };

  const editItem = (item) => {
    setActiveItem({ ...item });
    setModal(true);
  };

  // Safety: make sure we always filter an array, and coerce completed to boolean
  const itemsToShow = useMemo(() => {
    const list = Array.isArray(todoList) ? todoList : [];
    return list.filter((t) => Boolean(t?.completed) === viewCompleted);
  }, [todoList, viewCompleted]);

  return (
    <main className="container">
      <h1 className="text-white text-uppercase text-center my-4">Todo app</h1>
      <div className="row">
        <div className="col-md-6 col-sm-10 mx-auto p-0">
          <div className="card p-3">
            <div className="mb-4">
              <button className="btn btn-primary" onClick={createItem}>
                Add task
              </button>
            </div>

            <div className="nav nav-tabs">
              <button
                type="button"
                onClick={() => setViewCompleted(true)}
                className={`nav-link ${viewCompleted ? "active" : ""}`}
              >
                Complete
              </button>
              <button
                type="button"
                onClick={() => setViewCompleted(false)}
                className={`nav-link ${viewCompleted ? "" : "active"}`}
              >
                Incomplete
              </button>
            </div>

            <ul className="list-group list-group-flush border-top-0">
              {itemsToShow.map((item) => (
                <li
                  key={item.id ?? item._id ?? item.key ?? `${item.title}-${Math.random()}`}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <span
                    className={`todo-title mr-2 ${viewCompleted ? "completed-todo" : ""}`}
                    title={item.description}
                  >
                    {item.title}
                  </span>
                  <span>
                    <button className="btn btn-secondary mr-2" onClick={() => editItem(item)}>
                      Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete(item)}>
                      Delete
                    </button>
                  </span>
                </li>
              ))}
              {itemsToShow.length === 0 && (
                <li className="list-group-item text-muted">No tasks here yet.</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {modal && <Modal activeItem={activeItem} toggle={toggle} onSave={handleSubmit} />}
    </main>
  );
}

export default App;
