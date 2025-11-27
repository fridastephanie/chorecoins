import "./css/modal.css"; 

export default function Modal({ onClose, title, children }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {title && <h2>{title}</h2>}
        <div className="modal-content">{children}</div>
        <button className="modal-close" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
