import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { api } from '../../utils/api.js';

export default function MusikModule() {
  const { event } = useOutletContext();
  const [acts, setActs] = useState([]);
  const [selectedAct, setSelectedAct] = useState(null);
  const [music, setMusic] = useState(null);
  const [form, setForm] = useState({ track_title: '', artist: '', file_url: '', bpm: '', start_at_seconds: 0, fade_in_seconds: 0, fade_out_seconds: 0, operator_notes: '' });

  useEffect(() => {
    api(`/acts?event_id=${event.id}`).then(data => {
      setActs(data);
      if (data.length) setSelectedAct(data[0]);
    });
  }, [event.id]);

  useEffect(() => {
    if (!selectedAct) return;
    api(`/music?act_id=${selectedAct.id}`).then(m => {
      setMusic(m);
      if (m) setForm(m);
      else setForm({ track_title: '', artist: '', file_url: '', bpm: '', start_at_seconds: 0, fade_in_seconds: 0, fade_out_seconds: 0, operator_notes: '' });
    });
  }, [selectedAct]);

  const save = async () => {
    await api('/music', { method: 'POST', body: { ...form, act_id: selectedAct.id } });
    api(`/music?act_id=${selectedAct.id}`).then(setMusic);
  };

  return (
    <div className="musik-layout">
      <div className="musik-sidebar">
        <h3>Nummern</h3>
        {acts.map(a => (
          <button key={a.id} className={`act-btn${selectedAct?.id===a.id?' active':''}`} onClick={()=>setSelectedAct(a)}>
            <span className="act-btn-pos">{a.position}</span>
            <span>{a.title}</span>
            {a.music && <span>🎵</span>}
          </button>
        ))}
      </div>

      <div className="musik-main">
        {selectedAct && (
          <>
            <h2>🎵 {selectedAct.position}. {selectedAct.title}</h2>
            <div className="musik-form">
              <label>Track-Titel<input value={form.track_title} onChange={e=>setForm({...form,track_title:e.target.value})} /></label>
              <label>Künstler<input value={form.artist} onChange={e=>setForm({...form,artist:e.target.value})} /></label>
              <label>Link / Datei<input value={form.file_url} onChange={e=>setForm({...form,file_url:e.target.value})} placeholder="Spotify, YouTube oder Datei-URL" /></label>
              <label>BPM<input type="number" value={form.bpm} onChange={e=>setForm({...form,bpm:e.target.value})} /></label>
              <label>Start bei (Sek.)<input type="number" value={form.start_at_seconds} onChange={e=>setForm({...form,start_at_seconds:+e.target.value})} /></label>
              <label>Fade in (Sek.)<input type="number" value={form.fade_in_seconds} onChange={e=>setForm({...form,fade_in_seconds:+e.target.value})} /></label>
              <label>Fade out (Sek.)<input type="number" value={form.fade_out_seconds} onChange={e=>setForm({...form,fade_out_seconds:+e.target.value})} /></label>
              <label>Hinweise Tonmann
                <textarea value={form.operator_notes} onChange={e=>setForm({...form,operator_notes:e.target.value})} placeholder="Was soll der Tonmann wissen?" />
              </label>
              <button className="btn-primary" onClick={save}>Speichern</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
