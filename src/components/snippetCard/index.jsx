import { FiCopy, FiEdit2, FiStar, FiTrash2 } from "react-icons/fi";
import styles from "./styles.module.css";

const formatUpdatedDate = (dateValue) => {
  const date = new Date(dateValue);
  return Number.isNaN(date.getTime()) ? "Saved" : new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(date);
};

const SnippetCard = ({ snippet, onCopy, onEdit, onDelete, onTogglePin }) => (
  <article className={`${styles.card} ${snippet.pinned ? styles.pinned : ""}`} aria-labelledby={`snippet-title-${snippet.id}`}>
    <div className={styles.cardTop}>
      <span className={styles.category}>{snippet.category}</span>
      <div className={styles.iconActions}>
        <button type="button" aria-label={snippet.pinned ? `Unpin ${snippet.title}` : `Pin ${snippet.title}`} aria-pressed={snippet.pinned} onClick={() => onTogglePin(snippet.id)}><FiStar aria-hidden="true" /></button>
        <button type="button" aria-label={`Edit ${snippet.title}`} onClick={() => onEdit(snippet)}><FiEdit2 aria-hidden="true" /></button>
        <button type="button" aria-label={`Delete ${snippet.title}`} onClick={() => onDelete(snippet)}><FiTrash2 aria-hidden="true" /></button>
      </div>
    </div>
    <h3 id={`snippet-title-${snippet.id}`}>{snippet.title}</h3>
    <pre>{snippet.content}</pre>
    <div className={styles.cardFoot}>
      <span>Updated {formatUpdatedDate(snippet.updatedAt)}</span>
      <button className={styles.copyButton} type="button" onClick={() => onCopy(snippet.content)}><FiCopy aria-hidden="true" /> Copy</button>
    </div>
  </article>
);

export default SnippetCard;
