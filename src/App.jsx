import { useMemo, useState } from "react";
import { FiPlus, FiSearch, FiSliders } from "react-icons/fi";
import BackToTop from "./components/backToTop/index.jsx";
import DeleteSnippetConfirm from "./components/deleteSnippetConfirm/index.jsx";
import SiteFooter from "./components/siteFooter/index.jsx";
import SiteHeader from "./components/siteHeader/index.jsx";
import SnippetCard from "./components/snippetCard/index.jsx";
import SnippetEditor from "./components/snippetEditor/index.jsx";
import { allSnippetsCategory, filterSnippets, getSnippetCategories, sampleSnippets, storageKey } from "./utils/snippets.js";
import styles from "./App.module.css";

const readSnippets = () => {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === null) return sampleSnippets;
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : sampleSnippets;
  } catch {
    return sampleSnippets;
  }
};

const makeSnippetId = () => globalThis.crypto?.randomUUID?.() ?? `snippet-${Date.now().toString(36)}`;

const App = () => {
  const [snippets, setSnippets] = useState(readSnippets);
  const [activeCategory, setActiveCategory] = useState(allSnippetsCategory);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recent");
  const [editingSnippet, setEditingSnippet] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const categories = useMemo(() => getSnippetCategories(snippets), [snippets]);
  const visibleSnippets = useMemo(() => filterSnippets(snippets, activeCategory, query, sort), [snippets, activeCategory, query, sort]);

  const storeSnippets = (nextSnippets) => {
    setSnippets(nextSnippets);
    try {
      localStorage.setItem(storageKey, JSON.stringify(nextSnippets));
      setError("");
    } catch {
      setError("Browser storage is unavailable. Your changes will be lost when you leave this tab.");
    }
  };

  const saveSnippet = (values) => {
    const now = new Date().toISOString();
    const nextSnippet = { ...values, id: editingSnippet?.id ?? makeSnippetId(), pinned: editingSnippet?.pinned ?? false, updatedAt: now };
    const nextSnippets = editingSnippet
      ? snippets.map((snippet) => snippet.id === editingSnippet.id ? nextSnippet : snippet)
      : [nextSnippet, ...snippets];
    storeSnippets(nextSnippets);
    setActiveCategory(nextSnippet.category);
    setEditingSnippet(null);
    setIsCreating(false);
    setNotice(editingSnippet ? "Snippet updated." : "Snippet saved to your shelf.");
  };

  const togglePin = (id) => {
    const nextSnippets = snippets.map((snippet) => snippet.id === id ? { ...snippet, pinned: !snippet.pinned, updatedAt: new Date().toISOString() } : snippet);
    storeSnippets(nextSnippets);
    setNotice("Snippet pin updated.");
  };

  const deleteSnippet = () => {
    if (!pendingDelete) return;
    const nextSnippets = snippets.filter((snippet) => snippet.id !== pendingDelete.id);
    storeSnippets(nextSnippets);
    if (activeCategory !== allSnippetsCategory && !nextSnippets.some((snippet) => snippet.category === activeCategory)) setActiveCategory(allSnippetsCategory);
    setNotice(`“${pendingDelete.title}” deleted.`);
    setPendingDelete(null);
  };

  const copySnippet = async (text) => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(text);
      setError("");
      setNotice("Snippet copied to clipboard.");
    } catch {
      setNotice("");
      setError("Clipboard access is unavailable. Select the snippet text to copy it manually.");
    }
  };

  const openNewSnippet = () => { setEditingSnippet(null); setIsCreating(true); };
  const closeEditor = () => { setEditingSnippet(null); setIsCreating(false); };
  const openEditor = (snippet) => { setEditingSnippet(snippet); setIsCreating(false); };

  return (
    <div className={styles.appShell} id="top">
      <SiteHeader />
      <main>
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroInner}>
            <div><p className={styles.heroLabel}>YOUR POCKET REFERENCE</p><h1 id="hero-title">Save the<br /><span>useful bits.</span></h1><p className={styles.heroDescription}>Keep code, commands, and notes you reach for often in one searchable shelf.</p></div>
            <div className={styles.heroActions}><div className={styles.savedCount}><b>{String(snippets.length).padStart(2, "0")}</b><span>snippets<br />on your shelf</span></div><button type="button" onClick={openNewSnippet}><FiPlus aria-hidden="true" /> Add a snippet</button><p>Stored in this browser</p></div>
          </div>
        </section>
        <section className={styles.library} id="library" aria-labelledby="library-title">
          <aside className={styles.sidebar} aria-label="Snippet categories">
            <div className={styles.sidebarHeading}><span>YOUR SHELF</span><small>{snippets.length}</small></div>
            <button className={activeCategory === allSnippetsCategory ? styles.activeCategory : ""} type="button" onClick={() => setActiveCategory(allSnippetsCategory)} aria-pressed={activeCategory === allSnippetsCategory}><span>All snippets</span><b>{snippets.length}</b></button>
            {categories.map((category) => {
              const count = snippets.filter((snippet) => snippet.category === category).length;
              return <button className={activeCategory === category ? styles.activeCategory : ""} type="button" key={category} onClick={() => setActiveCategory(category)} aria-pressed={activeCategory === category}><span>{category}</span><b>{count}</b></button>;
            })}
            {snippets.length === 0 && <p className={styles.sidebarEmpty}>Save a snippet to create your first category.</p>}
            <div className={styles.storageNote}><span />Saved locally<br />on this device</div>
          </aside>
          <div className={styles.collection}>
            <div className={styles.collectionHeading}><div><p className={styles.sectionLabel}>{activeCategory === allSnippetsCategory ? "THE COLLECTION" : "CATEGORY"}</p><h2 id="library-title">{activeCategory}</h2><span>{visibleSnippets.length} {visibleSnippets.length === 1 ? "snippet" : "snippets"}{query && ` matching “${query}”`}</span></div><button className={styles.mobileAdd} type="button" onClick={openNewSnippet}><FiPlus aria-hidden="true" /> Add</button></div>
            <div className={styles.toolbar}>
              <label className={styles.searchBox} htmlFor="snippet-search"><FiSearch aria-hidden="true" /><input id="snippet-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search titles, text, categories..." /><kbd>/</kbd></label>
              <label className={styles.sortBox} htmlFor="snippet-sort"><FiSliders aria-hidden="true" /><span>Sort</span><select id="snippet-sort" value={sort} onChange={(event) => setSort(event.target.value)}><option value="recent">Recent</option><option value="name">Name</option></select></label>
            </div>
            {error && <p className={styles.error} role="alert">{error}</p>}
            {notice && <p className={styles.notice} role="status" aria-live="polite">{notice}</p>}
            {visibleSnippets.length > 0 ? (
              <div className={styles.snippetGrid}>
                {visibleSnippets.map((snippet) => <SnippetCard key={snippet.id} snippet={snippet} onCopy={copySnippet} onEdit={openEditor} onDelete={setPendingDelete} onTogglePin={togglePin} />)}
              </div>
            ) : (
              <div className={styles.emptyState}><span>{query ? "⌕" : "＋"}</span><h3>{query ? "No snippets match that search" : "Your shelf is empty"}</h3><p>{query ? "Try another word or clear the search to see everything." : "Save your first command, code sample, or note for later."}</p>{query ? <button type="button" onClick={() => setQuery("")}>Clear search</button> : <button type="button" onClick={openNewSnippet}>Add your first snippet</button>}</div>
            )}
            <p className={styles.collectionFoot}>Snippets are saved on this device. They are not synced between browsers.</p>
          </div>
        </section>
        <section className={styles.guide} id="guide" aria-labelledby="guide-title">
          <div className={styles.guideInner}><div><p className={styles.sectionLabel}>A smaller memory load</p><h2 id="guide-title">Find it. Copy it. Keep moving.</h2><p>Save reusable text once, give it a useful category, and bring it back with a search. Editing and pinning update the item in your local shelf.</p></div><div className={styles.guideSteps}><span><b>01</b> Save useful text</span><span><b>02</b> Organize by category</span><span><b>03</b> Copy when you need it</span></div></div>
        </section>
      </main>
      <SiteFooter />
      <BackToTop />
      {(isCreating || editingSnippet) && <SnippetEditor snippet={editingSnippet} categories={categories} onCancel={closeEditor} onSave={saveSnippet} />}
      {pendingDelete && <DeleteSnippetConfirm snippet={pendingDelete} onCancel={() => setPendingDelete(null)} onConfirm={deleteSnippet} />}
    </div>
  );
};

export default App;
