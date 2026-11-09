import { useRef } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import useDialogFocus from "../../hooks/useDialogFocus.js";
import styles from "./styles.module.css";

const DeleteSnippetConfirm = ({ snippet, onCancel, onConfirm }) => {
  const cancelRef = useRef(null);
  const dialogRef = useRef(null);
  useDialogFocus(dialogRef, onCancel, cancelRef);

  return (
    <div className={styles.overlay} onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel(); }}>
      <section ref={dialogRef} className={styles.dialog} role="alertdialog" aria-modal="true" aria-labelledby="delete-snippet-title" aria-describedby="delete-snippet-description">
        <span className={styles.warningIcon}><FiAlertTriangle aria-hidden="true" /></span>
        <h2 id="delete-snippet-title">Delete this snippet?</h2>
        <p id="delete-snippet-description">“{snippet.title}” will be removed from this browser's saved library. This action cannot be undone.</p>
        <div className={styles.actions}><button ref={cancelRef} type="button" onClick={onCancel}>Keep snippet</button><button type="button" onClick={onConfirm}>Delete snippet</button></div>
      </section>
    </div>
  );
};

export default DeleteSnippetConfirm;
