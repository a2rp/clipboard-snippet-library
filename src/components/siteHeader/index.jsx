import { FiGithub, FiClipboard } from "react-icons/fi";
import styles from "./styles.module.css";

const SiteHeader = () => (
  <header className={styles.header}>
    <div className={styles.bar}>
      <a className={styles.brand} href="#top" aria-label="Snippet Shelf home">
        <span className={styles.brandMark}><FiClipboard aria-hidden="true" /></span>
        <span>Snippet <b>Shelf</b></span>
      </a>
      <nav className={styles.navigation} aria-label="Main navigation">
        <a href="#library">Snippets</a>
        <a href="#guide">How to use</a>
      </nav>
      <a className={styles.repository} href="https://github.com/a2rp/clipboard-snippet-library" target="_blank" rel="noreferrer">
        <FiGithub aria-hidden="true" /> <span>Repository</span>
      </a>
    </div>
  </header>
);

export default SiteHeader;

