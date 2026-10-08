import assert from "node:assert/strict";
import test from "node:test";
import { allSnippetsCategory, filterSnippets, getSnippetCategories, sampleSnippets, validateSnippet } from "./snippets.js";

test("trims snippet fields and assigns a fallback category", () => {
  assert.deepEqual(validateSnippet({ title: "  Note  ", content: "  hello\nworld  ", category: " " }), { title: "Note", content: "hello\nworld", category: "General" });
});

test("requires a title and content and enforces field limits", () => {
  assert.throws(() => validateSnippet({ title: "", content: "body" }), /title/);
  assert.throws(() => validateSnippet({ title: "Title", content: " " }), /text/);
  assert.throws(() => validateSnippet({ title: "x".repeat(73), content: "body" }), /title under/);
  assert.throws(() => validateSnippet({ title: "Title", content: "x".repeat(12001) }), /limited to/);
  assert.throws(() => validateSnippet({ title: "Title", content: "body", category: "x".repeat(33) }), /category under/);
});

test("filters snippets by category and text across title, body, and category", () => {
  assert.equal(filterSnippets(sampleSnippets, "CSS").length, 1);
  assert.equal(filterSnippets(sampleSnippets, allSnippetsCategory, "useState")[0].id, "sample-hook");
  assert.equal(filterSnippets(sampleSnippets, allSnippetsCategory, "commands").length, 2);
  assert.equal(filterSnippets(sampleSnippets, allSnippetsCategory, "absent").length, 0);
});

test("sorts by name or puts pinned snippets first in recent order", () => {
  const byName = filterSnippets(sampleSnippets, allSnippetsCategory, "", "name");
  assert.equal(byName[0].title, "Centered flex layout");
  const recent = filterSnippets(sampleSnippets);
  assert.equal(recent[0].id, "sample-npm");
});

test("returns sorted distinct categories", () => {
  assert.deepEqual(getSnippetCategories(sampleSnippets), ["Commands", "CSS", "JavaScript"]);
});
