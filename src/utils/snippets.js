export const snippetTitleLimit = 72;
export const snippetContentLimit = 12_000;
export const snippetCategoryLimit = 32;
export const allSnippetsCategory = "All snippets";
export const storageKey = "snippet-shelf-v1";

export const sampleSnippets = [
  { id: "sample-npm", title: "Start a Vite app", category: "Commands", content: "npm create vite@latest\nnpm install\nnpm run dev", pinned: true, updatedAt: "2026-10-01T10:00:00.000Z" },
  { id: "sample-hook", title: "React state hook", category: "JavaScript", content: "const [value, setValue] = useState(initialValue);", pinned: false, updatedAt: "2026-09-28T10:00:00.000Z" },
  { id: "sample-flex", title: "Centered flex layout", category: "CSS", content: ".centered {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}", pinned: false, updatedAt: "2026-09-25T10:00:00.000Z" },
  { id: "sample-git", title: "Undo latest commit, keep changes", category: "Commands", content: "git reset --soft HEAD~1", pinned: false, updatedAt: "2026-09-20T10:00:00.000Z" },
];

export const validateSnippet = ({ title, content, category }) => {
  const cleanTitle = String(title ?? "").trim();
  const cleanContent = String(content ?? "").trim();
  const cleanCategory = String(category ?? "").trim() || "General";
  if (!cleanTitle) throw new Error("Add a title for this snippet.");
  if (cleanTitle.length > snippetTitleLimit) throw new Error(`Keep the title under ${snippetTitleLimit} characters.`);
  if (!cleanContent) throw new Error("Add the text you want to save.");
  if (cleanContent.length > snippetContentLimit) throw new Error(`Snippet content is limited to ${snippetContentLimit.toLocaleString()} characters.`);
  if (cleanCategory.length > snippetCategoryLimit) throw new Error(`Keep the category under ${snippetCategoryLimit} characters.`);
  return { title: cleanTitle, content: cleanContent, category: cleanCategory };
};

export const filterSnippets = (snippets, category = allSnippetsCategory, query = "", sort = "recent") => {
  const term = query.trim().toLocaleLowerCase();
  const visible = snippets.filter((snippet) => {
    const categoryMatches = category === allSnippetsCategory || snippet.category === category;
    const searchText = `${snippet.title} ${snippet.content} ${snippet.category}`.toLocaleLowerCase();
    return categoryMatches && (!term || searchText.includes(term));
  });
  return visible.sort((first, second) => {
    if (sort === "name") return first.title.localeCompare(second.title);
    if (first.pinned !== second.pinned) return Number(second.pinned) - Number(first.pinned);
    return new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime();
  });
};

export const getSnippetCategories = (snippets) => Array.from(new Set(snippets.map((snippet) => snippet.category))).sort((a, b) => a.localeCompare(b));
