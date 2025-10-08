// components/Modal.jsx
import { useEffect, useState } from "react";

export default function Modal({ activeItem, onSave, toggle }) {
  const [item, setItem] = useState(activeItem);

  useEffect(() => setItem(activeItem), [activeItem]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setItem((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(item);
  };

  return (
    <div className="hg-modal-backdrop" onClick={toggle} role="dialog" aria-modal="true">
      <div className="hg-modal" onClick={(e) => e.stopPropagation()}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h5 m-0">Task</h2>
          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={toggle}>
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              name="title"
              className="form-control"
              value={item.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-control"
              rows={3}
              value={item.description || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-check mb-4">
            <input
              id="completed"
              type="checkbox"
              name="completed"
              className="form-check-input"
              checked={!!item.completed}
              onChange={handleChange}
            />
            <label htmlFor="completed" className="form-check-label">Completed</label>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-light" onClick={toggle}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
