import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  AlignLeft, ArrowDownToLine, Bold, Check, ChevronDown, ChevronLeft, ChevronRight,
  CircleHelp, Clock3, Cloud, FilePlus2, FileText, FolderOpen, Italic, Link2,
  List, ListOrdered, Menu, MoreHorizontal, PanelLeftClose, Plus, Search, Share2,
  Sparkles, Underline, Upload, X, Trash2, Users, LockKeyhole, CheckCircle2
} from 'lucide-react';
import {
  DEMO_USERS, loadWorkspace, saveWorkspace, makeDocument, normalizeTitle,
  ownedDocuments, sharedDocuments, shareDocument, removeShare, canReadDocument,
  markdownToHtml, plainTextToHtml, htmlToMarkdown
} from './lib/documents.js';
import './styles.css';

function Avatar({ user, size = 'md' }) {
  return <span className={'avatar avatar-' + size} style={{ background: user?.color || '#777' }}>{user?.initials || '??'}</span>;
}

function App() {
  const [documents, setDocuments] = useState(() => loadWorkspace());
  const [userId, setUserId] = useState('kamran');
  const [activeId, setActiveId] = useState(() => loadWorkspace()[0]?.id || null);
  const [view, setView] = useState('all');
  const [query, setQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [shareError, setShareError] = useState('');
  const [toast, setToast] = useState('');
  const [renameMode, setRenameMode] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [accountMenu, setAccountMenu] = useState(false);
  const [moreMenu, setMoreMenu] = useState(false);
  const [saving, setSaving] = useState('saved');
  const editorRef = useRef(null);
  const fileRef = useRef(null);
  const searchRef = useRef(null);
  const renameRef = useRef(null);
  const user = DEMO_USERS.find((item) => item.id === userId) || DEMO_USERS[0];
  const activeDoc = documents.find((doc) => doc.id === activeId && canReadDocument(doc, userId)) || null;

  useEffect(() => {
    const ok = saveWorkspace(documents);
    setSaving(ok ? 'saved' : 'error');
  }, [documents]);

  useEffect(() => {
    if (activeDoc && editorRef.current && editorRef.current.innerHTML !== activeDoc.content) {
      editorRef.current.innerHTML = activeDoc.content || '<p><br></p>';
    }
  }, [activeId]);

  useEffect(() => {
    if (renameMode) renameRef.current?.focus();
  }, [renameMode]);

  useEffect(() => {
    if (!toast) return undefined;
    const id = window.setTimeout(() => setToast(''), 2800);
    return () => window.clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    const onShortcut = (event) => {
      if (!(event.metaKey || event.ctrlKey)) return;
      const key = event.key.toLowerCase();
      if (key === 'n') { event.preventDefault(); createNew(); }
      if (key === 'k') { event.preventDefault(); searchRef.current?.focus(); }
      if (key === 'o') { event.preventDefault(); fileRef.current?.click(); }
    };
    window.addEventListener('keydown', onShortcut);
    return () => window.removeEventListener('keydown', onShortcut);
  }, [userId]);

  const mine = useMemo(() => ownedDocuments(documents, userId), [documents, userId]);
  const shared = useMemo(() => sharedDocuments(documents, userId), [documents, userId]);
  const list = useMemo(() => {
    let items = view === 'shared' ? shared : view === 'owned' ? mine : [...mine, ...shared].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    if (query.trim()) items = items.filter((doc) => doc.title.toLowerCase().includes(query.toLowerCase()));
    return items;
  }, [documents, userId, view, query, mine, shared]);

  function notify(message) { setToast(message); }
  function updateDoc(id, patch) {
    setDocuments((current) => current.map((doc) => doc.id === id ? { ...doc, ...patch, updatedAt: new Date().toISOString() } : doc));
  }
  function createNew() {
    const doc = makeDocument(userId, 'Untitled document', '<h1>Untitled document</h1><p>Start writing something great...</p>');
    setDocuments((current) => [doc, ...current]);
    setActiveId(doc.id);
    setView('all');
    setRenameMode(false);
    notify('New document created');
  }
  function deleteActive() {
    if (!activeDoc || activeDoc.ownerId !== userId) return;
    if (!window.confirm('Delete “' + activeDoc.title + '”? This cannot be undone.')) return;
    const next = documents.filter((doc) => doc.id !== activeDoc.id);
    setDocuments(next);
    setActiveId(next.find((doc) => canReadDocument(doc, userId))?.id || null);
    setMoreMenu(false);
    notify('Document deleted');
  }
  function startRename() {
    if (!activeDoc || activeDoc.ownerId !== userId) return;
    setRenameValue(activeDoc.title);
    setRenameMode(true);
  }
  function finishRename() {
    if (activeDoc) updateDoc(activeDoc.id, { title: normalizeTitle(renameValue) });
    setRenameMode(false);
  }
  function format(command, value) {
    editorRef.current?.focus();
    document.execCommand(command, false, value || null);
    if (activeDoc && editorRef.current) updateDoc(activeDoc.id, { content: editorRef.current.innerHTML });
  }
  function handleEditorInput(event) {
    if (!activeDoc) return;
    updateDoc(activeDoc.id, { content: event.currentTarget.innerHTML });
  }
  async function importFile(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const extension = file.name.split('.').pop().toLowerCase();
    if (!['txt', 'md', 'markdown'].includes(extension)) {
      notify('Please choose a .txt, .md, or .markdown file');
      return;
    }
    if (file.size > 1024 * 1024) {
      notify('Files must be smaller than 1 MB');
      return;
    }
    try {
      const text = await file.text();
      const title = normalizeTitle(file.name.replace(/\.(txt|md|markdown)$/i, '').replace(/[-_]+/g, ' '));
      const content = extension === 'md' || extension === 'markdown' ? markdownToHtml(text) : plainTextToHtml(text);
      const doc = makeDocument(userId, title, content);
      setDocuments((current) => [doc, ...current]);
      setActiveId(doc.id);
      setView('all');
      notify('Imported “' + title + '”');
    } catch {
      notify('Could not read this file. Try a plain text file.');
    }
  }
  function grantShare(event) {
    event.preventDefault();
    const email = shareEmail.trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setShareError('Enter a valid email address.');
      return;
    }
    const target = DEMO_USERS.find((item) => item.email.toLowerCase() === email);
    if (!target) {
      setShareError('For this demo, use sara@example.com or alex@example.com.');
      return;
    }
    if (target.id === userId) {
      setShareError('You already own this document.');
      return;
    }
    setDocuments((current) => shareDocument(current, activeDoc.id, userId, target.id));
    setShareEmail('');
    setShareError('');
    notify('Shared with ' + target.name);
  }
  function revokeShare(targetId) {
    setDocuments((current) => removeShare(current, activeDoc.id, userId, targetId));
    notify('Access removed');
  }
  function exportMarkdown() {
    if (!activeDoc) return;
    const blob = new Blob([htmlToMarkdown(activeDoc.content)], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = normalizeTitle(activeDoc.title).replace(/[^a-z0-9-_ ]/gi, '').replace(/\s+/g, '-').toLowerCase() + '.md';
    anchor.click();
    URL.revokeObjectURL(url);
    setMoreMenu(false);
    notify('Markdown export ready');
  }
  function resetDemo() {
    if (!window.confirm('Reset all documents and sharing to the original demo data?')) return;
    const seeded = loadWorkspace({ getItem: () => null, setItem: () => {} });
    setDocuments(seeded);
    setActiveId(seeded.find((doc) => canReadDocument(doc, userId))?.id || seeded[0]?.id || null);
    notify('Demo workspace reset');
  }

  const isOwner = activeDoc?.ownerId === userId;
  const owner = DEMO_USERS.find((item) => item.id === activeDoc?.ownerId) || user;
  const sharedUsers = (activeDoc?.sharedWith || []).map((id) => DEMO_USERS.find((item) => item.id === id)).filter(Boolean);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-wrap">
          <button className="icon-btn mobile-toggle" aria-label="Toggle sidebar" onClick={() => setSidebarOpen(!sidebarOpen)}><Menu size={19} /></button>
          <div className="brand-mark"><FileText size={21} strokeWidth={2.2} /></div>
          <div className="brand-name">doc<span>space</span><span className="beta-pill">BETA</span></div>
        </div>
        <div className="topbar-center">
          <div className="save-state">{saving === 'error' ? <span className="save-dot error-dot" /> : <span className="save-dot" />}<Cloud size={15} />{saving === 'error' ? 'Local save unavailable' : 'All changes saved'}</div>
          <span className="topbar-divider" />
          <span className="workspace-label">Personal workspace</span>
        </div>
        <div className="topbar-actions">
          <button className="share-top-btn" disabled={!activeDoc || !isOwner} onClick={() => setShareOpen(true)}><Share2 size={16} /> Share</button>
          <div className="account-wrap">
            <button className="account-button" onClick={() => setAccountMenu(!accountMenu)} aria-label="Switch demo account"><Avatar user={user} /><ChevronDown size={14} /></button>
            {accountMenu && <div className="dropdown account-dropdown">
              <div className="dropdown-caption">Switch demo account</div>
              {DEMO_USERS.map((item) => <button className="dropdown-item" key={item.id} onClick={() => { setUserId(item.id); setAccountMenu(false); setActiveId(documents.find((doc) => canReadDocument(doc, item.id))?.id || null); setView('all'); }}><Avatar user={item} size="sm" /><span>{item.name}<small>{item.email}</small></span>{item.id === userId && <Check size={15} />}</button>)}
            </div>}
          </div>
        </div>
      </header>

      <div className="workspace">
        {sidebarOpen && <aside className="sidebar">
          <button className="new-doc-btn" onClick={createNew}><Plus size={17} strokeWidth={2.5} /> New document <span>⌘ N</span></button>
          <button className="import-doc-btn" onClick={() => fileRef.current?.click()}><Upload size={15} /> Import TXT or Markdown</button>
          <div className="search-box"><Search size={16} /><input ref={searchRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search documents" aria-label="Search documents" /><kbd>⌘ K</kbd></div>
          <div className="nav-section-label">WORKSPACE</div>
          <nav className="side-nav">
            <button className={view === 'all' ? 'nav-item active' : 'nav-item'} onClick={() => setView('all')}><FolderOpen size={17} /><span>All documents</span><span className="nav-count">{mine.length + shared.length}</span></button>
            <button className={view === 'owned' ? 'nav-item active' : 'nav-item'} onClick={() => setView('owned')}><FileText size={17} /><span>My documents</span><span className="nav-count">{mine.length}</span></button>
            <button className={view === 'shared' ? 'nav-item active' : 'nav-item'} onClick={() => setView('shared')}><Users size={17} /><span>Shared with me</span><span className="nav-count">{shared.length}</span></button>
          </nav>
          <div className="sidebar-divider" />
          <div className="docs-heading"><span>{view === 'shared' ? 'SHARED WITH ME' : view === 'owned' ? 'MY DOCUMENTS' : 'RECENT DOCUMENTS'}</span><button className="tiny-icon-btn" onClick={createNew} aria-label="Create document"><Plus size={16} /></button></div>
          <div className="document-list">
            {list.map((doc) => {
              const docOwner = DEMO_USERS.find((item) => item.id === doc.ownerId) || user;
              const isShared = doc.ownerId !== userId;
              return <button key={doc.id} className={'document-row ' + (doc.id === activeId ? 'selected' : '')} onClick={() => setActiveId(doc.id)}>
                <FileText size={16} className="document-row-icon" />
                <span className="document-row-text"><span className="document-row-title">{doc.title || 'Untitled document'}</span><small>{isShared ? 'From ' + docOwner.name.split(' ')[0] : new Date(doc.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</small></span>
                {isShared && <Users size={13} className="shared-indicator" />}
              </button>;
            })}
            {list.length === 0 && <div className="empty-list"><FileText size={22} /><span>{query ? 'No matching documents' : 'Nothing here yet'}</span><small>Create a document to get started.</small></div>}
          </div>
          <div className="sidebar-bottom">
            <div className="storage-note"><div className="storage-icon"><LockKeyhole size={15} /></div><div><strong>Private by default</strong><small>Only you can see your docs until you share them.</small></div></div>
            <button className="reset-demo" onClick={resetDemo}>Reset demo workspace</button>
            <div className="profile-row"><Avatar user={user} /><div className="profile-meta"><strong>{user.name}</strong><small>{user.email}</small></div><button className="tiny-icon-btn" onClick={() => setAccountMenu(!accountMenu)} aria-label="Account options"><MoreHorizontal size={18} /></button></div>
          </div>
        </aside>}

        <main className="main-area">
          {!activeDoc ? <div className="welcome-state">
            <div className="welcome-illustration"><div className="illustration-sheet"><div /><div /><div /><div /></div><span className="sparkle sparkle-a">✦</span><span className="sparkle sparkle-b">✧</span></div>
            <span className="eyebrow"><Sparkles size={14} /> YOUR SPACE TO THINK</span>
            <h1>Good work starts<br />with a blank page.</h1>
            <p>Create a document, capture an idea, or bring your notes in from another tool.</p>
            <div className="welcome-actions"><button className="primary-btn" onClick={createNew}><Plus size={17} /> Create a document</button><button className="secondary-btn" onClick={() => fileRef.current?.click()}><Upload size={16} /> Import a file</button></div>
            <div className="welcome-shortcuts"><span><kbd>⌘</kbd> <kbd>N</kbd> New document</span><span><kbd>⌘</kbd> <kbd>O</kbd> Open recent</span></div>
          </div> : <>
            <div className="doc-toolbar-head">
              <div className="doc-breadcrumb"><span>Workspace</span><ChevronRight size={14} /><span>{isOwner ? 'My documents' : 'Shared with me'}</span><ChevronRight size={14} /><FileText size={14} /></div>
              <div className="doc-head-actions">
                <span className="updated-label"><Clock3 size={13} /> Edited {new Date(activeDoc.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <button className="icon-btn" aria-label="Export as Markdown" title="Export Markdown" onClick={exportMarkdown}><ArrowDownToLine size={17} /></button>
                <div className="more-wrap"><button className="icon-btn" aria-label="More document actions" onClick={() => setMoreMenu(!moreMenu)}><MoreHorizontal size={18} /></button>
                  {moreMenu && <div className="dropdown more-dropdown">
                    <button className="dropdown-item" onClick={exportMarkdown}><ArrowDownToLine size={15} /> Export as Markdown</button>
                    {isOwner && <button className="dropdown-item danger-item" onClick={deleteActive}><Trash2 size={15} /> Delete document</button>}
                  </div>}
                </div>
              </div>
            </div>
            <div className="editor-scroll">
              <div className="paper">
                <div className="paper-title-row">
                  <div className="paper-title-wrap">
                    {renameMode ? <input ref={renameRef} className="title-input" value={renameValue} maxLength={120} onChange={(e) => setRenameValue(e.target.value)} onBlur={finishRename} onKeyDown={(e) => { if (e.key === 'Enter') finishRename(); if (e.key === 'Escape') setRenameMode(false); }} aria-label="Document title" /> : <button className="paper-title" onClick={startRename} title={isOwner ? 'Click to rename' : activeDoc.title}>{activeDoc.title}</button>}
                    <div className="paper-subtitle">{isOwner ? 'Saved in your workspace' : 'Shared by ' + owner.name}</div>
                  </div>
                  <div className="collaborator-stack">
                    {sharedUsers.slice(0, 3).map((item) => <span key={item.id} title={item.name} className="stacked-avatar"><Avatar user={item} size="sm" /></span>)}
                    {isOwner && <button className="add-collaborator" onClick={() => setShareOpen(true)} aria-label="Add collaborator"><Plus size={15} /></button>}
                  </div>
                </div>
                <div className="format-toolbar" role="toolbar" aria-label="Text formatting">
                  <button className="format-select" onClick={() => format('formatBlock', 'P')}>Paragraph <ChevronDown size={13} /></button>
                  <span className="format-divider" />
                  <button className="format-btn" aria-label="Bold" title="Bold (Ctrl+B)" onMouseDown={(e) => e.preventDefault()} onClick={() => format('bold')}><Bold size={17} /></button>
                  <button className="format-btn" aria-label="Italic" title="Italic (Ctrl+I)" onMouseDown={(e) => e.preventDefault()} onClick={() => format('italic')}><Italic size={17} /></button>
                  <button className="format-btn" aria-label="Underline" title="Underline (Ctrl+U)" onMouseDown={(e) => e.preventDefault()} onClick={() => format('underline')}><Underline size={17} /></button>
                  <span className="format-divider" />
                  <button className="format-btn" aria-label="Heading 1" title="Heading 1" onMouseDown={(e) => e.preventDefault()} onClick={() => format('formatBlock', 'H1')}><span className="heading-icon">H1</span></button>
                  <button className="format-btn" aria-label="Heading 2" title="Heading 2" onMouseDown={(e) => e.preventDefault()} onClick={() => format('formatBlock', 'H2')}><span className="heading-icon">H2</span></button>
                  <span className="format-divider" />
                  <button className="format-btn" aria-label="Bulleted list" title="Bulleted list" onMouseDown={(e) => e.preventDefault()} onClick={() => format('insertUnorderedList')}><List size={18} /></button>
                  <button className="format-btn" aria-label="Numbered list" title="Numbered list" onMouseDown={(e) => e.preventDefault()} onClick={() => format('insertOrderedList')}><ListOrdered size={18} /></button>
                  <div className="toolbar-spacer" />
                  <span className="format-hint">Editing</span>
                </div>
                <div className={'editable-content ' + (!isOwner ? 'read-only' : '')} ref={editorRef} contentEditable={isOwner} suppressContentEditableWarning onInput={handleEditorInput} onBlur={() => { if (activeDoc && editorRef.current) updateDoc(activeDoc.id, { content: editorRef.current.innerHTML }); }} role="textbox" aria-label="Document content" aria-multiline="true" data-placeholder="Start writing your document..." />
                {!isOwner && <div className="read-only-note"><LockKeyhole size={14} /> You have view access in this demo.</div>}
                <div className="paper-footer"><span>DOCSPACE EDITOR</span><span>{htmlToMarkdown(activeDoc.content).split(/\s+/).filter(Boolean).length} words</span></div>
              </div>
            </div>
          </>}
        </main>
      </div>

      <input ref={fileRef} type="file" accept=".txt,.md,.markdown,text/plain,text/markdown" className="visually-hidden" onChange={importFile} />
      {shareOpen && activeDoc && <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setShareOpen(false); }}>
        <section className="share-modal" role="dialog" aria-modal="true" aria-labelledby="share-title">
          <div className="modal-header"><div><div className="modal-icon"><Share2 size={18} /></div><h2 id="share-title">Share document</h2><p>Invite a teammate to read this document.</p></div><button className="icon-btn" onClick={() => setShareOpen(false)} aria-label="Close sharing dialog"><X size={18} /></button></div>
          <div className="share-doc-card"><div className="share-doc-icon"><FileText size={18} /></div><div><strong>{activeDoc.title}</strong><small>Anyone added below can view this document</small></div><span className="access-pill"><LockKeyhole size={12} /> Restricted</span></div>
          <form className="invite-form" onSubmit={grantShare}><label htmlFor="share-email">Add people</label><div className="invite-input-row"><input id="share-email" type="email" value={shareEmail} onChange={(e) => { setShareEmail(e.target.value); setShareError(''); }} placeholder="name@example.com" autoFocus /><button type="submit" className="primary-btn">Share</button></div>{shareError && <p className="field-error">{shareError}</p>}<p className="field-hint">Demo accounts: sara@example.com · alex@example.com</p></form>
          <div className="people-section"><div className="people-heading">People with access <span>{sharedUsers.length + 1}</span></div><div className="person-row"><Avatar user={owner} /><div className="person-details"><strong>{owner.name} (you)</strong><small>{owner.email}</small></div><span className="role-label">Owner</span></div>
            {sharedUsers.map((item) => <div className="person-row" key={item.id}><Avatar user={item} /><div className="person-details"><strong>{item.name}</strong><small>{item.email}</small></div>{isOwner ? <button className="remove-access" onClick={() => revokeShare(item.id)}>Remove</button> : <span className="role-label">Viewer</span>}</div>)}
            {sharedUsers.length === 0 && <div className="no-shares">No collaborators yet. Add someone above to share this document.</div>}
          </div>
          <div className="modal-footer"><span><LockKeyhole size={13} /> Only invited demo users have access</span><button className="secondary-btn" onClick={() => setShareOpen(false)}>Done</button></div>
        </section>
      </div>}
      {toast && <div className="toast" role="status"><CheckCircle2 size={17} />{toast}</div>}
      <div className="demo-disclaimer"><span className="demo-dot" /> Demo mode · Changes saved to this browser</div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
