import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api.js';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => { api('/events').then(setEvents); }, []);

  return (
    <div className="events-page">
      <div className="events-header">
        <h1>Softim</h1>
        <p>Show Production Management</p>
      </div>
      <div className="events-grid">
        {events.map(ev => (
          <button key={ev.id} className="event-card" onClick={() => navigate(`/event/${ev.slug}`)}>
            <div className="event-card-name">{ev.name}</div>
            <div className="event-card-venue">{ev.venue}</div>
            <div className="event-card-date">
              {ev.date ? new Date(ev.date).toLocaleDateString('de-CH') : ''}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
