import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api.js';

const MODULES = [
  { path: 'ablauf',  label: 'Ablauf',   icon: '📋' },
  { path: 'licht',   label: 'Licht',    icon: '💡' },
  { path: 'musik',   label: 'Musik',    icon: '🎵' },
  { path: 'video',   label: 'Video',    icon: '🎬' },
  { path: 'technik', label: 'Technik',  icon: '🏗️' },
];

export default function AppShell() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    api(`/events/${slug}`).then(setEvent).catch(() => navigate('/'));
  }, [slug]);

  return (
    <div className="shell">
      <header className="shell-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Events</button>
        <h1 className="event-title">{event?.name ?? '...'}</h1>
        <span className="event-date">{event?.date ? new Date(event.date).toLocaleDateString('de-CH') : ''}</span>
      </header>

      <nav className="module-nav">
        {MODULES.map(m => (
          <NavLink
            key={m.path}
            to={`/event/${slug}/${m.path}`}
            className={({ isActive }) => `module-tab${isActive ? ' active' : ''}`}
          >
            <span>{m.icon}</span>
            <span>{m.label}</span>
          </NavLink>
        ))}
      </nav>

      <main className="module-content">
        {event && <Outlet context={{ event }} />}
      </main>
    </div>
  );
}
