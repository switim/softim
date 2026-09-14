import express from 'express';
import pool from '../db/pool.js';

const router = express.Router();

// GET /api/lighting?act_id=5 — alle Cues einer Nummer
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM act_lighting WHERE act_id = $1 ORDER BY position',
      [req.query.act_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/lighting/export?event_id=1 — ChamSys-Programmierliste für ganzes Event
router.get('/export', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.position as act_position, a.title as act_title,
              l.cue_number, l.cue_name, l.trigger, l.trigger_time_seconds,
              l.color_description, l.fixtures, l.effects, l.intensity, l.programming_notes
       FROM act_lighting l
       JOIN acts a ON l.act_id = a.id
       WHERE a.event_id = $1
       ORDER BY a.position, l.position`,
      [req.query.event_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST — neuen Cue erstellen
router.post('/', async (req, res) => {
  const { act_id, cue_number, cue_name, trigger, trigger_time_seconds,
          color_description, fixtures, effects, intensity, programming_notes, position } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO act_lighting (act_id, cue_number, cue_name, trigger, trigger_time_seconds,
        color_description, fixtures, effects, intensity, programming_notes, position)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [act_id, cue_number, cue_name, trigger, trigger_time_seconds,
       color_description, fixtures, effects, intensity, programming_notes, position]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id', async (req, res) => {
  const fields = req.body;
  const keys = Object.keys(fields);
  const values = Object.values(fields);
  const set = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
  try {
    const result = await pool.query(
      `UPDATE act_lighting SET ${set} WHERE id = $${keys.length + 1} RETURNING *`,
      [...values, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM act_lighting WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
