import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { api } from '../../utils/api.js';

export default function LichtModule() {
  const { event } = useOutletContext();
  const [acts, setActs] = useState([]);
  const [selectedAct, setSelectedAct] = useState(null);
  const [cues, setCues] = useState([]);
  const [newCue, setNewCue] = useState({ cue_number: '', cue_name: '', color_description: '', effects: '', programming_notes: '' });

  useEffect(() => {
    api(`/acts?event_id=${event.id}`).then(data => {
      setActs(data);
      if (data.length) setSelectedAct(data[0]);
    });
  }, [event.id]);

  useEffect(() => {
    if (selectedAct) api(`/lighting?act_id=${selectedAct.id}`).then(setCues);
  }, [selectedAct]);

  const addCue = async () => {
    await api('/lighting', {
      method: 'POST',
      body: { ...newCue, act_id: selectedAct.id, position: cues.length }
    });
    setNewCue({ cue_number: '', cue_name: '', color_description: '', effects: '', programming_notes: '' });
    api(`/lighting?act_id=${selectedAct.id}`).then(setCues);
  };

  const exportChamSys = async () => {
    const data = await api(`/lighting/export?event_id=${event.id}`);
    const lines = data.map(c =>
      `Nr.${c.act_position} "${c.act_title}" | Cue ${c.cue_number} "${c.cue_name}" | ${c.color_description} | ${c.effects || ''} | ${c.programming_notes || ''}`
    );
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `${event.name}_ChamSys_Programmierliste.txt`; a.click();
  };

  return (
    <div className="licht-layout">
      <div className="licht-sidebar">
        <h3>Nummern</h3>
        {acts.map(a => (
          <button
            key={a.id}
            className={`act-btn${selectedAct?.id === a.id ? ' active' : ''}`}
            onClick={() => setSelectedAct(a)}
          >
            <span className="act-btn-pos">{a.position}</span>
            <span>{a.title}</span>
            {a.lighting?.length > 0 && <span className="cue-count">{a.lighting.length} 💡</span>}
          </button>
        ))}
      </div>

      <div className="licht-main">
        {selectedAct && (
          <>
            <div className="licht-header">
              <h2>💡 {selectedAct.position}. {selectedAct.title}</h2>
              <button className="btn-export" onClick={exportChamSys}>ChamSys Export ↓</button>
            </div>

            <table className="cues-table">
              <thead>
                <tr>
                  <th>Cue #</th>
                  <th>Name</th>
                  <th>Farbe / Beschreibung</th>
                  <th>Effekte</th>
                  <th>Programmier-Notizen</th>
                </tr>
              </thead>
              <tbody>
                {cues.map(c => (
                  <tr key={c.id}>
                    <td>{c.cue_number}</td>
                    <td>{c.cue_name}</td>
                    <td>{c.color_description}</td>
                    <td>{c.effects}</td>
                    <td>{c.programming_notes}</td>
                  </tr>
                ))}
                <tr className="new-cue-row">
                  <td><input placeholder="1.0" value={newCue.cue_number} onChange={e=>setNewCue({...newCue,cue_number:e.target.value})} /></td>
                  <td><input placeholder="Einmarsch Blau" value={newCue.cue_name} onChange={e=>setNewCue({...newCue,cue_name:e.target.value})} /></td>
                  <td><input placeholder="Blau von links, rot fill" value={newCue.color_description} onChange={e=>setNewCue({...newCue,color_description:e.target.value})} /></td>
                  <td><input placeholder="Strobe 4Hz" value={newCue.effects} onChange={e=>setNewCue({...newCue,effects:e.target.value})} /></td>
                  <td>
                    <input placeholder="was ins ChamSys..." value={newCue.programming_notes} onChange={e=>setNewCue({...newCue,programming_notes:e.target.value})} />
                    <button onClick={addCue} className="btn-add-cue">+</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
