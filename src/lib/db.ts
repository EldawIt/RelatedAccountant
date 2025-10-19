import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

// نحدد المسار
const dbDir = path.join(process.cwd(), "sqlite");
const dbPath = path.join(dbDir, "database.sqlite");

// لو الفولدر مش موجود نعمله
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir);
}

// نفتح الاتصال
const db = new Database(dbPath);

// إنشاء الجداول
db.exec(`
CREATE TABLE IF NOT EXISTS JournalTypes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS JournalEntries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  description TEXT,
  journal_type_id INTEGER NOT NULL,
  FOREIGN KEY (journal_type_id) REFERENCES JournalTypes(id)
);

CREATE TABLE IF NOT EXISTS JournalLines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entry_id INTEGER NOT NULL,
  account TEXT NOT NULL,
  debit REAL DEFAULT 0,
  credit REAL DEFAULT 0,
  FOREIGN KEY (entry_id) REFERENCES JournalEntries(id)
);
`);

// إدخال البيانات الافتراضية
const stmt = db.prepare("INSERT OR IGNORE INTO JournalTypes (id, name) VALUES (?, ?)");
stmt.run(1, "General Journal");
stmt.run(2, "Sales Journal");
stmt.run(3, "Purchase Journal");
stmt.run(4, "Cash Journal");

export default db;
