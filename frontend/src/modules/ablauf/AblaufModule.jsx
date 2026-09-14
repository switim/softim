import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { api } from '../../utils/api.js';
import ActRow from './ActRow.jsx';
import ActDetail from './ActDetail.jsx';

export default function AblaufModule() {
  const { event } = useOutletContext();
  const [acts, setActs] = useState([]);
  const [selected, setSelected] = useState(null);

  const load = () => api(`/acts?event_id=${event.id}`).then(setActs);

  useEffect(() => { load(); }, [event.id]);

  const addAct = async () => {
    const title = prompt('Titel der Nummer:');
    if (!title) return;
    await api('/acts', {
      method: 'POST',
      body: { event_id: event.id, title, position: acts.length + 1 }
    });
    load();
  };

  const totalDuration = acts.reduce((s, a) => s + (a.duration_seconds || 0), 0);
  const fmt = (s) => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;

  return (
    <div className="ablauf-layout">
      <div className="ablauf-list">
        <div className="ablauf-toolbar">
          <span className="total-duration">Total: {fmt(totalDuration)}</span>
          <button className="btn-add" onClick={addAct}>+ Nummer</button>
        </div>

        <div className="acts-table">
          <div className="acts-header">
            <span>#</span>
            <span>Titel</span>
            <span>Dauer</span>
            <span>Status</span>
            <span>Module</span>
          </div>
          {acts.map(act => (
            <ActRow
              key={act.id}
              act={act}
              selected={selected?.id === act.id}
              onClick={() => setSelected(act)}
              onUpdate={() => load()}
            />
          ))}
        </div>
      </div>

      {selected && (
        <ActDetail
          act={selected}
          onClose={() => setSelected(null)}
          onUpdate={() => { load(); }}
        />
      )}
    </div>
  );
}
