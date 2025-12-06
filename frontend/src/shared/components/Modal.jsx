import "../../css/shared/modal.css";
import { useEffect, useRef } from "react";

export default function Modal({ title, children, onClose, ariaLabel }) {
  const modalRef = useRef();

  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  return (
    <div className="modal-backdrop">
      <div
        className="modal-container"
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel || title}
        tabIndex={-1}
        ref={modalRef}
      >
        <div className="modal-header">
          <h2>{title}</h2>
          <button
            onClick={onClose}
            className="close-btn"
            aria-label="Close modal"
          >
            X
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
