import Database from 'better-sqlite3';
import path from 'node:path';
import { app } from 'electron';

let db;

export function initDatabase() {
  const dbPath = path.join(app.getPath('userData'), 'notes.db');
  db = new Database(dbPath);

  // Enable WAL mode for better performance
  db.pragma('journal_mode = WAL');

  // Create notes table
  db.exec(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL DEFAULT 'Untitled',
      content TEXT NOT NULL DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  return db;
}

export function getAllNotes() {
  return db.prepare('SELECT id, title, updated_at FROM notes ORDER BY updated_at DESC').all();
}

export function getNote(id) {
  return db.prepare('SELECT * FROM notes WHERE id = ?').get(id);
}

export function createNote() {
  const result = db.prepare('INSERT INTO notes (title, content) VALUES (?, ?)').run('Untitled', '');
  return getNote(result.lastInsertRowid);
}

export function updateNote(id, title, content) {
  db.prepare('UPDATE notes SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(title, content, id);
  return getNote(id);
}

export function duplicateNote(id) {
  const source = getNote(id);
  if (!source) return null;
  const result = db.prepare('INSERT INTO notes (title, content) VALUES (?, ?)').run(source.title, source.content);
  return getNote(result.lastInsertRowid);
}

export function deleteNote(id) {
  db.prepare('DELETE FROM notes WHERE id = ?').run(id);
  return { success: true };
}
