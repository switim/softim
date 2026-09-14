import React from 'react';
import { useOutletContext } from 'react-router-dom';

export default function TechnikModule() {
  const { event } = useOutletContext();

  return (
    <div className="technik-layout">
      <div className="technik-header">
        <h2>🏗️ Technischer Aufbau</h2>
        <p>3D Hallenplan für {event.name}</p>
      </div>
      <div className="technik-placeholder">
        <p>Das 3D-Hallen-Tool wird hier eingebettet.</p>
        <p>Layouts werden pro Event gespeichert und können aus dem Ablauf verlinkt werden.</p>
        {/* Das halle-3d-v3 Tool kommt hier als React-Komponente rein */}
      </div>
    </div>
  );
}
