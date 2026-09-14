-- Softim Database Schema
-- Central entity: act (Nummer) connects all modules

CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,        -- z.B. "Turnerchränzli 2026"
  slug VARCHAR(100) UNIQUE NOT NULL, -- z.B. "turnerchraenzli-2026"
  date DATE,
  venue VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Nummer: das Herzstück — alle Module referenzieren dies
CREATE TABLE IF NOT EXISTS acts (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,          -- Reihenfolge in der Show
  title VARCHAR(255) NOT NULL,        -- z.B. "Pyramide", "Einmarsch"
  subtitle VARCHAR(255),
  duration_seconds INTEGER,           -- Dauer in Sekunden
  category VARCHAR(100),              -- z.B. "Geräteturnen", "Pause", "Einmarsch"
  status VARCHAR(50) DEFAULT 'planned', -- planned / rehearsed / ready
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Modul: Musik
CREATE TABLE IF NOT EXISTS act_music (
  id SERIAL PRIMARY KEY,
  act_id INTEGER REFERENCES acts(id) ON DELETE CASCADE,
  track_title VARCHAR(255),
  artist VARCHAR(255),
  file_url TEXT,                      -- Spotify-Link oder Upload
  bpm INTEGER,
  start_at_seconds INTEGER DEFAULT 0, -- bei welcher Sekunde im Track starten
  fade_in_seconds INTEGER DEFAULT 0,
  fade_out_seconds INTEGER DEFAULT 0,
  operator_notes TEXT,               -- Hinweise für den Tonmann
  notes TEXT
);

-- Modul: Licht / ChamSys
CREATE TABLE IF NOT EXISTS act_lighting (
  id SERIAL PRIMARY KEY,
  act_id INTEGER REFERENCES acts(id) ON DELETE CASCADE,
  cue_number VARCHAR(20),            -- ChamSys Cue-Nummer z.B. "1.0", "1.5"
  cue_name VARCHAR(255),             -- Name im ChamSys z.B. "Einmarsch Blau"
  trigger VARCHAR(100),              -- "manuell", "timecode", "musik-beat"
  trigger_time_seconds INTEGER,      -- bei welcher Sekunde der Nummer
  color_description TEXT,            -- z.B. "Blau von links, Rot fill"
  fixtures TEXT,                     -- welche Scheinwerfer betroffen
  effects TEXT,                      -- z.B. "Strobe 4Hz", "Chase rainbow"
  intensity INTEGER,                 -- 0-100%
  programming_notes TEXT,            -- was im ChamSys programmiert werden muss
  position INTEGER DEFAULT 0,        -- Reihenfolge der Cues
  notes TEXT
);

-- Modul: Video / Beamer
CREATE TABLE IF NOT EXISTS act_video (
  id SERIAL PRIMARY KEY,
  act_id INTEGER REFERENCES acts(id) ON DELETE CASCADE,
  title VARCHAR(255),
  source_type VARCHAR(50),           -- "datei", "live-kamera", "keins"
  file_url TEXT,
  trigger VARCHAR(100),              -- "manuell", "musik-start"
  trigger_time_seconds INTEGER,
  loop BOOLEAN DEFAULT FALSE,
  operator_notes TEXT,
  notes TEXT
);

-- Modul: Technik-Aufbau (Hall-Layout pro Event)
CREATE TABLE IF NOT EXISTS hall_layouts (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  name VARCHAR(255) DEFAULT 'Hauptaufbau',
  layout_json JSONB,                 -- JSON aus dem 3D-Tool
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Seed: erstes Event
INSERT INTO events (name, slug, date, venue)
VALUES ('Turnerchränzli 2026', 'turnerchraenzli-2026', '2026-01-01', 'Turnhalle Bözen')
ON CONFLICT (slug) DO NOTHING;
