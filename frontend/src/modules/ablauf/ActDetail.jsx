import React, { useState } from 'react';
import { api } from '../../utils/api.js';

// Zeigt alle Modul-Daten einer Nummer in einem Panel
export default function ActDetail({ act, onClose, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: act.title,
    duration_seconds: act.duration_seconds || '',
    category: act.category || '',
    status: act.status || 'planned',
    notes: act.notes || ''
  });

  const save = async () => {
    await api(`/acts/${act.id}`, { method: 'PATCH', body: form });
    setEditing(false);
    onUpdate();
  };

  return (
    <div className="act-detail">
      <div className="act-detail-header">
        <h2>{act.position}. {act.title}</h2>
        <div>
          <button className="btn-icon" onClick={() => setEditing(!editing)}>✏️</button>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>
      </div>

      {editing ? (
        <div className="act-edit-form">
          <label>Titel
            <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
          </label>
          <label>Dauer (Sekunden)
            <input type="number" value={form.duration_seconds} onChange={e => setForm({...form, duration_seconds: +e.target.value})} />
          </label>
          <label>Kategorie
            <input value={form.category} onChange={e => setForm({...form, category: e.target.value})} placeholder="z.B. Geräteturnen, Pause..." />
          </label>
          <label>Status
            <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
              <option value="planned">Geplant</option>
              <option value="rehearsed">Geprobt</option>
              <option value="ready">Bereit</option>
            </select>
          </label>
          <label>Notizen
            <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
          </label>
          <div className="form-actions">
            <button onClick={save} className="btn-primary">Speichern</button>
            <button onClick={() => setEditing(false)}>Abbrechen</button>
          </div>
        </div>
      ) : (
        <div className="act-overview">
          <div className="act-meta">
            {act.category && <span className="tag">{act.category}</span>}
            {act.duration_seconds && <span className="tag">{Math.floor(act.duration_seconds/60)}:{String(act.duration_seconds%60).padStart(2,'0')} min</span>}
          </div>
          {act.notes && <p className="act-notes">{act.notes}</p>}

          {/* Musik-Zusammenfassung */}
          <section className="detail-section">
            <h3>🎵 Musik</h3>
            {act.music ? (
              <div>
                <strong>{act.music.track_title}</strong>
                {act.music.artist && <span> — {act.music.artist}</span>}
                {act.music.operator_notes && <p className="op-notes">{act.music.operator_notes}</p>}
              </div>
            ) : <p className="empty">Keine Musik erfasst</p>}
          </section>

          {/* Licht-Zusammenfassung */}
          <section className="detail-section">
            <h3>💡 Licht ({act.lighting?.length || 0} Cues)</h3>
            {act.lighting?.length > 0 ? (
              <table className="cue-table">
                <thead>
                  <tr><th>Cue</th><th>Name</th><th>Farbe / Effekt</th></tr>
                </thead>
                <tbody>
                  {act.lighting.map(c => (
                    <tr key={c.id}>
                      <td>{c.cue_number}</td>
                      <td>{c.cue_name}</td>
                      <td>{c.color_description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p className="empty">Keine Licht-Cues erfasst</p>}
          </section>

          {/* Video-Zusammenfassung */}
          <section className="detail-section">
            <h3>🎬 Video / Beamer</h3>
            {act.video ? (
              <div>
                <strong>{act.video.title || act.video.source_type}</strong>
                {act.video.operator_notes && <p className="op-notes">{act.video.operator_notes}</p>}
              </div>
            ) : <p className="empty">Kein Video erfasst</p>}
          </section>
        </div>
      )}
    </div>
  );
}
