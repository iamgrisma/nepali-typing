-- Cloudflare D1 Database Schema for TopNepali Typing Platform
-- Stores official verifiable typing test certificates and deep stroke analytics

CREATE TABLE IF NOT EXISTS certificates (
  id TEXT PRIMARY KEY,
  candidate_name TEXT NOT NULL,
  layout TEXT NOT NULL,
  layout_label TEXT NOT NULL,
  mode TEXT NOT NULL,
  duration_seconds INTEGER NOT NULL,
  net_wpm REAL NOT NULL,
  raw_wpm REAL NOT NULL,
  accuracy REAL NOT NULL,
  consistency REAL NOT NULL,
  cpm INTEGER NOT NULL,
  total_keystrokes INTEGER NOT NULL,
  correct_keystrokes INTEGER NOT NULL,
  error_keystrokes INTEGER NOT NULL,
  rank_title TEXT NOT NULL,
  rank_badge TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'QUALIFIED',
  issued_at TEXT NOT NULL,
  verification_url TEXT NOT NULL,
  signature TEXT NOT NULL,
  analytics_json TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_certificates_id ON certificates(id);
CREATE INDEX IF NOT EXISTS idx_certificates_created_at ON certificates(created_at);
