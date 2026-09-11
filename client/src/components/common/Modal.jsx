/**
 * Modal — reusable overlay dialog.
 *
 * Clicking the backdrop closes the modal (mousedown to avoid conflicting
 * with inner element click events).
 */
export function Modal({ title, children, onClose }) {
  return (
    <div className="modal-wrap" onMouseDown={onClose}>
      <section className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <h2>{title}</h2>
        {children}
      </section>
    </div>
  );
}
