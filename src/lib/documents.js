export const STORAGE_KEY = 'docspace.v1';

export const DEMO_USERS = [
  { id: 'kamran', name: 'Kamran Khan', email: 'kamran@example.com', initials: 'KK', color: '#6b5ce7' },
  { id: 'sara', name: 'Sara Ahmed', email: 'sara@example.com', initials: 'SA', color: '#e58a52' },
  { id: 'alex', name: 'Alex Morgan', email: 'alex@example.com', initials: 'AM', color: '#278f83' }
];

export function makeDocument(ownerId, title = 'Untitled document', content = '') {
  const now = new Date().toISOString();
  return {
    id: globalThis.crypto?.randomUUID?.() ?? 'doc-' + Date.now() + '-' + Math.random().toString(36).slice(2),
    title: title.trim() || 'Untitled document',
    content,
    ownerId,
    sharedWith: [],
    createdAt: now,
    updatedAt: now
  };
}

export function canReadDocument(doc, userId) {
  return Boolean(doc && userId && (doc.ownerId === userId || doc.sharedWith?.includes(userId)));
}

export function visibleDocuments(documents, userId) {
  return documents.filter((doc) => canReadDocument(doc, userId));
}

export function ownedDocuments(documents, userId) {
  return documents.filter((doc) => doc.ownerId === userId);
}

export function sharedDocuments(documents, userId) {
  return documents.filter((doc) => doc.ownerId !== userId && doc.sharedWith?.includes(userId));
}

export function normalizeTitle(title) {
  return String(title ?? '').trim().slice(0, 120) || 'Untitled document';
}

export function shareDocument(documents, documentId, ownerId, targetUserId) {
  return documents.map((doc) => {
    if (doc.id !== documentId || doc.ownerId !== ownerId || targetUserId === ownerId) return doc;
    const sharedWith = new Set(doc.sharedWith ?? []);
    sharedWith.add(targetUserId);
    return { ...doc, sharedWith: [...sharedWith], updatedAt: new Date().toISOString() };
  });
}

export function removeShare(documents, documentId, ownerId, targetUserId) {
  return documents.map((doc) => {
    if (doc.id !== documentId || doc.ownerId !== ownerId) return doc;
    return { ...doc, sharedWith: (doc.sharedWith ?? []).filter((id) => id !== targetUserId), updatedAt: new Date().toISOString() };
  });
}

export function seedDocuments() {
  const first = makeDocument('kamran', 'Welcome to DocSpace', '<h1>Your ideas, in one place.</h1><p>DocSpace is a focused space to write, organize, and share work.</p><p><strong>Try it:</strong> create a document, format a heading, then share it with Sara.</p><ul><li>Rich-text editing</li><li>TXT and Markdown import</li><li>Simple document sharing</li></ul>');
  const second = makeDocument('sara', 'Product sync notes', '<h1>Product sync</h1><p><strong>Agenda</strong></p><ul><li>Review onboarding feedback</li><li>Prioritize editor polish</li><li>Agree on next steps</li></ul>');
  second.sharedWith = ['kamran'];
  return [first, second];
}

export function loadWorkspace(storage = globalThis.localStorage) {
  try {
    const raw = storage?.getItem(STORAGE_KEY);
    if (!raw) {
      const documents = seedDocuments();
      storage?.setItem(STORAGE_KEY, JSON.stringify(documents));
      return documents;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : seedDocuments();
  } catch {
    return seedDocuments();
  }
}

export function saveWorkspace(documents, storage = globalThis.localStorage) {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(documents));
    return true;
  } catch {
    return false;
  }
}

export function escapeHtml(text) {
  return String(text).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

export function plainTextToHtml(text) {
  return String(text)
    .split(/\r?\n/)
    .map((line) => line.trim() ? '<p>' + escapeHtml(line) + '</p>' : '<p><br></p>')
    .join('');
}

export function markdownToHtml(text) {
  const lines = String(text).split(/\r?\n/);
  const output = [];
  let listType = null;
  const closeList = () => {
    if (listType) output.push(listType === 'ul' ? '</ul>' : '</ol>');
    listType = null;
  };
  for (const raw of lines) {
    const line = raw.trim();
    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    const bullet = line.match(/^[-*+]\s+(.+)$/);
    const number = line.match(/^\d+\.\s+(.+)$/);
    if (!line) { closeList(); output.push('<p><br></p>'); continue; }
    if (heading) { closeList(); const level = heading[1].length; output.push('<h' + level + '>' + escapeHtml(heading[2]) + '</h' + level + '>'); continue; }
    if (bullet || number) {
      const desired = bullet ? 'ul' : 'ol';
      if (listType !== desired) { closeList(); output.push('<' + desired + '>'); listType = desired; }
      output.push('<li>' + escapeHtml((bullet || number)[1]) + '</li>');
      continue;
    }
    closeList();
    output.push('<p>' + escapeHtml(line).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>') + '</p>');
  }
  closeList();
  return output.join('');
}

export function htmlToMarkdown(html) {
  const doc = new DOMParser().parseFromString(html || '', 'text/html');
  const render = (node) => {
    if (node.nodeType === 3) return node.nodeValue;
    if (node.nodeType !== 1) return '';
    const inner = [...node.childNodes].map(render).join('');
    const tag = node.tagName.toLowerCase();
    if (tag === 'strong' || tag === 'b') return '**' + inner + '**';
    if (tag === 'em' || tag === 'i') return '*' + inner + '*';
    if (tag === 'u') return inner;
    if (/^h[1-3]$/.test(tag)) return '#'.repeat(Number(tag[1])) + ' ' + inner + '\n\n';
    if (tag === 'li') return '- ' + inner + '\n';
    if (tag === 'p' || tag === 'div') return inner + '\n\n';
    if (tag === 'br') return '\n';
    return inner;
  };
  return [...doc.body.childNodes].map(render).join('').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}
