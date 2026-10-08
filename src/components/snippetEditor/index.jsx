import { useEffect, useRef, useState } from "react";
import { FiX } from "react-icons/fi";
import { snippetCategoryLimit, snippetContentLimit, snippetTitleLimit, validateSnippet } from "../../utils/snippets.js";
import styles from "./styles.module.css";

const SnippetEditor = ({ snippet, categories, onCancel, onSave }) => {
  const [title, setTitle] = useState(snippet?.title ?? "");
  const [category, setCategory] = useState(snippet?.category ?? "General");
  const [content, setContent] = useState(snippet?.content ?? "");
  const [error, setError] = useState("");
  const cancelRef = useRef(null);
  const saveRef = useRef(null);
  const isEditing = Boolean(snippet);

  useEffect(() => {
    cancelRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onCancel();
      if (event.key === "Tab" && event.shiftKey && document.activeElement === cancelRef.current) {
        event.preventDefault();
        saveRef.current?.focus();
      } else if (event.key === "Tab" && !event.shiftKey && document.activeElement === saveRef.current) {
        event.preventDefault();
        cancelRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  const submit = (event) => {
    event.preventDefault();
    try {
      onSave(validateSnippet({ title, category, content }));
    } catch (saveError) {
      setError(saveError.message);
    }
  };

  return (
    <div className={styles.overlay} onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel(); }}>
      <form className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="snippet-editor-title" aria-describedby="snippet-editor-description" onSubmit={submit}>
        <div className={styles.heading}>
          <div><p>{isEditing ? "EDIT YOUR CLIP" : "ADD TO YOUR SHELF"}</p><h2 id="snippet-editor-title">{isEditing ? "Update snippet" : "Save a snippet"}</h2></div>
          <button className={styles.closeButton} type="button" onClick={onCancel} aria-label="Close editor"><FiX aria-hidden="true" /></button>
        </div>
        <p className={styles.description} id="snippet-editor-description">Give this piece of text a name and category so it is easy to find again.</p>
        <label htmlFor="snippet-title">Title</label>
        <input id="snippet-title" value={title} maxLength={snippetTitleLimit} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Git undo command" required />
        <div className={styles.labelRow}><label htmlFor="snippet-category">Category</label><span>Choose one or add a new name</span></div>
        <input id="snippet-category" list="snippet-categories" value={category} maxLength={snippetCategoryLimit} onChange={(event) => setCategory(event.target.value)} placeholder="General" />
        <datalist id="snippet-categories">{categories.map((name) => <option value={name} key={name} />)}</datalist>
        <div className={styles.labelRow}><label htmlFor="snippet-content">Snippet text</label><span>{content.length.toLocaleString()} / {snippetContentLimit.toLocaleString()}</span></div>
        <textarea id="snippet-content" value={content} maxLength={snippetContentLimit} onChange={(event) => setContent(event.target.value)} placeholder="Paste the text you want to keep..." required />
        {error && <p className={styles.error} role="alert">{error}</p>}
        <div className={styles.actions}>
          <button ref={cancelRef} type="button" onClick={onCancel}>Cancel</button>
          <button ref={saveRef} type="submit">{isEditing ? "Save changes" : "Save snippet"}</button>
        </div>
      </form>
    </div>
  );
};

export default SnippetEditor;
