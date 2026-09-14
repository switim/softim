import express from 'express';
import pool from '../db/pool.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM hall_layouts WHERE event_id = $1 ORDER BY id DESC LIMIT 1',
      [req.query.event_id]
    );
    res.json(result.rows[0] || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { event_id, name, layout_json } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO hall_layouts (event_id, name, layout_json)
       VALUES ($1,$2,$3)
       ON CONFLICT DO NOTHING RETURNING *`,
      [event_id, name || 'Hauptaufbau', layout_json]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id', async (req, res) => {
  const { layout_json, name } = req.body;
  try {
    const result = await pool.query(
      `UPDATE hall_layouts SET layout_json=$1, name=$2, updated_at=NOW() WHERE id=$3 RETURNING *`,
      [layout_json, name, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
