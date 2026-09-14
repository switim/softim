import React from 'react';

const STATUS_COLORS = {
  planned:   '#6b7280',
  rehearsed: '#d97706',
  ready:     '#16a34a'
};

const STATUS_LABELS = {
  planned:   'Geplant',
  rehearsed: 'Geprobt',
  ready:     'Bereit'
};

export default function ActRow({ act, selected, onClick, onUpdate }) {
  const fmt = (s) => s ? `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}` : '—';

  const hasMusic    = !!act.music;
  const hasLighting = act.lighting?.length > 0;
  const hasVideo    = !!act.video;

  return (
    <div className={`act-row${selected ? ' selected' : ''}`} onClick={onClick}>
      <span className="act-pos">{act.position}</span>
      <span className="act-title">{act.title}</span>
      <span className="act-duration">{fmt(act.duration_seconds)}</span>
      <span className="act-status" style={{ color: STATUS_COLORS[act.status] }}>
        {STATUS_LABELS[act.status] || act.status}
      </span>
      <span className="act-modules">
        {hasMusic    && <span title="Musik">🎵</span>}
        {hasLighting && <span title="Licht">{act.lighting.length} 💡</span>}
        {hasVideo    && <span title="Video">🎬</span>}
      </span>
    </div>
  );
}
