import express from 'express';
import pool from '../db/pool.js';

const router = express.Router();

// GET /api/acts?event_id=1 — alle Nummern eines Events (mit allen Modul-Daten)
router.get('/', async (req, res) => {
  const { event_id } = req.query;
  try {
    const acts = await pool.query(
      `SELECT a.*,
        (SELECT row_to_json(m) FROM act_music m WHERE m.act_id = a.id LIMIT 1) AS music,
        (SELECT json_agg(l ORDER BY l.position) FROM act_lighting l WHERE l.act_id = a.id) AS lighting,
        (SELECT row_to_json(v) FROM act_video v WHERE v.act_id = a.id LIMIT 1) AS video
       FROM acts a
       WHERE a.event_id = $1
       ORDER BY a.position`,
      [event_id]
    );
    res.json(acts.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/acts — neue Nummer erstellen
router.post('/', async (req, res) => {
  const { event_id, title, subtitle, position, duration_seconds, category, notes } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO acts (event_id, title, subtitle, position, duration_seconds, category, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [event_id, title, subtitle, position, duration_seconds, category, notes]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/acts/:id — Nummer aktualisieren
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const fields = req.body;
  const keys = Object.keys(fields);
  const values = Object.values(fields);
  const set = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
  try {
    const result = await pool.query(
      `UPDATE acts SET ${set} WHERE id = $${keys.length + 1} RETURNING *`,
      [...values, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/acts/reorder — Reihenfolge neu sortieren
router.patch('/reorder', async (req, res) => {
  const { order } = req.body; // Array von { id, position }
  try {
    await Promise.all(order.map(({ id, position }) =>
      pool.query('UPDATE acts SET position = $1 WHERE id = $2', [position, id])
    ));
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/acts/:id
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM acts WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
