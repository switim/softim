import express from 'express';
import pool from '../db/pool.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM act_music WHERE act_id = $1', [req.query.act_id]
    );
    res.json(result.rows[0] || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { act_id, track_title, artist, file_url, bpm,
          start_at_seconds, fade_in_seconds, fade_out_seconds, operator_notes, notes } = req.body;
  try {
    // Upsert: eine Nummer hat eine Musik
    await pool.query('DELETE FROM act_music WHERE act_id = $1', [act_id]);
    const result = await pool.query(
      `INSERT INTO act_music (act_id, track_title, artist, file_url, bpm,
        start_at_seconds, fade_in_seconds, fade_out_seconds, operator_notes, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [act_id, track_title, artist, file_url, bpm,
       start_at_seconds, fade_in_seconds, fade_out_seconds, operator_notes, notes]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
