import { describe, expect, it } from 'vitest';
import {
  canReadDocument, visibleDocuments, ownedDocuments, sharedDocuments,
  shareDocument, removeShare, normalizeTitle, markdownToHtml, plainTextToHtml
} from './documents.js';

const docs = [
  { id: 'one', ownerId: 'kamran', title: 'Owned', sharedWith: ['sara'], updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'two', ownerId: 'alex', title: 'Private', sharedWith: [], updatedAt: '2026-01-02T00:00:00.000Z' }
];

describe('document access and sharing', () => {
  it('allows owners and explicitly shared users to read', () => {
    expect(canReadDocument(docs[0], 'kamran')).toBe(true);
    expect(canReadDocument(docs[0], 'sara')).toBe(true);
    expect(canReadDocument(docs[0], 'alex')).toBe(false);
  });
  it('separates owned and shared document lists', () => {
    expect(ownedDocuments(docs, 'kamran').map((doc) => doc.id)).toEqual(['one']);
    expect(sharedDocuments(docs, 'sara').map((doc) => doc.id)).toEqual(['one']);
    expect(visibleDocuments(docs, 'alex').map((doc) => doc.id)).toEqual(['two']);
  });
  it('grants access only when the current user owns the document', () => {
    const result = shareDocument(docs, 'one', 'kamran', 'alex');
    expect(result[0].sharedWith).toContain('alex');
    expect(shareDocument(docs, 'one', 'sara', 'alex')[0].sharedWith).not.toContain('alex');
  });
  it('revokes access without changing other documents', () => {
    const result = removeShare(docs, 'one', 'kamran', 'sara');
    expect(result[0].sharedWith).not.toContain('sara');
    expect(result[1]).toEqual(docs[1]);
  });
});

describe('input and import helpers', () => {
  it('normalizes empty and overlong titles', () => {
    expect(normalizeTitle('   ')).toBe('Untitled document');
    expect(normalizeTitle('x'.repeat(140))).toHaveLength(120);
  });
  it('converts markdown headings and lists into editor HTML', () => {
    const html = markdownToHtml('# Notes\n- One\n- Two');
    expect(html).toContain('<h1>Notes</h1>');
    expect(html).toContain('<ul>');
    expect(html).toContain('<li>Two</li>');
  });
  it('escapes plain text before importing it as HTML', () => {
    expect(plainTextToHtml('<script>alert(1)</script>')).toContain('&lt;script&gt;');
  });
});
