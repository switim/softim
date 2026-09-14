import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { api } from '../../utils/api.js';

export default function VideoModule() {
  const { event } = useOutletContext();
  const [acts, setActs] = useState([]);
  const [selectedAct, setSelectedAct] = useState(null);
  const [form, setForm] = useState({ title: '', source_type: 'datei', file_url: '', trigger: 'manuell', loop: false, operator_notes: '' });

  useEffect(() => {
    api(`/acts?event_id=${event.id}`).then(data => {
      setActs(data);
      if (data.length) setSelectedAct(data[0]);
    });
  }, [event.id]);

  useEffect(() => {
    if (!selectedAct) return;
    api(`/video?act_id=${selectedAct.id}`).then(v => {
      if (v) setForm(v);
      else setForm({ title: '', source_type: 'datei', file_url: '', trigger: 'manuell', loop: false, operator_notes: '' });
    });
  }, [selectedAct]);

  const save = async () => {
    await api('/video', { method: 'POST', body: { ...form, act_id: selectedAct.id } });
  };

  return (
    <div className="video-layout">
      <div className="video-sidebar">
        <h3>Nummern</h3>
        {acts.map(a => (
          <button key={a.id} className={`act-btn${selectedAct?.id===a.id?' active':''}`} onClick={()=>setSelectedAct(a)}>
            <span className="act-btn-pos">{a.position}</span>
            <span>{a.title}</span>
            {a.video && <span>🎬</span>}
          </button>
        ))}
      </div>

      <div className="video-main">
        {selectedAct && (
          <>
            <h2>🎬 {selectedAct.position}. {selectedAct.title}</h2>
            <div className="video-form">
              <label>Quelle
                <select value={form.source_type} onChange={e=>setForm({...form,source_type:e.target.value})}>
                  <option value="keins">Kein Video</option>
                  <option value="datei">Datei / URL</option>
                  <option value="live-kamera">Live-Kamera</option>
                </select>
              </label>
              {form.source_type !== 'keins' && (
                <>
                  <label>Titel<input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} /></label>
                  {form.source_type === 'datei' && (
                    <label>URL / Datei<input value={form.file_url} onChange={e=>setForm({...form,file_url:e.target.value})} /></label>
                  )}
                  <label>Trigger
                    <select value={form.trigger} onChange={e=>setForm({...form,trigger:e.target.value})}>
                      <option value="manuell">Manuell</option>
                      <option value="musik-start">Bei Musik-Start</option>
                    </select>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" checked={form.loop} onChange={e=>setForm({...form,loop:e.target.checked})} />
                    Loop
                  </label>
                </>
              )}
              <label>Hinweise Beamer-Operator
                <textarea value={form.operator_notes} onChange={e=>setForm({...form,operator_notes:e.target.value})} />
              </label>
              <button className="btn-primary" onClick={save}>Speichern</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
