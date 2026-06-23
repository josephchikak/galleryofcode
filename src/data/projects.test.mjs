import { test } from "node:test";
import assert from "node:assert/strict";
import { projects } from "./projects.mjs";

test("there are at least 6 projects", () => {
  assert.ok(projects.length >= 6);
});

test("every project has the required fields", () => {
  for (const p of projects) {
    assert.equal(typeof p.slug, "string", `slug missing on ${p.title}`);
    assert.match(p.slug, /^[a-z0-9-]+$/, `slug not url-safe: ${p.slug}`);
    assert.equal(typeof p.title, "string");
    assert.equal(typeof p.year, "number");
    assert.ok(Array.isArray(p.disciplines) && p.disciplines.length > 0);
    assert.equal(typeof p.summary, "string");
    assert.ok(Array.isArray(p.body) && p.body.length > 0, `body paragraphs missing on ${p.slug}`);
    assert.ok(Array.isArray(p.colors) && p.colors.length === 2, `need 2 colors on ${p.slug}`);
    for (const c of p.colors) assert.match(c, /^#[0-9a-f]{6}$/i);
  }
});

test("slugs are unique", () => {
  const slugs = projects.map((p) => p.slug);
  assert.equal(new Set(slugs).size, slugs.length);
});

test("projects are sorted by year ascending (it is a timeline)", () => {
  const years = projects.map((p) => p.year);
  assert.deepEqual(years, [...years].sort((a, b) => a - b));
});
