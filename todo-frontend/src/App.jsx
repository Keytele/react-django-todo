import React, { useMemo, useState } from "react";
import Modal from "./components/Modal.jsx";

const initialTodos = [
  { id: 1, title: "Go to Market", description: "Buy ingredients to prepare dinner", completed: true },
  { id: 2, title: "Study", description: "Read Algebra and History textbook for the upcoming test", completed: false },
  { id: 3, title: "Sammy's books", description: "Go to library to return Sammy's books", completed: true },
  { id: 4, title: "Article", description: "Write article on how to use Django with React", completed: false },
];

export default function App() {
  const [viewCompleted, setViewCompleted] = useState(false);
  const [todoList, setTodoList] = useState(initialTodos);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState({ title: "", description: "", completed: false });

  const toggle = () => setIsModalOpen(v => !v);

  const handleSubmit = (item) => {
    setTodoList(list => {
      const exists = list.some(t => t.id === item.id);
      if (exists) return list.map(t => (t.id === item.id ? item : t));
      const nextId = list.length ? Math.max(...list.map(t => t.id)) + 1 : 1;
      return [...list, { ...item, id: nextId }];
    });
    toggle();
  };

  const handleDelete = (item) => setTodoList(list => list.filter(t => t.id !== item.id));
  const createItem = () => { setActiveItem({ title: "", description: "", completed: false }); setIsModalOpen(true); };
  const editItem = (item) => { setActiveItem(item); setIsModalOpen(true); };

  const filteredItems = useMemo(
    () => todoList.filter(item => item.completed === viewCompleted),
    [todoList, viewCompleted]
  );

  return (
    <main className="container py-4">
      <h1 className="text-center my-4">Todo app</h1>

      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card shadow-sm mw-100">
            <div className="card-body mw-100">
              <div className="mb-3">
                <button className="btn btn-primary" onClick={createItem}>Add task</button>
              </div>

              <ul className="nav nav-tabs mb-3" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    type="button"
                    role="tab"
                    className={`nav-link ${viewCompleted ? "active" : ""}`}
                    onClick={() => setViewCompleted(true)}
                  >
                    Complete
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    type="button"
                    role="tab"
                    className={`nav-link ${!viewCompleted ? "active" : ""}`}
                    onClick={() => setViewCompleted(false)}
                  >
                    Incomplete
                  </button>
                </li>
              </ul>

              <ul className="list-group list-group-flush">
                {filteredItems.map(item => (
                  <li
                    key={item.id}
                    className="list-group-item d-flex flex-column flex-sm-row justify-content-between align-items-start gap-2"
                    title={item.description}
                  >
                    <span className={`flex-grow-1 ${viewCompleted ? "text-decoration-line-through" : ""}`}>
                      {item.title}
                    </span>

                    <div className="btn-group btn-group-sm" role="group" aria-label={`Actions for ${item.title}`}>
                      <button className="btn btn-outline-secondary" onClick={() => editItem(item)}>Edit</button>
                      <button className="btn btn-danger" onClick={() => handleDelete(item)}>Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Modal activeItem={activeItem} isOpen={isModalOpen} toggle={toggle} onSave={handleSubmit} />
    </main>
  );
}
