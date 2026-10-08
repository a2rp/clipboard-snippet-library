import { useEffect, useRef } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import styles from "./styles.module.css";

const DeleteSnippetConfirm = ({ snippet, onCancel, onConfirm }) => {
  const cancelRef = useRef(null);
  const confirmRef = useRef(null);

  useEffect(() => {
    cancelRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onCancel();
      if (event.key === "Tab" && event.shiftKey && document.activeElement === cancelRef.current) {
        event.preventDefault();
        confirmRef.current?.focus();
      } else if (event.key === "Tab" && !event.shiftKey && document.activeElement === confirmRef.current) {
        event.preventDefault();
        cancelRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  return (
    <div className={styles.overlay} onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel(); }}>
      <section className={styles.dialog} role="alertdialog" aria-modal="true" aria-labelledby="delete-snippet-title" aria-describedby="delete-snippet-description">
        <span className={styles.warningIcon}><FiAlertTriangle aria-hidden="true" /></span>
        <h2 id="delete-snippet-title">Delete this snippet?</h2>
        <p id="delete-snippet-description">“{snippet.title}” will be removed from this browser's saved library. This action cannot be undone.</p>
        <div className={styles.actions}><button ref={cancelRef} type="button" onClick={onCancel}>Keep snippet</button><button ref={confirmRef} type="button" onClick={onConfirm}>Delete snippet</button></div>
      </section>
    </div>
  );
};

export default DeleteSnippetConfirm;
